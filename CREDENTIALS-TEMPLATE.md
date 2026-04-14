# 📋 Credentials Reference Card

## Fill this out as you complete setup:

### MongoDB Atlas
```
Cluster Name: StarMensPark
Username: starmenspark
Password: ________________________________
Connection String:
mongodb+srv://starmenspark:PASSWORD@starmenspark.xxxxx.mongodb.net/starmenspark?retryWrites=true&w=majority
```

### Cloudflare R2
```
Account ID: ________________________________
Bucket Name: starmenspark-products
Access Key ID: ________________________________
Secret Access Key: ________________________________
Public URL: https://pub-xxxxx.r2.dev
```

### Google OAuth
```
Client ID: ________________________________.apps.googleusercontent.com
Client Secret: GOCSPX-________________________________
```

### JWT Secret
```
JWT_SECRET: ________________________________
(Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

---

## Backend .env Template

Copy this to `backend/.env` and fill in values:

```env
PORT=5001
CORS_ORIGINS=http://localhost:3000

MONGODB_URI=mongodb+srv://starmenspark:PASSWORD@starmenspark.xxxxx.mongodb.net/starmenspark?retryWrites=true&w=majority

JWT_SECRET=your-generated-jwt-secret-here

GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

R2_ACCOUNT_ID=your-account-id
R2_BUCKET=starmenspark-products
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_PUBLIC_BASE_URL=https://pub-xxxxx.r2.dev
R2_SIGNED_URL_EXPIRES_SECONDS=300
```

---

## Frontend .env.local Additions

Add these to existing `.env.local`:

```env
NEXT_PUBLIC_USE_MONGODB=false
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

---

## Quick Test Commands

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Start Backend
cd backend && npm start

# Test Health
curl http://localhost:5001/health

# Test Products
curl http://localhost:5001/api/products

# Start Frontend
npm run dev
```

---

## Admin User Setup

After first login, run in MongoDB Atlas:

```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

## URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- Admin Dashboard: http://localhost:3000/admin/dashboard
- MongoDB Atlas: https://cloud.mongodb.com
- Cloudflare Dashboard: https://dash.cloudflare.com
- Google Cloud Console: https://console.cloud.google.com

---

**Keep this file secure! Contains sensitive credentials.**
