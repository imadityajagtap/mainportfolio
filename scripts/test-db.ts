import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE importing anything that needs them
config({ path: resolve(__dirname, '../.env.local') });

// Now import after env is loaded
import('../lib/mongodb').then(async ({ default: connectDB }) => {
  const mongoose = await import('mongoose');

  console.log('🔍 Testing MongoDB connection...\n');

  try {
    // Connect to MongoDB
    await connectDB();
    console.log('✅ Successfully connected to MongoDB\n');

    // Get database instance
    const db = mongoose.default.connection.db;

    if (!db) {
      throw new Error('Database instance is not available');
    }

    // List all collections
    const collections = await db.listCollections().toArray();

    console.log(`📦 Total collections: ${collections.length}`);

    if (collections.length > 0) {
      console.log('\n📋 Collections:');
      collections.forEach((collection) => {
        console.log(`   - ${collection.name}`);
      });
    } else {
      console.log('   (No collections yet - this is normal for a new database)');
    }

    console.log('\n✨ Connection test completed successfully!');

  } catch (error) {
    console.error('\n❌ Connection test failed:');

    if (error instanceof Error) {
      console.error(`   Error: ${error.message}`);
      if (error.message.includes('bad auth')) {
        console.error('\n   ⚠️  Authentication failed - check your username/password');
      }
    } else {
      console.error(`   Unknown error: ${error}`);
    }

    console.log('\n🔧 Troubleshooting tips:');
    console.log('   1. Check that MONGODB_URI is set in .env.local');
    console.log('   2. Verify MongoDB Atlas connection string is correct');
    console.log('   3. Ensure your IP address is whitelisted in MongoDB Atlas');
    console.log('   4. Check that network access allows connections from your location');
    console.log('   5. Verify username and password are correct');

    process.exit(1);
  } finally {
    // Clean up connection
    await mongoose.default.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
});
