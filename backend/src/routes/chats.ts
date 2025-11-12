import { Router } from 'express';
import {
  getChats,
  getMessages,
  createChat,
  sendMessage,
  deleteChat,
  renameChat,
} from '../controllers/chatController';
import { authenticateTelegram } from '../middleware/auth';
import { rateLimitMessages, rateLimitChatCreation } from '../middleware/rateLimit';

const router = Router();

// All routes require authentication
router.use(authenticateTelegram);

// GET /api/chats - Get all chats for the user
router.get('/', getChats);

// POST /api/chats - Create a new chat
router.post('/', rateLimitChatCreation, createChat);

// GET /api/chats/:chatId/messages - Get messages from a chat
router.get('/:chatId/messages', getMessages);

// POST /api/chats/:chatId/messages - Send a message
router.post('/:chatId/messages', rateLimitMessages, sendMessage);

// DELETE /api/chats/:chatId - Delete a chat
router.delete('/:chatId', deleteChat);

// PATCH /api/chats/:chatId - Rename a chat
router.patch('/:chatId', renameChat);

export default router;
