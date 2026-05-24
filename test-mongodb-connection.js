// Test MongoDB Connection Script
require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

console.log('🔍 Starting MongoDB connection test...\n');
console.log('📍 Your current IP:', '103.24.126.106');
console.log('🔗 Testing connection to:', process.env.MONGODB_URI?.substring(0, 30) + '...\n');

const opts = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  family: 4, // Force IPv4
};

async function testConnection() {
  try {
    console.log('⏳ Attempting connection (10 second timeout)...');
    const start = Date.now();

    await mongoose.connect(process.env.MONGODB_URI, opts);

    const duration = Date.now() - start;
    console.log(`\n✅ SUCCESS! Connected in ${duration}ms`);
    console.log('📊 Connection details:');
    console.log('  - State:', mongoose.connection.readyState); // 1 = connected
    console.log('  - Database:', mongoose.connection.name);
    console.log('  - Host:', mongoose.connection.host);

    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`  - Collections found: ${collections.length}`);
    collections.forEach(col => console.log(`    • ${col.name}`));

    await mongoose.disconnect();
    console.log('\n✅ Test completed successfully!');
    process.exit(0);

  } catch (error) {
    const duration = Date.now() - start;
    console.log(`\n❌ FAILED after ${duration}ms`);
    console.log('Error details:');
    console.log('  - Type:', error.name);
    console.log('  - Message:', error.message);

    if (error.name === 'MongoServerSelectionError') {
      console.log('\n🔧 TROUBLESHOOTING STEPS:');
      console.log('1. Verify IP whitelist at: https://cloud.mongodb.com');
      console.log('   Current IP to whitelist: 103.24.126.106');
      console.log('2. Wait 2-5 minutes after adding IP (propagation time)');
      console.log('3. Check if VPN/Proxy is active (disable if yes)');
      console.log('4. Verify database user has correct permissions');
      console.log('5. Check connection string has correct password encoding');
    }

    if (error.name === 'MongooseServerSelectionError') {
      console.log('\n🔧 Possible causes:');
      console.log('- Network firewall blocking MongoDB port (27017)');
      console.log('- Corporate network restrictions');
      console.log('- MongoDB cluster is paused/offline');
    }

    process.exit(1);
  }
}

testConnection();
