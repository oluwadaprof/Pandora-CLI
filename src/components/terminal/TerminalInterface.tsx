import React, { useState } from "react";
import CommandPrompt from "./CommandPrompt";
import OutputDisplay from "./OutputDisplay";
import FloatingPanel from "./FloatingPanel";
import { motion, AnimatePresence } from "framer-motion";
import { PanelRight, Plus, X, Terminal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { executeCommand } from "@/lib/terminal/commands";
import { useComputerName } from "@/hooks/useComputerName";

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
}

interface TerminalInterfaceProps {
  onCommandExecute?: (command: string) => void;
  initialDirectory?: string;
}

const TerminalInterface = ({
  onCommandExecute = () => {},
  initialDirectory,
}: TerminalInterfaceProps) => {
  const computerName = useComputerName();
  const defaultDirectory = `${computerName}@${import.meta.env.VITE_USER || "user"}/Desktop`;

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: initialDirectory || defaultDirectory,
      directory: initialDirectory || defaultDirectory,
      outputLines: [],
    },
  ]);
  const [activeTab, setActiveTab] = useState("1");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: initialDirectory || defaultDirectory,
      directory: initialDirectory || defaultDirectory,
      outputLines: [],
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const closeTab = (tabId: string) => {
    if (tabs.length > 1) {
      const newTabs = tabs.filter((tab) => tab.id !== tabId);
      setTabs(newTabs);
      if (activeTab === tabId) {
        setActiveTab(newTabs[newTabs.length - 1].id);
      }
    }
  };

  const handleCommandSubmit = async (command: string) => {
    const currentDirectory =
      tabs.find((tab) => tab.id === activeTab)?.directory || defaultDirectory;

    const newCommandLine: OutputLine = {
      id: Date.now().toString(),
      content: `$ ${command}`,
      type: "command",
    };

    if (command.trim().toLowerCase() === "clear") {
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTab
            ? {
                ...tab,
                outputLines: [],
              }
            : tab,
        ),
      );
      return;
    }

    const result = await executeCommand(command);

    const outputLine: OutputLine = {
      id: Date.now().toString(),
      content: result.content,
      type: result.type,
    };

    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              outputLines: [...tab.outputLines, newCommandLine, outputLine],
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
        className="flex flex-col h-full bg-[#1C1C1C] text-white rounded-lg overflow-hidden border border-zinc-800 min-w-[300px] min-h-[200px]"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        {/* Header with Logo and Tabs */}
        <div className="h-8 border-b border-zinc-800 flex items-stretch">
          {/* Logo Section */}
          <div className="w-[40px] flex items-center justify-center border-r border-zinc-800 bg-zinc-900">
            <Terminal className="w-4 h-4 text-emerald-500" />
          </div>

          {/* Tabs Section with horizontal scroll */}
          <div className="flex-1 flex items-stretch bg-zinc-900/50 overflow-x-auto scrollbar-none">
            <div className="flex items-stretch h-full min-w-fit">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group relative h-8 px-6 flex items-center gap-2 text-xs font-medium whitespace-nowrap min-w-[180px]
                    ${
                      activeTab === tab.id
                        ? "text-white bg-[#1C1C1C] border-b-2 border-emerald-500"
                        : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                    }
                  `}
                  layout
                >
                  <div className="relative z-10 flex items-center w-full">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center w-full">
                            <span className="truncate flex-1">
                              {tab.directory.length > 20
                                ? `${tab.directory.slice(0, 20)}...`
                                : tab.directory}
                            </span>
                            {tabs.length > 1 && (
                              <div className="flex-shrink-0 ml-auto">
                                <X
                                  className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    closeTab(tab.id);
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          sideOffset={16}
                          className="bg-zinc-800 border-zinc-700 text-xs"
                        >
                          {tab.directory}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.button>
              ))}
              <button
                onClick={addTab}
                className="px-3 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors flex-shrink-0"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Window Controls */}
          <div className="w-24 flex-shrink-0 bg-zinc-900/50 flex items-center justify-end pr-2 gap-2">
            <button
              onClick={() => {
                if (window.electron) {
                  window.electron.minimize();
                }
              }}
              className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors"
            />
            <button
              onClick={() => {
                if (window.electron) {
                  window.electron.maximize();
                }
              }}
              className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors"
            />
            <button
              onClick={() => {
                if (window.electron) {
                  window.electron.close();
                }
              }}
              className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 flex bg-[#1C1C1C] relative">
          <div className="flex-1 flex flex-col h-full">
            <div className="flex-1 relative">
              <OutputDisplay
                lines={activeTabData?.outputLines || []}
                currentDirectory={activeTabData?.directory}
              />
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
            <CommandPrompt onCommandSubmit={handleCommandSubmit} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TerminalInterface;
