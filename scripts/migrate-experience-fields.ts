import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI not found in .env.local');
  }

  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
  });

  const db = mongoose.connection.db;
  if (!db) throw new Error('No database connection');

  const collection = db.collection('experiences');
  const docs = await collection.find({}).toArray();
  let updated = 0;

  for (const doc of docs) {
    const company = doc.company || doc.companyName || doc.organization;
    const role = doc.role || doc.position || doc.jobTitle || doc.title;
    const updates: Record<string, unknown> = {};

    if (!doc.company && company) updates.company = company;
    if (!doc.role && role) updates.role = role;

    // Keep legacy aliases filled while the public/admin UI is being normalized.
    if (!doc.organization && company) updates.organization = company;
    if (!doc.title && role) updates.title = role;

    if (Object.keys(updates).length > 0) {
      await collection.updateOne({ _id: doc._id }, { $set: updates });
      updated++;
    }
  }

  console.log(`Experience documents scanned: ${docs.length}`);
  console.log(`Experience documents updated: ${updated}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error instanceof Error ? error.message : error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
