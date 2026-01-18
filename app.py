import logging
import os
import pickle
import sqlite3

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq

# 1. Setup & Environment
load_dotenv()
app = Flask(__name__)

# This allows your local frontend (localhost) and Vercel to talk to this API
CORS(app, resources={r"/*": {"origins": "*"}})
logging.basicConfig(level=logging.DEBUG)

# Initialize Groq (Set GROQ_API_KEY in your Render environment variables)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# FIX: Use absolute path for DB to avoid permission issues on Render
basedir = os.path.abspath(os.path.dirname(__file__))
DB_NAME = os.path.join(basedir, "chat_history.db")


# 2. Database Helper Functions
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


# 3. Chat Endpoint
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        user_id = data.get("user_id", "default_user")
        user_msg = data.get("message", "")

        if not user_msg:
            return jsonify({"error": "No message"}), 400

        # Load history and prepare messages for Groq
        history = load_history(user_id)

        # Groq uses 'assistant' instead of 'model' for roles
        messages = [
            {"role": m["role"].replace("model", "assistant"), "content": m["content"]}
            for m in history
        ]
        messages.append({"role": "user", "content": user_msg})

        # --- UPDATED MODEL NAME ---
        # gemma2-9b-it was decommissioned. Using Llama 3.3 70B for high quality.
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
        )

        bot_response = completion.choices[0].message.content

        # Save updated history (keeping your original keys)
        history.append({"role": "user", "content": user_msg})
        history.append({"role": "assistant", "content": bot_response})
        save_history(user_id, history)

        return jsonify({"response": bot_response})

    except Exception as e:
        app.logger.error(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


# 4. Reset Endpoint
@app.route("/reset", methods=["POST"])
def reset():
    try:
        data = request.json
        user_id = data.get("user_id", "default_user")
        with sqlite3.connect(DB_NAME) as conn:
            conn.execute("DELETE FROM conversations WHERE user_id = ?", (user_id,))
        return jsonify({"message": "History cleared"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    init_db()
    # Port 5000 is required for Render as per your logs
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
