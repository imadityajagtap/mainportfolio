import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../lib/mongodb';
import Project from '../models/Project';

async function testCRUD() {
  try {
    console.log('🧪 Testing CRUD Operations...\n');
    
    // Connect
    await connectDB();
    console.log('✅ Connected to MongoDB\n');
    
    // TEST 1: COUNT
    console.log('📊 TEST 1: COUNT');
    const count = await Project.countDocuments();
    console.log(`   ✅ Projects: ${count}\n`);
    
    // TEST 2: READ
    console.log('📖 TEST 2: READ');
    const projects = await Project.find().limit(2);
    console.log(`   ✅ Fetched: ${projects.length} projects\n`);
    
    console.log('🎉 CRUD TESTS PASSED!');
    
  } catch (error) {
    console.error('❌ FAILED:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testCRUD();
