import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { useCollaboration } from "@/hooks/useCollaboration";
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
  const { session, createSession } = useCollaboration();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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
              Terminal Menu
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
        <div className="p-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="favorites" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-zinc-800/50 rounded-md transition-colors">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Star className="w-4 h-4" />
                  <span>Favorites</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="py-2 px-3 text-sm text-zinc-500">
                  No favorite commands yet
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ai" className="border-none">
              <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-zinc-800/50 rounded-md transition-colors">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Bot className="w-4 h-4" />
                  <span>AI Assistant</span>
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 rounded">
                    Beta
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="py-2 px-3 text-sm text-zinc-500">
                  AI features coming soon
                </div>
              </AccordionContent>
            </AccordionItem>

            <CollaborationPanel
              sessionId={session?.id}
              onCreateSession={createSession}
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
  );
};

export default FloatingPanel;
