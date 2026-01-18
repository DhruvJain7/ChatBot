// src/components/PromptBox.js

import React, { useState } from "react";

// new Mic Icon
const MicrophoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
    />
  </svg>
);
// Send Icon
const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
      clipRule="evenodd"
    />
  </svg>
);
const SpeakerOnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .89-1.077 1.337-1.707.707L5.586 15z"
    />
  </svg>
);
const SpeakerOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.536 8.464a5 5 0 010 7.072M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .89-1.077 1.337-1.707.707L5.586 15z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 14l-4-4m0 4l4-4"
    />
  </svg>
);

const PromptBox = ({
  onPromptSubmit,
  isLoading,
  isListening,
  onToggleListening,
  isSpeechSupported,
  isVoiceModeOn,
  onToggleVoiceMode,
}) => {
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
      {isSpeechSupported && (
        <button
          type="button"
          onClick={onToggleListening}
          disabled={isLoading}
          className={`p-3 rounded-full transition-colors ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isListening ? "Stop Listening" : "Start Listening"}
        >
          <MicrophoneIcon />
        </button>
      )}
      <button
        type="button"
        onClick={onToggleVoiceMode}
        disabled={isLoading}
        className={`
                p-3 rounded-full transition-colors
                ${
                  isVoiceModeOn
                    ? "bg-blue-500 text-white"
                    : "bg-transparent  text-gray-600 hover:bg-gray-300"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
        aria-label={
          isVoiceModeOn ? "Turn voice mode off" : "Turn voice mode on"
        }
      >
        {isVoiceModeOn ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
      </button>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? "Listening..." : "Ask the model anything..."}
        disabled={isLoading || isListening}
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
        disabled={isLoading || !prompt.trim() || isListening}
        aria-label="Send prompt"
      >
        {/* Paper Plane Icon from Flaticon */}
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : (
          <SendIcon />
        )}
        {/* <i className="fi fi-rr-paper-plane flex h-5 w-5 items-center justify-center"></i>*/}
      </button>
    </form>
  );
};

export default PromptBox;
