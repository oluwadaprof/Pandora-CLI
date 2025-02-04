import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Clock,
  Star,
  Users,
  Bot,
  Settings,
  HelpCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

interface Command {
  id: string;
  command: string;
  timestamp: string;
  isFavorite?: boolean;
}

interface CommandHistoryProps {
  commands?: Command[];
  onCommandSelect?: (command: string) => void;
  onSearch?: (searchTerm: string) => void;
}

const CommandHistory = ({
  commands = [
    {
      id: "1",
      command: "npm install react",
      timestamp: "2024-03-20 10:00",
      isFavorite: true,
    },
    { id: "2", command: "git status", timestamp: "2024-03-20 09:45" },
    { id: "3", command: "ls -la", timestamp: "2024-03-20 09:30" },
    { id: "4", command: "cd projects", timestamp: "2024-03-20 09:15" },
    {
      id: "5",
      command: "docker ps",
      timestamp: "2024-03-20 09:00",
      isFavorite: true,
    },
  ],
  onCommandSelect = () => {},
  onSearch = () => {},
}: CommandHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const filteredCommands = commands.filter((cmd) =>
    cmd.command.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const favoriteCommands = filteredCommands.filter((cmd) => cmd.isFavorite);
  const recentCommands = filteredCommands.filter((cmd) => !cmd.isFavorite);

  return (
    <motion.div
      className="w-[250px] h-full bg-zinc-900 border-l border-zinc-700 flex flex-col"
      initial={{ x: 250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="p-4 space-y-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9 bg-zinc-800 border-zinc-700"
          />
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
        </div>

        <ScrollArea className="flex-1">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="favorites" className="border-none">
              <AccordionTrigger className="flex items-center gap-2 text-zinc-400 hover:no-underline py-0 [&[data-state=open]>svg]:rotate-0">
                <Star className="h-4 w-4" />
                <span className="text-sm font-medium text-left">Favorites</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {favoriteCommands.map((cmd) => (
                    <Button
                      key={cmd.id}
                      variant="ghost"
                      className="w-full justify-start text-left text-zinc-300 hover:text-white hover:bg-zinc-800"
                      onClick={() => onCommandSelect(cmd.command)}
                    >
                      <span className="truncate">{cmd.command}</span>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="recent" className="border-none">
              <AccordionTrigger className="flex items-center gap-2 text-zinc-400 hover:no-underline py-0 [&[data-state=open]>svg]:rotate-0">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium text-left">
                  Recent Commands
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2">
                  {recentCommands.map((cmd) => (
                    <Button
                      key={cmd.id}
                      variant="ghost"
                      className="w-full justify-start text-left text-zinc-300 hover:text-white hover:bg-zinc-800"
                      onClick={() => onCommandSelect(cmd.command)}
                    >
                      <span className="truncate">{cmd.command}</span>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai" className="border-none">
              <AccordionTrigger className="flex items-center gap-2 text-zinc-400 hover:no-underline py-0 [&[data-state=open]>svg]:rotate-0">
                <Bot className="h-4 w-4" />
                <span className="text-sm font-medium text-left">
                  AI Assistant
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2 text-sm text-zinc-400">
                  <p>Enable AI assistance for:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Command suggestions</li>
                    <li>Error debugging</li>
                    <li>Task automation</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-2">
                    Configure AI
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="collaboration" className="border-none">
              <AccordionTrigger className="flex items-center gap-2 text-zinc-400 hover:no-underline py-0 [&[data-state=open]>svg]:rotate-0">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium text-left">
                  Collaboration
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 pt-2 text-sm text-zinc-400">
                  <p>Share terminal access with:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Team members</li>
                    <li>External collaborators</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-2">
                    Manage Access
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>

      <div className="mt-auto p-2 border-t border-zinc-800 flex justify-end gap-2">
        <motion.button
          className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="h-4 w-4" />
        </motion.button>
        <motion.button
          className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HelpCircle className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CommandHistory;
