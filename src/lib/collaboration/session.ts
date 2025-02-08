import { supabase } from "@/lib/supabase";
import type {
  TerminalSession,
  SharedCommand,
  SessionMember,
  SharedSnippet,
} from "./types";

export const createSession = async (
  name: string,
  ownerId: string,
): Promise<TerminalSession> => {
  const { data, error } = await supabase
    .from("terminal_sessions")
    .insert([
      {
        name,
        owner_id: ownerId,
        is_active: true,
        current_directory: "~",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const joinSession = async (
  sessionId: string,
  userId: string,
): Promise<void> => {
  const { error } = await supabase.from("session_members").insert([
    {
      session_id: sessionId,
      user_id: userId,
      is_active: true,
    },
  ]);

  if (error) throw error;
};

export const leaveSession = async (
  sessionId: string,
  userId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("session_members")
    .update({ is_active: false })
    .match({ session_id: sessionId, user_id: userId });

  if (error) throw error;
};

export const subscribeToCommands = (
  sessionId: string,
  callback: (command: SharedCommand) => void,
) => {
  return supabase
    .channel(`commands:${sessionId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "shared_commands",
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        callback(payload.new as SharedCommand);
      },
    )
    .subscribe();
};

export const shareCommand = async (
  sessionId: string,
  command: string,
  output: string,
  userId: string,
): Promise<void> => {
  const { error } = await supabase.from("shared_commands").insert([
    {
      session_id: sessionId,
      command,
      output,
      executed_by: userId,
      status: "success",
    },
  ]);

  if (error) throw error;
};

export const saveSnippet = async (
  snippet: Omit<SharedSnippet, "id" | "created_at">,
): Promise<SharedSnippet> => {
  const { data, error } = await supabase
    .from("shared_snippets")
    .insert([snippet])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getSessionSnippets = async (
  sessionId: string,
): Promise<SharedSnippet[]> => {
  const { data, error } = await supabase
    .from("shared_snippets")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
