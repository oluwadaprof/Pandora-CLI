import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder } from "lucide-react";

interface OutputLine {
  id: string;
  content: string;
  type: "command" | "output" | "error";
}

interface OutputDisplayProps {
  lines?: OutputLine[];
  currentDirectory?: string;
}

const OutputDisplay = ({
  lines = [],
  currentDirectory = "~/user",
}: OutputDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && viewportRef.current) {
      const scrollElement = scrollRef.current;
      const viewportElement = viewportRef.current;
      viewportElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [lines]);

  // Split directory into username and path
  const [username, ...pathParts] = currentDirectory.split("/");
  const path = `~/${pathParts.join("/")}`;

  // Group command and its output together
  const groupedLines: { command: OutputLine; output?: OutputLine }[] = [];
  for (let i = 0; i < lines.length; i += 2) {
    groupedLines.push({
      command: lines[i],
      output: lines[i + 1],
    });
  }

  return (
    <div className="absolute inset-0 bg-black rounded-t-lg">
      <div
        className="h-full overflow-y-auto scrollbar-none pr-4"
        ref={viewportRef}
      >
        <div className="p-4 space-y-4 font-mono text-sm" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {groupedLines.map(({ command, output }) => (
              <motion.div
                key={command.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5,
                }}
                className="space-y-1"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[#87d441] flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5" />
                      {username}
                    </span>
                    <span className="text-[#c678dd]">MINGW64</span>
                    <span className="text-[#61afef]">{path}</span>
                    <span className="text-[#87d441] font-bold">$</span>
                    <span className="text-white">
                      {command.content.replace("$ ", "")}
                    </span>
                  </div>
                  {output && (
                    <div
                      className={`pl-5 ${output.type === "error" ? "text-red-400" : "text-gray-300"}`}
                    >
                      <span>{output.content}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OutputDisplay;
