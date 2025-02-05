import React from "react";
import {
  ChevronDown,
  UserPlus,
  Plus,
  FileText,
  Terminal as TerminalIcon,
  X,
} from "lucide-react";

interface FloatingPanelProps {
  onClose: () => void;
}

const FloatingPanel = ({ onClose }: FloatingPanelProps) => {
  return (
    <div className="absolute top-0 right-0 w-[300px] bg-[#2A2A2A] border border-zinc-800 rounded-lg shadow-xl overflow-hidden">
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-300">Terminal</div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-md group cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-300">
                Acme Inc.
              </span>
            </div>
            <div className="flex items-center gap-1">
              <UserPlus className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100" />
              <Plus className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100" />
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </div>
          </div>

          <div className="ml-2 space-y-1">
            <div className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md cursor-pointer">
              <TerminalIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-zinc-300">
                Connect to Staging Server
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md cursor-pointer">
              <TerminalIcon className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-zinc-300">DB Fields</span>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-zinc-800 rounded-md cursor-pointer">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-zinc-300">
                Getting started with Acme Inc. Staging
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-md group cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-zinc-300">
                Personal
              </span>
            </div>
            <Plus className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingPanel;
