import React, { useState } from "react";
import axios from "axios";
// FIX: Assuming your components are in a 'components' folder.
// If they are in the same folder as App.jsx, remove 'components/'.
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

const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "I am ready. Ask me anything." },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptSubmit = async (prompt) => {
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
    try {
      await axios.post("http://localhost:5000/reset", { user_id: userId });
      setChatMessages([
        { sender: "bot", text: "I am ready. Ask me anything." },
      ]);
      // Also reset the persona to default
      setCurrentPersona("default");
    } catch (error) {
      console.error("Error resetting conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* --- THE FIX IS HERE ---
         We now pass BOTH the value and the function down.
      */}
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
        />
      </main>
    </div>
  );
};

export default App;
