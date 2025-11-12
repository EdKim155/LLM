import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { InputPanel } from './components/InputPanel';
import { useAppStore } from './stores/appStore';
import { telegram } from './utils/telegram';
import { api } from './services/api';
import './App.css';

function App() {
  const {
    chats,
    currentChatId,
    messages,
    isLoading,
    error,
    theme,
    isSidebarOpen,
    setChats,
    setMessages,
    addChat,
    deleteChat,
    setCurrentChatId,
    addMessage,
    setLoading,
    setError,
    setTheme,
    setUser,
    toggleSidebar,
    setSidebarOpen,
  } = useAppStore();

  // Initialize app
  useEffect(() => {
    // Set user from Telegram
    const user = telegram.getUser();
    setUser(user);

    // Set theme from Telegram
    const telegramTheme = telegram.getTheme();
    setTheme(telegramTheme);
    document.documentElement.classList.toggle('dark', telegramTheme === 'dark');

    // Setup back button for mobile
    if (window.innerWidth < 768) {
      telegram.showBackButton(() => {
        if (isSidebarOpen) {
          setSidebarOpen(false);
        }
      });
    }

    // Load chats
    loadChats();

    // Cleanup
    return () => {
      telegram.hideBackButton();
    };
  }, []);

  // Update back button visibility when sidebar state changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      if (isSidebarOpen) {
        telegram.showBackButton(() => setSidebarOpen(false));
      } else {
        telegram.hideBackButton();
      }
    }
  }, [isSidebarOpen]);

  // Load all chats
  const loadChats = async () => {
    try {
      setLoading(true);
      const response = await api.getChats();
      setChats(response.chats);

      // Auto-select first chat if available
      if (response.chats.length > 0 && !currentChatId) {
        const firstChat = response.chats[0];
        setCurrentChatId(firstChat.id);
        await loadMessages(firstChat.id);
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
      setError('Не удалось загрузить чаты');
    } finally {
      setLoading(false);
    }
  };

  // Load messages for a specific chat
  const loadMessages = async (chatId: string) => {
    try {
      setLoading(true);
      const response = await api.getMessages(chatId);
      setMessages(chatId, response.messages);
    } catch (err) {
      console.error('Failed to load messages:', err);
      setError('Не удалось загрузить сообщения');
    } finally {
      setLoading(false);
    }
  };

  // Create new chat
  const handleNewChat = async () => {
    try {
      setLoading(true);
      const response = await api.createChat();
      addChat(response.chat);
      setCurrentChatId(response.chat.id);
      setMessages(response.chat.id, []);
    } catch (err) {
      console.error('Failed to create chat:', err);
      setError('Не удалось создать чат');
    } finally {
      setLoading(false);
    }
  };

  // Select chat
  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId);

    // Load messages if not already loaded
    if (!messages[chatId]) {
      await loadMessages(chatId);
    }
  };

  // Delete chat
  const handleDeleteChat = async (chatId: string) => {
    try {
      await api.deleteChat(chatId);
      deleteChat(chatId);

      // Select another chat if the deleted one was active
      if (currentChatId === chatId && chats.length > 1) {
        const remainingChats = chats.filter((c) => c.id !== chatId);
        if (remainingChats.length > 0) {
          handleSelectChat(remainingChats[0].id);
        } else {
          setCurrentChatId(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
      setError('Не удалось удалить чат');
    }
  };

  // Send message
  const handleSendMessage = async (content: string) => {
    if (!currentChatId) {
      // Create a new chat if none exists
      await handleNewChat();
      // Wait for the chat to be created
      setTimeout(() => handleSendMessage(content), 100);
      return;
    }

    try {
      setLoading(true);

      // Add user message optimistically
      const userMessage = {
        id: `temp-${Date.now()}`,
        role: 'user' as const,
        content,
        timestamp: Date.now(),
      };
      addMessage(currentChatId, userMessage);

      // Send to API
      const response = await api.sendMessage(currentChatId, content);

      // Replace temp message with real one
      setMessages(
        currentChatId,
        messages[currentChatId]
          .filter((m) => m.id !== userMessage.id)
          .concat([response.user_message, response.ai_response])
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Не удалось отправить сообщение');
    } finally {
      setLoading(false);
    }
  };

  // Get current chat title
  const currentChatTitle = currentChatId
    ? chats.find((c) => c.id === currentChatId)?.title || 'PromptCraft'
    : 'PromptCraft';

  // Get current messages
  const currentMessages = currentChatId ? messages[currentChatId] || [] : [];

  return (
    <div className={`flex h-screen ${theme}`}>
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <div className="flex-1 flex flex-col">
        <ChatArea
          messages={currentMessages}
          isLoading={isLoading}
          onToggleSidebar={toggleSidebar}
          chatTitle={currentChatTitle}
        />

        <InputPanel
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={!currentChatId && chats.length === 0}
        />
      </div>

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-4 underline"
          >
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
