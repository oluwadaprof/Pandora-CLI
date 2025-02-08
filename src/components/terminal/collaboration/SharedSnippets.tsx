import React from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Command, Tag, Clock } from "lucide-react";
import type { SharedSnippet } from "@/lib/collaboration/types";

interface SharedSnippetsProps {
  snippets: SharedSnippet[];
  onSelect: (snippet: SharedSnippet) => void;
}

const SharedSnippets: React.FC<SharedSnippetsProps> = ({
  snippets,
  onSelect,
}) => {
  return (
    <ScrollArea className="h-[300px] w-[250px] bg-zinc-900 border border-zinc-800 rounded-lg">
      <div className="p-4 space-y-4">
        <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          <Command className="w-4 h-4" />
          Shared Snippets
        </h3>

        <div className="space-y-2">
          {snippets.map((snippet) => (
            <motion.div
              key={snippet.id}
              className="p-3 bg-zinc-800/50 border border-zinc-700/50 rounded-lg space-y-2 cursor-pointer hover:bg-zinc-800 transition-colors"
              onClick={() => onSelect(snippet)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-zinc-300">
                  {snippet.name}
                </span>
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {new Date(snippet.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-zinc-400 truncate">
                {snippet.command}
              </div>

              {snippet.tags && snippet.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {snippet.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-700/50 rounded text-xs text-zinc-400"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default SharedSnippets;
