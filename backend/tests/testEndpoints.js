import fetch from 'node-fetch';

const API_URL = 'http://localhost:5001';
let authToken = '';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, method, endpoint, body = null, requiresAuth = false) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (requiresAuth && authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    log(`\n🧪 Testing: ${name}`, 'blue');
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (response.ok) {
      log(`✅ PASS - Status: ${response.status}`, 'green');
      console.log('Response:', JSON.stringify(data, null, 2));
      return data;
    } else {
      log(`❌ FAIL - Status: ${response.status}`, 'red');
      console.log('Error:', JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    log(`❌ ERROR: ${error.message}`, 'red');
    return null;
  }
}

async function runTests() {
  log('\n🚀 Starting Backend API Tests\n', 'yellow');
  log('='.repeat(50), 'yellow');

  await testEndpoint('Health Check', 'GET', '/health');
  await testEndpoint('Get All Products', 'GET', '/api/products');
  await testEndpoint('Get Products by Category', 'GET', '/api/products?category=casual-shirt');
  await testEndpoint('Search Products', 'GET', '/api/products?search=shirt');
  await testEndpoint('Paginated Products', 'GET', '/api/products?page=1&limit=10');

  log('\n⚠️  Auth tests require real Google OAuth token', 'yellow');
  log('Skipping Google OAuth test - manual testing required', 'yellow');

  log('\n🔒 Testing Protected Routes (Should Fail)', 'yellow');
  await testEndpoint('Create Product (No Auth)', 'POST', '/api/products', {
    name: 'Test Product',
    category: 'casual-shirt',
    price: 999,
    imageUrl: 'https://example.com/image.jpg',
    imageKey: 'test-key',
  });

  await testEndpoint('Get Upload URL (No Auth)', 'POST', '/api/upload-url', {
    filename: 'test.jpg',
    contentType: 'image/jpeg',
  });

  log('\n' + '='.repeat(50), 'yellow');
  log('\n✅ Basic Tests Complete!', 'green');
  log('\n📝 Manual Testing Required:', 'yellow');
  log('1. Get Google OAuth token from frontend', 'reset');
  log('2. Test POST /api/auth/google with token', 'reset');
  log('3. Use returned JWT for protected routes', 'reset');
  log('4. Test product CRUD with admin user', 'reset');
  log('5. Test Socket.io real-time updates', 'reset');
}

runTests().catch(console.error);
