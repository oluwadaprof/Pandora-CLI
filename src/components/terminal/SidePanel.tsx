import React from "react";
import { Star, Bot, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SidePanel = () => {
  const { user, signInWithGithub } = useAuth();

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
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-2 px-3 text-sm text-zinc-500">
                Open terminal menu to access collaboration features
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
            Sign in with GitHub
          </button>
        )}
      </div>
    </div>
  );
};

export default SidePanel;
