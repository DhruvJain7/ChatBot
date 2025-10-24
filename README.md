# Personal AI Chatbot with React and Flask

This is a personal AI chatbot application built with a React frontend and a Flask backend. It uses a pre-trained model from Hugging Face to generate responses.

***

## Description

This project implements a client-server architecture to create a chatbot.
- The **React frontend** provides a user-friendly chat interface.
- The **Flask backend** handles the natural language processing using the **DialoGPT-medium model** from Microsoft, available via Hugging Face.

When a user sends a message, it's sent to the Flask server. The server uses the DialoGPT model to generate a response, which is then sent back to the frontend and displayed in the chat window.

***

## Technologies Used

* **Frontend**:
    * React
    * Vite
    * axios
* **Backend**:
    * Flask
    * Flask-CORS
    * transformers (from Hugging Face)
    * torch

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
4.  Start the Flask server:
    ```sh
    python app.py
    ```

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

## Features

* **Responsive Chat Interface**: A clean and simple chat UI.
* **Real-time Interaction**: Get responses from the AI in real-time.
* **Powered by Hugging Face**: Utilizes a powerful, pre-trained language model.
* **Separation of Concerns**: A decoupled frontend and backend for maintainability.

***

## Acknowledgements

* This project is based on the [Dev.to article](https://dev.to/allanninal/building-a-personal-ai-chatbot-with-react-and-flask-a-comprehensive-guide-4n2j) by Allan Ninal.
* Thanks to Microsoft for the DialoGPT model and Hugging Face for making it accessible.
