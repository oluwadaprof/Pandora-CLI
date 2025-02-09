import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SidePanel from "../SidePanel";
import { TerminalInterfaceProps } from "@/types/terminal";
import { ANIMATION_CONFIG } from "@/constants/terminal";
import { useTerminal } from "@/hooks/useTerminal";
import TerminalHeader from "./TerminalHeader";
import TerminalContent from "./TerminalContent";
import Onboarding from "./Onboarding";
import ResizeHandles from "./ResizeHandles";

const ONBOARDING_KEY = "pandora-terminal-onboarding-completed";

const TerminalInterface = ({
  onCommandExecute = () => {},
  initialDirectory,
}: TerminalInterfaceProps) => {
  const [size, setSize] = useState({ width: 1200, height: 800 });
  const terminalRef = useRef<HTMLDivElement>(null);
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
    try {
      // Execute command and get result
      await handleCommandSubmit(command);
      onCommandExecute(command);
    } catch (error) {
      console.error("Error executing command:", error);
    }
  };

  const handleResize = (
    direction: string,
    movementX: number,
    movementY: number,
  ) => {
    setSize((prevSize) => {
      let newWidth = prevSize.width;
      let newHeight = prevSize.height;

      // Apply a smoother scaling factor
      const scaleFactor = 1;
      const deltaX = movementX * scaleFactor;
      const deltaY = movementY * scaleFactor;

      // Handle horizontal resizing
      if (direction.includes("e")) newWidth += deltaX;
      if (direction.includes("w")) newWidth -= deltaX;

      // Handle vertical resizing
      if (direction.includes("s")) newHeight += deltaY;
      if (direction.includes("n")) newHeight -= deltaY;

      // Round to nearest pixel to prevent subpixel rendering
      newWidth = Math.round(Math.max(300, newWidth));
      newHeight = Math.round(Math.max(200, newHeight));

      return { width: newWidth, height: newHeight };
    });
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          ref={terminalRef}
          className="flex bg-[#1C1C1C] text-white rounded-lg overflow-hidden border border-zinc-800 relative"
          style={{
            width: size.width,
            height: size.height,
            minWidth: 300,
            minHeight: 200,
          }}
          {...ANIMATION_CONFIG}
        >
          <div className="flex-1 flex flex-col">
            <ResizeHandles onResize={handleResize} />
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
          </div>
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
