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

  const path = "C:\\Users\\user>"

  return (
    <div className="absolute inset-0 bg-black rounded-t-lg">
      <div
        className="h-full overflow-y-auto scrollbar-none pr-4"
        ref={viewportRef}
      >
        <div className="p-4 space-y-2 font-mono text-sm" ref={scrollRef}>
          <AnimatePresence initial={false}>
            {lines.map((line, index) => (
              <motion.div
                key={line.id}
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
                {line.type === "command" ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[#00ff00] flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      <span>PS</span>
                      <span>C:\Users\user></span>
                    </span>
                    <span className="text-[#ff69b4]">MINGW64</span>
                    <span className="text-[#00bfff]">~/Desktop</span>
                    <span className="text-[#00ff00]">$</span>
                    <span className="text-white">{line.content}</span>
                  </div>
                ) : (
                  <div className="flex">
                    <div className="relative w-6 mr-2">
                      <div className="absolute left-0 top-0 w-[2px] h-full bg-gray-600"></div>
                      <div className="absolute left-0 top-1/2 w-6 h-[2px] bg-gray-600"></div>
                    </div>
                    <div
                      className={`flex-1 ${line.type === "error" ? "text-red-500" : "text-gray-300"}`}
                    >
                      {line.content}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OutputDisplay;
