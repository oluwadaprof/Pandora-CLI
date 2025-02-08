import React from "react";
import { motion } from "framer-motion";
import { Command, Terminal, Git, Package, Database, Cloud } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommandCategory {
  name: string;
  icon: React.ReactNode;
  commands: string[];
}

const categories: CommandCategory[] = [
  {
    name: "Basic",
    icon: <Terminal className="w-4 h-4" />,
    commands: ["ls", "cd", "pwd", "mkdir", "touch", "rm", "cp", "mv"],
  },
  {
    name: "Git",
    icon: <Git className="w-4 h-4" />,
    commands: ["git init", "git add", "git commit", "git push", "git pull"],
  },
  {
    name: "Package",
    icon: <Package className="w-4 h-4" />,
    commands: ["npm install", "npm start", "npm build", "yarn add", "yarn dev"],
  },
  {
    name: "Database",
    icon: <Database className="w-4 h-4" />,
    commands: ["mysql", "postgresql", "mongodb"],
  },
  {
    name: "Cloud",
    icon: <Cloud className="w-4 h-4" />,
    commands: ["aws", "gcloud", "azure"],
  },
];

interface CommandPaletteProps {
  onSelect: (command: string) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onSelect }) => {
  return (
    <ScrollArea className="h-[300px] w-[200px] bg-zinc-900 border border-zinc-800 rounded-lg p-2">
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name} className="space-y-2">
            <div className="flex items-center gap-2 px-2 text-sm text-zinc-400">
              {category.icon}
              <span>{category.name}</span>
            </div>
            <div className="space-y-1">
              {category.commands.map((cmd) => (
                <motion.button
                  key={cmd}
                  className="w-full px-2 py-1.5 text-left text-sm text-zinc-300 hover:bg-zinc-800 rounded-md flex items-center gap-2"
                  onClick={() => onSelect(cmd)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Command className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="font-mono">{cmd}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CommandPalette;
