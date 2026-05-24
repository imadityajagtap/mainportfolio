import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const fixData = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    if (!db) throw new Error('No DB connection');

    const collection = db.collection('experiences');
    const docs = await collection.find({}).toArray();

    console.log(`Found ${docs.length} experience documents\n`);

    for (const doc of docs) {
      console.log('📄 Document ID:', doc._id);
      console.log('   organization:', doc.organization);
      console.log('   title:', doc.title);
      console.log('   company:', doc.company);
      console.log('   role:', doc.role);
      console.log('   companyName:', doc.companyName);
      console.log('   position:', doc.position);
      console.log('   jobTitle:', doc.jobTitle);

      const updates: any = {};

      // Migrate company/companyName → organization if needed
      if (!doc.organization && (doc.company || doc.companyName)) {
        updates.organization = doc.company || doc.companyName;
      }

      // Migrate role/position/jobTitle → title if needed
      if (!doc.title && (doc.role || doc.position || doc.jobTitle)) {
        updates.title = doc.role || doc.position || doc.jobTitle;
      }

      if (Object.keys(updates).length > 0) {
        await collection.updateOne({ _id: doc._id }, { $set: updates });
        console.log('   ✅ Updated with:', updates);
      } else {
        console.log('   ⏭️  No migration needed');
      }
      console.log('');
    }

    console.log('✅ Data migration complete!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixData();
