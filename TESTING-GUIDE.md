# Backend Testing Guide

## 🧪 Automated Tests

### Run All Tests
```bash
cd backend
node tests/testEndpoints.js
```

Expected output:
```
🚀 Starting Backend API Tests

🧪 Testing: Health Check
✅ PASS - Status: 200

🧪 Testing: Get All Products
✅ PASS - Status: 200

🧪 Testing: Get Products by Category
✅ PASS - Status: 200

🧪 Testing: Create Product (No Auth)
❌ FAIL - Status: 401
```

---

## 🔐 Manual Authentication Testing

### 1. Get Google OAuth Token

Add this to your frontend login page temporarily:

```javascript
// After successful Google login
console.log('Google ID Token:', googleUser.credential);
```

### 2. Test Login Endpoint

```bash
curl -X POST http://localhost:5001/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_GOOGLE_ID_TOKEN"}'
```

Expected response:
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user",
    "avatar": "https://..."
  }
}
```

### 3. Save JWT Token
```bash
export JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Test Protected Endpoints

```bash
# Create Product (Admin only)
curl -X POST http://localhost:5001/api/products \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "category": "casual-shirt",
    "price": 999,
    "imageUrl": "https://example.com/image.jpg",
    "imageKey": "test-key"
  }'
```

---

## 📦 Product CRUD Testing

### Create Product
```bash
curl -X POST http://localhost:5001/api/products \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Cotton Shirt",
    "description": "High quality cotton shirt",
    "category": "casual-shirt",
    "price": 1299,
    "oldPrice": 1599,
    "stock": 50,
    "color": "Blue",
    "tag": "New Arrival",
    "imageUrl": "https://example.com/shirt.jpg",
    "imageKey": "products/test/shirt.jpg"
  }'
```

### Get All Products
```bash
curl http://localhost:5001/api/products
```

### Get Single Product
```bash
curl http://localhost:5001/api/products/PRODUCT_ID
```

### Update Product
```bash
curl -X PUT http://localhost:5001/api/products/PRODUCT_ID \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1199,
    "stock": 45
  }'
```

### Delete Product
```bash
curl -X DELETE http://localhost:5001/api/products/PRODUCT_ID \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

## 🖼️ Image Upload Testing

### 1. Get Upload URL
```bash
curl -X POST http://localhost:5001/api/upload-url \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test-shirt.jpg",
    "contentType": "image/jpeg"
  }'
```

Response:
```json
{
  "ok": true,
  "uploadUrl": "https://...r2.cloudflarestorage.com/...",
  "publicUrl": "https://pub-xxxxx.r2.dev/products/...",
  "key": "products/..."
}
```

### 2. Upload Image
```bash
curl -X PUT "UPLOAD_URL_FROM_STEP_1" \
  -H "Content-Type: image/jpeg" \
  --data-binary "@/path/to/image.jpg"
```

### 3. Verify Image
```bash
curl PUBLIC_URL_FROM_STEP_1
```

---

## 🔌 Socket.io Testing

### Browser Console Test

```javascript
// Connect to Socket.io
const socket = io('http://localhost:5001');

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);
});

socket.on('product:created', (data) => {
  console.log('🆕 Product created:', data);
});

socket.on('product:updated', (data) => {
  console.log('✏️ Product updated:', data);
});

socket.on('product:deleted', (data) => {
  console.log('🗑️ Product deleted:', data);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected');
});
```

### Test Real-time Updates

1. Open browser console with Socket.io code above
2. In another tab, create/update/delete product via admin dashboard
3. See events in console immediately

---

## 🔒 Security Testing

### Rate Limiting
```bash
# Send 101 requests in 15 minutes (should fail on 101st)
for i in {1..101}; do
  curl http://localhost:5001/api/products
  echo "Request $i"
