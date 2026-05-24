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
    console.log('📊 TEST 1: COUNT DOCUMENTS');
    const projectCount = await Project.countDocuments();
    console.log(`   Projects in DB: ${projectCount}`);
    console.log('   ✅ COUNT successful\n');
    
    // TEST 2: READ
    console.log('📖 TEST 2: READ DOCUMENTS');
    const projects = await Project.find().limit(3);
    console.log(`   Fetched ${projects.length} projects:`);
    projects.forEach((p, i) => {
      console.log(`   ${i + 1}. "${p.title}" (${p.category})`);
    });
    console.log('   ✅ READ successful\n');
    
    // TEST 3: CREATE (test document)
    console.log('✏️ TEST 3: CREATE DOCUMENT');
    const testProject = await Project.create({
      title: 'TEST Project - DELETE ME',
      slug: `test-${Date.now()}`,
      category: 'Strategy',
      hook: 'This is a test project created by the CRUD test script',
    });
    console.log(`   Created test project: ${testProject.title}`);
    console.log(`   ID: ${testProject._id}`);
    console.log('   ✅ CREATE successful\n');
    
    // TEST 4: UPDATE
    console.log('🔄 TEST 4: UPDATE DOCUMENT');
    const updated = await Project.findByIdAndUpdate(
      testProject._id,
      { hook: 'Updated by CRUD test - ready for deletion' },
      { new: true }
    );
    console.log(`   Updated hook: ${updated?.hook}`);
    console.log('   ✅ UPDATE successful\n');
    
    // TEST 5: DELETE
    console.log('🗑️ TEST 5: DELETE DOCUMENT');
    await Project.findByIdAndDelete(testProject._id);
    const deleted = await Project.findById(testProject._id);
    console.log(`   Document deleted: ${deleted === null}`);
    console.log('   ✅ DELETE successful\n');
    
    console.log('🎉 ALL CRUD TESTS PASSED!');
    console.log('✅ MongoDB is fully operational\n');
    
  } catch (error) {
    console.error('❌ CRUD TEST FAILED:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testCRUD();
