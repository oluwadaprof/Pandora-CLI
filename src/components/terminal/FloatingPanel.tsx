import React, { useState } from "react";
import { Search, X, User, HelpCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface FloatingPanelProps {
  onClose: () => void;
  className?: string;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  onClose,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div
      className={cn(
        "w-[300px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/40 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[400px]",
        className,
      )}
    >
      {/* Header */}
      <div className="h-12 px-4 border-b border-zinc-800/40 flex items-center justify-between">
        <div className="flex-1 flex items-center min-w-0">
          {!isSearching ? (
            <div className="text-[15px] font-medium text-zinc-200/80">
              Search Commands
            </div>
          ) : (
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="bg-transparent border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 h-8"
              autoFocus
            />
          )}
        </div>
        <div className="flex items-center gap-3 ml-2">
          <button
            onClick={() => {
              setIsSearching(!isSearching);
              if (!isSearching) {
                setSearchTerm("");
              }
            }}
            className="text-zinc-400 hover:text-zinc-300"
          >
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
      <ScrollArea className="flex-1">
        <div className="p-4">
          {searchTerm ? (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
              <Search className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-sm">No results found</p>
              <p className="text-xs opacity-75">Try a different search term</p>
            </div>
          ) : (
            <div className="text-center text-zinc-400 py-8">
              <p className="text-sm">Start typing to search commands</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Bottom Sheet */}
      <div className="mt-auto">
        <Separator className="bg-zinc-800/40" />
        <div className="p-2 flex justify-end gap-2">
          <button className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors">
            <User className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingPanel;
