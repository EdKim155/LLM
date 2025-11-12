import { MongoClient, Db } from 'mongodb';

let db: Db | null = null;
let client: MongoClient | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/promptcraft';

  try {
    client = new MongoClient(uri);
    await client.connect();

    db = client.db();

    console.log('✅ Connected to MongoDB');

    // Create indexes
    await createIndexes();

    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

async function createIndexes() {
  if (!db) return;

  try {
    // Chats collection indexes
    await db.collection('chats').createIndex({ tg_user_id: 1, updated_at: -1 });
    await db.collection('chats').createIndex({ tg_user_id: 1, created_at: -1 });

    // Messages collection indexes
    await db.collection('messages').createIndex({ chat_id: 1, timestamp: 1 });

    console.log('✅ Database indexes created');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    db = null;
    client = null;
    console.log('✅ Database connection closed');
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});
