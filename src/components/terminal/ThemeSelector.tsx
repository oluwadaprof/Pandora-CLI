import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Monitor, Moon, Terminal, Palette } from "lucide-react";

interface Theme {
  id: string;
  name: string;
  icon: React.ReactNode;
  colors: {
    background: string;
    foreground: string;
    accent: string;
  };
}

interface ThemeSelectorProps {
  onThemeSelect?: (theme: Theme) => void;
  selectedTheme?: string;
}

const ThemeSelector = ({
  onThemeSelect = () => {},
  selectedTheme = "developer",
}: ThemeSelectorProps) => {
  const presetThemes: Theme[] = [
    {
      id: "hacker",
      name: "Hacker",
      icon: <Terminal className="h-4 w-4" />,
      colors: {
        background: "#0C0C0C",
        foreground: "#00FF00",
        accent: "#008F11",
      },
    },
    {
      id: "developer",
      name: "Developer",
      icon: <Monitor className="h-4 w-4" />,
      colors: {
        background: "#1E1E1E",
        foreground: "#D4D4D4",
        accent: "#007ACC",
      },
    },
    {
      id: "retro",
      name: "Retro",
      icon: <Moon className="h-4 w-4" />,
      colors: {
        background: "#2B2B2B",
        foreground: "#33FF33",
        accent: "#FF33FF",
      },
    },
  ];

  return (
    <Card className="w-[300px] h-[400px] bg-zinc-900 border-zinc-800">
      <Tabs defaultValue="preset" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-2 bg-zinc-800">
          <TabsTrigger value="preset">Preset Themes</TabsTrigger>
          <TabsTrigger value="custom">Custom Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="preset" className="p-4">
          <ScrollArea className="h-[320px] pr-4">
            <div className="space-y-2">
              {presetThemes.map((theme) => (
                <Button
                  key={theme.id}
                  variant={selectedTheme === theme.id ? "secondary" : "outline"}
                  className="w-full justify-start gap-2"
                  onClick={() => onThemeSelect(theme)}
                >
                  {theme.icon}
                  {theme.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="custom" className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bg-color">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="bg-color"
                type="text"
                placeholder="#000000"
                className="flex-1"
              />
              <div className="w-8 h-8 rounded border border-zinc-700 bg-black" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fg-color">Foreground Color</Label>
            <div className="flex gap-2">
              <Input
                id="fg-color"
                type="text"
                placeholder="#FFFFFF"
                className="flex-1"
              />
              <div className="w-8 h-8 rounded border border-zinc-700 bg-white" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accent-color"
                type="text"
                placeholder="#007ACC"
                className="flex-1"
              />
              <div className="w-8 h-8 rounded border border-zinc-700 bg-blue-500" />
            </div>
          </div>

          <Button className="w-full mt-4" onClick={() => {}}>
            <Palette className="h-4 w-4 mr-2" />
            Apply Custom Theme
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ThemeSelector;
