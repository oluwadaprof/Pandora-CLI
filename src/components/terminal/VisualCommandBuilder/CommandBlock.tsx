import React from "react";
import { motion } from "framer-motion";
import { Command, ChevronRight } from "lucide-react";

interface CommandBlockProps {
  command: string;
  args?: string[];
  isConnected?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CommandBlock: React.FC<CommandBlockProps> = ({
  command,
  args = [],
  isConnected = false,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 flex items-center gap-3 cursor-pointer group"
        onClick={onEdit}
      >
        <Command className="w-5 h-5 text-emerald-500" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-200">{command}</span>
          {args.length > 0 && (
            <span className="text-xs text-zinc-400">{args.join(" ")}</span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
        >
          ×
        </button>
      </motion.div>
      {isConnected && <ChevronRight className="w-5 h-5 text-zinc-600" />}
    </div>
  );
};

export default CommandBlock;
