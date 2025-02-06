export * from "./add";
export * from "./branch";
export * from "./commit";
export * from "./push";
export * from "./pull";
export * from "./merge";
export * from "./rebase";
export * from "./remote";
export * from "./status";
export * from "./tag";

export const gitHelpText = `
Git is a fast, scalable, distributed revision control system.

Common Git commands:

start a working area
   clone     Clone a repository into a new directory
   init      Create an empty Git repository

work on the current change
   add       Add file contents to the index
   mv        Move or rename a file, directory
   restore   Restore working tree files
   rm        Remove files from working tree and index

examine the history and state
   bisect    Use binary search to find the commit that introduced a bug
   diff      Show changes between commits, commit and working tree, etc
   grep      Print lines matching a pattern
   log       Show commit logs
   show      Show various types of objects
   status    Show the working tree status

grow, mark and tweak your common history
   branch    List, create, or delete branches
   commit    Record changes to the repository
   merge     Join two or more development histories together
   rebase    Reapply commits on top of another base tip
   reset     Reset current HEAD to the specified state
   switch    Switch branches
   tag       Create, list, delete or verify a tag object signed with GPG

collaborate
   fetch     Download objects and refs from another repository
   pull      Fetch from and integrate with another repository or a local branch
   push      Update remote refs along with associated objects
`;
