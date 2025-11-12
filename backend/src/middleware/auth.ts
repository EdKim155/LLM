import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface AuthenticatedRequest extends Request {
  tg_user_id?: string;
}

/**
 * Middleware to extract and validate Telegram user ID
 * In production, you should validate the Telegram init data signature
 */
export function authenticateTelegram(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const tgUserId = req.headers['x-telegram-user-id'] as string;

  if (!tgUserId) {
    res.status(401).json({ error: 'Unauthorized: Telegram user ID required' });
    return;
  }

  // In production, validate the Telegram init data here
  // const initData = req.headers['x-telegram-init-data'] as string;
  // if (!validateTelegramInitData(initData)) {
  //   res.status(401).json({ error: 'Unauthorized: Invalid init data' });
  //   return;
  // }

  req.tg_user_id = tgUserId;
  next();
}

/**
 * Validate Telegram WebApp init data signature
 * This prevents unauthorized access from outside Telegram
 */
export function validateTelegramInitData(initData: string): boolean {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) {
    console.warn('⚠️  TELEGRAM_BOT_TOKEN not set, skipping validation');
    return true; // Allow in development
  }

  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');

    // Sort parameters alphabetically
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key
    const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return calculatedHash === hash;
  } catch (error) {
    console.error('❌ Error validating init data:', error);
    return false;
  }
}

/**
 * Optional: More strict validation in production
 */
export function strictAuthenticateTelegram(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const initData = req.headers['x-telegram-init-data'] as string;

  if (!initData) {
    res.status(401).json({ error: 'Unauthorized: Init data required' });
    return;
  }

  if (!validateTelegramInitData(initData)) {
    res.status(401).json({ error: 'Unauthorized: Invalid init data' });
    return;
  }

  // Extract user ID from init data
  const urlParams = new URLSearchParams(initData);
  const userJson = urlParams.get('user');

  if (!userJson) {
    res.status(401).json({ error: 'Unauthorized: User data not found' });
    return;
  }

  try {
    const user = JSON.parse(userJson);
    req.tg_user_id = user.id.toString();
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid user data' });
  }
}
