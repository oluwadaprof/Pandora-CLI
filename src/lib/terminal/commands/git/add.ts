import { executeGitCommand } from "../../gitCommands";

export const addCommand = async (files: string) => {
  return executeGitCommand(["add", files]);
};

export const helpText = `
git-add - Add file contents to the index

Usage:
  git add [<options>] [--] <pathspec>...

Common Options:
  -A, --all             - Add all tracked and untracked files
  -u, --update          - Update tracked files
  -p, --patch           - Interactively choose hunks to add
  -f, --force           - Allow adding ignored files
`;
