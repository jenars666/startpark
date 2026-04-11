# Deployment Checklist

## ✅ Pre-Deployment (Do This First)

### 1. Firebase Setup
- [ ] Firebase Storage rules published
- [ ] Firestore security rules published
- [ ] Shop owner registered and made admin
- [ ] Test: Shop owner can access `/admin`
- [ ] Test: Shop owner can add a product

### 2. Products Added
- [ ] All casual shirts added
- [ ] All formal shirts added
- [ ] All vesthi shirts added (if any)
- [ ] All group shirts added (if any)
- [ ] Test: Products appear on respective pages
- [ ] Test: Product images load correctly

### 3. Environment Variables
- [ ] `.env.local` has all Firebase keys
- [ ] Razorpay keys added (test mode for now)
- [ ] All keys are valid and working

### 4. Test Core Features
- [ ] User can register/login
- [ ] User can browse products
- [ ] User can add to cart
- [ ] User can add to wishlist
- [ ] Cart persists after login
- [ ] Checkout page works
- [ ] Payment test page works

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to https://vercel.com
2. Click **New Project**
3. Import from GitHub: `jenars666/startpark`
4. Click **Deploy**

### Step 3: Add Environment Variables to Vercel

In Vercel Dashboard → Project → Settings → Environment Variables:

Add all variables from `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

### Step 4: Redeploy

After adding environment variables:
```bash
vercel --prod
```

Or in Vercel Dashboard → Deployments → Redeploy

---

## ✅ Post-Deployment Checks

### 1. Website Loads
- [ ] Visit your production URL
- [ ] Homepage loads correctly
- [ ] All images load
- [ ] Navigation works

### 2. Products Display
- [ ] `/casual-shirt` shows products
- [ ] `/formal-shirt` shows products
- [ ] Product images load from Firebase Storage
- [ ] Product details are correct

### 3. User Features
- [ ] User can register
- [ ] User can login with Google
- [ ] User can add to cart
- [ ] Cart icon shows count
- [ ] Wishlist works

### 4. Admin Panel
- [ ] Shop owner can login
- [ ] Can access `/admin`
- [ ] Can add new products
- [ ] New products appear instantly on website

### 5. Payment (Test Mode)
- [ ] Checkout page loads
- [ ] Razorpay popup opens
- [ ] Test payment works (use test card: 4111 1111 1111 1111)
- [ ] Order confirmation page shows

---

## 🔧 Common Deployment Issues

### Issue: "Firebase not initialized"

**Solution:**
- Check environment variables in Vercel
- Make sure all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Redeploy after adding variables

### Issue: Images not loading

**Solution:**
- Check Firebase Storage rules are published
- Verify images are in Firebase Storage (not local)
- Check browser console for CORS errors

### Issue: Admin can't add products

**Solution:**
- Verify user has `role: "admin"` in Firestore
- Check Firebase Storage rules allow admin writes
- Check browser console for errors

### Issue: Payment not working

**Solution:**
- Verify Razorpay keys in Vercel environment variables
- Check if using test keys (rzp_test_...)
- Test with Razorpay test card: 4111 1111 1111 1111

---

## 🎯 Production Readiness

### Before Going Live

- [ ] All products added and verified
- [ ] Test complete user journey (browse → cart → checkout → payment)
- [ ] Admin can add/edit products
- [ ] Mobile responsive (test on phone)
- [ ] All links work
- [ ] Contact page works
- [ ] Footer links work

### Switch to Live Razorpay

When ready for real payments:

1. Get live Razorpay keys from dashboard
2. Update in Vercel environment variables:
   ```
   RAZORPAY_KEY_ID=rzp_live_...
   RAZORPAY_KEY_SECRET=...
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
   ```
3. Redeploy

---

## 📊 Monitoring

### After Launch

**Check Daily:**
- [ ] Website is up and running
- [ ] Products load correctly
- [ ] No errors in Vercel logs
- [ ] Firebase usage within free tier

**Check Weekly:**
- [ ] Firebase Storage usage
- [ ] Firestore read/write counts
- [ ] Vercel bandwidth usage

---

## 🆘 Emergency Contacts

**Vercel Issues:**
- Dashboard: https://vercel.com/dashboard
- Support: https://vercel.com/support

**Firebase Issues:**
- Console: https://console.firebase.google.com
- Support: https://firebase.google.com/support

**Razorpay Issues:**
- Dashboard: https://dashboard.razorpay.com
- Support: support@razorpay.com

---

## ✅ Deployment Complete!

Your website is now live at: `https://your-domain.vercel.app`

**Next Steps:**
1. Share link with shop owner
2. Monitor for any issues
3. Collect customer feedback
4. Plan future features

**Congratulations! 🎉**
