export interface Tab {
  id: string;
  title: string;
  directory: string;
  outputLines: OutputLine[];
  commandHistory: string[];
  historyIndex: number;
}

export interface OutputLine {
  id: string;
  content: string;
  type: "command" | "output" | "error";
}

export interface TerminalInterfaceProps {
  onCommandExecute?: (command: string) => void;
  initialDirectory?: string;
}

export interface TabProps {
  tab: Tab;
  isActive: boolean;
  onClose: (id: string) => void;
  onClick: (id: string) => void;
}

export interface WindowControlsProps {
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
}
