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
