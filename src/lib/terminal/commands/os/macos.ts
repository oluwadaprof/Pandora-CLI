import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface CommandResult {
  content: string;
  type: "output" | "error";
}

export const macosCommands = {
  // Directory Navigation
  cd: async (path: string): Promise<CommandResult> => {
    try {
      await execAsync(`cd ${path}`);
      return { content: "", type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  ls: async (path?: string): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync(`ls ${path || ""}`);
      return { content: stdout, type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  pwd: async (): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync("pwd");
      return { content: stdout.trim(), type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },

  // File Operations
  cp: async (source: string, dest: string): Promise<CommandResult> => {
    try {
      await execAsync(`cp ${source} ${dest}`);
      return { content: "File copied successfully", type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  rm: async (path: string): Promise<CommandResult> => {
    try {
      await execAsync(`rm ${path}`);
      return { content: "File deleted successfully", type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  mkdir: async (path: string): Promise<CommandResult> => {
    try {
      await execAsync(`mkdir -p ${path}`);
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
  uname: async (): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync("uname -a");
      return { content: stdout, type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },

  // Network Commands
  ifconfig: async (): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync("ifconfig");
      return { content: stdout, type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  ping: async (host: string): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync(`ping -c 4 ${host}`);
      return { content: stdout, type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },

  // Process Management
  ps: async (): Promise<CommandResult> => {
    try {
      const { stdout } = await execAsync("ps aux");
      return { content: stdout, type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
  kill: async (pid: string): Promise<CommandResult> => {
    try {
      await execAsync(`kill ${pid}`);
      return { content: "Process terminated successfully", type: "output" };
    } catch (error: any) {
      return { content: error.message, type: "error" };
    }
  },
};

export const macosHelpText = `
macOS Terminal Commands

Directory Navigation:
  cd <path>     - Change directory
  ls            - List directory contents
  pwd           - Print working directory

File Operations:
  cp            - Copy files
  rm            - Remove files
  mkdir         - Create directory
  rmdir         - Remove directory

System Information:
  uname         - Display system information

Network Commands:
  ifconfig      - Display network configuration
  ping          - Test network connectivity

Process Management:
  ps            - List processes
  kill          - Terminate processes
`;
