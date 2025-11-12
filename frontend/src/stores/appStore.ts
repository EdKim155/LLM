import { create } from 'zustand';
import { AppState, Chat, Message, ThemeMode, TelegramUser } from '../types';

interface AppActions {
  // Chat actions
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  deleteChat: (chatId: string) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  setCurrentChatId: (chatId: string | null) => void;

  // Message actions
  setMessages: (chatId: string, messages: Message[]) => void;
  addMessage: (chatId: string, message: Message) => void;

  // UI actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setTheme: (theme: ThemeMode) => void;
  setUser: (user: TelegramUser | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState & AppActions>((set) => ({
  // Initial state
  chats: [],
  currentChatId: null,
  messages: {},
  isLoading: false,
  error: null,
  theme: 'light',
  user: null,
  isSidebarOpen: false,

  // Chat actions
  setChats: (chats) => set({ chats }),

  addChat: (chat) => set((state) => ({
    chats: [chat, ...state.chats],
  })),

  deleteChat: (chatId) => set((state) => {
    const newMessages = { ...state.messages };
    delete newMessages[chatId];

    return {
      chats: state.chats.filter((c) => c.id !== chatId),
      messages: newMessages,
      currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
    };
  }),

  updateChat: (chatId, updates) => set((state) => ({
    chats: state.chats.map((c) =>
      c.id === chatId ? { ...c, ...updates } : c
    ),
  })),

  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

  // Message actions
  setMessages: (chatId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: messages,
    },
  })),

  addMessage: (chatId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [chatId]: [...(state.messages[chatId] || []), message],
    },
  })),

  // UI actions
  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setTheme: (theme) => set({ theme }),

  setUser: (user) => set({ user }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));
