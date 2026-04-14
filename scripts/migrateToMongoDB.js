import admin from 'firebase-admin';
import mongoose from 'mongoose';
import { Product } from '../backend/src/models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateProducts() {
  console.log('🚀 Starting Firebase to MongoDB migration...\n');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  const categories = ['casual-shirt', 'formal-shirt', 'vesthi-shirt', 'group-shirt'];
  let totalMigrated = 0;

  for (const category of categories) {
    console.log(`📦 Migrating ${category}...`);
    
    const snapshot = await db.collection('products').where('category', '==', category).get();
    
    if (snapshot.empty) {
      console.log(`   No products found in ${category}\n`);
      continue;
    }

    const products = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      products.push({
        name: data.name || 'Untitled Product',
        description: data.description || '',
        category: data.category,
        price: data.price || 0,
        oldPrice: data.oldPrice || null,
        stock: data.stock || 0,
        status: data.status || 'active',
        imageUrl: data.imageUrl || data.image || '',
        imageKey: data.imageKey || `products/${doc.id}/main.jpg`,
        color: data.color || 'Multi',
        tag: data.tag || '',
        sizes: data.sizes || [],
      });
    });

    const result = await Product.insertMany(products, { ordered: false });
    console.log(`   ✅ Migrated ${result.length} products from ${category}\n`);
    totalMigrated += result.length;
  }

  console.log(`\n🎉 Migration complete! Total products migrated: ${totalMigrated}`);
  
  await mongoose.disconnect();
  process.exit(0);
}

migrateProducts().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
