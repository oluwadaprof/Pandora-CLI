import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface CommandResult {
  content: string;
  type: "output" | "error";
}

export const windowsCommands = {
  // Directory Navigation
  cd: async (path: string): Promise<CommandResult> => {
    try {
      await execAsync(`cd ${path}`);
      return { content: "", type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  dir: async (path?: string): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync(`dir ${path || ""}`);
      return { content: stdout, type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  pwd: async (): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync("cd");
      return { content: stdout.trim(), type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },

  // File Operations
  copy: async (source: string, dest: string): Promise<CommandResult> => {
    try {
      await execAsync(`copy ${source} ${dest}`);
      return { content: "File copied successfully", type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  del: async (path: string): Promise<CommandResult> => {
    try {
      await execAsync(`del ${path}`);
      return { content: "File deleted successfully", type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  mkdir: async (path: string): Promise<CommandResult> => {
    try {
      await execAsync(`mkdir ${path}`);
      return { content: "Directory created successfully", type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  rmdir: async (path: string): Promise<CommandResult> => {
    try {
      await execAsync(`rmdir ${path}`);
      return { content: "Directory removed successfully", type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },

  // System Information
  systeminfo: async (): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync("systeminfo");
      return { content: stdout, type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },

  // Network Commands
  ipconfig: async (): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync("ipconfig");
      return { content: stdout, type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  ping: async (host: string): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync(`ping ${host}`);
      return { content: stdout, type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },

  // Process Management
  tasklist: async (): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync("tasklist");
      return { content: stdout, type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  taskkill: async (pid: string): Promise<CommandResult> => {
    try {
      await execAsync(`taskkill /PID ${pid}`);
      return { content: "Process terminated successfully", type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
};

export const windowsHelpText = `
Windows Command Line Interface

Directory Navigation:
  cd <path>     - Change directory
  dir           - List directory contents
  pwd           - Print working directory

File Operations:
  copy          - Copy files
  del           - Delete files
  mkdir         - Create directory
  rmdir         - Remove directory

System Information:
  systeminfo    - Display system information

Network Commands:
  ipconfig      - Display network configuration
  ping          - Test network connectivity

Process Management:
  tasklist      - List running processes
  taskkill      - Terminate processes
`;
