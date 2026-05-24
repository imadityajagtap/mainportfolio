import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env.local file');
}

const MONGODB_URI: string = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB with caching
 * Returns existing connection if available, creates new one if not
 */
async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false, // Fail immediately if disconnected
      serverSelectionTimeoutMS: 10000, // 10s - allows Atlas cold start
      socketTimeoutMS: 45000, // 45s - keeps connection alive
      connectTimeoutMS: 10000, // 10s initial connection
      family: 4, // Force IPv4 to fix SSL alert 80
      retryWrites: true,
      w: 'majority' as const,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas');
      console.log('📡 Connection state:', mongoose.connection.readyState);
      console.log('🗄️  Database:', mongoose.connection.name);
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed');
      console.error('🔍 Error name:', error.name);
      console.error('📝 Error message:', error.message);
      if (error.cause) {
        console.error('🔗 Cause:', error.cause);
      }
      console.error('🔗 Connection string format:', MONGODB_URI.substring(0, 25) + '...');
      if (error.name === 'MongoServerSelectionError') {
        console.error('💡 Hint: Check IP whitelist at https://cloud.mongodb.com → Network Access');
        console.error('💡 Also verify: VPN off, correct database name, valid credentials');
      }
      cached!.promise = null; // Reset so next call can retry
      throw error;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
