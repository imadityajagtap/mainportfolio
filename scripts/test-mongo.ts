/**
 * MongoDB Connection Test Script
 * Run with: npx tsx scripts/test-mongo.ts
 *
 * Tests connection to MongoDB Atlas with detailed diagnostics
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

console.log('🔍 MongoDB Connection Test');
console.log('─────────────────────────────────');
console.log('📍 URI format:', MONGODB_URI.substring(0, 20) + '...');
console.log('⏰ Starting connection attempt...\n');

const opts = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4, // Force IPv4
  retryWrites: true,
  w: 'majority' as const,
};

async function testConnection() {
  try {
    console.log('🚀 Connecting to MongoDB Atlas...');
    const startTime = Date.now();

    await mongoose.connect(MONGODB_URI!, opts);

    const duration = Date.now() - startTime;

    console.log('✅ Connection successful!');
    console.log('─────────────────────────────────');
    console.log('⏱️  Time taken:', duration + 'ms');
    console.log('📡 Connection state:', mongoose.connection.readyState);
    console.log('🗄️  Database name:', mongoose.connection.name);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('🔌 Port:', mongoose.connection.port || 'default');
    console.log('─────────────────────────────────');

    // Test a simple query
    console.log('\n🧪 Testing database query...');
    const collections = await mongoose.connection.db?.listCollections().toArray();
    console.log('📚 Collections found:', collections?.length || 0);
    if (collections && collections.length > 0) {
      console.log('   -', collections.map(c => c.name).join(', '));
    }

    console.log('\n✨ All tests passed!');

    await mongoose.connection.close();
    console.log('👋 Connection closed gracefully\n');

    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Connection failed');
    console.error('─────────────────────────────────');
    console.error('🔍 Error name:', error.name);
    console.error('📝 Error message:', error.message);

    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 Common causes:');
      console.error('   1. Network/firewall blocking MongoDB port 27017');
      console.error('   2. IP address not whitelisted in Atlas');
      console.error('   3. Invalid connection string or credentials');
      console.error('   4. SSL/TLS configuration mismatch');
      console.error('   5. IPv6 issues (fixed by family: 4)');
    }

    if (error.code === 'ENOTFOUND') {
      console.error('\n💡 DNS resolution failed - check cluster URL');
    }

    console.error('\n🔗 Check your connection string format:');
    console.error('   mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority');

    process.exit(1);
  }
}

// Run the test
testConnection();
