import React from "react";
import { Reorder } from "framer-motion";
import { Plus } from "lucide-react";
import { Tab } from "@/types/terminal";
import TabItem from "./TabItem";

interface TabListProps {
  tabs: Tab[];
  activeTab: string;
  onReorder: (newTabs: Tab[]) => void;
  onTabClick: (id: string) => void;
  onTabClose: (id: string) => void;
  onAddTab: () => void;
}

const TabList = ({
  tabs,
  activeTab,
  onReorder,
  onTabClick,
  onTabClose,
  onAddTab,
}: TabListProps) => {
  const hasMultipleTabs = tabs.length > 1;

  return (
    <div className="flex-1 flex items-stretch bg-zinc-900/50 overflow-x-auto scrollbar-none">
      {hasMultipleTabs ? (
        <Reorder.Group
          as="div"
          axis="x"
          values={tabs}
          onReorder={onReorder}
          className="flex items-stretch h-full min-w-fit"
        >
          {tabs.map((tab) => (
            <Reorder.Item key={tab.id} value={tab}>
              <TabItem
                tab={tab}
                isActive={activeTab === tab.id}
                onClick={() => onTabClick(tab.id)}
                onClose={() => onTabClose(tab.id)}
                showDrag={hasMultipleTabs}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className="flex items-stretch h-full min-w-fit">
          {tabs.map((tab) => (
            <TabItem
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => onTabClick(tab.id)}
              onClose={() => onTabClose(tab.id)}
              showDrag={hasMultipleTabs}
            />
          ))}
        </div>
      )}
      <button
        onClick={onAddTab}
        className="px-3 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors flex-shrink-0"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};

export default TabList;
