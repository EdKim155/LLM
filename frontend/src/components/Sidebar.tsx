import { motion, AnimatePresence } from 'framer-motion';
import { Chat } from '../types';
import { telegram } from '../utils/telegram';
import { formatDistanceToNow } from '../utils/time';

interface SidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  currentChatId,
  isOpen,
  onClose,
  onSelectChat,
  onNewChat,
  onDeleteChat,
}) => {
  const handleChatClick = (chatId: string) => {
    telegram.hapticFeedback('light');
    onSelectChat(chatId);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleNewChat = () => {
    telegram.hapticFeedback('medium');
    onNewChat();
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    telegram.hapticFeedback('medium');
    onDeleteChat(chatId);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed md:sticky top-0 left-0 h-screen w-[280px] bg-light-sidebar dark:bg-dark-sidebar border-r border-light-border dark:border-dark-border z-50 md:z-auto flex flex-col ${
          !isOpen && 'md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-border dark:border-dark-border">
          <h2 className="text-lg font-semibold text-light-text dark:text-dark-text">История</h2>
          <button
            onClick={onClose}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={handleNewChat}
            className="w-full py-3 px-4 rounded-lg bg-light-user-bubble dark:bg-dark-user-bubble text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span>
            <span>Новый чат</span>
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3">
          {chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                У вас пока нет чатов.
                <br />
                Создайте новый чат, чтобы начать!
              </p>
            </div>
          ) : (
            <div className="space-y-1 pb-3">
              {chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="relative group"
                >
                  <button
                    onClick={() => handleChatClick(chat.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors relative ${
                      currentChatId === chat.id
                        ? 'bg-light-user-bubble/10 dark:bg-dark-user-bubble/10 border-l-3 border-light-user-bubble dark:border-dark-user-bubble'
                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-medium text-light-text dark:text-dark-text truncate mb-1">
                          {chat.title}
                        </p>
                        <p className="text-[13px] text-light-text-secondary dark:text-dark-text-secondary">
                          {formatDistanceToNow(chat.updated_at)}
                        </p>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="flex-shrink-0 w-7 h-7 rounded-md hover:bg-red-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete chat"
                      >
                        <span className="text-red-500 text-sm">🗑️</span>
                      </button>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};
