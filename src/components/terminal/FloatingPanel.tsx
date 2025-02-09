import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import {
  Search,
  X,
  Star,
  Bot,
  Users,
  HelpCircle,
  Settings,
  LogIn,
  LogOut,
  Share2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const COMMANDS = [
  { id: "1", name: "git status", category: "git" },
  { id: "2", name: "git add .", category: "git" },
  { id: "3", name: "git commit", category: "git" },
  { id: "4", name: "npm install", category: "npm" },
  { id: "5", name: "npm start", category: "npm" },
  { id: "6", name: "cd", category: "navigation" },
  { id: "7", name: "ls", category: "navigation" },
  { id: "8", name: "clear", category: "system" },
];

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(COMMANDS);
  const [showCollabDialog, setShowCollabDialog] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      const filtered = COMMANDS.filter((cmd) =>
        cmd.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCommands(filtered);
    } else {
      setFilteredCommands(COMMANDS);
    }
  }, [searchTerm]);

  const handleSearchToggle = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchTerm("");
    }
  };

  return (
    <>
      <div
        className={cn(
          "w-[315px] bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/40 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[650px]",
          className,
        )}
      >
        {/* Header */}
        <div className="h-12 px-4 border-b border-zinc-800/40 flex items-center justify-between">
          <div className="flex-1 flex items-center min-w-0">
            {isSearching ? (
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="bg-transparent border-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0 pl-0 h-8"
                autoFocus
              />
            ) : (
              <div className="text-[15px] font-medium text-zinc-200/80">
                Search Commands
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 ml-2">
            <button
              onClick={handleSearchToggle}
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
          {isSearching ? (
            <div className="p-4">
              {filteredCommands.length > 0 ? (
                <div className="space-y-1">
                  {filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => onCommandSubmit?.(cmd.name)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-colors"
                    >
                      <code className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded">
                        {cmd.category}
                      </code>
                      <span>{cmd.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                  <Search className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">No commands found</p>
                  <p className="text-xs opacity-75">
                    Try a different search term
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-colors">
                <Star className="w-4 h-4" />
                <span>Favorites</span>
              </button>

              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-colors relative">
                <Bot className="w-4 h-4" />
                <span>AI Assistant</span>
                <span className="absolute right-3 px-1.5 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 rounded">
                  Beta
                </span>
              </button>

              <button
                onClick={() => setShowCollabDialog(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Collaboration</span>
              </button>
            </div>
          )}
        </ScrollArea>

        {/* Bottom Sheet */}
        <div className="mt-auto">
          <Separator className="bg-zinc-800/40" />
          <div className="p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata.user_name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-zinc-400">
                    {user.user_metadata.user_name}
                  </span>
                </div>
              ) : (
                <button
                  onClick={signInWithGithub}
                  className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in with GitHub
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors">
                <HelpCircle className="w-4 h-4" />
              </button>
              {user && (
                <>
                  <button className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={signOut}
                    className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Collaboration Dialog */}
      <Dialog open={showCollabDialog} onOpenChange={setShowCollabDialog}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-zinc-100 border-zinc-800">
          <DialogHeader>
            <DialogTitle>Terminal Collaboration</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Share your terminal session with other developers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {user ? (
              <div className="space-y-4">
                <Button
                  className="w-full flex items-center gap-2"
                  variant="outline"
                >
                  <Share2 className="w-4 h-4" />
                  Share Session Link
                </Button>
                <Button
                  className="w-full flex items-center gap-2"
                  variant="outline"
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Collaborator
                </Button>
                <div className="rounded-md border border-zinc-800 p-4">
                  <h4 className="text-sm font-medium mb-2">Active Sessions</h4>
                  <p className="text-sm text-zinc-400">No active sessions</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-zinc-400 mb-4">
                  Sign in to use collaboration features
                </p>
                <Button onClick={signInWithGithub}>Sign in with GitHub</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingPanel;
