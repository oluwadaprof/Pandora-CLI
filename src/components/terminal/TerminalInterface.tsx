import React, { useState } from "react";
import CommandPrompt from "./CommandPrompt";
import OutputDisplay from "./OutputDisplay";
import FloatingPanel from "./FloatingPanel";
import { motion, AnimatePresence } from "framer-motion";
import { PanelRight } from "lucide-react";

interface Tab {
  id: string;
  title: string;
  directory: string;
  outputLines: OutputLine[];
}

interface OutputLine {
  id: string;
  content: string;
  type: "command" | "output" | "error";
  timestamp: string;
}

interface TerminalInterfaceProps {
  onCommandExecute?: (command: string) => void;
  initialDirectory?: string;
}

const TerminalInterface = ({
  onCommandExecute = () => {},
  initialDirectory = "~/work-env/warp-internal",
}: TerminalInterfaceProps) => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: "Terminal 1",
      directory: initialDirectory,
      outputLines: [
        {
          id: "welcome",
          content: "Welcome to Terminal",
          type: "output",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ]);
  const [activeTab, setActiveTab] = useState("1");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleCommandSubmit = (command: string) => {
    const newCommandLine: OutputLine = {
      id: Date.now().toString(),
      content: `$ ${command}`,
      type: "command",
      timestamp: new Date().toISOString(),
    };

    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              outputLines: [...tab.outputLines, newCommandLine],
            }
          : tab,
      ),
    );

    onCommandExecute(command);
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col h-full bg-[#1C1C1C] text-white rounded-lg overflow-hidden border border-zinc-800"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        <div className="flex-1 flex bg-[#1C1C1C] relative">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 relative">
              <OutputDisplay lines={activeTabData?.outputLines || []} />
              <button
                onClick={() => setIsPanelOpen(!isPanelOpen)}
                className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                <PanelRight className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {isPanelOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-12 right-2 z-50"
                  >
                    <FloatingPanel onClose={() => setIsPanelOpen(false)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <CommandPrompt
              currentDirectory={activeTabData?.directory || initialDirectory}
              onCommandSubmit={handleCommandSubmit}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TerminalInterface;
