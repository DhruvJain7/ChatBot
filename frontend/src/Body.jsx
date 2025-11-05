import React from "react";
import PromptBox from "./PromptBox";
import botAvatar from "/src/bot.png";
import ReactMarkdown from "react-markdown";

// Body is now a "presentational" component. It just displays the data it's given.
const Body = ({
  chatMessages,
  isLoading,
  handlePromptSubmit,
  isListening,
  onToggleListening,
  isSpeechSupported,
  isVoiceModeOn,
  onToggleVoiceMode,
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Scrollable content area */}
      <div className="flex-grow overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Gemma-Bot
          </h1>
          <div className="space-y-4">
            {chatMessages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="w-12 h-12 shrink-0">
                    <img
                      src={botAvatar}
                      alt="Bot Avatar"
                      className="w-full h-full rounded-full object-cover"
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
                  <div className="prose">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <div className="w-12 h-12 shrink-0">
                  <img
                    src={botAvatar}
                    alt="Bot Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
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
            isListening={isListening}
            onToggleListening={onToggleListening}
            isSpeechSupported={isSpeechSupported}
            isVoiceModeOn={isVoiceModeOn}
            onToggleVoiceMode={onToggleVoiceMode}
          />
        </div>
      </div>
    </div>
  );
};

export default Body;
