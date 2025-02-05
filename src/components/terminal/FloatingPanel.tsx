import React from "react";
import {
  ChevronDown,
  UserPlus,
  Plus,
  FileText,
  X,
  Search,
  Trash,
} from "lucide-react";

interface FloatingPanelProps {
  onClose: () => void;
}

const FloatingPanel = ({ onClose }: FloatingPanelProps) => {
  return (
    <div className="absolute top-0 right-0 w-[300px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/40 rounded-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800/40 flex items-center justify-between">
        <div className="text-[15px] font-medium text-zinc-200">Warp Drive</div>
        <div className="flex items-center gap-3">
          <button className="text-zinc-400 hover:text-zinc-300">
            <Search className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-300"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-1">
        {/* Acme Inc Section */}
        <div>
          <div className="flex items-center justify-between p-2 rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-zinc-200">Acme Inc.</span>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-zinc-400" />
              <Plus className="w-4 h-4 text-zinc-400" />
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800/50">
              <span className="text-yellow-500/90 font-mono text-sm">$_</span>
              <span className="text-[14px] text-zinc-200">
                Connect to Staging Server
              </span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800/50">
              <span className="text-yellow-500/90 font-mono text-sm">$_</span>
              <span className="text-[14px] text-zinc-200">DB Fields</span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800/50">
              <FileText className="w-4 h-4 text-blue-400/90" />
              <span className="text-[14px] text-zinc-200">
                Getting started with Acme Inc. Staging
              </span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800/50">
              <X className="w-4 h-4 text-pink-400/90" />
              <span className="text-[14px] text-zinc-200">
                Tokens and Secrets
              </span>
            </div>
          </div>
        </div>

        {/* Personal Section */}
        <div className="mt-2">
          <div className="flex items-center justify-between p-2 rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-[15px] text-zinc-200">Personal</span>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </div>
            <Plus className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800/50">
              <span className="text-yellow-500/90 font-mono text-sm">$_</span>
              <span className="text-[14px] text-zinc-200">
                Ensure .ssh folder has correct permissi...
              </span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800/50">
              <FileText className="w-4 h-4 text-blue-400/90" />
              <span className="text-[14px] text-zinc-200">
                Getting started with Notebooks
              </span>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800/50">
              <Trash className="w-4 h-4 text-zinc-400" />
              <span className="text-[14px] text-zinc-200">Trash</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingPanel;
