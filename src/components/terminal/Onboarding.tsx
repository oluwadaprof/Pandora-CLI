import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Command, GitBranch, Settings, X } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  command?: string;
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to Pandora Terminal",
    description:
      "A modern, powerful terminal with Git integration and AI assistance.",
    icon: <Terminal className="w-8 h-8 text-emerald-500" />,
  },
  {
    title: "Basic Commands",
    description: "Try these commands to get started:",
    icon: <Command className="w-8 h-8 text-blue-500" />,
    command: "help",
  },
  {
    title: "Git Integration",
    description: "Seamless Git operations with visual feedback:",
    icon: <GitBranch className="w-8 h-8 text-purple-500" />,
    command: "git status",
  },
  {
    title: "Customization",
    description:
      "Open the settings panel to customize your terminal experience.",
    icon: <Settings className="w-8 h-8 text-orange-500" />,
  },
];

interface OnboardingProps {
  onClose: () => void;
  onCommandExecute: (command: string) => void;
}

const Onboarding = ({ onClose, onCommandExecute }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (steps[currentStep + 1].command) {
        onCommandExecute(steps[currentStep + 1].command!);
      }
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-zinc-900 border border-zinc-800 rounded-lg w-[400px] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h2 className="text-lg font-medium text-white">Getting Started</h2>
            <button
              onClick={handleSkip}
              className="text-zinc-400 hover:text-zinc-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              {step.icon}
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-zinc-400 text-sm">{step.description}</p>
              </div>
            </div>

            {step.command && (
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <code className="text-emerald-400 text-sm font-mono">
                  $ {step.command}
                </code>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-zinc-900/50">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Onboarding;
