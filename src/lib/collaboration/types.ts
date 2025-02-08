export interface TerminalSession {
  id: string;
  name: string;
  created_at: string;
  owner_id: string;
  is_active: boolean;
  current_directory: string;
}

export interface SharedCommand {
  id: string;
  session_id: string;
  command: string;
  output: string;
  executed_at: string;
  executed_by: string;
  status: "success" | "error";
}

export interface SessionMember {
  id: string;
  session_id: string;
  user_id: string;
  joined_at: string;
  cursor_position?: { line: number; column: number };
  is_active: boolean;
}

export interface SharedSnippet {
  id: string;
  session_id: string;
  name: string;
  command: string;
  description?: string;
  created_by: string;
  created_at: string;
  tags: string[];
}
