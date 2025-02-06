import { mockCommands, bashHelpText } from "./mockCommands";
import { CommandResult } from "@/types/terminal";

type MockCommandFunction = (args: string[]) => Promise<CommandResult>;

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
    const commandFn = mockCommands[
      cmd.toLowerCase() as keyof typeof mockCommands
    ] as MockCommandFunction | undefined;

    if (commandFn) {
      return await commandFn(args);
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
