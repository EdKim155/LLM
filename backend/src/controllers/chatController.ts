import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database';
import { Chat, Message, CreateMessageData } from '../models/Chat';
import { AuthenticatedRequest } from '../middleware/auth';
import { generatePrompt, generateChatTitle } from '../utils/promptGenerator';

/**
 * Get all chats for a user
 */
export async function getChats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const tgUserId = req.tg_user_id;

    if (!tgUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const db = getDatabase();
    const chats = await db
      .collection<Chat>('chats')
      .find({ tg_user_id: tgUserId })
      .sort({ updated_at: -1 })
      .toArray();

    // Format response
    const formattedChats = chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      preview: chat.title, // Could be enhanced to show first message
      created_at: chat.created_at,
      updated_at: chat.updated_at,
    }));

    res.json({ chats: formattedChats });
  } catch (error) {
    console.error('❌ Error getting chats:', error);
    res.status(500).json({ error: 'Failed to get chats' });
  }
}

/**
 * Get messages from a specific chat
 */
export async function getMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { chatId } = req.params;
    const tgUserId = req.tg_user_id;

    if (!tgUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const db = getDatabase();

    // Verify chat belongs to user
    const chat = await db.collection<Chat>('chats').findOne({
      id: chatId,
      tg_user_id: tgUserId,
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    // Get messages
    const messages = await db
      .collection<Message>('messages')
      .find({ chat_id: chatId })
      .sort({ timestamp: 1 })
      .toArray();

    // Format response
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    res.json({ messages: formattedMessages });
  } catch (error) {
    console.error('❌ Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
}

/**
 * Create a new chat
 */
export async function createChat(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const tgUserId = req.tg_user_id;

    if (!tgUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const db = getDatabase();
    const chatId = new ObjectId().toString();
    const now = Date.now();

    const chat: Chat = {
      id: chatId,
      tg_user_id: tgUserId,
      title: 'Новый чат',
      created_at: now,
      updated_at: now,
    };

    await db.collection<Chat>('chats').insertOne(chat);

    res.json({
      chat_id: chatId,
      chat: {
        id: chat.id,
        title: chat.title,
        preview: chat.title,
        created_at: chat.created_at,
        updated_at: chat.updated_at,
      },
    });
  } catch (error) {
    console.error('❌ Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
}

/**
 * Send a message and get AI response
 */
export async function sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const tgUserId = req.tg_user_id;

    if (!tgUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (message.length > 1000) {
      res.status(400).json({ error: 'Message is too long (max 1000 characters)' });
      return;
    }

    const db = getDatabase();

    // Verify chat belongs to user
    const chat = await db.collection<Chat>('chats').findOne({
      id: chatId,
      tg_user_id: tgUserId,
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    const now = Date.now();

    // Create user message
    const userMessageId = new ObjectId().toString();
    const userMessage: Message = {
      id: userMessageId,
      chat_id: chatId,
      role: 'user',
      content: message.trim(),
      timestamp: now,
    };

    // Generate AI response
    const aiPrompt = await generatePrompt(message);

    // Create AI message
    const aiMessageId = new ObjectId().toString();
    const aiMessage: Message = {
      id: aiMessageId,
      chat_id: chatId,
      role: 'assistant',
      content: aiPrompt,
      timestamp: now + 1,
    };

    // Save messages to database
    await db.collection<Message>('messages').insertMany([userMessage, aiMessage]);

    // Update chat title if it's the first message
    const messageCount = await db.collection<Message>('messages').countDocuments({ chat_id: chatId });
    if (messageCount === 2) {
      // First exchange (user + assistant)
      const newTitle = generateChatTitle(message);
      await db.collection<Chat>('chats').updateOne(
        { id: chatId },
        { $set: { title: newTitle, updated_at: now } }
      );
    } else {
      // Just update timestamp
      await db.collection<Chat>('chats').updateOne(
        { id: chatId },
        { $set: { updated_at: now } }
      );
    }

    res.json({
      user_message: {
        id: userMessage.id,
        role: userMessage.role,
        content: userMessage.content,
        timestamp: userMessage.timestamp,
      },
      ai_response: {
        id: aiMessage.id,
        role: aiMessage.role,
        content: aiMessage.content,
        timestamp: aiMessage.timestamp,
      },
    });
  } catch (error: any) {
    console.error('❌ Error sending message:', error);

    // Return user-friendly error message
    const errorMessage = error.message || 'Failed to send message';
    res.status(500).json({ error: errorMessage });
  }
}

/**
 * Delete a chat
 */
export async function deleteChat(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { chatId } = req.params;
    const tgUserId = req.tg_user_id;

    if (!tgUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const db = getDatabase();

    // Verify chat belongs to user
    const chat = await db.collection<Chat>('chats').findOne({
      id: chatId,
      tg_user_id: tgUserId,
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    // Delete chat and all its messages
    await Promise.all([
      db.collection<Chat>('chats').deleteOne({ id: chatId }),
      db.collection<Message>('messages').deleteMany({ chat_id: chatId }),
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
}

/**
 * Rename a chat
 */
export async function renameChat(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    const tgUserId = req.tg_user_id;

    if (!tgUserId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const db = getDatabase();

    // Verify chat belongs to user
    const chat = await db.collection<Chat>('chats').findOne({
      id: chatId,
      tg_user_id: tgUserId,
    });

    if (!chat) {
      res.status(404).json({ error: 'Chat not found' });
      return;
    }

    // Update title
    await db.collection<Chat>('chats').updateOne(
      { id: chatId },
      { $set: { title: title.trim(), updated_at: Date.now() } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error renaming chat:', error);
    res.status(500).json({ error: 'Failed to rename chat' });
  }
}
