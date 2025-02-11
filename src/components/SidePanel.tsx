import React, { useState } from "react";
import { Star, Bot, Users, Copy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCollaboration } from "@/hooks/useCollaboration";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/components/ui/use-toast";

const SidePanel = () => {
  const { user, signInWithGithub } = useAuth();
  const { session, members, createSession, joinSession, leaveSession } =
    useCollaboration();
  const [sessionIdInput, setSessionIdInput] = useState("");

  const handleCopySessionId = () => {
    if (!session?.id) return;
    navigator.clipboard.writeText(session.id);
    toast({
      title: "Session ID copied",
      description: "Share this ID with others to join your session",
    });
  };

  return (
    <div className="w-[240px] bg-[#1C1C1C] border-r border-zinc-800 flex flex-col h-full">
      <div className="flex-1 p-2 space-y-1">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="favorites" className="border-none">
            <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-zinc-800/50 rounded-md transition-colors">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Star className="h-4 w-4" />
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
                <Bot className="h-4 w-4" />
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

          <AccordionItem value="collaboration" className="border-none">
            <AccordionTrigger className="hover:no-underline py-2 px-3 hover:bg-zinc-800/50 rounded-md transition-colors">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Users className="h-4 w-4" />
                <span>Collaboration</span>
                {session && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded">
                    Active
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 p-2">
                {!session ? (
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
                          onClick={() => joinSession(sessionIdInput)}
                          disabled={!sessionIdInput}
                        >
                          Join
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full h-7 text-xs text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50"
                        onClick={createSession}
                        disabled={!user}
                      >
                        Start New Session
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-zinc-300">
                        Members
                      </h4>
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
        </Accordion>
      </div>

      <div className="p-2 border-t border-zinc-800">
        {user ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-800/50">
            <img
              src={user.user_metadata.avatar_url}
              alt={user.user_metadata.user_name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-zinc-200 truncate">
                {user.user_metadata.user_name}
              </div>
              <div className="text-xs text-zinc-500 truncate">{user.email}</div>
            </div>
          </div>
        ) : (
          <button
            onClick={signInWithGithub}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-colors"
          >
            Sign in with GitHub
          </button>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
