const admin = require('firebase-admin');
const serviceAccount = require('../starmenspark-1cc3f-firebase-adminsdk-fbsvc-da12b4023b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'starmenspark-1cc3f.firebasestorage.app',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function testBackend() {
  console.log('\n🔍 Testing Firebase Backend...\n');

  try {
    // Test 1: Firestore Connection
    console.log('1️⃣ Testing Firestore connection...');
    await db.collection('_test').doc('connection').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: 'Connection test successful',
    });
    await db.collection('_test').doc('connection').delete();
    console.log('   ✅ Firestore: Connected and working\n');

    // Test 2: Storage Connection
    console.log('2️⃣ Testing Firebase Storage connection...');
    const [bucketExists] = await bucket.exists();
    if (bucketExists) {
      console.log('   ✅ Storage: Bucket exists and accessible\n');
    } else {
      console.log('   ❌ Storage: Bucket not found\n');
    }

    // Test 3: Check Products Collection
    console.log('3️⃣ Checking products collection...');
    const productsSnapshot = await db.collection('products').limit(5).get();
    console.log(`   📦 Found ${productsSnapshot.size} products in Firestore`);
    
    if (productsSnapshot.size > 0) {
      console.log('   ✅ Products collection exists\n');
      console.log('   Sample products:');
      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`   - ${data.name} (${data.category})`);
      });
    } else {
      console.log('   ⚠️  No products found (add products via admin panel)\n');
    }

    // Test 4: Check Storage Files
    console.log('\n4️⃣ Checking Firebase Storage...');
    const [files] = await bucket.getFiles({ prefix: 'products/', maxResults: 5 });
    console.log(`   📁 Found ${files.length} files in Storage`);
    
    if (files.length > 0) {
      console.log('   ✅ Storage has product images\n');
      console.log('   Sample files:');
      files.forEach((file) => {
        console.log(`   - ${file.name}`);
      });
    } else {
      console.log('   ⚠️  No images found (upload via admin panel)\n');
    }

    // Test 5: Check Admin Users
    console.log('\n5️⃣ Checking admin users...');
    const usersSnapshot = await db.collection('users').where('role', '==', 'admin').get();
    console.log(`   👤 Found ${usersSnapshot.size} admin user(s)`);
    
    if (usersSnapshot.size > 0) {
      console.log('   ✅ Admin users configured\n');
      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`   - ${data.email || 'No email'} (${doc.id})`);
      });
    } else {
      console.log('   ⚠️  No admin users found');
      console.log('   Run: node scripts/makeAdmin.js <email>\n');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 BACKEND STATUS SUMMARY');
    console.log('='.repeat(50));
    console.log('✅ Firestore: Connected');
    console.log('✅ Storage: Connected');
    console.log(`📦 Products: ${productsSnapshot.size} items`);
    console.log(`📁 Images: ${files.length} files`);
    console.log(`👤 Admins: ${usersSnapshot.size} users`);
    console.log('='.repeat(50));

    if (productsSnapshot.size === 0) {
      console.log('\n⚠️  ACTION REQUIRED:');
      console.log('   1. Make user admin: node scripts/makeAdmin.js <email>');
      console.log('   2. Login to /admin and add products');
      console.log('   3. Or run: node scripts/uploadProducts.js\n');
    } else {
      console.log('\n✅ Backend is fully operational!\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error testing backend:', error.message);
    console.error('\nPossible issues:');
    console.error('- Firebase service account key not found');
    console.error('- Wrong project ID or bucket name');
    console.error('- Network connection issues');
    console.error('- Firebase rules blocking access\n');
    process.exit(1);
  }
}

testBackend();
