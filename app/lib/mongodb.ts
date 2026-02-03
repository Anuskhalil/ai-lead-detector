// lib/mongodb.ts

import mongoose from 'mongoose';

// Get MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-lead-gen-auditor';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global mongoose cache to prevent creating multiple connections
 * in development when Next.js hot-reloads
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connect to MongoDB
 * Reuses existing connection if available
 */
export async function connectDB(): Promise<typeof mongoose> {
  // If already connected, return existing connection
  if (cached.conn) {
    console.log('✅ Using existing MongoDB connection');
    return cached.conn;
  }

  // If not connecting yet, create new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable command buffering
    };

    console.log('🔄 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully');
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e);
    throw e;
  }

  return cached.conn;
}