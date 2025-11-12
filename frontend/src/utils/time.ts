/**
 * Format timestamp to relative time (e.g., "5 мин назад", "Вчера")
 */
export function formatDistanceToNow(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'только что';
  } else if (minutes < 60) {
    return `${minutes} мин назад`;
  } else if (hours < 24) {
    return `${hours} ч назад`;
  } else if (days === 1) {
    return 'вчера';
  } else if (days < 7) {
    return `${days} дн назад`;
  } else if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} нед назад`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} мес назад`;
  } else {
    const years = Math.floor(days / 365);
    return `${years} г назад`;
  }
}

/**
 * Format timestamp to date string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format timestamp to time string
 */
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
