import { executeGitCommand } from "../../gitCommands";

export const commitCommand = async (message: string) => {
  return executeGitCommand(["commit", "-m", message]);
};

export const helpText = `
git-commit - Record changes to the repository

Usage:
  git commit [-a | --interactive | --patch] [-s] [-v] [-u<mode>] [--amend]
             [--dry-run] [(-c | -C | --squash) <commit> | --fixup [(amend|reword):]<commit>)]
             [-F <file> | -m <msg>] [--reset-author] [--allow-empty]
             [--allow-empty-message] [--no-verify] [-e] [--author=<author>]
             [--date=<date>] [--cleanup=<mode>] [--[no-]status]
             [-i | -o] [--pathspec-from-file=<file> [--pathspec-file-nul]]
             [(--trailer <token>[(=|:)<value>])...] [-S[<keyid>]]
             [--] [<pathspec>...]

Common Options:
  -m, --message <msg>   - Use the given <msg> as the commit message
  -a, --all            - Automatically stage modified and deleted files
  --amend              - Amend previous commit
  -S, --gpg-sign       - GPG sign commit
`;
