import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { useCollaboration } from "@/hooks/useCollaboration";
import {
  SearchCode,
  XCircle,
  Sparkles,
  Cpu,
  UsersRound,
  HelpCircleIcon,
  Settings2,
  GithubIcon,
  LogOutIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import CollaborationPanel from "./collaboration/CollaborationPanel";

interface FloatingPanelProps {
  onClose: () => void;
  className?: string;
  onCommandSubmit?: (command: string) => void;
}

const FloatingPanel: React.FC<FloatingPanelProps> = ({
  onClose,
  className,
  onCommandSubmit,
}) => {
  const { user, signInWithGithub, signOut } = useAuth();
  const { session, createSession, joinSession, isLoading } = useCollaboration();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<any[]>([]);
  const [favoriteCommands, setFavoriteCommands] = useState<any[]>([]);

  // Fetch favorite commands when user is logged in
  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        const { data } = await supabase
          .from("favorite_commands")
          .select("*")
          .eq("user_id", user.id);
        if (data) {
          setFavoriteCommands(data);
        }
      };
      fetchFavorites();
    }
  }, [user]);

  // Sample commands list - replace with actual commands from your system
  const commands = [
    { id: "1", command: "npm install", category: "package" },
    { id: "2", command: "git status", category: "git" },
    { id: "3", command: "docker ps", category: "docker" },
    { id: "4", command: "ls -la", category: "system" },
    { id: "5", command: "git commit -m", category: "git" },
    { id: "6", command: "yarn add", category: "package" },
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value) {
      setFilteredCommands([]);
      return;
    }

    const filtered = commands.filter((cmd) =>
      cmd.command.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredCommands(filtered);
  };

  const handleSearchToggle = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchTerm("");
    }
  };

  return (
    <div
      className={cn(
        "w-[315px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[650px]",
        className,
      )}
    >
      {/* Header */}
      <div className="h-12 px-4 border-b border-zinc-800/40 flex items-center justify-between">
        <div className="flex-1 flex items-center min-w-0">
          {isSearching ? (
            <div className="flex-1 relative">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 h-8"
                autoFocus
              />
              {searchTerm && filteredCommands.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-zinc-800 border border-zinc-700 rounded-md overflow-hidden shadow-lg z-50">
                  {filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-700 transition-colors"
                      onClick={() => {
                        // Handle command selection
                        setSearchTerm("");
                        setIsSearching(false);
                      }}
                    >
                      {cmd.command}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-[15px] font-medium text-zinc-200/80">
              Terminal Menu
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 ml-2">
          <button
            onClick={handleSearchToggle}
            className="text-zinc-400 hover:text-zinc-300"
          >
            <SearchCode className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-300"
          >
            <XCircle className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 scrollbar-none">
        <div className="p-4">
          <Accordion
            type="single"
            collapsible
            defaultValue="favorites"
            className="w-full space-y-2"
          >
            <AccordionItem value="favorites" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-zinc-800/50 rounded-md transition-colors">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Sparkles className="h-4 w-4" />
                  <span>Favorites</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 p-2">
                  {favoriteCommands.length > 0 ? (
                    <div className="space-y-0.5">
                      {favoriteCommands.map((cmd) => (
                        <button
                          key={cmd.id}
                          onClick={() => onCommandSubmit?.(cmd.command)}
                          className="w-full px-3 py-1.5 text-left text-sm text-zinc-300 hover:bg-zinc-800/50 rounded-md transition-colors flex items-center gap-2"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                          <span className="font-mono">{cmd.command}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-500 text-center py-4">
                      No favorite commands yet
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai" className="border-none opacity-50">
              <AccordionTrigger
                className="hover:no-underline py-2 px-3 rounded-md transition-colors cursor-not-allowed"
                disabled
              >
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Cpu className="h-4 w-4" />
                  <span>AI Assistant</span>
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-zinc-500/20 text-zinc-300 rounded">
                    Coming Soon
                  </span>
                </div>
              </AccordionTrigger>
            </AccordionItem>

            <CollaborationPanel
              sessionId={session?.id}
              onCreateSession={createSession}
              onJoinSession={joinSession}
            />
          </Accordion>
        </div>
      </ScrollArea>

      {/* Bottom Sheet */}
      <div className="mt-auto">
        <Separator className="bg-zinc-800/40" />
        <div className="p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user ? (
              <div className="w-7 h-7 rounded-full border-2 border-emerald-500">
                <div className="w-full h-full rounded-full overflow-hidden p-[2px] bg-zinc-900">
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata.user_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={signInWithGithub}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300"
              >
                <GithubIcon className="w-4 h-4" />
                Sign in with GitHub
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors">
              <HelpCircleIcon className="w-4 h-4" />
            </button>
            {user && (
              <>
                <button className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors">
                  <Settings2 className="w-4 h-4" />
                </button>
                <button
                  onClick={signOut}
                  className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors"
                >
                  <LogOutIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingPanel;
