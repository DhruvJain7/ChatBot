# Personal AI Chatbot with React, Flask, and Gemma 2B

This is a personal AI chatbot application built with a React frontend and a Flask backend. It uses Google's powerful **Gemma 2B** instruction-tuned model to provide intelligent responses and maintains a persistent conversation history using SQLite.

***

## Description

This project implements a client-server architecture to create an advanced chatbot.
- The **React frontend** provides a user-friendly chat interface.
- The **Flask backend** now uses **Google's `gemma-2b-it`**, a powerful instruction-following model, to generate intelligent and accurate responses.
- **Persistent Memory:** The backend uses **SQLite** to save all conversation history. This means the chatbot remembers your conversation even after the server is restarted.
- **Reset Functionality:** A `/reset` endpoint is available to clear the chat history for a specific user, allowing them to start a new conversation.

This is a significant upgrade from the original project, moving from a simple conversational model (DialoGPT) to a truly capable AI assistant.

***

## Technologies Used

* **Frontend**:
    * React
    * Vite
    * axios
* **Backend**:
    * Flask
    * Flask-CORS
    * `sqlite3` (for persistent database)
    * `pickle` (for data serialization)
* **AI Model**:
    * `transformers` (from Hugging Face)
    * `torch`
    * **`google/gemma-2b-it`** (replaces DialoGPT)

***

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Python 3.x
* Node.js and npm

### Backend Setup

1.  Clone the repo (replace `your_username/your_project_name` with your actual repo details):
    ```sh
    git clone [https://github.com/your_username/your_project_name.git](https://github.com/your_username/your_project_name.git)
    cd your_project_name/backend
    ```
2.  Create and activate a virtual environment:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
3.  Install the required packages:
    ```sh
    pip install Flask Flask-Cors transformers torch
    ```
    *(Note: `sqlite3` and `pickle` are included with Python, so no extra install is needed.)*

4.  Start the Flask server:
    ```sh
    python app.py
    ```
    A `chat_history.db` file will be automatically created in this directory.

### Frontend Setup

1.  Navigate to the frontend directory from the project's root:
    ```sh
    cd ../frontend
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```
3.  Start the development server:
    ```sh
    npm run dev
    ```

***

## Core Features

* **Intelligent Responses**: Powered by Google's Gemma 2B, the bot can answer questions, write code, and follow instructions.
* **Persistent Conversation History**: Your chat is saved in a local SQLite database, so the bot always remembers your context.
* **Real-time Interaction**: Get responses from the AI in real-time.
* **Chat Reset**: A built-in `/reset` endpoint allows users to clear their conversation history and start fresh.
* **Separation of Concerns**: A decoupled frontend and backend for maintainability.

***

## Acknowledgements

* This project was originally based on the [Dev.to article](https://dev.to/allanninal/building-a-personal-ai-chatbot-with-react-and-flask-a-comprehensive-guide-4n2j) by Allan Ninal.
* It has been significantly upgraded with a modern LLM (Google's Gemma) and a persistent SQLite database.
