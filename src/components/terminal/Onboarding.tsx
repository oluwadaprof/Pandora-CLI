import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Command,
  GitBranch,
  Settings,
  X,
  ChevronRight,
  Zap,
} from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  command?: string;
  tip?: string;
}

const steps: OnboardingStep[] = [
  {
    title: "Welcome to Pandora Terminal",
    description:
      "A modern, powerful terminal with Git integration and AI assistance. Let's get you started with the basics.",
    icon: <Terminal className="w-12 h-12 text-emerald-500" />,
    tip: "Pro tip: Press Ctrl+` to quickly open the terminal from anywhere",
  },
  {
    title: "Basic Commands",
    description: "Get started with some essential commands. Try them out!",
    icon: <Command className="w-12 h-12 text-blue-500" />,
    command: "help",
    tip: "Use the up arrow key to cycle through command history",
  },
  {
    title: "Git Integration",
    description:
      "Seamless Git operations with visual feedback and smart suggestions.",
    icon: <GitBranch className="w-12 h-12 text-purple-500" />,
    command: "git status",
    tip: "Quick tip: Use 'git help' for a list of all Git commands",
  },
  {
    title: "AI-Powered Features",
    description:
      "Get intelligent command suggestions and real-time help as you type.",
    icon: <Zap className="w-12 h-12 text-yellow-500" />,
    tip: "Press Tab for AI-powered command completion",
  },
  {
    title: "Customization",
    description:
      "Make the terminal yours with custom themes, shortcuts, and settings.",
    icon: <Settings className="w-12 h-12 text-orange-500" />,
    tip: "Right-click anywhere to access quick settings",
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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-zinc-900/90 backdrop-blur border border-zinc-800/50 rounded-xl w-full max-w-[500px] overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Progress bar */}
          <div className="h-1 bg-zinc-800">
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <h2 className="text-lg font-medium text-white">
                Getting Started
              </h2>
            </div>
            <button
              onClick={handleSkip}
              className="text-zinc-400 hover:text-zinc-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            <motion.div
              key={currentStep}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-6"
            >
              {/* Icon and Title */}
              <div className="flex items-start gap-6">
                <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 shadow-xl">
                  {step.icon}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Command Example */}
              {step.command && (
                <div className="bg-zinc-800/50 rounded-lg border border-zinc-700/30 overflow-hidden">
                  <div className="px-4 py-2 border-b border-zinc-700/30 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs text-zinc-400">
                      Try this command
                    </span>
                  </div>
                  <div className="p-4">
                    <code className="text-emerald-400 text-sm font-mono">
                      $ {step.command}
                    </code>
                  </div>
                </div>
              )}

              {/* Pro Tip */}
              {step.tip && (
                <div className="flex items-start gap-3 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-300">{step.tip}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-zinc-800/50 bg-zinc-900/50">
            <div className="text-sm text-zinc-500">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Onboarding;
