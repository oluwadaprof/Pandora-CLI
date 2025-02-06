import { executeGitCommand } from "../../gitCommands";

export const branchCommand = async (args: string[] = []) => {
  return executeGitCommand(["branch", ...args]);
};

export const helpText = `
git-branch - List, create, or delete branches

Usage:
  git branch [<options>] [-r | -a] [--merged | --no-merged]
  git branch [<options>] [-l] [-f] <branch-name> [<start-point>]
  git branch [<options>] [-r] (-d | -D) <branch-name>...

Common Options:
  -d, --delete          - Delete a branch
  -D                    - Force delete a branch
  -m, --move           - Move/rename a branch
  -c, --copy           - Copy a branch
  -a, --all            - List both remote-tracking and local branches
  -r, --remotes        - List remote-tracking branches
`;
