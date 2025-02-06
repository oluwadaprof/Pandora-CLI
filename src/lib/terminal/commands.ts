import { mockCommands, bashHelpText } from "./mockCommands";
import { CommandResult } from "@/types/terminal";

export async function executeCommand(command: string): Promise<CommandResult> {
  const [cmd, ...args] = command.trim().split(/\s+/);

  try {
    // Clear command
    if (cmd.toLowerCase() === "clear") {
      return { content: "", type: "output" };
    }

    // Help command
    if (cmd.toLowerCase() === "help") {
      return { content: bashHelpText, type: "output" };
    }

    // Check if command exists in mockCommands
    if (cmd.toLowerCase() in mockCommands) {
      return await mockCommands[cmd.toLowerCase() as keyof typeof mockCommands](
        args,
      );
    }

    return {
      content: `Command not found: ${cmd}. Type 'help' for available commands.`,
      type: "error",
    };
  } catch (error: any) {
    return {
      content: error.message || "An error occurred",
      type: "error",
    };
  }
}
