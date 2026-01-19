Full-Stack AI Voice Chatbot 🎙️🤖
=================================

This project is a high-performance, voice-enabled AI assistant featuring a **React (Vite)** frontend and a **Flask (Dockerized)** backend. It leverages the state-of-the-art **Gemma 2 9B IT** model via the **Groq LPU™ Inference Engine** for sub-second responses, preserves conversation memory using **SQLite**, and includes an interactive **Voice Mode**.

✨ Core Features
---------------

*   **Intelligent AI**: Powered by Google's **Gemma 2 9B IT**, known for its high accuracy and conversational ability.
    
*   **Persistent Memory**: Integrated **SQLite** backend stores serialized chat history, allowing context to persist across sessions and server restarts.
    
*   **Voice Mode**: Full support for the Web Speech API, enabling real-time **Speech-to-Text** (dictation) and **Text-to-Speech** (audio responses).
    
*   **Production Ready**: Dockerized backend for easy scaling on Render and a Vercel-optimized frontend.
    
*   **Secure & Fast**: Optimized for **HTTPS** to ensure microphone permissions work flawlessly, with lightning-fast inference provided by Groq.
    

🛠️ Tech Stack
--------------

**LayerTechnologyFrontend**React (Vite), Axios, Tailwind CSS**Backend**Flask, Gunicorn, Python 3.11**AI Inference**Groq Cloud API (**Gemma 2 9B IT**)**Database**SQLite + Pickle (Serialization)**Infrastructure**Docker, Vercel (Frontend), Render (Backend)

🏗️ Architecture Overview
-------------------------

The app uses a decoupled architecture for maximum maintainability:

1.  **React Client**: Handles the UI, state management, and speech synthesis/recognition.
    
2.  **Flask API**: Orchestrates the logic, manages unique User IDs via local storage, and handles database I/O.
    
3.  **Groq Engine**: Processes the LLM prompts on dedicated hardware, bypassing local hardware limitations.
    

🚀 Local Setup
--------------

## 🚀 Local Setup

### 1. Backend Setup
```bash
# Clone the repository
git clone [https://github.com/DhruvJain7/ChatBot.git](https://github.com/DhruvJain7/ChatBot.git)
cd ChatBot

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

### 2\. Frontend Setup 



```bash
cd frontend  npm install  
# Create a local .env file
  echo "VITE_API_URL=http://localhost:5000" > .env
# Run the development server
npm run dev   `
```

🔑 Environment Variables
------------------------

### Local Development

*   **Backend Root**: .env file containing GROQ\_API\_KEY.
    
*   **Frontend Folder**: .env file containing VITE\_API\_URL.
    

### Production Deployment

*   **Render (Backend)**: Add GROQ\_API\_KEY and PORT=5000 to the Environment settings.
    
*   **Vercel (Frontend)**: Add VITE\_API\_URL set to your live Render URL (e.g., https://your-app.onrender.com).
    

🌐 Deployment Configuration
---------------------------

### Render (Backend)

*   **Root Directory**: Leave blank (Root of repo).
    
*   **Language**: Docker.
    
*   **Dockerfile Path**: ./Dockerfile.
    

### Vercel (Frontend)

*   **Root Directory**: frontend.
    
*   **Framework Preset**: Vite.
    
*   **Build Command**: npm run build.
    
*   **Output Directory**: dist.
    

🎤 Voice & HTTPS
----------------

The **Web Speech API** used for the microphone and voice synthesis requires a **Secure Context**.

*   In production, Vercel and Render provide **HTTPS** by default.
    
*   Always ensure you access the app via the https:// protocol to enable microphone permissions in your browser.
    



🙏 Acknowledgments & Credits
----------------------------

This project was built and evolved starting from the foundational guide by **Allan Ninal**.

*   **Original Article**: [Building a Personal AI Chatbot with React and Flask: A Comprehensive Guide](https://dev.to/allanninal/building-a-personal-ai-chatbot-with-react-and-flask-a-comprehensive-guide-4n2j)
    
*   **Evolutions**: While the original guide utilized DialoGPT, this version has been upgraded with:
    
    *   **Groq API** for sub-second LPU inference.
        
    *   **Gemma 2 9B** instruction-tuned model.
        
    *   **SQLite Persistence** for multi-user chat history.
        
    *   **Dockerization** for cloud-ready deployment.
