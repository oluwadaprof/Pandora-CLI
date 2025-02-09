import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import type { TerminalSession, SessionMember } from "@/types/supabase";

export function useCollaboration() {
  const { user } = useAuth();
  const [session, setSession] = useState<TerminalSession | null>(null);
  const [members, setMembers] = useState<SessionMember[]>([]);

  useEffect(() => {
    if (!user) return;

    // Check if user is in an active session
    const checkSession = async () => {
      const { data } = await supabase
        .from("terminal_sessions")
        .select(
          `
          *,
          members:session_members(*)
        `,
        )
        .eq("is_active", true)
        .eq("members.user_id", user.id)
        .single();

      if (data) {
        setSession(data);
        setMembers(data.members);
      }
    };

    checkSession();
  }, [user]);

  const createSession = async () => {
    if (!user) return;

    try {
      // Create session
      const { data: sessionData } = await supabase
        .from("terminal_sessions")
        .insert({
          owner_id: user.id,
          name: `${user.user_metadata.user_name}'s Session`,
        })
        .select()
        .single();

      if (!sessionData) throw new Error("Failed to create session");

      // Add owner as member
      await supabase.from("session_members").insert({
        session_id: sessionData.id,
        user_id: user.id,
        role: "owner",
        cursor_color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      });

      setSession(sessionData);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const updateCursorPosition = async (position: {
    line: number;
    column: number;
  }) => {
    if (!session || !user) return;

    try {
      await supabase
        .from("session_members")
        .update({ cursor_position: position })
        .eq("session_id", session.id)
        .eq("user_id", user.id);
    } catch (error) {
      console.error("Error updating cursor position:", error);
    }
  };

  return {
    session,
    members,
    createSession,
    updateCursorPosition,
  };
}
