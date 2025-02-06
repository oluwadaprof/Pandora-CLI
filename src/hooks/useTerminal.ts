import { useState } from "react";
import { Tab, OutputLine } from "@/types/terminal";
import { executeCommand } from "@/lib/terminal/commands";
import { useComputerName } from "./useComputerName";

export const useTerminal = (initialDirectory?: string) => {
  const computerName = useComputerName();
  const defaultDirectory = `${computerName}@${import.meta.env.VITE_USER || "user"}/Desktop`;

  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      title: initialDirectory || defaultDirectory,
      directory: initialDirectory || defaultDirectory,
      outputLines: [],
      commandHistory: [],
      historyIndex: -1,
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
    // Update command history
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === activeTab
          ? {
              ...tab,
              commandHistory: [...tab.commandHistory, command],
              historyIndex: tab.commandHistory.length,
            }
          : tab,
      ),
    );
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
