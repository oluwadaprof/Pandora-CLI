import React, { useState, useEffect } from "react";
import { commandPredictor } from "@/lib/ai/commandPrediction";
import { correctCommand } from "@/lib/ai/commandCorrection";
import CommandSuggestions from "./CommandSuggestions";
import { toast } from "@/components/ui/use-toast";

interface CommandPromptProps {
  onCommandSubmit?: (command: string) => void;
  commandHistory?: string[];
  historyIndex?: number;
  onHistoryChange?: (index: number) => void;
}

const CommandPrompt = ({
  onCommandSubmit = () => {},
  commandHistory = [],
  historyIndex = -1,
  onHistoryChange = () => {},
}: CommandPromptProps) => {
  const [command, setCommand] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedCommand, setSavedCommand] = useState("");

  useEffect(() => {
    if (command.trim()) {
      const predictions = commandPredictor.predictNext(command);
      setSuggestions(predictions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [command]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const { corrected, isCorrection } = correctCommand(command);

    if (isCorrection) {
      toast({
        title: "Command Corrected",
        description: `Using '${corrected}' instead of '${command}'`,
        duration: 3000,
      });
    }

    commandPredictor.addCommand(corrected);
    onCommandSubmit(corrected);
    setCommand("");
    setSavedCommand("");
    onHistoryChange(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Escape key to hide suggestions
    if (e.key === "Escape") {
      setShowSuggestions(false);
      return;
    }

    // Handle command submission
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
      return;
    }

    // Handle command history navigation
    if (e.key === "ArrowUp" && !command) {
      e.preventDefault();
      if (historyIndex === -1) {
        setSavedCommand(command);
      }
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        onHistoryChange(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown" && !command) {
      e.preventDefault();
      if (historyIndex > -1) {
        const newIndex = historyIndex - 1;
        onHistoryChange(newIndex);
        if (newIndex === -1) {
          setCommand(savedCommand);
        } else {
          setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setCommand(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col p-2 bg-gray-900 border-t border-gray-700 relative">
      <CommandSuggestions
        suggestions={suggestions}
        onSelect={handleSuggestionSelect}
        visible={showSuggestions && suggestions.length > 0}
      />
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-start gap-2">
          <span className="text-white font-mono text-sm leading-6">$</span>
          <textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none text-white font-mono text-sm focus:outline-none resize-none leading-6 min-h-[24px] max-h-[120px] overflow-y-auto"
            placeholder="Enter command..."
            spellCheck={false}
            autoComplete="off"
            rows={Math.min(5, Math.max(1, command.split("\n").length))}
            style={{
              height: `${Math.min(5, Math.max(1, command.split("\n").length)) * 24}px`,
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default CommandPrompt;
