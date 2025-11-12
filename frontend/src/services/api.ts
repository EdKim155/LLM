import axios from 'axios';
import { Chat, Message } from '../types';
import { telegram } from '../utils/telegram';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Telegram user ID to all requests
apiClient.interceptors.request.use((config) => {
  const userId = telegram.getUserId();
  if (userId) {
    config.headers['x-telegram-user-id'] = userId;
  }

  // Add Telegram init data for authentication
  const initData = telegram.getInitData();
  if (initData) {
    config.headers['x-telegram-init-data'] = initData;
  }

  return config;
});

export interface GetChatsResponse {
  chats: Chat[];
}

export interface GetMessagesResponse {
  messages: Message[];
}

export interface CreateChatResponse {
  chat_id: string;
  chat: Chat;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  user_message: Message;
  ai_response: Message;
}

export const api = {
  /**
   * Get all chats for the current user
   */
  async getChats(): Promise<GetChatsResponse> {
    const response = await apiClient.get<GetChatsResponse>('/chats');
    return response.data;
  },

  /**
   * Get messages from a specific chat
   */
  async getMessages(chatId: string): Promise<GetMessagesResponse> {
    const response = await apiClient.get<GetMessagesResponse>(`/chats/${chatId}/messages`);
    return response.data;
  },

  /**
   * Create a new chat
   */
  async createChat(): Promise<CreateChatResponse> {
    const response = await apiClient.post<CreateChatResponse>('/chats');
    return response.data;
  },

  /**
   * Send a message and get AI response
   */
  async sendMessage(chatId: string, message: string): Promise<SendMessageResponse> {
    const response = await apiClient.post<SendMessageResponse>(
      `/chats/${chatId}/messages`,
      { message }
    );
    return response.data;
  },

  /**
   * Delete a chat
   */
  async deleteChat(chatId: string): Promise<void> {
    await apiClient.delete(`/chats/${chatId}`);
  },

  /**
   * Rename a chat
   */
  async renameChat(chatId: string, title: string): Promise<void> {
    await apiClient.patch(`/chats/${chatId}`, { title });
  },
};
