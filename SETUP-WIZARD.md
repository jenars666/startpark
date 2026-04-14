# 🚀 Complete Setup Wizard - Step by Step

## Step 1: MongoDB Atlas Setup (5 minutes)

### 1.1 Create Account
1. Go to: https://cloud.mongodb.com
2. Click "Try Free"
3. Sign up with Google or email
4. Verify email

### 1.2 Create Cluster
1. Click "Build a Database"
2. Choose "M0 FREE" (Shared cluster)
3. Provider: AWS
4. Region: Choose closest to you (e.g., Mumbai for India)
5. Cluster Name: "StarMensPark"
6. Click "Create"

### 1.3 Create Database User
1. Security → Database Access
2. Click "Add New Database User"
3. Authentication: Password
4. Username: `starmenspark`
5. Password: Click "Autogenerate Secure Password" (SAVE THIS!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Whitelist IP Address
1. Security → Network Access
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Database → Connect
2. Click "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy connection string:
```
mongodb+srv://starmenspark:<password>@starmenspark.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with your actual password
6. Add database name: `/starmenspark` before the `?`

**Final Connection String:**
```
mongodb+srv://starmenspark:YOUR_PASSWORD@starmenspark.xxxxx.mongodb.net/starmenspark?retryWrites=true&w=majority
```

✅ **Save this connection string!**

---

## Step 2: Cloudflare R2 Setup (5 minutes)

### 2.1 Create Cloudflare Account
1. Go to: https://dash.cloudflare.com/sign-up
2. Sign up with email
3. Verify email

### 2.2 Enable R2
1. In dashboard, click "R2" in left sidebar
2. Click "Purchase R2"
3. Click "Get Started" (Free tier: 10GB storage)

### 2.3 Create Bucket
1. Click "Create bucket"
2. Bucket name: `starmenspark-products`
3. Location: Automatic
4. Click "Create bucket"

### 2.4 Configure Public Access (Optional but Recommended)
1. Click on your bucket
2. Settings → Public Access
3. Click "Connect Domain" or use default R2.dev domain
4. Copy public URL: `https://pub-xxxxx.r2.dev`

### 2.5 Create API Token
1. R2 → Manage R2 API Tokens
2. Click "Create API Token"
3. Token name: `starmenspark-backend`
4. Permissions: "Object Read & Write"
5. TTL: Forever
6. Click "Create API Token"

**Save these values:**
```
Access Key ID: xxxxxxxxxxxxxxxxxxxx
Secret Access Key: yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

### 2.6 Get Account ID
1. R2 → Overview
2. Copy "Account ID" from right sidebar

✅ **Save: Account ID, Access Key ID, Secret Access Key, Public URL**

---

## Step 3: Google OAuth Setup (5 minutes)

### 3.1 Create Google Cloud Project
1. Go to: https://console.cloud.google.com
2. Click project dropdown → "New Project"
3. Project name: "Star Mens Park"
4. Click "Create"

### 3.2 Enable Google+ API
1. APIs & Services → Library
2. Search "Google+ API"
3. Click "Enable"

### 3.3 Configure OAuth Consent Screen
1. APIs & Services → OAuth consent screen
2. User Type: "External"
3. Click "Create"
4. App name: "Star Mens Park"
5. User support email: your email
6. Developer contact: your email
7. Click "Save and Continue"
8. Scopes: Click "Save and Continue" (use defaults)
9. Test users: Add your email
10. Click "Save and Continue"

### 3.4 Create OAuth Credentials
1. APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "Star Mens Park Web"
5. Authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:5001`
6. Authorized redirect URIs:
   - `http://localhost:3000`
7. Click "Create"

**Save these values:**
```
Client ID: xxxxx-yyyyy.apps.googleusercontent.com
Client Secret: GOCSPX-zzzzzzzzzzzzzzz
```

✅ **Save: Client ID and Client Secret**

---

## Step 4: Configure Environment Variables

### 4.1 Backend Environment Variables
Create `backend/.env`:

```bash
cd backend
```

Copy this template and fill in your values:

```env
# Server
PORT=5001
CORS_ORIGINS=http://localhost:3000

# MongoDB Atlas (from Step 1)
MONGODB_URI=mongodb+srv://starmenspark:YOUR_PASSWORD@starmenspark.xxxxx.mongodb.net/starmenspark?retryWrites=true&w=majority

# JWT Secret (generate random string - 32+ characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string-min-32-chars

# Google OAuth (from Step 3)
GOOGLE_CLIENT_ID=xxxxx-yyyyy.apps.googleusercontent.com

# Cloudflare R2 (from Step 2)
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_BUCKET=starmenspark-products
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_PUBLIC_BASE_URL=https://pub-xxxxx.r2.dev
R2_SIGNED_URL_EXPIRES_SECONDS=300
```

### 4.2 Generate JWT Secret
Use one of these methods:

**Option 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Online**
Go to: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")

**Option 3: Manual**
Type random characters (min 32 chars):
```
my-super-secret-jwt-key-12345678901234567890
```

### 4.3 Frontend Environment Variables
Add to `.env.local` (in root directory):

```env
# Existing Firebase variables (keep them)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# New MongoDB Backend variables
NEXT_PUBLIC_USE_MONGODB=false
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx-yyyyy.apps.googleusercontent.com
```

**Note:** Keep `NEXT_PUBLIC_USE_MONGODB=false` for now. We'll enable it after testing.

---

## Step 5: Test Backend

### 5.1 Install Dependencies
```bash
cd backend
npm install
```

### 5.2 Start Backend
```bash
npm start
```

Expected output:
```
Products backend running on http://localhost:5001
```

### 5.3 Test Health Endpoint
Open new terminal:
```bash
curl http://localhost:5001/health
```

Expected response:
```json
{
  "ok": true,
  "message": "Products backend is healthy.",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 5.4 Test Products Endpoint
```bash
curl http://localhost:5001/api/products
```

Expected response:
```json
{
  "ok": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 0,
    "totalPages": 1
  }
}
```

✅ **Backend is running!**

---

## Step 6: Make First User Admin

### 6.1 Start Frontend
Open new terminal:
```bash
npm run dev
```

### 6.2 Login with Google
1. Go to: http://localhost:3000
2. Click "Login" or "Sign In"
3. Login with your Google account
4. Check browser console for user info

### 6.3 Get Your User ID
**Option 1: Browser Console**
```javascript
// In browser console after login
console.log(localStorage.getItem('user'));
```

**Option 2: MongoDB Atlas**
1. Go to MongoDB Atlas dashboard
2. Database → Browse Collections
3. Database: `starmenspark`
4. Collection: `users`
5. Find your email
6. Copy the `_id` value

### 6.4 Make User Admin in MongoDB Atlas
1. Database → Browse Collections
2. Collection: `users`
3. Find your user document
4. Click "Edit Document"
5. Find the `role` field
6. Change from `"user"` to `"admin"`
7. Click "Update"

**Or use MongoDB Shell:**
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

✅ **You are now admin!**

---

## Step 7: Test Product Creation with Real-time Updates

### 7.1 Open Admin Dashboard
1. Go to: http://localhost:3000/admin/dashboard
2. You should see "Welcome, Your Name"
3. Click "Add Product"

### 7.2 Create Test Product
Fill in the form:
- Name: `Test Cotton Shirt`
- Description: `Premium quality cotton shirt`
- Category: `Casual Shirt`
- Price: `1299`
- Old Price: `1599`
- Stock: `50`
- Image: Upload any image

Click "Create Product"

### 7.3 Verify Real-time Updates
1. Keep admin dashboard open
2. Open new tab: http://localhost:3000/casual-shirt
3. Go back to admin dashboard
4. Create another product
5. Watch it appear instantly on the casual-shirt page!

### 7.4 Test Socket.io in Browser Console
```javascript
// Open browser console
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
```

Now create/update/delete products and see events in console!

---

## 🎉 Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created
- [ ] IP whitelisted
- [ ] Connection string saved
- [ ] Cloudflare R2 bucket created
- [ ] R2 API token created
- [ ] R2 public URL configured
- [ ] Google OAuth credentials created
- [ ] Backend .env configured
- [ ] Frontend .env.local updated
- [ ] Backend starts successfully
- [ ] Health endpoint returns 200
- [ ] Products endpoint returns data
- [ ] Logged in with Google
- [ ] User made admin in MongoDB
- [ ] Admin dashboard accessible
- [ ] Product created successfully
- [ ] Image uploaded to R2
- [ ] Real-time updates working
- [ ] Socket.io events firing

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check environment variables
cat backend/.env

# Check MongoDB connection
# Make sure password doesn't have special characters
# If it does, URL encode them: @ = %40, # = %23, etc.
```

### Can't connect to MongoDB
```bash
# Test connection
node -e "require('mongoose').connect('YOUR_MONGODB_URI').then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e.message))"
```

### Google OAuth fails
- Check Client ID matches in both backend and frontend .env
- Check authorized origins include http://localhost:3000
- Clear browser cache and try again

### Images not uploading
- Check R2 credentials in backend/.env
- Verify bucket name is correct
- Check R2_PUBLIC_BASE_URL is set

### Real-time updates not working
- Check Socket.io connection in browser console
- Verify backend URL in NEXT_PUBLIC_API_URL
- Check CORS_ORIGINS includes frontend URL

---

## 📞 Need Help?

### Check Logs
```bash
# Backend logs
# Check terminal where backend is running

# MongoDB logs
# MongoDB Atlas → Monitoring → Logs

# R2 logs
# Cloudflare Dashboard → R2 → Analytics
```

### Test Individual Components
```bash
# Test MongoDB
node backend/tests/testEndpoints.js

# Test R2 upload
# Use admin dashboard to upload image

# Test Socket.io
# Use browser console code from Step 7.4
```

---

**Setup Time**: 15-20 minutes
**Status**: Ready to test! 🚀
