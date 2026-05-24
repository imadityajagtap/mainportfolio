import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import User model dynamically to avoid path issues
const seedAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const UserSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      hashedPassword: { type: String, required: true, select: false },
      role: { type: String, default: 'admin' },
    }, { timestamps: true });

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const email = 'aditya.jagtap312@gmail.com';
    const plainPassword = 'Adity@007';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existing = await User.findOne({ email }).select('+hashedPassword');

    if (existing) {
      existing.hashedPassword = hashedPassword;
      existing.role = 'admin';
      await existing.save();
      console.log('✅ Admin password UPDATED for:', email);
    } else {
      await User.create({
        email,
        hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin user CREATED:', email);
    }

    console.log('\n🔑 LOGIN CREDENTIALS:');
    console.log('   Email:', email);
    console.log('   Password:', plainPassword);
    console.log('\n🚀 Visit: http://localhost:3000/admin/login\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedAdmin();
