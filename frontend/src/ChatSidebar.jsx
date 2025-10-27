import React from "react";

// --- ICONS (Added a few new ones for our personas) ---
const BurgerIcon = () => (
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
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);
const SettingsIcon = () => (
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
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.499.09.679-.217.679-.481 0-.237-.015-.867-.015-1.693-2.782.607-3.369-1.341-3.369-1.341-.454-1.156-1.11-1.46-1.11-1.46-.908-.619.069-.607.069-.607 1.004.07 1.531 1.032 1.531 1.032.892 1.529 2.341 1.087 2.91.829.091-.645.356-1.087.653-1.33-2.228-.253-4.555-1.119-4.555-4.97 0-1.101.392-1.996 1.03-2.693-.103-.253-.448-1.275.097-2.651 0 0 .84-.27 2.75 1.025A9.23 9.23 0 0112 5.04c.85.006 1.7.127 2.476.356 1.907-1.295 2.747-1.025 2.747-1.025.546 1.376.202 2.398.099 2.651.64.697 1.028 1.592 1.028 2.693 0 3.86-2.33 4.71-4.565 4.964.359.309.678.92.678 1.855 0 1.336-.012 2.419-.012 2.747 0 .268.18.583.687.481C21.144 20.203 24 16.449 24 12.017 24 6.484 19.522 2 14 2H12z"
      clipRule="evenodd"
    />
  </svg>
);

const ChatSidebar = ({
  isOpen,
  setIsOpen,
  onNewChat,
  currentPersona,
  onPersonaChange,
}) => {
  return (
    <nav
      className={`
        h-screen bg-white shadow-lg
        transition-all duration-500 ease-in-out
        flex flex-col
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* Burger menu container */}
      <div className="flex justify-end p-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
          aria-label="Toggle menu"
        >
          <BurgerIcon />
        </button>
      </div>

      {/* --- Main Actions --- */}
      <div className="flex-grow px-2 overflow-y-auto">
        {/* -- New Chat Button -- */}
        <button
          onClick={onNewChat}
          className={`
            flex items-center w-full h-[43px] cursor-pointer
            hover:border-l-[7px] hover:border-[#58b5fc] hover:bg-gray-100
            overflow-hidden rounded-md
            ${isOpen ? "pl-4" : "justify-center"}
          `}
        >
          <div className="w-6 text-xl flex justify-center">
            <PlusIcon />
          </div>
          <span className={`ml-4 text-base font-lato ${!isOpen && "hidden"}`}>
            New Chat
          </span>
        </button>
      </div>

      {/* --- Footer Controls --- */}
      <div className="mb-4">
        <a
          href="#"
          className={`flex items-center h-[43px] cursor-pointer hover:bg-gray-100 overflow-hidden ${isOpen ? "pl-4" : "justify-center"}`}
        >
          <div className="w-6 text-xl flex justify-center">
            <SettingsIcon />
          </div>
          <span
            className={`ml-4 text-sm font-lato text-gray-600 ${!isOpen && "hidden"}`}
          >
            Settings
          </span>
        </a>
        <a
          href="https://github.com/DhruvJain7/ChatBot" // <-- UPDATE THIS LINK!
          target="_blank"
          rel="noopener noreferrer"
          className={`
            flex items-center h-[43px] cursor-pointer
            hover:bg-gray-100 overflow-hidden
            ${isOpen ? "pl-4" : "justify-center"}
          `}
        >
          {isOpen ? (
            <>
              <i className="fi fi-brands-github text-xl w-6 text-center"></i>
              <span className={`ml-4 text-sm font-lato text-gray-600`}>
                View on GitHub
              </span>
            </>
          ) : (
            <div className="w-6 text-xl flex justify-center text-gray-600">
              <GitHubIcon />
            </div>
          )}
        </a>
      </div>
    </nav>
  );
};

export default ChatSidebar;
