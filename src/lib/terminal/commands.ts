import { fs } from "./fileSystem";

type CommandOutput = {
  content: string;
  type: "output" | "error";
};

export async function executeCommand(command: string): Promise<CommandOutput> {
  const [cmd, ...args] = command.trim().split(/\s+/);

  try {
    switch (cmd.toLowerCase()) {
      case "clear":
        return {
          content: "",
          type: "output",
        };

      case "pwd":
        const pwd = await fs.pwd();
        return {
          content: pwd,
          type: "output",
        };

      case "ls":
        const files = await fs.ls(args[0]);
        return {
          content: files.join("  "),
          type: "output",
        };

      case "cd":
        if (args.length === 0) {
          return {
            content: "cd: missing directory argument",
            type: "error",
          };
        }
        const cdResult = await fs.cd(args[0]);
        if (!cdResult.success) {
          return {
            content: cdResult.error || "Failed to change directory",
            type: "error",
          };
        }
        return {
          content: "",
          type: "output",
        };

      case "help":
        return {
          content: "Available commands: clear, pwd, ls, cd, help, echo",
          type: "output",
        };

      case "echo":
        return {
          content: args.join(" "),
          type: "output",
        };

      default:
        return {
          content: `Command not found: ${cmd}. Type 'help' for available commands.`,
          type: "error",
        };
    }
  } catch (error) {
    return {
      content: error.message || "An error occurred",
      type: "error",
    };
  }
}