done
```

Expected: 429 Too Many Requests after 100 requests

### Auth Rate Limiting
```bash
# Send 6 login attempts (should fail on 6th)
for i in {1..6}; do
  curl -X POST http://localhost:5001/api/auth/google \
    -H "Content-Type: application/json" \
    -d '{"token":"invalid"}'
  echo "Attempt $i"
done
```

Expected: 429 Too Many Requests after 5 attempts

### CORS Testing
```bash
# Request from unauthorized origin (should fail)
curl http://localhost:5001/api/products \
  -H "Origin: https://evil.com"
```

---

## 📊 Performance Testing

### Load Test with Apache Bench
```bash
# Install Apache Bench
# Ubuntu: sudo apt-get install apache2-utils
# Mac: brew install httpd

# Test 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:5001/api/products
```

Expected results:
- Requests per second: > 100
- Time per request: < 100ms
- Failed requests: 0

### Database Query Performance
```javascript
// In MongoDB Atlas
db.products.find({ category: "casual-shirt" }).explain("executionStats")
```

Check:
- executionTimeMillis < 50ms
- totalDocsExamined = nReturned (using index)

---

## 🐛 Error Handling Testing

### Invalid Product Data
```bash
curl -X POST http://localhost:5001/api/products \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "price": -100
  }'
```

Expected: 400 Bad Request with validation errors

### Invalid Product ID
```bash
curl http://localhost:5001/api/products/invalid-id
```

Expected: 400 Bad Request

### Non-existent Product
```bash
curl http://localhost:5001/api/products/507f1f77bcf86cd799439011
```

Expected: 404 Not Found

### Expired JWT Token
```bash
curl -X POST http://localhost:5001/api/products \
  -H "Authorization: Bearer expired.jwt.token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```

Expected: 401 Unauthorized

---

## ✅ Testing Checklist

### Backend
- [ ] Health endpoint returns 200
- [ ] Products list endpoint works
- [ ] Category filtering works
- [ ] Search works
- [ ] Pagination works
- [ ] Google OAuth login works
- [ ] JWT token generation works
- [ ] Token verification works
- [ ] Admin middleware blocks non-admins
- [ ] Product creation works (admin)
- [ ] Product update works (admin)
- [ ] Product deletion works (admin)
- [ ] Image upload URL generation works
- [ ] R2 upload works
- [ ] Rate limiting works (100/15min)
- [ ] Auth rate limiting works (5/15min)
- [ ] CORS blocks unauthorized origins
- [ ] Error handling works
- [ ] Validation works

### Socket.io
- [ ] Connection established
- [ ] product:created event fires
- [ ] product:updated event fires
- [ ] product:deleted event fires
- [ ] Multiple clients receive events
- [ ] Reconnection works

### Frontend Integration
- [ ] Products load from MongoDB
- [ ] Real-time updates work
- [ ] Admin dashboard loads
- [ ] Product creation works
- [ ] Image upload with progress works
- [ ] Product deletion works
- [ ] Authentication works
- [ ] Admin role check works

### Migration
- [ ] Firebase products migrate to MongoDB
- [ ] Firebase images migrate to R2
- [ ] No data loss
- [ ] Image URLs updated

---

## 📈 Monitoring

### Check Backend Logs
```bash
# Railway
railway logs

# Render
# View in dashboard

# Local
# Check terminal output
```

### Monitor MongoDB
```javascript
// In MongoDB Atlas
db.currentOp()
db.serverStatus()
```

### Monitor R2
Check Cloudflare dashboard for:
- Storage usage
- Request count
- Bandwidth usage

---

## 🔄 Continuous Testing

### Add to package.json
```json
{
  "scripts": {
    "test": "node tests/testEndpoints.js",
    "test:watch": "nodemon tests/testEndpoints.js"
  }
}
```

### Run Tests
```bash
npm test
```

---

**Testing Status**: Ready to test
**Estimated Time**: 1-2 hours for complete testing
**Priority**: High - Test before production deployment
