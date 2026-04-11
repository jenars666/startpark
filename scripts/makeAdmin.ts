import * as admin from 'firebase-admin';

// Initialize Firebase Admin
const serviceAccount = require('../starmenspark-1cc3f-firebase-adminsdk-fbsvc-da12b4023b.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function makeUserAdmin(email: string) {
  try {
    // Get user by email
    const userRecord = await admin.auth().getUserByEmail(email);
    const uid = userRecord.uid;

    console.log(`Found user: ${email}`);
    console.log(`UID: ${uid}`);

    // Set admin role in Firestore
    await db.collection('users').doc(uid).set({
      email: email,
      role: 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`✅ Successfully made ${email} an admin!`);
    console.log(`They can now access /admin and add products.`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.error('Usage: npx ts-node scripts/makeAdmin.ts <email>');
  console.error('Example: npx ts-node scripts/makeAdmin.ts owner@starmenspark.com');
  process.exit(1);
}

makeUserAdmin(email);
