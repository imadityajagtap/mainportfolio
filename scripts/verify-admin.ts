import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Import after env is loaded
import('../lib/mongodb').then(async ({ default: connectDB }) => {
  const mongoose = await import('mongoose');
  const User = (await import('../models/User')).default;

  console.log('🔍 Verifying admin user in MongoDB...\n');

  try {
    await connectDB();

    // Find all admin users (don't select password)
    const admins = await User.find({ role: 'admin' }).select('-hashedPassword');

    if (admins.length === 0) {
      console.log('❌ No admin users found in database.');
      console.log('   Run: npx tsx scripts/create-admin-interactive.ts\n');
    } else {
      console.log(`✅ Found ${admins.length} admin user(s):\n`);

      admins.forEach((admin, index) => {
        console.log(`${index + 1}. Email: ${admin.email}`);
        console.log(`   Role:  ${admin.role}`);
        console.log(`   ID:    ${admin._id}`);
        console.log(`   Created: ${new Date(admin.createdAt).toLocaleString()}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await mongoose.default.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
});
