import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

export interface CommandHistoryItem {
  id: string;
  command: string;
  output?: string;
  executed_at: string;
  status: "success" | "error";
}

export function useCommandHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHistory = async (searchTerm?: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      let query = supabase
        .from("command_history")
        .select("*")
        .eq("user_id", user.id)
        .order("executed_at", { ascending: false });

      if (searchTerm) {
        query = query.ilike("command", `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setHistory(data || []);
    } catch (error: any) {
      console.error("Error fetching command history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch command history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = async (
    command: string,
    output?: string,
    status: "success" | "error" = "success",
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("command_history").insert([
        {
          user_id: user.id,
          command,
          output,
          status,
        },
      ]);

      if (error) throw error;
      fetchHistory();
    } catch (error: any) {
      console.error("Error adding to history:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  return {
    history,
    isLoading,
    fetchHistory,
    addToHistory,
  };
}
