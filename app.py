import sqlite3
import pickle
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import logging
import time  # Import time for timing

# --- App & Model Setup ---
app = Flask(__name__)
CORS(app)
# Use DEBUG level for more detailed logs during debugging
logging.basicConfig(level=logging.DEBUG)

model_name = "google/gemma-2b-it"

app.logger.info(f"Loading tokenizer: {model_name}")
tokenizer = AutoTokenizer.from_pretrained(model_name)
app.logger.info(f"Loading model: {model_name}. This may take a moment...")
model_load_start = time.time()
dialogue_model = AutoModelForCausalLM.from_pretrained(
    model_name,
    dtype=torch.float16,
    device_map="auto",
)
model_load_end = time.time()
app.logger.info(
    f"Model loaded successfully in {model_load_end - model_load_start:.2f} seconds."
)


DB_NAME = "chat_history.db"


# --- Database Helper Functions ---
# (Keep init_db, save_history, load_history, delete_history as they were)
def init_db():
    # ... (no changes needed)
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            user_id TEXT PRIMARY KEY,
            history_tensor BLOB
        )
        """)


def save_history(user_id, history_list):
    # ... (no changes needed)
    pickled_list = pickle.dumps(history_list)
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT OR REPLACE INTO conversations (user_id, history_tensor) VALUES (?, ?)",
            (user_id, pickled_list),
        )
        conn.commit()
        app.logger.debug(f"Saved history for {user_id}. Length: {len(history_list)}")


def load_history(user_id):
    # ... (no changes needed)
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT history_tensor FROM conversations WHERE user_id = ?", (user_id,)
        )
        row = cursor.fetchone()
        if row:
            try:
                loaded_list = pickle.loads(row[0])
                if isinstance(loaded_list, list) and all(
                    isinstance(item, dict) for item in loaded_list
                ):
                    app.logger.debug(
                        f"Loaded history for {user_id}. Length: {len(loaded_list)}"
                    )
                    return loaded_list
                else:
                    app.logger.warning(
                        f"Corrupted history data for user {user_id}. Resetting."
                    )
                    return []
            except (pickle.UnpicklingError, EOFError, TypeError) as e:
                app.logger.error(
                    f"Error unpickling history for user {user_id}: {e}. Resetting history."
                )
                return []
        else:
            app.logger.debug(f"No history found for {user_id}. Returning empty list.")
            return []


def delete_history(user_id):
    # ... (no changes needed)
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM conversations WHERE user_id = ?", (user_id,))
        conn.commit()
        app.logger.info(f"Deleted history for {user_id}.")


# --- Flask Endpoints ---
@app.route("/chat", methods=["POST"])
def chat():
    app.logger.info("Entered /chat endpoint.")  # Log entry
    try:
        request_data = request.json
        user_id = request_data.get("user_id", "default_user")
        user_message_content = request_data.get("message", "")
        app.logger.info(f"User: {user_id}, Message: '{user_message_content[:50]}...'")

        if not user_message_content:
            app.logger.warning("Empty message received.")
            return jsonify({"error": "No input provided"}), 400

        app.logger.debug("Loading history...")
        chat_history_list = load_history(user_id)

        messages_for_template = [msg.copy() for msg in chat_history_list]
        new_user_message = {"role": "user", "content": user_message_content}
        messages_for_template.append(new_user_message)
        app.logger.debug(
            f"Prepared messages for template (count: {len(messages_for_template)})"
        )

        app.logger.debug("Applying chat template...")
        prompt = tokenizer.apply_chat_template(
            messages_for_template,
            tokenize=False,
            add_generation_prompt=True,
        )
        app.logger.debug(f"Template applied. Prompt starts with: '{prompt[:100]}...'")

        app.logger.debug("Encoding prompt...")
        inputs = tokenizer.encode(prompt, return_tensors="pt").to(dialogue_model.device)
        attention_mask = torch.ones_like(inputs)
        app.logger.debug("Prompt encoded.")

        app.logger.info("Generating response...")
        generation_start = time.time()
        with torch.no_grad():
            # --- Add specific try-except around generate ---
            try:
                output_ids = dialogue_model.generate(
                    inputs,
                    attention_mask=attention_mask,
                    max_new_tokens=256,
                    eos_token_id=tokenizer.eos_token_id,
                )
            except Exception as gen_error:
                app.logger.exception(f"ERROR DURING MODEL GENERATION: {gen_error}")
                # Return an error immediately if generation fails
                return jsonify({"error": f"Model generation failed: {gen_error}"}), 500
            # --- End specific try-except ---

        generation_end = time.time()
        app.logger.info(
            f"Response generated in {generation_end - generation_start:.2f} seconds."
        )

        app.logger.debug("Decoding response...")
        response_ids = output_ids[0][inputs.shape[-1] :]
        response_content = tokenizer.decode(response_ids, skip_special_tokens=True)
        new_bot_message = {"role": "model", "content": response_content}
        app.logger.debug(f"Response decoded: '{response_content[:50]}...'")

        app.logger.debug("Saving history...")
        chat_history_list.append(new_user_message)
        chat_history_list.append(new_bot_message)
        save_history(user_id, chat_history_list)
        app.logger.debug("History saved.")

        app.logger.info("Sending response to client.")
        return jsonify({"response": response_content})

    except Exception as error:
        # Log the full traceback for any other unexpected errors
        app.logger.exception(f"Unhandled error in /chat endpoint: {error}")
        return jsonify({"error": str(error)}), 500


@app.route("/reset", methods=["POST"])
def reset_conversation():
    app.logger.info("Entered /reset endpoint.")
    try:
        request_data = request.json
        user_id = request_data.get("user_id", "default_user")
        app.logger.info(f"Resetting history for user: {user_id}")
        delete_history(user_id)
        return jsonify({"message": f"Conversation reset for {user_id}."})
    except Exception as error:
        app.logger.error(f"Error in /reset: {error}")
        return jsonify({"error": str(error)}), 500


# --- Main Execution ---
if __name__ == "__main__":
    init_db()
    app.logger.info("Initializing DB and starting Flask server...")
    # Listen on all interfaces, disable reloader
    app.run(debug=True, use_reloader=False, host="0.0.0.0")
