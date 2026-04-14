# Backend Deployment Guide

## 🚀 Deploy to Railway

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add MongoDB backend"
git push origin main
```

### Step 2: Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js

### Step 3: Configure Build
1. Go to Settings → Build
2. Set Root Directory: `backend`
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`

### Step 4: Add Environment Variables
Go to Variables tab and add:
```
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/starmenspark
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
R2_ACCOUNT_ID=your-account-id
R2_BUCKET=starmenspark-products
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_PUBLIC_BASE_URL=https://pub-xxxxx.r2.dev
CORS_ORIGINS=https://yourdomain.vercel.app
```

### Step 5: Deploy
Railway will automatically deploy. Get your URL: `https://your-app.railway.app`

---

## 🚀 Deploy to Render

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Add MongoDB backend"
git push origin main
```

### Step 2: Create Web Service
1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `starmenspark-backend`
   - Region: Singapore
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

### Step 3: Add Environment Variables
Add all variables from Railway section above.

### Step 4: Deploy
Render will build and deploy. Get your URL: `https://starmenspark-backend.onrender.com`

---

## 🔧 Update Frontend

### Add to `.env.local`:
```env
NEXT_PUBLIC_USE_MONGODB=true
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Update CORS on Backend
After deployment, update `CORS_ORIGINS` environment variable:
```
CORS_ORIGINS=https://yourdomain.vercel.app,http://localhost:3000
```

---

## 📦 Run Migrations

### Migrate Products from Firebase to MongoDB
```bash
# Add Firebase admin credentials to .env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@project.iam.gserviceaccount.com"

# Run migration
node scripts/migrateToMongoDB.js
```

### Migrate Images from Firebase Storage to R2
```bash
# Run migration
node scripts/migrateImagesToR2.js
```

---

## ✅ Testing Checklist

### Backend Health
```bash
curl https://your-backend-url.railway.app/health
```

### Get Products
```bash
curl https://your-backend-url.railway.app/api/products
```

### Test Authentication
1. Login with Google on frontend
2. Check browser console for JWT token
3. Test admin endpoints with token

### Test Real-time Updates
1. Open admin dashboard: `/admin/dashboard`
2. Open product page in another tab
3. Add product in admin
4. See it appear instantly on product page

---

## 💰 Cost Breakdown

### Railway (Recommended)
- Free tier: $5 credit/month
- Hobby plan: $5/month (500 hours)
- Pro plan: $20/month (unlimited)

### Render
- Free tier: 750 hours/month
- Starter: $7/month
- Standard: $25/month

### MongoDB Atlas
- M0 (Free): 512MB storage
- M2: $9/month (2GB)
- M10: $57/month (10GB)

### Cloudflare R2
- Free: 10GB storage, 1M reads/month
- Paid: $0.015/GB storage

### Total Estimated Cost
- Development: **$0/month** (all free tiers)
- Production (small): **$15-20/month**
- Production (medium): **$60-70/month**

---

## 🔒 Security Checklist

- ✅ Environment variables configured
- ✅ CORS restricted to your domain
- ✅ Rate limiting enabled (100 req/15min)
- ✅ Auth rate limiting (5 req/15min)
- ✅ Helmet.js security headers
- ✅ JWT tokens with 7-day expiry
- ✅ Admin role verification
- ✅ MongoDB connection authenticated
- ✅ R2 presigned URLs (5min expiry)

---

## 🐛 Troubleshooting

### Backend won't start
- Check all environment variables are set
- Check MongoDB connection string
- Check logs: Railway/Render dashboard

### CORS errors
- Add frontend URL to CORS_ORIGINS
- Include http://localhost:3000 for development

### Authentication fails
- Verify GOOGLE_CLIENT_ID matches frontend
- Check JWT_SECRET is set
- Verify user has admin role in MongoDB

### Images not uploading
- Check R2 credentials
- Verify bucket name
- Check R2_PUBLIC_BASE_URL

### Real-time updates not working
- Check Socket.io connection in browser console
- Verify backend URL in NEXT_PUBLIC_API_URL
- Check CORS allows WebSocket connections

---

## 📊 Monitoring

### Railway
- View logs in dashboard
- Monitor CPU/Memory usage
- Set up alerts

### Render
- View logs in dashboard
- Monitor response times
- Set up health checks

### MongoDB Atlas
- Monitor connections
- Check query performance
- Set up alerts for storage

---

## 🔄 Rollback Plan

If MongoDB backend has issues:

1. Set `NEXT_PUBLIC_USE_MONGODB=false` in `.env.local`
2. Redeploy frontend
3. System falls back to Firebase
4. No data loss (Firebase still has all data)

---

## 📈 Next Steps After Deployment

1. ✅ Test all endpoints
2. ✅ Make first user admin in MongoDB
3. ✅ Upload test product via admin dashboard
4. ✅ Verify real-time updates work
5. ✅ Run migrations from Firebase
6. ✅ Update frontend to use MongoDB
7. ✅ Monitor for 24 hours
8. ✅ Gradually migrate all users

---

**Deployment Status**: Ready to deploy
**Estimated Time**: 30-60 minutes
**Difficulty**: Medium
