import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { telegram } from '../utils/telegram';

interface InputPanelProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() && !isLoading && !disabled) {
      telegram.hapticFeedback('light');
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = message.trim().length > 0 && !isLoading && !disabled;

  return (
    <div className="border-t border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg">
      <div className="max-w-4xl mx-auto p-4">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Опишите вашу идею..."
              disabled={isLoading || disabled}
              rows={1}
              className="w-full resize-none rounded-input bg-light-ai-bubble dark:bg-dark-ai-bubble text-light-text dark:text-dark-text placeholder-light-text-secondary dark:placeholder-dark-text-secondary px-5 py-3 pr-14 text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-light-user-bubble dark:focus:ring-dark-user-bubble transition-shadow disabled:opacity-50"
              style={{ maxHeight: '120px' }}
            />

            {/* Character counter (optional, shown when approaching limit) */}
            {message.length > 800 && (
              <div className="absolute bottom-2 left-4 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                {message.length}/1000
              </div>
            )}
          </div>

          {/* Send button */}
          <motion.button
            whileHover={canSend ? { scale: 1.05 } : {}}
            whileTap={canSend ? { scale: 0.95 } : {}}
            onClick={handleSend}
            disabled={!canSend}
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              canSend
                ? 'bg-light-user-bubble dark:bg-dark-user-bubble text-white cursor-pointer shadow-lg'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 4L10 16M10 4L6 8M10 4L14 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Hint text */}
        <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-2 text-center">
          Enter для отправки, Shift+Enter для новой строки
        </p>
      </div>
    </div>
  );
};
