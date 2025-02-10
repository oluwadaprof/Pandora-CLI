import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";
import type { TerminalSession, SessionMember } from "@/types/supabase";

export function useCollaboration() {
  const { user } = useAuth();
  const [session, setSession] = useState<TerminalSession | null>(null);
  const [members, setMembers] = useState<SessionMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Check if user is in an active session
    const checkSession = async () => {
      const { data } = await supabase
        .from("terminal_sessions")
        .select(
          `
          *,
          members:session_members(*, user:user_id(user_metadata))
        `,
        )
        .eq("is_active", true)
        .eq("members.user_id", user.id)
        .eq("members.is_active", true)
        .single();

      if (data) {
        setSession(data);
        setMembers(data.members);
      }
    };

    checkSession();

    // Subscribe to session changes
    const sessionChanges = supabase
      .channel("session-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "terminal_sessions" },
        (payload) => {
          if (
            payload.eventType === "DELETE" ||
            (payload.eventType === "UPDATE" && !payload.new.is_active)
          ) {
            setSession(null);
            setMembers([]);
          }
        },
      )
      .subscribe();

    return () => {
      sessionChanges.unsubscribe();
    };
  }, [user]);

  const createSession = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a session",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Create session
      const { data: sessionData, error: sessionError } = await supabase
        .from("terminal_sessions")
        .insert({
          owner_id: user.id,
          name: `${user.user_metadata.user_name}'s Session`,
          is_active: true,
          current_directory: "~",
        })
        .select()
        .single();

      if (sessionError) throw sessionError;
      if (!sessionData) throw new Error("Failed to create session");

      // Add owner as member
      const { error: memberError } = await supabase
        .from("session_members")
        .insert({
          session_id: sessionData.id,
          user_id: user.id,
          role: "owner",
          cursor_color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        });

      if (memberError) throw memberError;

      setSession(sessionData);
      // Copy session ID to clipboard and show toast
      try {
        await navigator.clipboard.writeText(sessionData.id);
        toast({
          title: "Session Created!",
          description: `Session ID: ${sessionData.id}\nCopied to clipboard!`,
          duration: 5000,
        });
      } catch (clipboardError) {
        toast({
          title: "Session Created!",
          description: `Session ID: ${sessionData.id}\n(Please copy manually)`,
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error("Error creating session:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinSession = async (sessionId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      // Check if session exists and is active
      const { data: sessionData, error: sessionError } = await supabase
        .from("terminal_sessions")
        .select()
        .eq("id", sessionId)
        .eq("is_active", true)
        .single();

      if (sessionError || !sessionData) {
        throw new Error("Session not found or inactive");
      }

      // Add user as member
      const { error: memberError } = await supabase
        .from("session_members")
        .insert({
          session_id: sessionId,
          user_id: user.id,
          role: "member",
          cursor_color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        });

      if (memberError) throw memberError;

      setSession(sessionData);
      toast({
        title: "Session joined",
        description: "You have successfully joined the session",
      });
    } catch (error: any) {
      console.error("Error joining session:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to join session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const leaveSession = async () => {
    if (!session || !user) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("session_members")
        .update({ is_active: false })
        .eq("session_id", session.id)
        .eq("user_id", user.id);

      if (error) throw error;

      setSession(null);
      setMembers([]);
      toast({
        title: "Session left",
        description: "You have left the collaboration session",
      });
    } catch (error: any) {
      console.error("Error leaving session:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to leave session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    members,
    isLoading,
    createSession,
    joinSession,
    leaveSession,
  };
}
