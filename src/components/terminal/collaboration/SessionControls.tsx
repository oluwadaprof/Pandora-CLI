import React from "react";
import { motion } from "framer-motion";
import { Users, Share2, Copy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SessionControlsProps {
  sessionId?: string;
  isHost: boolean;
  onShare: () => void;
  onSaveSnippet: () => void;
  memberCount: number;
}

const SessionControls: React.FC<SessionControlsProps> = ({
  sessionId,
  isHost,
  onShare,
  onSaveSnippet,
  memberCount,
}) => {
  return (
    <div className="absolute top-2 right-2 flex items-center gap-2">
      <TooltipProvider>
        <div className="flex items-center gap-1 px-2 py-1 bg-zinc-800/50 rounded-full text-xs text-zinc-400">
          <Users className="w-3.5 h-3.5" />
          <span>{memberCount}</span>
        </div>

        {sessionId && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    navigator.clipboard.writeText(sessionId);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy Session ID</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Session</TooltipContent>
            </Tooltip>
          </>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onSaveSnippet}
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save Snippet</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SessionControls;
