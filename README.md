# PromptCraft - Telegram Mini App

<div align="center">

  ✨ **Автоматическая генерация качественных промптов для AI моделей**

  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
  ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
  ![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)

</div>

## 📋 Описание

**PromptCraft** — это Telegram Mini App, которое преобразует ваши простые идеи в детальные, эффективные промпты для работы с ChatGPT, Claude и другими языковыми моделями.

### ✨ Возможности

- 💬 **Чат-интерфейс** в стиле ChatGPT/Claude
- 🤖 **Генерация промптов** через OpenAI API (GPT-4o-mini)
- 📚 **История чатов** с автоматическим сохранением
- 📋 **Копирование промптов** в один клик
- 🌓 **Темная/светлая тема** (автоматическая синхронизация с Telegram)
- 📱 **Адаптивный дизайн** (мобильные, планшеты, десктоп)
- ⚡ **Rate limiting** для защиты от злоупотреблений
- 🔒 **Аутентификация** через Telegram

## 🛠 Технологический стек

### Frontend
- **React 18+** с TypeScript
- **Vite** - быстрая сборка
- **Tailwind CSS** - стилизация
- **Telegram Mini Apps SDK** (@twa-dev/sdk)
- **Zustand** - управление состоянием
- **Framer Motion** - анимации
- **React Markdown** - форматирование промптов
- **Axios** - HTTP запросы

### Backend
- **Node.js** + **Express** с TypeScript
- **MongoDB** - база данных
- **OpenAI API** - генерация промптов
- **rate-limiter-flexible** - защита от спама

## 📦 Установка

### Требования

- Node.js >= 18.0.0
- MongoDB (локальный или MongoDB Atlas)
- OpenAI API ключ
- Telegram Bot Token (для production)

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd LLM
```

### 2. Установка зависимостей

```bash
# Установить зависимости для всех проектов
npm install

# Или отдельно для frontend и backend
cd frontend && npm install
cd ../backend && npm install
```

### 3. Настройка переменных окружения

#### Frontend (.env)

```bash
cd frontend
cp .env.example .env
```

Отредактируйте `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Отредактируйте `.env`:
```env
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/promptcraft

# OpenAI
OPENAI_API_KEY=sk-ваш_ключ_от_openai

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=20
RATE_LIMIT_WINDOW_HOURS=1

# Telegram (для production)
TELEGRAM_BOT_TOKEN=ваш_токен_бота
```

### 4. Запуск в режиме разработки

#### Вариант 1: Запустить всё одновременно

```bash
# Из корневой директории
npm run dev
```

Это запустит:
- Frontend на http://localhost:5173
- Backend на http://localhost:3000

#### Вариант 2: Запустить отдельно

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 🚀 Production деплой

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Загрузите папку dist/ на хостинг
```

**Переменные окружения в Vercel:**
```
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Backend (Railway/Render/Fly.io)

```bash
cd backend
npm run build
npm start
```

**Переменные окружения:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `OPENAI_API_KEY` - Ключ OpenAI API
- `CORS_ORIGIN` - URL вашего frontend
- `TELEGRAM_BOT_TOKEN` - Токен бота из @BotFather

## 📁 Структура проекта

