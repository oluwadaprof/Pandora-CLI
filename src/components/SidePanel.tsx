import React from "react";
import { Star, Bot, Users, HelpCircle, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth";

const SidePanel = () => {
  const { user, signInWithGithub } = useAuth();

  return (
    <div className="w-[240px] bg-[#1C1C1C] border-r border-zinc-800 flex flex-col h-full">
      <div className="flex-1 p-2 space-y-1">
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

        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-colors">
          <Users className="w-4 h-4" />
          <span>Collaboration</span>
        </button>

        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-colors">
          <HelpCircle className="w-4 h-4" />
          <span>Support</span>
        </button>
      </div>

      <div className="p-2 border-t border-zinc-800">
        {user ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-800/50">
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
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
            <span>Sign in with GitHub</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
