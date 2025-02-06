import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalInterfaceProps } from "@/types/terminal";
import { ANIMATION_CONFIG } from "@/constants/terminal";
import { useTerminal } from "@/hooks/useTerminal";
import TerminalHeader from "./TerminalHeader";
import TerminalContent from "./TerminalContent";
import Onboarding from "./Onboarding";

const ONBOARDING_KEY = "pandora-terminal-onboarding-completed";

const TerminalInterface = ({
  onCommandExecute = () => {},
  initialDirectory,
}: TerminalInterfaceProps) => {
  const {
    tabs,
    setTabs,
    activeTab,
    setActiveTab,
    isPanelOpen,
    setIsPanelOpen,
    addTab,
    closeTab,
    handleCommandSubmit,
    activeTabData,
  } = useTerminal(initialDirectory);

  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const handleCommand = async (command: string) => {
    await handleCommandSubmit(command);
    onCommandExecute(command);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="flex flex-col h-full bg-[#1C1C1C] text-white rounded-lg overflow-hidden border border-zinc-800 min-w-[300px] min-h-[200px]"
          {...ANIMATION_CONFIG}
        >
          <TerminalHeader
            tabs={tabs}
            activeTab={activeTab}
            onReorder={setTabs}
            onTabClick={setActiveTab}
            onTabClose={closeTab}
            onAddTab={addTab}
          />

          <TerminalContent
            outputLines={activeTabData?.outputLines || []}
            currentDirectory={activeTabData?.directory}
            isPanelOpen={isPanelOpen}
            onPanelToggle={() => setIsPanelOpen(!isPanelOpen)}
            onCommandSubmit={handleCommand}
          />
        </motion.div>
      </AnimatePresence>

      {showOnboarding && (
        <Onboarding
          onClose={handleOnboardingClose}
          onCommandExecute={handleCommand}
        />
      )}
    </>
  );
};

export default TerminalInterface;
