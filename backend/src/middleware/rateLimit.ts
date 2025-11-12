import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { AuthenticatedRequest } from './auth';

// Rate limiter for messages: 20 per hour per user
const messageRateLimiter = new RateLimiterMemory({
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '20'),
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_HOURS || '1') * 3600,
});

// Rate limiter for creating chats: 5 per day per user
const chatCreationRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 24 * 3600, // 24 hours
});

/**
 * Rate limit middleware for sending messages
 */
export async function rateLimitMessages(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.tg_user_id || req.ip;

  if (!userId) {
    res.status(400).json({ error: 'Bad request' });
    return;
  }

  try {
    await messageRateLimiter.consume(userId);
    next();
  } catch (error: any) {
    const secondsToReset = Math.ceil(error.msBeforeNext / 1000);
    res.status(429).json({
      error: 'Слишком много запросов',
      message: `Подождите ${Math.ceil(secondsToReset / 60)} минут`,
      retryAfter: secondsToReset,
    });
  }
}

/**
 * Rate limit middleware for creating chats
 */
export async function rateLimitChatCreation(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userId = req.tg_user_id || req.ip;

  if (!userId) {
    res.status(400).json({ error: 'Bad request' });
    return;
  }

  try {
    await chatCreationRateLimiter.consume(userId);
    next();
  } catch (error: any) {
    const hoursToReset = Math.ceil(error.msBeforeNext / 1000 / 3600);
    res.status(429).json({
      error: 'Превышен лимит создания чатов',
      message: `Вы можете создать только 5 чатов в день. Попробуйте через ${hoursToReset} часов`,
      retryAfter: error.msBeforeNext / 1000,
    });
  }
}

/**
 * General rate limiter for API endpoints
 */
export async function generalRateLimit(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const limiter = new RateLimiterMemory({
    points: 100, // 100 requests
    duration: 60, // per 60 seconds
  });

  const key = req.ip || 'unknown';

  try {
    await limiter.consume(key);
    next();
  } catch (error) {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please slow down',
    });
  }
}
