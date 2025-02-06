import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export interface GitCommandResult {
  content: string;
  type: "output" | "error";
}

export const executeGitCommand = async (
  args: string[],
): Promise<GitCommandResult> => {
  try {
    const { stdout, stderr } = await execAsync(`git ${args.join(" ")}`);
    if (stderr) {
      return { content: stderr, type: "error" };
    }
    return { content: stdout, type: "output" };
  } catch (error: any) {
    return { content: error.message, type: "error" };
  }
};

export const gitCommands = {
  // Repository initialization and cloning
  init: async () => executeGitCommand(["init"]),
  clone: async (url: string) => executeGitCommand(["clone", url]),

  // Basic snapshotting
  add: async (files: string) => executeGitCommand(["add", files]),
  status: async () => executeGitCommand(["status"]),
  commit: async (message: string) =>
    executeGitCommand(["commit", "-m", message]),
  reset: async (file: string) => executeGitCommand(["reset", file]),

  // Branching and merging
  branch: async () => executeGitCommand(["branch"]),
  checkout: async (branch: string) => executeGitCommand(["checkout", branch]),
  merge: async (branch: string) => executeGitCommand(["merge", branch]),

  // Remote repository commands
  remote: async () => executeGitCommand(["remote", "-v"]),
  fetch: async () => executeGitCommand(["fetch"]),
  pull: async () => executeGitCommand(["pull"]),
  push: async () => executeGitCommand(["push"]),

  // Inspection and comparison
  log: async () => executeGitCommand(["log"]),
  diff: async () => executeGitCommand(["diff"]),
  show: async (commit: string) => executeGitCommand(["show", commit]),

  // Advanced commands
  stash: async (action = "push") => executeGitCommand(["stash", action]),
  tag: async () => executeGitCommand(["tag"]),
  rebase: async (branch: string) => executeGitCommand(["rebase", branch]),
};
