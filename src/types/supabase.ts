export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
}

export interface CommandHistory {
  id: string;
  user_id: string;
  command: string;
  is_favorite: boolean;
  created_at: string;
}

export interface TerminalSession {
  id: string;
  owner_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface SessionMember {
  id: string;
  session_id: string;
  user_id: string;
  role: "owner" | "member";
  is_active: boolean;
  created_at: string;
}
