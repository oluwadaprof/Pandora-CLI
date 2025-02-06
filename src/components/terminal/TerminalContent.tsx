import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PanelRight } from "lucide-react";
import { OutputLine } from "@/types/terminal";
import { PANEL_ANIMATION_CONFIG } from "@/constants/terminal";
import OutputDisplay from "./OutputDisplay";
import CommandPrompt from "./CommandPrompt";
import FloatingPanel from "./FloatingPanel";

interface TerminalContentProps {
  outputLines: OutputLine[];
  currentDirectory?: string;
  isPanelOpen: boolean;
  onPanelToggle: () => void;
  onCommandSubmit: (command: string) => void;
}

const TerminalContent = ({
  outputLines,
  currentDirectory,
  isPanelOpen,
  onPanelToggle,
  onCommandSubmit,
}: TerminalContentProps) => {
  return (
    <div className="flex-1 flex bg-[#1C1C1C] relative">
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 relative">
          <OutputDisplay
            lines={outputLines}
            currentDirectory={currentDirectory}
          />
          <button
            onClick={onPanelToggle}
            className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors"
          >
            <PanelRight className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {isPanelOpen && (
              <motion.div
                {...PANEL_ANIMATION_CONFIG}
                className="absolute top-12 right-2 z-50"
              >
                <FloatingPanel onClose={onPanelToggle} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <CommandPrompt
          onCommandSubmit={onCommandSubmit}
          commandHistory={outputLines
            .filter((line) => line.type === "command")
            .map((line) => line.content.replace("$ ", ""))}
          historyIndex={-1}
          onHistoryChange={(index) => {}}
        />
      </div>
    </div>
  );
};

export default TerminalContent;
