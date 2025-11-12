import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { Message } from '../types';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onToggleSidebar: () => void;
  chatTitle: string;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onToggleSidebar,
  chatTitle,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg">
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors md:hidden"
          aria-label="Toggle sidebar"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <h1 className="text-lg font-semibold text-light-text dark:text-dark-text flex-1">
          {chatTitle}
        </h1>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-light-bg dark:bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </>
          )}

          {/* Loading indicator */}
          {isLoading && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full text-center px-4"
    >
      <div className="text-6xl mb-6">✨</div>
      <h2 className="text-2xl font-semibold text-light-text dark:text-dark-text mb-3">
        Добро пожаловать в PromptCraft!
      </h2>
      <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-md">
        Опишите вашу идею, и я создам для вас идеальный промпт.
      </p>

      <div className="space-y-3 w-full max-w-md">
        <p className="text-sm font-medium text-light-text dark:text-dark-text mb-2">
          💡 Несколько примеров для вдохновения:
        </p>

        {[
          'Бизнес-план для кофейни',
          'Резюме на позицию разработчика',
          'Идеи для YouTube канала',
          'План статьи про искусственный интеллект',
        ].map((example, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-light-ai-bubble dark:bg-dark-ai-bubble text-left text-sm text-light-text dark:text-dark-text"
          >
            • {example}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mb-4"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">
        🤖
      </div>

      <div className="bg-light-ai-bubble dark:bg-dark-ai-bubble rounded-bubble px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-gray-500"
            />
          ))}
        </div>
      </div>

      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
        генерирую промпт...
      </span>
    </motion.div>
  );
};
