import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

export interface FavoriteCommand {
  id: string;
  command: string;
  created_at: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteCommand[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("favorite_commands")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error",
        description: "Failed to fetch favorite commands",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (command: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("favorite_commands")
        .insert([{ user_id: user.id, command }])
        .select()
        .single();

      if (error) throw error;
      setFavorites([data, ...favorites]);
      toast({
        title: "Success",
        description: "Command added to favorites",
      });
    } catch (error: any) {
      console.error("Error adding favorite:", error);
      toast({
        title: "Error",
        description: "Failed to add command to favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (id: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("favorite_commands")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setFavorites(favorites.filter((fav) => fav.id !== id));
      toast({
        title: "Success",
        description: "Command removed from favorites",
      });
    } catch (error: any) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove command from favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (command: string) => {
    return favorites.some((fav) => fav.command === command);
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
