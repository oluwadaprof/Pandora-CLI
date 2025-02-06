import React from "react";
import { Input } from "@/components/ui/input";

interface CommandPromptProps {
  onCommandSubmit?: (command: string) => void;
}

const CommandPrompt = ({ onCommandSubmit = () => {} }: CommandPromptProps) => {
  const [command, setCommand] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onCommandSubmit(command);
    setCommand("");
  };

  return (
    <div className="flex flex-col p-2 bg-gray-900 border-t border-gray-700">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex items-start gap-2">
          <span className="text-white font-mono text-sm leading-6">$</span>
          <textarea
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
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
