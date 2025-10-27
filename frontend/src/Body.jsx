import React, { useState } from "react";
import axios from "axios";
// Assuming PromptBox is in a separate file, e.g., ./PromptBox
import PromptBox from "./PromptBox";
import botAvatar from "/src/bot.png"; // Adjust the path to your image

const Body = () => {
  // State to hold the entire conversation history
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "I am ready. Ask me anything." },
  ]);

  // State for loading and error UI
  const [isLoading, setIsLoading] = useState(false);

  const handlePromptSubmit = async (prompt) => {
    // 1. Add user's message to chat history immediately for a responsive feel
    const userMessage = { sender: "user", text: prompt };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);

    // 2. Set loading state and clear previous errors
    setIsLoading(true);

    try {
      // 3. Send the prompt to the backend
      const res = await axios.post("http://localhost:5000/chat", {
        message: prompt,
      });

      // 4. Create the bot's response object
      const botMessage = { sender: "bot", text: res.data.response };

      // 5. Add bot's response to the chat history
      setChatMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err) {
      console.error("Failed to fetch from backend:", err);

      // Optionally, add an error message to the chat itself
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I couldn't connect. Please check your connection and try again.",
      };
      setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      // 6. Stop loading, whether the request succeeded or failed
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Scrollable content area */}
      <div className="flex-grow overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            ChatBot
          </h1>

          {/* This div now renders the entire chat history */}
          <div className="space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Simple Avatar for the bot */}
                {message.sender === "bot" && (
                  <div className="w-12 h-12 shrink-0">
                    <img
                      src={botAvatar}
                      alt="Bot Avatar"
                      className="w-full h-full rounded-full object-cover" // These classes make the image circular and fit perfectly
                    />
                  </div>
                )}

                <div
                  className={`max-w-md rounded-lg px-4 py-2 shadow-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}

            {/* Display loading skeleton when waiting for a response */}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex-shrink-0"></div>
                <div className="space-y-2 p-4 bg-white rounded-lg border border-gray-200">
                  <div className="w-48 bg-gray-200 rounded-md h-5 animate-pulse"></div>
                  <div className="w-32 bg-gray-200 rounded-md h-5 animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PromptBox at the bottom */}
      <div className="w-full border-t border-gray-200 px-4 py-4 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
          <PromptBox
            onPromptSubmit={handlePromptSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Body;
