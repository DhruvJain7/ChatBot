# Full-Stack AI Voice Chatbot 🎙️🤖

A personal, voice-enabled AI assistant featuring a **React (Vite)** frontend and a **Flask (Dockerized)** backend. This application leverages the high-speed **Gemma 2 9B** model via the **Groq LPU™ Inference Engine**, preserves conversation context with an **SQLite** database, and features a hands-free **Voice Mode**.



---

## 📖 Table of Contents
1. [Core Features](#-core-features)
2. [Tech Stack](#-tech-stack)
3. [Architecture Overview](#-architecture-overview)
4. [Local Setup](#-local-setup)
5. [Environment Variables](#-environment-variables)
6. [Deployment](#-deployment)
7. [Voice & HTTPS](#-voice--https)
8. [License](#-license)

---

## ✨ Core Features
* **Intelligent AI**: Powered by Google's **Gemma 2 9B IT**, a state-of-the-art instruction-tuned model known for its accuracy and conversational capabilities.
* **Persistent Memory**: Integrated **SQLite** backend stores chat history, allowing the bot to remember past interactions even after a page refresh or server restart.
* **Voice Interactivity**: Full support for the **Web Speech API**.
    * **Dictation**: Speak your prompts directly to the AI.
    * **Audio Response**: The bot reads its answers back to you automatically when Voice Mode is enabled.
* **Production Ready**: Dockerized backend for easy scaling on Render and a Vercel-optimized frontend.
* **Secure & Fast**: Optimized for **HTTPS** to ensure microphone permissions work flawlessly, with lightning-fast inference speeds provided by Groq.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite), Axios, Tailwind CSS |
| **Backend** | Flask, Gunicorn, Python 3.11 |
| **AI Inference** | Groq Cloud API (**Gemma 2 9B IT**) |
| **Database** | SQLite + Pickle (Serialization) |
| **Infrastructure** | Docker, Vercel (Frontend), Render (Backend) |

---

## 🏗️ Architecture Overview
The app uses a decoupled architecture for maximum maintainability:
1.  **React Client**: Handles the UI, state management, and speech synthesis/recognition.
2.  **Flask API**: Orchestrates the logic, manages unique User IDs via local storage, and handles database I/O.
3.  **Groq Engine**: Processes the LLM prompts on dedicated hardware, bypassing local hardware limitations.

---

## 🚀 Local Setup

### 1. Backend Setup
```bash
# Clone the repository
git clone [https://github.com/DhruvJain7/ChatBot.git](https://github.com/DhruvJain7/ChatBot.git)
cd ChatBot

# Install dependencies
pip install -r requirements.txt

# Create a local .env file
echo "GROQ_API_KEY=your_groq_key_here" > .env

# Run the server
python app.py
