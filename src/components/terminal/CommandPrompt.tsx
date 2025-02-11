import React, { useState, useEffect } from "react";
import { commandPredictor } from "@/lib/ai/commandPrediction";
import { correctCommand } from "@/lib/ai/commandCorrection";
import CommandSuggestions from "./CommandSuggestions";
import { toast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/lib/auth";
import { useCommandHistory } from "@/hooks/useCommandHistory";

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
  const { user } = useAuth();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToHistory } = useCommandHistory();

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
    try {
      await onCommandSubmit(corrected);
      await addToHistory(corrected, undefined, "success");
    } catch (error) {
      await addToHistory(
        corrected,
        error instanceof Error ? error.message : "An error occurred",
        "error",
      );
      throw error;
    }
    setCommand("");
    setSavedCommand("");
    setShowSuggestions(false);
    onHistoryChange(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
      return;
    }

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

  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add favorites",
        variant: "destructive",
      });
      return;
    }

    const favorite = isFavorite(command);
    if (favorite) {
      const favCommand = favorites.find((f) => f.command === command);
      if (favCommand) {
        await removeFavorite(favCommand.id);
      }
    } else {
      await addFavorite(command);
    }
  };

  return (
    <div className="flex flex-col p-2 bg-gray-900 border-t border-gray-700 relative z-50">
      <CommandSuggestions
        suggestions={suggestions}
        onSelect={handleSuggestionSelect}
        visible={showSuggestions && suggestions.length > 0}
      />
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-start gap-2">
          <span className="text-white font-mono text-sm leading-6">$</span>
          <div className="flex-1 relative">
            <textarea
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none text-white font-mono text-sm focus:outline-none resize-none leading-6 min-h-[24px] max-h-[120px] overflow-y-auto pr-8"
              placeholder="Enter command..."
              spellCheck={false}
              autoComplete="off"
              rows={Math.min(5, Math.max(1, command.split("\n").length))}
              style={{
                height: `${Math.min(5, Math.max(1, command.split("\n").length)) * 24}px`,
              }}
            />
            {command && (
              <button
                type="button"
                onClick={handleToggleFavorite}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-yellow-500 transition-colors"
              >
                <Sparkles
                  className={`w-4 h-4 ${isFavorite(command) ? "fill-yellow-500 text-yellow-500" : ""}`}
                />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommandPrompt;
