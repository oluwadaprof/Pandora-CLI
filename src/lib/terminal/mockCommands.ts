import { CommandResult } from "@/types/terminal";

const mockFileSystem: { [key: string]: string } = {
  "/": "root",
  "/home": "home directory",
  "/home/user": "user directory",
  "/home/user/documents": "documents directory",
};

let currentPath = "/home/user";

export const mockCommands = {
  // File System Navigation
  pwd: async (): Promise<CommandResult> => {
    return { content: currentPath, type: "output" };
  },

  ls: async (args: string[] = []): Promise<CommandResult> => {
    const path = args[0] || currentPath;
    if (mockFileSystem[path]) {
      return {
        content: Object.keys(mockFileSystem)
          .filter((p) => p.startsWith(path) && p !== path)
          .map((p) => p.replace(path + "/", ""))
          .join("\n"),
        type: "output",
      };
    }
    return { content: "Directory not found", type: "error" };
  },

  cd: async (path: string = "~"): Promise<CommandResult> => {
    if (path === "~") path = "/home/user";
    if (mockFileSystem[path]) {
      currentPath = path;
      return { content: "", type: "output" };
    }
    return { content: "Directory not found", type: "error" };
  },

  // File Operations
  cat: async (filename: string): Promise<CommandResult> => {
    return { content: "File contents would appear here", type: "output" };
  },

  touch: async (filename: string): Promise<CommandResult> => {
    return { content: "", type: "output" };
  },

  mkdir: async (args: string[]): Promise<CommandResult> => {
    return { content: "", type: "output" };
  },

  rm: async (args: string[]): Promise<CommandResult> => {
    return { content: "", type: "output" };
  },

  // System Information
  uname: async (): Promise<CommandResult> => {
    return { content: "Web Browser Terminal v1.0", type: "output" };
  },

  whoami: async (): Promise<CommandResult> => {
    return { content: "user", type: "output" };
  },

  // Process Management
  ps: async (): Promise<CommandResult> => {
    return {
      content:
        "PID TTY          TIME CMD\n  1 ?        00:00:00 terminal\n  2 ?        00:00:00 shell",
      type: "output",
    };
  },

  // Network Commands
  ping: async (host: string): Promise<CommandResult> => {
    return {
      content: `PING ${host} (127.0.0.1): 56 data bytes\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.000 ms`,
      type: "output",
    };
  },

  // Package Management
  npm: async (args: string[]): Promise<CommandResult> => {
    return { content: "Package management simulation", type: "output" };
  },

  yarn: async (args: string[]): Promise<CommandResult> => {
    return { content: "Package management simulation", type: "output" };
  },
};

export const bashHelpText = `
Keyboard Shortcuts:
└ Ctrl + L - Clear screen
└ ↑ (Up Arrow) - Run last command
└ Ctrl + Shift + T - New Tab
Commands:
└ pwd - Print working directory
└ ls - List directory contents
└ cd - Change directory
└ cat - Display file contents
└ touch - Create empty file
└ mkdir - Create directory
└ rm - Remove files/directories`;
