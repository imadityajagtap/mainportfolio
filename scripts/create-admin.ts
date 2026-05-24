import { config } from 'dotenv';
import { resolve } from 'path';
import { hash } from 'bcryptjs';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Import after env is loaded
import('../lib/mongodb').then(async ({ default: connectDB }) => {
  const mongoose = await import('mongoose');
  const User = (await import('../models/User')).default;

  console.log('👤 Creating admin user...\n');

  try {
    await connectDB();

    // Admin credentials
    const email = 'admin@adityajagtap.com';
    const password = 'admin123'; // Change this in production!

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${email}`);
      console.log('\n💡 To reset the password, delete the user first or modify this script.');
      process.exit(0);
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const hashedPassword = await hash(password, 12);

    // Create admin user
    console.log('✨ Creating admin user...');
    const admin = await User.create({
      email,
      hashedPassword,
      role: 'admin',
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔗 Login URL: http://localhost:3000/admin/login');
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');

  } catch (error) {
    console.error('\n❌ Failed to create admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.default.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
});
