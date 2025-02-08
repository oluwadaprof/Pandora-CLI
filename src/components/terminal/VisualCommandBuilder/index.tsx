import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, Save } from "lucide-react";
import CommandBlock from "./CommandBlock";
import CommandPalette from "./CommandPalette";
import { Button } from "@/components/ui/button";

interface VisualCommandBuilderProps {
  onExecute: (command: string) => void;
}

interface CommandStep {
  command: string;
  args: string[];
}

const VisualCommandBuilder: React.FC<VisualCommandBuilderProps> = ({
  onExecute,
}) => {
  const [steps, setSteps] = useState<CommandStep[]>([]);
  const [showPalette, setShowPalette] = useState(false);

  const handleAddCommand = (command: string) => {
    setSteps([...steps, { command, args: [] }]);
    setShowPalette(false);
  };

  const handleDeleteStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleExecute = () => {
    const fullCommand = steps
      .map((step) => `${step.command} ${step.args.join(" ")}`)
      .join(" && ");
    onExecute(fullCommand);
  };

  return (
    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">
          Visual Command Builder
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPalette(!showPalette)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Command
          </Button>
          {steps.length > 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={handleExecute}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Execute
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex-1 space-y-3">
          {steps.length === 0 ? (
            <div className="text-center py-8 text-sm text-zinc-500">
              Add commands to build your pipeline
            </div>
          ) : (
            <div className="flex items-center flex-wrap gap-3">
              {steps.map((step, index) => (
                <CommandBlock
                  key={index}
                  command={step.command}
                  args={step.args}
                  isConnected={index < steps.length - 1}
                  onDelete={() => handleDeleteStep(index)}
                />
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {showPalette && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <CommandPalette onSelect={handleAddCommand} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VisualCommandBuilder;
