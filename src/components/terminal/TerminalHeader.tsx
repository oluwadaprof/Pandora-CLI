import React from "react";
import { Terminal } from "lucide-react";
import TabList from "./TabList";
import WindowControls from "./WindowControls";
import { Tab } from "@/types/terminal";

interface TerminalHeaderProps {
  tabs: Tab[];
  activeTab: string;
  onReorder: (newTabs: Tab[]) => void;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onAddTab: () => void;
}

const TerminalHeader = ({
  tabs,
  activeTab,
  onReorder,
  onTabClick,
  onTabClose,
  onAddTab,
}: TerminalHeaderProps) => {
  return (
    <div className="h-8 border-b border-zinc-800 flex items-stretch">
      <div className="w-[40px] flex items-center justify-center border-r border-zinc-800 bg-zinc-900">
        <Terminal className="w-4 h-4 text-emerald-500" />
      </div>

      <TabList
        tabs={tabs}
        activeTab={activeTab}
        onReorder={onReorder}
        onTabClick={onTabClick}
        onTabClose={onTabClose}
        onAddTab={onAddTab}
      />

      <WindowControls
        onMinimize={() => window.electron?.minimize()}
        onMaximize={() => window.electron?.maximize()}
        onClose={() => window.electron?.close()}
      />
    </div>
  );
};

export default TerminalHeader;
