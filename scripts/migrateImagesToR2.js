import admin from 'firebase-admin';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function migrateImages() {
  console.log('🚀 Starting Firebase Storage to R2 migration...\n');

  const [files] = await bucket.getFiles({ prefix: 'products/' });
  
  console.log(`📦 Found ${files.length} files to migrate\n`);

  let migrated = 0;
  let failed = 0;

  for (const file of files) {
    try {
      console.log(`   Migrating: ${file.name}`);
      
      const [buffer] = await file.download();
      const metadata = file.metadata;
      
      await r2Client.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: file.name,
        Body: buffer,
        ContentType: metadata.contentType || 'image/jpeg',
      }));

      console.log(`   ✅ Migrated: ${file.name}`);
      migrated++;
    } catch (error) {
      console.error(`   ❌ Failed: ${file.name}`, error.message);
      failed++;
    }
  }

  console.log(`\n🎉 Migration complete!`);
  console.log(`   ✅ Migrated: ${migrated}`);
  console.log(`   ❌ Failed: ${failed}`);
  
  process.exit(0);
}

migrateImages().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
