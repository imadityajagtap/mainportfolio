import { config } from 'dotenv';
import { resolve } from 'path';
import { hash } from 'bcryptjs';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Import after env is loaded
import('../lib/mongodb').then(async ({ default: connectDB }) => {
  const mongoose = await import('mongoose');
  const User = (await import('../models/User')).default;

  console.log('👤 Creating admin user for aditya.jagtap312@gmail.com...\n');

  try {
    await connectDB();

    const email = 'aditya.jagtap312@gmail.com';
    const password = 'Admin@2024'; // Change this after first login!

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('⚠️  Admin user already exists! Updating password...');
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const hashedPassword = await hash(password, 10);

    // Create or update admin user
    let admin;
    if (existingUser) {
      admin = await User.findOneAndUpdate(
        { email },
        { hashedPassword },
        { new: true }
      );
      console.log('✅ Admin password updated successfully!');
    } else {
      admin = await User.create({
        email,
        hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║         LOGIN CREDENTIALS                             ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔗 Login URL: http://localhost:3000/admin/login');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!\n');

  } catch (error) {
    console.error('\n❌ Failed to create admin user:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await mongoose.default.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
});
