import { fs } from "./fileSystem";
import { gitCommands } from "./gitCommands";

type CommandOutput = {
  content: string;
  type: "output" | "error";
};

export async function executeCommand(command: string): Promise<CommandOutput> {
  const [cmd, ...args] = command.trim().split(/\s+/);

  try {
    switch (cmd.toLowerCase()) {
      // File system commands
      case "clear":
        return { content: "", type: "output" };
      case "pwd":
        const pwd = await fs.pwd();
        return { content: pwd, type: "output" };
      case "ls":
        const files = await fs.ls(args[0]);
        return { content: files.join("  "), type: "output" };
      case "cd":
        if (args.length === 0) {
          return { content: "cd: missing directory argument", type: "error" };
        }
        const cdResult = await fs.cd(args[0]);
        if (!cdResult.success) {
          return {
            content: cdResult.error || "Failed to change directory",
            type: "error",
          };
        }
        return { content: "", type: "output" };

      // Git commands
      case "git":
        if (args.length === 0) {
          return { content: "git: missing command", type: "error" };
        }

        const gitCmd = args[0];
        const gitArgs = args.slice(1);

        switch (gitCmd) {
          case "init":
            return await gitCommands.init();

          case "clone":
            if (gitArgs.length === 0) {
              return {
                content: "git clone: missing repository URL",
                type: "error",
              };
            }
            return await gitCommands.clone(gitArgs[0]);

          case "add":
            return await gitCommands.add(gitArgs.join(" ") || ".");

          case "status":
            return await gitCommands.status();

          case "commit":
            if (!gitArgs.includes("-m")) {
              return await gitCommands.commit(gitArgs.join(" "));
            }
            const msgIndex = gitArgs.indexOf("-m") + 1;
            if (msgIndex >= gitArgs.length) {
              return {
                content: "git commit: missing commit message",
                type: "error",
              };
            }
            return await gitCommands.commit(gitArgs[msgIndex]);

          case "branch":
            return await gitCommands.branch();

          case "checkout":
            if (gitArgs.length === 0) {
              return {
                content: "git checkout: missing branch name",
                type: "error",
              };
            }
            return await gitCommands.checkout(gitArgs[0]);

          case "merge":
            if (gitArgs.length === 0) {
              return {
                content: "git merge: missing branch name",
                type: "error",
              };
            }
            return await gitCommands.merge(gitArgs[0]);

          case "pull":
            return await gitCommands.pull();

          case "push":
            return await gitCommands.push();

          case "log":
            return await gitCommands.log();

          case "diff":
            return await gitCommands.diff();

          case "remote":
            return await gitCommands.remote();

          case "fetch":
            return await gitCommands.fetch();

          case "stash":
            return await gitCommands.stash(gitArgs[0]);

          case "tag":
            return await gitCommands.tag();

          case "rebase":
            if (gitArgs.length === 0) {
              return {
                content: "git rebase: missing branch name",
                type: "error",
              };
            }
            return await gitCommands.rebase(gitArgs[0]);

          default:
            return {
              content: `git: '${gitCmd}' is not a git command. See 'git --help'.`,
              type: "error",
            };
        }

      case "help":
        return {
          content: `Available commands:
  File System:
    clear - Clear the terminal screen
    pwd   - Print working directory
    ls    - List directory contents
    cd    - Change directory

  Git Commands:
    git init              - Create an empty Git repository
    git clone <url>       - Clone a repository
    git add <files>       - Add files to staging area
    git status           - Show working tree status
    git commit -m <msg>   - Create a new commit
    git branch           - List branches
    git checkout <branch> - Switch branches
    git merge <branch>    - Merge a branch
    git pull             - Fetch and merge changes
    git push             - Push changes to remote
    git log              - Show commit logs
    git diff             - Show changes
    git remote           - Show remote repositories
    git fetch            - Download objects and refs
    git stash            - Stash changes
    git tag              - List tags
    git rebase <branch>  - Rebase current branch`,
          type: "output",
        };

      default:
        return {
          content: `Command not found: ${cmd}. Type 'help' for available commands.`,
          type: "error",
        };
    }
  } catch (error: any) {
    return {
      content: error.message || "An error occurred",
      type: "error",
    };
  }
}
