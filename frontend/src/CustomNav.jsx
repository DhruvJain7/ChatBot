// src/components/Sidebar.js

import React from "react";

// ... (BurgerIcon component)
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
const CustomNav = ({ isOpen, setIsOpen }) => {
  return (
    <nav
      className={`
        h-screen bg-white shadow-lg
        transition-all duration-500 ease-in-out
        ${isOpen ? "w-64" : "w-20"}
      `}
    >
      {/* ... (Burger menu container) */}
      {/* Burger menu container */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer p-6"
          aria-label="Toggle menu"
        >
          <BurgerIcon />
        </button>
      </div>

      <ul className="list-none mt-[53px]">
        {/* -- Dashboard -- */}
        <li
          className={`
            flex items-center h-[43px] cursor-pointer
            hover:border-l-[7px] hover:border-[#58b5fc] hover:bg-gray-100
            overflow-hidden
            ${isOpen ? "pl-4" : "justify-center"}
          `}
        >
          <i className="fi fi-rr-apps text-xl w-6"></i>
          <span className={`ml-4 text-base font-lato ${!isOpen && "hidden"}`}>
            Dashboard
          </span>
        </li>

        {/* -- Projects -- */}
        <li
          className={`
            flex items-center h-[43px] mt-[15px] cursor-pointer
            hover:border-l-[7px] hover:border-[#58b5fc] hover:bg-gray-100
            overflow-hidden
            ${isOpen ? "pl-4" : "justify-center"}
          `}
        >
          <i className="fi fi-rr-folder text-xl w-6"></i>
          <span className={`ml-4 text-base font-lato ${!isOpen && "hidden"}`}>
            Projects
          </span>
        </li>

        {/* -- Tasks -- */}
        <li
          className={`
            flex items-center h-[43px] mt-[15px] cursor-pointer
            hover:border-l-[7px] hover:border-[#58b5fc] hover:bg-gray-100
            overflow-hidden
            ${isOpen ? "pl-4" : "justify-center"}
          `}
        >
          <i className="fi fi-rr-list-check text-xl w-6"></i>
          <span className={`ml-4 text-base font-lato ${!isOpen && "hidden"}`}>
            Tasks
          </span>
        </li>

        {/* -- Analytics -- */}
        <li
          className={`
            flex items-center h-[43px] mt-[15px] cursor-pointer
            hover:border-l-[7px] hover:border-[#58b5fc] hover:bg-gray-100
            overflow-hidden
            ${isOpen ? "pl-4" : "justify-center"}
          `}
        >
          <i className="fi fi-rr-chart-pie-alt text-xl w-6"></i>
          <span className={`ml-4 text-base font-lato ${!isOpen && "hidden"}`}>
            Analytics
          </span>
        </li>

        {/* -- Settings -- */}
        <li
          className={`
            flex items-center h-[43px] mt-[15px] cursor-pointer
            hover:border-l-[7px] hover:border-[#58b5fc] hover:bg-gray-100
            overflow-hidden
            ${isOpen ? "pl-4" : "justify-center"}
          `}
        >
          <i className="fi fi-rr-settings text-xl w-6"></i>
          <span className={`ml-4 text-base font-lato ${!isOpen && "hidden"}`}>
            Settings
          </span>
        </li>
      </ul>
    </nav>
  );
};

export default CustomNav;
