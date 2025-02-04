import React, { useState } from "react";
import ThemeSelector from "./terminal/ThemeSelector";
import TerminalInterface from "./terminal/TerminalInterface";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from "lucide-react";

interface Theme {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    accent: string;
  };
}

const Home = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>({
    id: "developer",
    name: "Developer",
    colors: {
      background: "#1E1E1E",
      foreground: "#D4D4D4",
      accent: "#007ACC",
    },
  });

  const handleThemeSelect = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Pandora Interface</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                style={{
                  backgroundColor: currentTheme.colors.accent,
                  color: currentTheme.colors.background,
                }}
                className="hover:scale-105 transition-transform"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent
              className="bg-transparent border-0 p-0"
              style={{
                position: "fixed",
                bottom: "4rem",
                right: "1rem",
              }}
            >
              <ThemeSelector
                onThemeSelect={handleThemeSelect}
                selectedTheme={currentTheme.id}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div
          className="h-[700px] rounded-lg overflow-hidden"
          style={{
            backgroundColor: currentTheme.colors.background,
            color: currentTheme.colors.foreground,
          }}
        >
          <TerminalInterface
            onCommandExecute={(command) => {
              console.log("Executing command:", command);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
