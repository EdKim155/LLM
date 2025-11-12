export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Chat {
  id: string;
  title: string;
  preview: string;
  created_at: number;
  updated_at: number;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

export interface ThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
}

export type ThemeMode = 'light' | 'dark';

export interface AppState {
  chats: Chat[];
  currentChatId: string | null;
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  theme: ThemeMode;
  user: TelegramUser | null;
  isSidebarOpen: boolean;
}
