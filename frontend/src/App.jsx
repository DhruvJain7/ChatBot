import React, { useState } from "react";
import CustomNav from "./CustomNav";
import Body from "./Body";

const App = () => {
  // 1. State is "lifted up" to the parent component.
  const [isNavOpen, setIsNavOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 2. Pass the state and the function to change it down as props. */}
      <CustomNav isOpen={isNavOpen} setIsOpen={setIsNavOpen} />

      {/* 3. The Body component is wrapped in a 'main' tag that grows to fill the remaining space. */}
      {/* The 'overflow-y-auto' ensures only the content area scrolls, not the whole page. */}
      <main className="flex-1 overflow-y-auto">
        <Body />
      </main>
    </div>
  );
};

export default App;
