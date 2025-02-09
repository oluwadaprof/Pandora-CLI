import { useState } from "react";
import { Tab, OutputLine } from "@/types/terminal";
import { executeCommand } from "@/lib/terminal/commands";
import { useComputerName } from "./useComputerName";

const createNewTab = (directory: string): Tab => ({
  id: Date.now().toString(),
  title: directory,
  directory: directory,
  outputLines: [],
  commandHistory: [],
  historyIndex: -1,
});

export const useTerminal = (initialDirectory?: string) => {
  const computerName = useComputerName();
  const defaultDirectory = `${computerName}@${import.meta.env.VITE_USER || "user"}/Desktop`;

  const [tabs, setTabs] = useState<Tab[]>([
    createNewTab(initialDirectory || defaultDirectory),
  ]);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const addTab = () => {
    const newTab = createNewTab(initialDirectory || defaultDirectory);
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
    // Handle clear command first
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

    // Add command to history and show it in output
    const commandLine: OutputLine = {
      id: Date.now().toString(),
      content: command,
      type: "command",
    };

    // Update tabs with the command first
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              commandHistory: [...tab.commandHistory, command],
              historyIndex: tab.commandHistory.length,
              outputLines: [...tab.outputLines, commandLine],
            }
          : tab,
      ),
    );

    try {
      // Execute command and get result
      const result = await executeCommand(command);

      // Add output to the terminal
      const outputLine: OutputLine = {
        id: (Date.now() + 1).toString(),
        content: result.content,
        type: result.type,
      };

      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTab
            ? {
                ...tab,
                outputLines: [...tab.outputLines, outputLine],
              }
            : tab,
        ),
      );
    } catch (error) {
      // Handle error output
      const errorLine: OutputLine = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error ? error.message : "An error occurred",
        type: "error",
      };

      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === activeTab
            ? {
                ...tab,
                outputLines: [...tab.outputLines, errorLine],
              }
            : tab,
        ),
      );
    }
  };

  return {
    tabs,
    setTabs,
    activeTab,
    setActiveTab,
    isPanelOpen,
    setIsPanelOpen,
    addTab,
    closeTab,
    handleCommandSubmit,
    activeTabData: tabs.find((tab) => tab.id === activeTab),
  };
};
