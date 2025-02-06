import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddItemDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    type: "command" | "folder";
    name: string;
    command?: string;
  }) => void;
  section: "acme" | "personal";
}

export function AddItemDialog({
  open,
  onClose,
  onAdd,
  section,
}: AddItemDialogProps) {
  const [type, setType] = React.useState<"command" | "folder">("command");
  const [name, setName] = React.useState("");
  const [command, setCommand] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ type, name, command });
    setName("");
    setCommand("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-zinc-100 border-zinc-800">
        <DialogHeader>
          <DialogTitle>
            Add New {type === "command" ? "Command" : "Folder"} to {section}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <RadioGroup
            defaultValue={type}
            onValueChange={(value) => setType(value as "command" | "folder")}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="command" id="command" />
              <Label htmlFor="command">Command</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="folder" id="folder" />
              <Label htmlFor="folder">Folder</Label>
            </div>
          </RadioGroup>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "command" ? "Command name" : "Folder name"}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          {type === "command" && (
            <div className="space-y-2">
              <Label htmlFor="command">Command</Label>
              <Input
                id="command"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Enter command"
                className="bg-zinc-800 border-zinc-700"
              />
            </div>
          )}

          <DialogFooter>
            <Button type="submit" className="w-full">
              Add {type === "command" ? "Command" : "Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
