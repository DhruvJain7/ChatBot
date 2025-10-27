import sqlite3
import pickle
import torch
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer

# --- App & Model Setup ---
app = Flask(__name__)
CORS(app)

# 1. --- MODEL CHANGE ---
# We are now using a much smarter, instruction-tuned model from Google.
model_name = "google/gemma-2b-it"

# Use 'torch.float16' (or 'bfloat16') to use less VRAM
# Your M4 Pro can handle this easily.
tokenizer = AutoTokenizer.from_pretrained(model_name)
dialogue_model = AutoModelForCausalLM.from_pretrained(
    model_name,
    dtype=torch.float16,
    device_map="auto",  # Automatically uses your M1/M2/M3/M4 GPU
)

DB_NAME = "chat_history.db"


# --- Database Helper Functions (No Changes Needed) ---
# ... all your functions (init_db, save_history, load_history, delete_history) ...
# ... are exactly the same. I've removed them for brevity. ...
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
    # NOTE: We now save a Python list of messages, not a tensor.
    # This is much more flexible and easier to manage.
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
            # Load the pickled list
            return pickle.loads(row[0])
        else:
            # Return an empty list to start a new conversation
            return []


def delete_history(user_id):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM conversations WHERE user_id = ?", (user_id,))
        conn.commit()


# --- Flask Endpoints ---


@app.route("/chat", methods=["POST"])
def chat():
    """
    Endpoint to handle chat requests.
    Expects: {"user_id": "unique_id", "message": "your text"}
    """
    try:
        request_data = request.json
        user_id = request_data.get("user_id", "default_user")
        user_message = request_data.get("message", "")

        if not user_message:
            return jsonify({"error": "No input provided"}), 400

        # --- 2. MODIFIED HISTORY & PROMPT LOGIC ---

        # 1. Load the list of past messages
        # This will be an empty list [] if it's a new user.
        chat_history_list = load_history(user_id)

        # 2. Add the new user message to our history list
        chat_history_list.append({"role": "user", "content": user_message})

        # 3. Apply the chat template
        # This function correctly formats the *entire* history
        # into a single string the model understands.
        prompt = tokenizer.apply_chat_template(
            chat_history_list,
            tokenize=False,  # We want a string, not tokens
            add_generation_prompt=True,  # Adds the final 'model' token
        )

        # 4. Encode the full prompt
        # We send the whole conversation history every time
        inputs = tokenizer.encode(prompt, return_tensors="pt").to(dialogue_model.device)
        attention_mask = torch.ones_like(inputs)

        # 5. Generate response
        with torch.no_grad():
            output_ids = dialogue_model.generate(
                inputs,
                attention_mask=attention_mask,
                max_new_tokens=256,  # Controls length of the *new* reply
                eos_token_id=tokenizer.eos_token_id,
            )

        # 6. Decode *only* the new part of the response
        response_ids = output_ids[0][inputs.shape[-1] :]
        response = tokenizer.decode(response_ids, skip_special_tokens=True)

        # 7. Save the updated history (including the bot's new reply)
        chat_history_list.append({"role": "model", "content": response})

        # We are saving the list of dictionaries, not the tensor
        save_history(user_id, chat_history_list)

        return jsonify({"response": response})

    except Exception as error:
        app.logger.error(f"Error in /chat: {error}")
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
    app.run(debug=True)
