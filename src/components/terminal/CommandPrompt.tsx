import React from "react";
import { Input } from "@/components/ui/input";
import { Folder } from "lucide-react";

interface CommandPromptProps {
  currentDirectory?: string;
  onCommandSubmit?: (command: string) => void;
}

const CommandPrompt = ({
  currentDirectory = "~/user",
  onCommandSubmit = () => {},
}: CommandPromptProps) => {
  const [command, setCommand] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCommandSubmit(command);
    setCommand("");
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-900 border-t border-gray-700">
      <div className="flex items-center gap-2 text-green-500">
        <Folder size={16} />
        <span className="font-mono text-sm">{currentDirectory}</span>
        <span className="text-white">$</span>
      </div>
      <form onSubmit={handleSubmit} className="flex-1">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="bg-transparent border-none text-white font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Enter command..."
          spellCheck={false}
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default CommandPrompt;
