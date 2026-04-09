import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
const serviceAccount = require('../starmenspark-1cc3f-firebase-adminsdk-fbsvc-da12b4023b.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'starmenspark-1cc3f.appspot.com',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// Your products - update with your actual product details
const products = [
  // Casual Shirts - New Updated folder
  {
    id: 'casual-001',
    name: 'Premium Cotton Casual Shirt',
    description: 'Comfortable casual shirt perfect for everyday wear',
    price: 1299,
    originalPrice: 1999,
    category: 'Casual Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    badge: 'Bestseller',
    inStock: true,
    imagePath: './public/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.21 PM.jpeg',
  },
  {
    id: 'casual-002',
    name: 'Stylish Check Casual Shirt',
    description: 'Modern check pattern for casual occasions',
    price: 1199,
    originalPrice: 1799,
    category: 'Casual Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    badge: 'New',
    inStock: true,
    imagePath: './public/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.22 PM (1).jpeg',
  },
  {
    id: 'casual-003',
    name: 'Classic Casual Shirt',
    description: 'Timeless design for everyday comfort',
    price: 1099,
    originalPrice: 1699,
    category: 'Casual Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    badge: '',
    inStock: true,
    imagePath: './public/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.22 PM.jpeg',
  },
  {
    id: 'casual-004',
    name: 'Modern Fit Casual Shirt',
    description: 'Contemporary style with perfect fit',
    price: 1249,
    originalPrice: 1849,
    category: 'Casual Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    badge: '',
    inStock: true,
    imagePath: './public/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.23 PM.jpeg',
  },
  {
    id: 'casual-005',
    name: 'Trendy Casual Shirt',
    description: 'Latest fashion trends in casual wear',
    price: 1149,
    originalPrice: 1749,
    category: 'Casual Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    badge: 'Sale',
    inStock: true,
    imagePath: './public/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.24 PM (1).jpeg',
  },
  
  // Formal Shirts
  {
    id: 'formal-001',
    name: 'OFFICE READY LIGHT GREY SHIRT',
    description: 'Professional grey formal shirt for office wear',
    price: 1599,
    originalPrice: 2299,
    category: 'Formal Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    badge: 'Premium',
    inStock: true,
    imagePath: './public/images/formal paline/WhatsApp Image 2026-03-25 at 9.13.25 PM (1).jpeg',
  },
  {
    id: 'formal-002',
    name: 'ELEGANT NAVY FORMAL SHIRT',
    description: 'Sophisticated navy blue formal shirt',
    price: 1799,
    originalPrice: 2499,
    category: 'Formal Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    badge: 'Bestseller',
    inStock: true,
    imagePath: './public/images/formal paline/WhatsApp Image 2026-03-25 at 9.13.25 PM.jpeg',
  },
  {
    id: 'formal-003',
    name: 'STRUCTURED FORMAL BLACK SHIRT',
    description: 'Classic black formal shirt for business meetings',
    price: 1699,
    originalPrice: 2399,
    category: 'Formal Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    badge: '',
    inStock: true,
    imagePath: './public/images/formal paline/WhatsApp Image 2026-03-29 at 9.43.22 PM.jpeg',
  },
  {
    id: 'formal-004',
    name: 'SLIM FIT FORMAL BLUE SHIRT',
    description: 'Modern slim fit blue formal shirt',
    price: 1499,
    originalPrice: 2199,
    category: 'Formal Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    badge: 'New',
    inStock: true,
    imagePath: './public/images/formal paline/WhatsApp Image 2026-03-29 at 9.43.23 PM (1).jpeg',
  },
  {
    id: 'formal-005',
    name: 'CLASSIC FORMAL WHITE SHIRT',
    description: 'Essential white formal shirt for every wardrobe',
    price: 1399,
    originalPrice: 1999,
    category: 'Formal Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    badge: '',
    inStock: true,
    imagePath: './public/images/formal paline/WhatsApp Image 2026-03-29 at 9.43.23 PM.jpeg',
  },
  
  // Add more products here...
];

async function uploadImage(localPath: string, destination: string): Promise<string> {
  if (!localPath || !fs.existsSync(localPath)) {
    console.log(`  ⚠️  No image at ${localPath}, skipping`);
    return '';
  }

  await bucket.upload(localPath, {
    destination,
    metadata: { contentType: 'image/jpeg' },
  });

  const file = bucket.file(destination);
  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
  console.log(`  ✓ Uploaded: ${publicUrl}`);
  return publicUrl;
}

async function uploadAllProducts() {
  console.log(`\n🚀 Starting upload of ${products.length} products...\n`);

  for (const product of products) {
    console.log(`📦 Processing: ${product.name}`);

    const imageUrl = await uploadImage(
      product.imagePath,
      `products/${product.id}/main.jpg`
    );

    if (!imageUrl) {
      console.log(`  ❌ Skipped - no image found\n`);
      continue;
    }

    await db.collection('products').doc(product.id).set({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      oldPrice: product.originalPrice.toString(),
      category: product.category,
      sizes: product.sizes,
      tag: product.badge,
      inStock: product.inStock,
      img: imageUrl,
      color: 'Multi',
      stock: 100,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`  ✓ Saved to Firestore\n`);
  }

  console.log('✅ All products uploaded successfully!');
  process.exit(0);
}

uploadAllProducts().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