```
LLM/
├── frontend/                 # React приложение
│   ├── src/
│   │   ├── components/       # UI компоненты
│   │   │   ├── ChatArea.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── InputPanel.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── stores/           # Zustand state management
│   │   │   └── appStore.ts
│   │   ├── services/         # API клиенты
│   │   │   └── api.ts
│   │   ├── utils/            # Утилиты
│   │   │   ├── telegram.ts
│   │   │   └── time.ts
│   │   ├── types/            # TypeScript типы
│   │   │   └── index.ts
│   │   ├── App.tsx           # Главный компонент
│   │   └── main.tsx          # Точка входа
│   └── package.json
│
├── backend/                  # Express API сервер
│   ├── src/
│   │   ├── config/           # Конфигурации
│   │   │   ├── database.ts   # MongoDB подключение
│   │   │   └── openai.ts     # OpenAI конфиг
│   │   ├── controllers/      # Бизнес-логика
│   │   │   └── chatController.ts
│   │   ├── middleware/       # Express middleware
│   │   │   ├── auth.ts       # Telegram аутентификация
│   │   │   └── rateLimit.ts  # Rate limiting
│   │   ├── models/           # Модели данных
│   │   │   └── Chat.ts
│   │   ├── routes/           # API роуты
│   │   │   └── chats.ts
│   │   ├── utils/            # Утилиты
│   │   │   └── promptGenerator.ts
│   │   └── index.ts          # Точка входа
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Получить список чатов
```http
GET /api/chats
Headers: x-telegram-user-id: <user_id>
```

### Получить сообщения из чата
```http
GET /api/chats/:chatId/messages
Headers: x-telegram-user-id: <user_id>
```

### Создать новый чат
```http
POST /api/chats
Headers: x-telegram-user-id: <user_id>
```

### Отправить сообщение
```http
POST /api/chats/:chatId/messages
Headers: x-telegram-user-id: <user_id>
Body: { "message": "Ваш текст" }
```

### Удалить чат
```http
DELETE /api/chats/:chatId
Headers: x-telegram-user-id: <user_id>
```

### Переименовать чат
```http
PATCH /api/chats/:chatId
Headers: x-telegram-user-id: <user_id>
Body: { "title": "Новое название" }
```

## 🎨 Настройка под Telegram

### 1. Создание бота через @BotFather

```
/newbot
# Следуйте инструкциям
/mybots -> выберите бота -> Bot Settings -> Menu Button -> Edit Menu Button URL
```

Укажите URL вашего фронтенда.

### 2. Настройка Mini App

В настройках бота в @BotFather:
```
Menu Button URL: https://your-frontend-domain.com
```

### 3. Тестирование локально

Для тестирования локально через Telegram используйте ngrok:
```bash
ngrok http 5173
# Укажите ngrok URL в настройках бота
```

## ⚡ Ограничения и Rate Limiting

- **Сообщения:** 20 запросов в час на пользователя
- **Создание чатов:** 5 чатов в день на пользователя
- **Общий rate limit:** 100 запросов в минуту на IP

## 🔒 Безопасность

- ✅ Аутентификация через Telegram init data
- ✅ Rate limiting для всех endpoints
- ✅ Санитизация входных данных
- ✅ Валидация длины сообщений (макс 1000 символов)
- ✅ CORS policy
- ✅ API ключ OpenAI только на backend

## 📊 Расчет стоимости OpenAI API

**Модель: gpt-4o-mini**
- Input: $0.150 / 1M tokens
- Output: $0.600 / 1M tokens
- **Средняя стоимость одной генерации:** ~$0.0003
- **На 1000 пользователей (10 генераций/день):** ~$3/день

## 🐛 Troubleshooting

### Backend не запускается

**Проблема:** "Cannot connect to MongoDB"
```bash
# Проверьте, запущен ли MongoDB
# Linux/Mac:
sudo systemctl status mongod
# или
brew services list

# Или используйте MongoDB Atlas (облачный)
```

**Проблема:** "OpenAI API Error"
```bash
# Проверьте OPENAI_API_KEY в .env
# Проверьте баланс на platform.openai.com
```

### Frontend не подключается к API

```bash
# Убедитесь, что VITE_API_BASE_URL правильный
# Проверьте CORS_ORIGIN в backend/.env
# Перезапустите оба сервера
```

## 🤝 Contributing

Pull requests приветствуются! Для крупных изменений сначала откройте issue.

## 📝 License

MIT

## 👨‍💻 Автор

Разработано для Telegram Mini Apps Hackathon

---

<div align="center">

  Сделано с ❤️ и ☕

</div>
