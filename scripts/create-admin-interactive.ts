import { config } from 'dotenv';
import { resolve } from 'path';
import { hash } from 'bcryptjs';
import * as readline from 'readline';

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') });

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify readline question
function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Import after env is loaded
import('../lib/mongodb').then(async ({ default: connectDB }) => {
  const mongoose = await import('mongoose');
  const User = (await import('../models/User')).default;

  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║         ADMIN ACCOUNT CREATION                        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  try {
    await connectDB();

    // Get email
    let email = '';
    while (!email || !isValidEmail(email)) {
      email = await question('Enter admin email: ');
      if (!isValidEmail(email)) {
        console.log('❌ Invalid email format. Please try again.\n');
        email = '';
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`\n⚠️  Admin user with email "${email}" already exists!`);
      const reset = await question('Do you want to reset the password? (yes/no): ');

      if (reset.toLowerCase() !== 'yes' && reset.toLowerCase() !== 'y') {
        console.log('\n❌ Account creation cancelled.');
        rl.close();
        await mongoose.default.connection.close();
        process.exit(0);
      }
    }

    // Get password
    let password = '';
    while (password.length < 8) {
      // Note: readline doesn't support hidden input by default
      // In production, you'd want to use a library like 'read' or 'inquirer'
      password = await question('\nEnter password (min 8 characters): ');
      if (password.length < 8) {
        console.log('❌ Password must be at least 8 characters. Please try again.');
        password = '';
      }
    }

    // Confirm password
    const confirmPassword = await question('Confirm password: ');
    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match. Please run the script again.');
      rl.close();
      await mongoose.default.connection.close();
      process.exit(1);
    }

    // Hash the password
    console.log('\n🔐 Hashing password...');
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
    console.log('\n⚠️  IMPORTANT: Keep these credentials safe!');
    console.log('   Consider changing the password after first login.\n');

  } catch (error) {
    console.error('\n❌ Failed to create admin user:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.default.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
});
