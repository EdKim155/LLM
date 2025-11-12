import WebApp from '@twa-dev/sdk';
import { TelegramUser, ThemeMode } from '../types';

export class TelegramService {
  private static instance: TelegramService;

  private constructor() {
    // Initialize Telegram WebApp
    WebApp.ready();
    this.expandApp();
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  /**
   * Expand the app to full height
   */
  public expandApp(): void {
    WebApp.expand();
  }

  /**
   * Get current user data from Telegram
   */
  public getUser(): TelegramUser | null {
    const user = WebApp.initDataUnsafe?.user;
    if (!user) return null;

    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      language_code: user.language_code,
      photo_url: user.photo_url,
    };
  }

  /**
   * Get user ID for API requests
   */
  public getUserId(): string | null {
    const user = this.getUser();
    return user ? user.id.toString() : null;
  }

  /**
   * Detect theme from Telegram
   */
  public getTheme(): ThemeMode {
    const colorScheme = WebApp.colorScheme;
    return colorScheme === 'dark' ? 'dark' : 'light';
  }

  /**
   * Get theme colors from Telegram
   */
  public getThemeParams() {
    return WebApp.themeParams;
  }

  /**
   * Show/hide back button
   */
  public showBackButton(onClick?: () => void): void {
    WebApp.BackButton.show();
    if (onClick) {
      WebApp.BackButton.onClick(onClick);
    }
  }

  public hideBackButton(): void {
    WebApp.BackButton.hide();
  }

  /**
   * Haptic feedback
   */
  public hapticFeedback(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light'): void {
    if (WebApp.HapticFeedback) {
      WebApp.HapticFeedback.impactOccurred(style);
    }
  }

  /**
   * Show main button (optional for future features)
   */
  public showMainButton(text: string, onClick: () => void): void {
    WebApp.MainButton.setText(text);
    WebApp.MainButton.show();
    WebApp.MainButton.onClick(onClick);
  }

  public hideMainButton(): void {
    WebApp.MainButton.hide();
  }

  /**
   * Close the mini app
   */
  public close(): void {
    WebApp.close();
  }

  /**
   * Get init data for backend authentication
   */
  public getInitData(): string {
    return WebApp.initData;
  }

  /**
   * Check if running in Telegram
   */
  public isInTelegram(): boolean {
    return WebApp.initData !== '';
  }
}

export const telegram = TelegramService.getInstance();
