import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "lucide-react";

interface CommandSuggestionsProps {
  suggestions: string[];
  onSelect: (command: string) => void;
  visible: boolean;
}

const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({
  suggestions,
  onSelect,
  visible,
}) => {
  if (!visible || suggestions.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute bottom-full left-4 w-[20%] mb-2 bg-zinc-800/80 backdrop-blur-sm border border-zinc-700/50 rounded-md overflow-hidden shadow-lg"
      >
        <div className="p-1 space-y-0.5">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion}
              className="w-full px-3 py-1.5 text-left text-sm text-zinc-300 hover:bg-zinc-700 rounded flex items-center gap-2"
              onClick={() => onSelect(suggestion)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Command className="w-4 h-4 text-zinc-500" />
              <span className="font-mono">{suggestion}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandSuggestions;
