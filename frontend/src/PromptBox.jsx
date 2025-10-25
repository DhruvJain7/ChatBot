// src/components/PromptBox.js

import React, { useState } from "react";

const PromptBox = ({ onPromptSubmit }) => {
  const [prompt, setPrompt] = useState("");

  // Handles form submission (button click or Enter key)
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from reloading
    if (prompt.trim() === "") return; // Don't submit empty prompts

    // This is where you would send the prompt to your AI model
    onPromptSubmit(prompt);

    setPrompt(""); // Clear the input field after submission
  };

  // Allows "Enter" to submit and "Shift+Enter" for a new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask the model anything..."
        className="
          block w-full resize-none rounded-md border-gray-300 bg-white
          p-4 pr-16 text-gray-900 shadow-sm
          focus:border-blue-500 focus:ring-blue-500
        "
        rows="1" // Starts as a single line
      />
      <button
        type="submit"
        className="
          absolute bottom-2.5 right-2.5 rounded-lg bg-blue-600 p-2.5 text-white
          hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300
          disabled:opacity-50
        "
        disabled={prompt.trim() === ""}
        aria-label="Send prompt"
      >
        {/* Paper Plane Icon from Flaticon */}
        <i className="fi fi-rr-paper-plane flex h-5 w-5 items-center justify-center"></i>
      </button>
    </form>
  );
};

export default PromptBox;
