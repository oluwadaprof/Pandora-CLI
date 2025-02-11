import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, X, Crown, Share2, Copy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";
import { useCollaboration } from "@/hooks/useCollaboration";

interface CollaborationPanelProps {
  sessionId?: string;
  onCreateSession?: () => void;
  onJoinSession?: (sessionId: string) => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  sessionId,
  onCreateSession,
  onJoinSession,
}) => {
  const { user } = useAuth();
  const { members, leaveSession } = useCollaboration();
  const [sessionIdInput, setSessionIdInput] = useState("");

  const handleCopySessionId = () => {
    if (!sessionId) return;
    navigator.clipboard.writeText(sessionId);
    toast({
      title: "Session ID copied",
      description: "Share this ID with others to join your session",
    });
  };

  return (
    <AccordionItem value="collaboration" className="border-none">
      <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-zinc-800/50 rounded-md transition-colors">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Users className="h-4 w-4" />
          <span>Collaboration</span>
          {sessionId && (
            <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded">
              Active
            </span>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 p-2">
          {!sessionId ? (
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                <div className="flex w-full gap-1.5">
                  <Input
                    placeholder="Session ID"
                    value={sessionIdInput}
                    onChange={(e) => setSessionIdInput(e.target.value)}
                    className="flex-1 h-7 text-xs bg-zinc-900/50 border-zinc-700/50 focus-visible:ring-zinc-700"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2.5 text-xs text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                    onClick={() => onJoinSession?.(sessionIdInput)}
                  >
                    Join
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  className="w-full h-7 text-xs text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                  onClick={onCreateSession}
                  disabled={!user}
                >
                  Start New Session
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-300">Members</h4>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1.5 text-zinc-400 hover:text-zinc-300"
                    onClick={handleCopySessionId}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy ID
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[200px]">
                <div className="space-y-1">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-zinc-800/50"
                    >
                      <div
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: member.cursor_color }}
                      />
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={member.user.user_metadata.avatar_url}
                          alt={member.user.user_metadata.user_name}
                        />
                        <AvatarFallback>
                          {member.user.user_metadata.user_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-zinc-300 flex-1 truncate">
                        {member.user.user_metadata.user_name}
                      </span>
                      {member.role === "owner" && (
                        <Crown className="h-3 w-3 text-yellow-500" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Button
                variant="outline"
                size="sm"
                className="w-full h-7 text-xs border-zinc-700/50 hover:bg-zinc-800/50 hover:text-zinc-300"
                onClick={leaveSession}
              >
                Leave Session
              </Button>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CollaborationPanel;
