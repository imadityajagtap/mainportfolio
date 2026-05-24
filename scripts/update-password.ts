import { config } from 'dotenv';
import { resolve } from 'path';
import { hash } from 'bcryptjs';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Import after env is loaded
import('../lib/mongodb').then(async ({ default: connectDB }) => {
  const mongoose = await import('mongoose');
  const User = (await import('../models/User')).default;

  console.log('🔐 Updating password for aditya.jagtap312@gmail.com...\n');

  try {
    await connectDB();

    const email = 'aditya.jagtap312@gmail.com';
    const password = 'Aditya007';

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Update password
    const admin = await User.findOneAndUpdate(
      { email },
      { hashedPassword },
      { new: true }
    );

    if (!admin) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ Password updated successfully!');
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║         LOGIN CREDENTIALS                             ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔗 Login URL: http://localhost:3000/admin/login\n');

  } catch (error) {
    console.error('\n❌ Failed to update password:', error);
    process.exit(1);
  } finally {
    await mongoose.default.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
});
