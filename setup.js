#!/usr/bin/env node

console.log('\n🚀 Star Mens Park - MongoDB Backend Setup\n');
console.log('Follow these steps in order:\n');

const steps = [
  {
    title: '1️⃣  MongoDB Atlas Setup',
    url: 'https://cloud.mongodb.com',
    tasks: [
      'Create free account',
      'Create M0 FREE cluster (choose AWS, closest region)',
      'Create database user (username: starmenspark)',
      'Whitelist IP: 0.0.0.0/0 (allow all)',
      'Get connection string and save it'
    ]
  },
  {
    title: '2️⃣  Cloudflare R2 Setup',
    url: 'https://dash.cloudflare.com',
    tasks: [
      'Create Cloudflare account',
      'Enable R2 (free tier)',
      'Create bucket: starmenspark-products',
      'Create API token (Read & Write)',
      'Save: Account ID, Access Key, Secret Key, Public URL'
    ]
  },
  {
    title: '3️⃣  Google OAuth Setup',
    url: 'https://console.cloud.google.com',
    tasks: [
      'Create new project: Star Mens Park',
      'Enable Google+ API',
      'Configure OAuth consent screen',
      'Create OAuth credentials (Web application)',
      'Add authorized origin: http://localhost:3000',
      'Save Client ID'
    ]
  },
  {
    title: '4️⃣  Configure Environment Variables',
    tasks: [
      'Open: backend/.env (already created with JWT secret)',
      'Fill in MONGODB_URI from step 1',
      'Fill in GOOGLE_CLIENT_ID from step 3',
      'Fill in R2 credentials from step 2',
      'Add to .env.local: NEXT_PUBLIC_API_URL=http://localhost:5001',
      'Add to .env.local: NEXT_PUBLIC_GOOGLE_CLIENT_ID=(same as backend)'
    ]
  },
  {
    title: '5️⃣  Test Backend',
    commands: [
      'cd backend',
      'npm install',
      'npm start',
      '# In new terminal:',
      'curl http://localhost:5001/health',
      'curl http://localhost:5001/api/products'
    ]
  },
  {
    title: '6️⃣  Make First User Admin',
    tasks: [
      'Start frontend: npm run dev',
      'Go to: http://localhost:3000',
      'Login with Google',
      'Go to MongoDB Atlas → Browse Collections → users',
      'Find your user by email',
      'Edit document: change role from "user" to "admin"',
      'Save'
    ]
  },
  {
    title: '7️⃣  Test Product Creation',
    tasks: [
      'Go to: http://localhost:3000/admin/dashboard',
      'Click "Add Product"',
      'Fill form and upload image',
      'Click "Create Product"',
      'Open new tab: http://localhost:3000/casual-shirt',
      'See product appear instantly! 🎉'
    ]
  }
];

steps.forEach((step, index) => {
  console.log(`\x1b[36m${step.title}\x1b[0m`);
  if (step.url) {
    console.log(`   🔗 ${step.url}`);
  }
  if (step.tasks) {
    step.tasks.forEach(task => console.log(`   ☐ ${task}`));
  }
  if (step.commands) {
    step.commands.forEach(cmd => console.log(`   $ ${cmd}`));
  }
  console.log('');
});

console.log('\x1b[32m📚 Detailed guides:\x1b[0m');
console.log('   • SETUP-WIZARD.md - Complete step-by-step guide');
console.log('   • CREDENTIALS-TEMPLATE.md - Fill in your credentials');
console.log('   • BACKEND-SETUP-GUIDE.md - Technical documentation');
console.log('   • TESTING-GUIDE.md - How to test everything');
console.log('');

console.log('\x1b[33m⚡ Quick start:\x1b[0m');
console.log('   1. Fill backend/.env with your credentials');
console.log('   2. cd backend && npm start');
console.log('   3. npm run dev (in new terminal)');
console.log('   4. Visit http://localhost:3000/admin/dashboard');
console.log('');

console.log('\x1b[35m💡 Generated for you:\x1b[0m');
console.log('   JWT_SECRET=c2550daa6fee0d382e0c71c952dd12bc36354e453445ec925b29428c4646ca5b');
console.log('   (Already in backend/.env)');
console.log('');

console.log('\x1b[32m✅ Estimated setup time: 15-20 minutes\x1b[0m\n');
