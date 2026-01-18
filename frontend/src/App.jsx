import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatSidebar from "./ChatSidebar";
import Body from "./Body";

// Helper function to get or create a unique user ID
const getOrCreateUserId = () => {
  const USER_ID_KEY = "chatbot_user_id";
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

const userId = getOrCreateUserId();

// Speech Recognition Setup
// Check for browser support
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;
} else {
  console.warn("Speech Recognition not supported in this browser.");
}
////////

const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "I am ready. Ask me anything." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceModeOn, setIsVoiceModeOn] = useState(false);
  const speak = (text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Check if there are at least two messages
    if (chatMessages.length < 2) {
      return; // Not a reply, so don't speak
    }

    const lastMsg = chatMessages[chatMessages.length - 1];
    const secondLastMsg = chatMessages[chatMessages.length - 2];

    // Only speak if the last message is from the bot
    // AND the message before it was from the user.
    if (
      lastMsg.sender === "bot" &&
      secondLastMsg.sender === "user" &&
      isVoiceModeOn
    ) {
      speak(lastMsg.text);
    }
  }, [chatMessages, isVoiceModeOn]); // This dependency array runs the effect when chatMessages changes
  const handlePromptSubmit = async (prompt) => {
    if (!prompt || prompt.trim() === "") return; // Dont send empty prompts

    const userMessage = { sender: "user", text: prompt };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: prompt,
        user_id: userId,
      });
      const botMessage = { sender: "bot", text: res.data.response };
      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err) {
      console.error("Failed to fetch from backend:", err);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I couldn't connect. Please try again.",
      };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    setIsLoading(true);
    // Stop any speaking audio on new chat
    window.speechSynthesis.cancel();
    try {
      await axios.post("http://localhost:5000/reset", { user_id: userId });
      setChatMessages([
        { sender: "bot", text: "I am ready. Ask me anything." },
      ]);
    } catch (error) {
      console.error("Error resetting conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleListening = () => {
    if (!SpeechRecognition) {
      alert("Sorry your browser does not support speech recognition.");
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);

      // When speech is recognized
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handlePromptSubmit(transcript);
        setIsListening(false);
      };
      //Handle end of speech
      recognition.onend = () => {
        setIsListening(false);
      };
      // Handle errors
      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }
  };
  const toggleVoiceMode = () => {
    const newVoiceMode = !isVoiceModeOn;
    setIsVoiceModeOn(newVoiceMode);
    localStorage.setItem("chatbot_voice_mode", newVoiceMode);
    if (!newVoiceMode) {
      window.SpeechSynthesis.cancel();
    }
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        isOpen={isNavOpen}
        setIsOpen={setIsNavOpen}
        onNewChat={handleNewChat}
      />
      <main className="flex-1 overflow-y-auto">
        <Body
          chatMessages={chatMessages}
          isLoading={isLoading}
          handlePromptSubmit={handlePromptSubmit}
          isListening={isListening}
          onToggleListening={handleToggleListening}
          isSpeechSupported={!!SpeechRecognition}
          isVoiceModeOn={isVoiceModeOn}
          onToggleVoiceMode={toggleVoiceMode}
        />
      </main>
    </div>
  );
};

export default App;
