import React from "react";
import TerminalInterface from "./terminal/TerminalInterface";

const Home = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-[1200px] mx-auto h-screen p-4">
        <TerminalInterface
          onCommandExecute={(command) => {
            console.log("Executing command:", command);
          }}
        />
      </div>
    </div>
  );
};

export default Home;
