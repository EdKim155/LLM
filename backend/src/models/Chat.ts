import { ObjectId } from 'mongodb';

export interface Chat {
  _id?: ObjectId;
  id: string;
  tg_user_id: string;
  title: string;
  created_at: number;
  updated_at: number;
}

export interface Message {
  _id?: ObjectId;
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface CreateChatData {
  tg_user_id: string;
}

export interface CreateMessageData {
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
}
