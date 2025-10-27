import sqlite3
import pickle
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import logging

# --- App & Model Setup ---
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.INFO)

model_name = "google/gemma-2b-it"

tokenizer = AutoTokenizer.from_pretrained(model_name)
dialogue_model = AutoModelForCausalLM.from_pretrained(
    model_name,
    dtype=torch.float16,
    device_map="auto",
)

DB_NAME = "chat_history.db"


# --- Database Helper Functions ---
def init_db():
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            user_id TEXT PRIMARY KEY,
            history_tensor BLOB
        )
        """)


def save_history(user_id, history_list):
    pickled_list = pickle.dumps(history_list)
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT OR REPLACE INTO conversations (user_id, history_tensor) VALUES (?, ?)",
            (user_id, pickled_list),
        )
        conn.commit()


def load_history(user_id):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT history_tensor FROM conversations WHERE user_id = ?", (user_id,)
        )
        row = cursor.fetchone()
        if row:
            try:
                return pickle.loads(row[0])
            except (pickle.UnpicklingError, EOFError):
                return []
        else:
            return []


def delete_history(user_id):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM conversations WHERE user_id = ?", (user_id,))
        conn.commit()


# --- Flask Endpoints ---
@app.route("/chat", methods=["POST"])
def chat():
    try:
        request_data = request.json
        user_id = request_data.get("user_id", "default_user")
        user_message_content = request_data.get("message", "")

        if not user_message_content:
            return jsonify({"error": "No input provided"}), 400

        # 1. Load the clean history from the previous turn
        chat_history_list = load_history(user_id)

        # 2. Prepare the list for the model: Copy history + add the NEW user message
        messages_for_template = [msg.copy() for msg in chat_history_list]
        new_user_message = {"role": "user", "content": user_message_content}
        messages_for_template.append(new_user_message)

        # 3. Apply the chat template
        prompt = tokenizer.apply_chat_template(
            messages_for_template,
            tokenize=False,
            add_generation_prompt=True,
        )

        # 4. Encode and generate a response
        inputs = tokenizer.encode(prompt, return_tensors="pt").to(dialogue_model.device)
        attention_mask = torch.ones_like(inputs)

        with torch.no_grad():
            output_ids = dialogue_model.generate(
                inputs,
                attention_mask=attention_mask,
                max_new_tokens=256,
                eos_token_id=tokenizer.eos_token_id,
            )

        # 5. Decode the response
        response_ids = output_ids[0][inputs.shape[-1] :]
        response_content = tokenizer.decode(response_ids, skip_special_tokens=True)
        new_bot_message = {"role": "model", "content": response_content}

        # 6. Save the updated history
        chat_history_list.append(new_user_message)
        chat_history_list.append(new_bot_message)
        save_history(user_id, chat_history_list)

        return jsonify({"response": response_content})

    except Exception as error:
        app.logger.exception(f"Error in /chat: {error}")
        return jsonify({"error": str(error)}), 500


@app.route("/reset", methods=["POST"])
def reset_conversation():
    try:
        request_data = request.json
        user_id = request_data.get("user_id", "default_user")
        delete_history(user_id)
        return jsonify({"message": f"Conversation reset for {user_id}."})
    except Exception as error:
        app.logger.error(f"Error in /reset: {error}")
        return jsonify({"error": str(error)}), 500


# --- Main Execution ---
if __name__ == "__main__":
    init_db()
    app.logger.info("Starting Flask server...")
    app.run(debug=True)
