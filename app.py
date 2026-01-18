import logging
import os
import pickle
import sqlite3

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq  # Much lighter than transformers/torch

# 1. Setup & Environment
load_dotenv()
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)

# Initialize Groq (Set GROQ_API_KEY in your Render environment)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
DB_NAME = "chat_history.db"


# 2. Database Helper Functions (Preserved from your code)
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
            return pickle.loads(row[0])
        return []


# 3. Chat Endpoint (Refactored for API)
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_id = data.get("user_id", "default_user")
        user_msg = data.get("message", "")

        if not user_msg:
            return jsonify({"error": "No message"}), 400

        # Load history and append new message
        history = load_history(user_id)
        # Groq uses 'assistant' instead of 'model' for roles
        messages = [
            {"role": m["role"].replace("model", "assistant"), "content": m["content"]}
            for m in history
        ]
        messages.append({"role": "user", "content": user_msg})

        # Call Groq API instead of local model
        completion = client.chat.completions.create(
            model="gemma2-9b-it",
            messages=messages,
            temperature=0.7,
        )

        bot_response = completion.choices[0].message.content

        # Save updated history
        history.append({"role": "user", "content": user_msg})
        history.append({"role": "assistant", "content": bot_response})
        save_history(user_id, history)

        return jsonify({"response": bot_response})

    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
