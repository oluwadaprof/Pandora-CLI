import React, { useState } from "react";
import CommandHistory from "./CommandHistory";
import CommandPrompt from "./CommandPrompt";
import OutputDisplay from "./OutputDisplay";
import { motion, AnimatePresence } from "framer-motion";

interface TerminalInterfaceProps {
  onCommandExecute?: (command: string) => void;
  initialDirectory?: string;
}

interface OutputLine {
  id: string;
  content: string;
  type: "command" | "output" | "error";
  timestamp: string;
}

const TerminalInterface = ({
  onCommandExecute = () => {},
  initialDirectory = "~/user",
}: TerminalInterfaceProps) => {
  const [currentDirectory, setCurrentDirectory] = useState(initialDirectory);
  const [outputLines, setOutputLines] = useState<OutputLine[]>([
    {
      id: "1",
      content: "Welcome to the Terminal Interface",
      type: "output",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      content: 'Type "help" for a list of available commands',
      type: "output",
      timestamp: new Date().toISOString(),
    },
  ]);

  const handleCommandSubmit = (command: string) => {
    // Add command to output
    const newCommandLine: OutputLine = {
      id: Date.now().toString(),
      content: `$ ${command}`,
      type: "command",
      timestamp: new Date().toISOString(),
    };

    setOutputLines((prev) => [...prev, newCommandLine]);
    onCommandExecute(command);

    // Simulate command output
    if (command.startsWith("cd ")) {
      const newDir = command.split(" ")[1];
      setCurrentDirectory((prev) => `${prev}/${newDir}`);
    } else {
      // Add mock output
      const mockOutput: OutputLine = {
        id: (Date.now() + 1).toString(),
        content: `Executed command: ${command}`,
        type: "output",
        timestamp: new Date().toISOString(),
      };
      setOutputLines((prev) => [...prev, mockOutput]);
    }
  };

  const handleCommandSelect = (command: string) => {
    handleCommandSubmit(command);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col h-full bg-zinc-900 text-white rounded-lg overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          duration: 0.3,
        }}
      >
        <div className="h-8 bg-gray-800 flex items-center justify-between px-4 rounded-t-lg">
          <span className="text-sm font-medium text-gray-400">
            Pandora Interface
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              className="w-3 h-3 rounded-full bg-yellow-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
            <motion.button
              className="w-3 h-3 rounded-full bg-green-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
            <motion.button
              className="w-3 h-3 rounded-full bg-red-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            />
          </div>
        </div>
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 relative">
              <OutputDisplay lines={outputLines} />
            </div>
            <CommandPrompt
              currentDirectory={currentDirectory}
              onCommandSubmit={handleCommandSubmit}
            />
          </div>
          <CommandHistory onCommandSelect={handleCommandSelect} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TerminalInterface;
