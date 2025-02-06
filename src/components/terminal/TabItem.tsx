import React from "react";
import { Reorder } from "framer-motion";
import { X } from "lucide-react";
import { TabProps } from "@/types/terminal";
import { TAB_MAX_LENGTH } from "@/constants/terminal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TabItemProps extends TabProps {
  showDrag: boolean;
}

const TabItem = ({
  tab,
  isActive,
  onClose,
  onClick,
  showDrag,
}: TabItemProps) => {
  const Component = showDrag ? Reorder.Item : "div";

  return (
    <Component
      value={tab}
      className={`
        group relative h-8 px-6 flex items-center gap-2 text-xs font-medium whitespace-nowrap min-w-[180px]
        ${showDrag ? "cursor-grab active:cursor-grabbing" : ""}
        ${
          isActive
            ? "text-white bg-[#1C1C1C] border-b-2 border-emerald-500"
            : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
        }
      `}
      onClick={() => onClick(tab.id)}
    >
      <div className="relative z-10 flex items-center w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center w-full">
                <span className="truncate flex-1">
                  {tab.directory.length > TAB_MAX_LENGTH
                    ? `${tab.directory.slice(0, TAB_MAX_LENGTH)}...`
                    : tab.directory}
                </span>
                {showDrag && (
                  <div className="flex-shrink-0 ml-auto">
                    <X
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity close-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose(tab.id);
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
    </Component>
  );
};

export default TabItem;
