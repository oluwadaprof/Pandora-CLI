import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, X, Crown, Share2, Copy } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
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
import type { SessionMember } from "@/types/supabase";

interface CollaborationPanelProps {
  sessionId?: string;
  onCreateSession?: () => void;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  sessionId,
  onCreateSession,
}) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<SessionMember[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!sessionId || !user) return;

    const fetchMembers = async () => {
      const { data } = await supabase
        .from("session_members")
        .select(
          `
          *,
          user:user_id (user_metadata)
        `,
        )
        .eq("session_id", sessionId)
        .eq("is_active", true);

      if (data) {
        setMembers(data);
        // Check if current user is owner
        const currentMember = data.find((m) => m.user_id === user.id);
        setIsOwner(currentMember?.role === "owner");
      }
    };

    fetchMembers();

    // Subscribe to member changes
    const subscription = supabase
      .channel(`session-${sessionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "session_members",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setMembers((prev) => [...prev, payload.new as SessionMember]);
          } else if (payload.eventType === "DELETE") {
            setMembers((prev) =>
              prev.filter((m) => m.id !== (payload.old as SessionMember).id),
            );
          } else if (payload.eventType === "UPDATE") {
            setMembers((prev) =>
              prev.map((m) =>
                m.id === (payload.new as SessionMember).id ? payload.new : m,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [sessionId, user]);

  const handleInvite = async () => {
    if (!sessionId || !inviteEmail) return;

    try {
      // First get the user ID from the email
      const { data: userData } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", inviteEmail)
        .single();

      if (!userData) {
        toast({
          title: "User not found",
          description: "Please check the email address and try again",
          variant: "destructive",
        });
        return;
      }

      // Add the user to session_members
      await supabase.from("session_members").insert({
        session_id: sessionId,
        user_id: userData.id,
        role: "member",
        cursor_color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      });

      toast({
        title: "Invitation sent",
        description: "User has been added to the session",
      });

      setShowInvite(false);
      setInviteEmail("");
    } catch (error) {
      console.error("Error inviting user:", error);
      toast({
        title: "Error",
        description: "Failed to invite user",
        variant: "destructive",
      });
    }
  };

  const handleCopySessionId = () => {
    if (!sessionId) return;
    navigator.clipboard.writeText(sessionId);
    toast({
      title: "Session ID copied",
      description: "Share this ID with others to join your session",
    });
  };

  const handleLeaveSession = async () => {
    if (!sessionId || !user) return;

    try {
      await supabase
        .from("session_members")
        .update({ is_active: false })
        .eq("session_id", sessionId)
        .eq("user_id", user.id);

      toast({
        title: "Left session",
        description: "You have left the collaboration session",
      });
    } catch (error) {
      console.error("Error leaving session:", error);
      toast({
        title: "Error",
        description: "Failed to leave session",
        variant: "destructive",
      });
    }
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
              <Button
                variant="outline"
                className="w-full"
                onClick={onCreateSession}
              >
                Start New Session
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-zinc-900 px-2 text-zinc-500">or</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Session ID"
                  className="flex-1 h-9 text-xs"
                />
                <Button variant="outline" size="sm" className="h-9">
                  Join
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-zinc-300">Members</h4>
                <div className="flex items-center gap-2">
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setShowInvite(!showInvite)}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleCopySessionId}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {showInvite && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 p-2 bg-zinc-800/50 rounded-md border border-zinc-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">
                          Invite User
                        </span>
                        <button
                          onClick={() => setShowInvite(false)}
                          className="text-zinc-500 hover:text-zinc-400"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="user@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="flex-1 h-8 text-xs"
                        />
                        <Button
                          onClick={handleInvite}
                          size="sm"
                          className="h-8"
                        >
                          Invite
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
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
                      <span className="text-sm text-zinc-300 flex-1">
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
                className="w-full"
                onClick={handleLeaveSession}
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
