import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OutputLine {
  id: string;
  content: string;
  type: "command" | "output" | "error";
  timestamp: string;
}

interface OutputDisplayProps {
  lines?: OutputLine[];
}

const OutputDisplay = ({
  lines = [
    {
      id: "1",
      content: "$ ls -la",
      type: "command",
      timestamp: "2024-01-01 10:00:00",
    },
    {
      id: "2",
      content:
        "total 32\ndrwxr-xr-x  2 user group 4096 Jan 1 10:00 .\ndrwxr-xr-x 15 user group 4096 Jan 1 10:00 ..",
      type: "output",
      timestamp: "2024-01-01 10:00:01",
    },
    {
      id: "3",
      content: "$ cd invalid-directory",
      type: "command",
      timestamp: "2024-01-01 10:00:02",
    },
    {
      id: "4",
      content: "cd: no such file or directory: invalid-directory",
      type: "error",
      timestamp: "2024-01-01 10:00:03",
    },
  ],
}: OutputDisplayProps) => {
  return (
    <div className="w-full h-full bg-black rounded-lg p-4">
      <ScrollArea className="h-full">
        <div className="space-y-2 font-mono text-sm">
          {lines.map((line) => (
            <div
              key={line.id}
              className={`
                ${line.type === "command" ? "text-green-400" : ""}
                ${line.type === "output" ? "text-gray-300" : ""}
                ${line.type === "error" ? "text-red-400" : ""}
              `}
            >
              <span className="text-gray-500 text-xs mr-2">
                [{line.timestamp}]
              </span>
              {line.content}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OutputDisplay;
