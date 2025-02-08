interface CommandPattern {
  command: string;
  frequency: number;
  lastUsed: Date;
  context?: string[];
}

class CommandPredictor {
  private patterns: Map<string, CommandPattern> = new Map();
  private recentCommands: string[] = [];

  addCommand(command: string, context?: string[]) {
    const pattern = this.patterns.get(command) || {
      command,
      frequency: 0,
      lastUsed: new Date(),
      context: [],
    };

    pattern.frequency++;
    pattern.lastUsed = new Date();
    if (context) {
      pattern.context = [...new Set([...(pattern.context || []), ...context])];
    }

    this.patterns.set(command, pattern);
    this.recentCommands = [command, ...this.recentCommands].slice(0, 10);
  }

  predictNext(currentInput: string, context?: string[]): string[] {
    const predictions = Array.from(this.patterns.values())
      .filter((pattern) => pattern.command.startsWith(currentInput))
      .sort((a, b) => {
        // Weight based on frequency and recency
        const recencyWeight =
          (new Date().getTime() - a.lastUsed.getTime()) / 1000 / 3600;
        const frequencyWeight = b.frequency - a.frequency;
        const contextWeight =
          context && pattern.context
            ? pattern.context.filter((c) => context.includes(c)).length
            : 0;

        return frequencyWeight * 2 + contextWeight * 3 - recencyWeight;
      })
      .map((pattern) => pattern.command)
      .slice(0, 5);

    return predictions;
  }

  getRecentCommands(): string[] {
    return this.recentCommands;
  }
}

export const commandPredictor = new CommandPredictor();
