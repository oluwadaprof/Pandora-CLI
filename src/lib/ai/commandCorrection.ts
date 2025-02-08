const commonMistakes = new Map([
  ["gti", "git"],
  ["sl", "ls"],
  ["cd..", "cd .."],
  ["grpe", "grep"],
  ["pythno", "python"],
]);

const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + substitutionCost,
      );
    }
  }

  return matrix[b.length][a.length];
};

export const correctCommand = (
  command: string,
): { corrected: string; isCorrection: boolean } => {
  // Check for common mistakes first
  const commonCorrection = commonMistakes.get(command);
  if (commonCorrection) {
    return { corrected: commonCorrection, isCorrection: true };
  }

  // Split command into parts
  const parts = command.split(" ");
  const mainCommand = parts[0];

  // Common commands to check against
  const commonCommands = [
    "git",
    "ls",
    "cd",
    "pwd",
    "mkdir",
    "rm",
    "cp",
    "mv",
    "cat",
    "grep",
    "echo",
    "touch",
    "chmod",
    "chown",
    "ssh",
    "npm",
    "yarn",
    "node",
    "python",
    "docker",
    "kubectl",
  ];

  // Find closest match for main command
  let closestMatch = mainCommand;
  let minDistance = Infinity;

  for (const cmd of commonCommands) {
    const distance = levenshteinDistance(
      mainCommand.toLowerCase(),
      cmd.toLowerCase(),
    );
    if (distance < minDistance && distance <= 2) {
      // Max 2 character difference
      minDistance = distance;
      closestMatch = cmd;
    }
  }

  if (closestMatch !== mainCommand) {
    parts[0] = closestMatch;
    return { corrected: parts.join(" "), isCorrection: true };
  }

  return { corrected: command, isCorrection: false };
};
