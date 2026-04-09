# Razorpay Payment Gateway Setup Guide

## Overview
Your Star Mens Park e-commerce platform is integrated with Razorpay for secure payment processing. The integration is **already complete** - you just need to add your API keys.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Razorpay Account
1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Click "Sign Up" (Free account)
3. Complete registration with business details
4. Verify email and phone number

### Step 2: Get API Keys

#### For Testing (Test Mode):
1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Key**
4. Copy both:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (keep this secret!)

#### For Production (Live Mode):
1. Complete KYC verification in dashboard
2. Submit business documents
3. Once approved, generate **Live Keys**
4. Copy both:
   - **Key ID** (starts with `rzp_live_`)
   - **Key Secret**

### Step 3: Add Keys to Project

Open `e:\star\.env.local` and replace placeholders:

```env
# Replace these with your actual Razorpay keys
RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_ID_HERE"
RAZORPAY_KEY_SECRET="YOUR_SECRET_KEY_HERE"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_ID_HERE"
```

**Important:** 
- Use **Test keys** for development
- Use **Live keys** only in production
- Never commit `.env.local` to Git

### Step 4: Test Payment Flow

```bash
# Restart development server
npm run dev
```

1. Add items to cart
2. Click "Proceed to Checkout"
3. Razorpay modal will open
4. Use test card details:

**Test Card Numbers:**
```
Card Number: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

**Test UPI:**
```
UPI ID: success@razorpay
```

**Test Netbanking:**
- Select any bank
- Use credentials provided on test page

---

## 🏗️ What's Already Implemented

### ✅ Backend API Routes

#### 1. Create Order (`/api/payments/razorpay/order/route.ts`)
- Creates Razorpay order
- Calculates total amount
- Handles cart items
- Returns order ID for checkout

#### 2. Verify Payment (`/api/payments/razorpay/verify/route.ts`)
- Verifies payment signature
- Prevents payment tampering
- Confirms successful payment

### ✅ Frontend Integration

#### Cart Sidebar (`src/components/CartSidebar.tsx`)
- "Proceed to Checkout" button
- Loads Razorpay script dynamically
- Opens Razorpay payment modal
- Handles success/failure
- Clears cart on success
- Shows user feedback with toasts

#### Payment Client (`src/lib/razorpay-client.ts`)
- TypeScript types for Razorpay
- Script loader utility
- Handles Razorpay SDK

---

## 💳 Payment Flow

```
User clicks "Proceed to Checkout"
         ↓
Frontend calls /api/payments/razorpay/order
         ↓
Backend creates Razorpay order
         ↓
Razorpay modal opens
         ↓
User completes payment
         ↓
Frontend calls /api/payments/razorpay/verify
         ↓
Backend verifies signature
         ↓
Cart cleared, order confirmed
```

---

## 🧪 Testing Scenarios

### Test Successful Payment
```
Card: 4111 1111 1111 1111
Result: Payment succeeds
```

### Test Failed Payment
```
Card: 4000 0000 0000 0002
Result: Payment fails
```

### Test Insufficient Funds
```
Card: 4000 0000 0000 9995
Result: Insufficient funds error
```

---

## 🔒 Security Features

✅ **Server-side signature verification**
- Prevents payment tampering
- Uses HMAC SHA256

✅ **Environment variables**
- Keys stored securely
- Not exposed to client

✅ **HTTPS required in production**
- Razorpay enforces SSL

✅ **Amount validation**
- Server validates cart total
- Prevents price manipulation

---

## 🌐 Supported Payment Methods

Your integration supports:
- 💳 **Credit/Debit Cards** (Visa, Mastercard, RuPay, Amex)
- 🏦 **Net Banking** (All major Indian banks)
- 📱 **UPI** (Google Pay, PhonePe, Paytm, etc.)
- 💰 **Wallets** (Paytm, Mobikwik, Freecharge, etc.)
- 💵 **EMI** (Credit card EMI)
- 🏪 **Cardless EMI** (ZestMoney, etc.)

---

## 📊 Razorpay Dashboard Features

After setup, you can:
- View all transactions
- Track payment status
- Issue refunds
- Download reports
- Set up webhooks
- Configure payment methods
- View analytics

---

## 🚨 Common Issues & Solutions

### Issue: "Razorpay is not configured"
**Solution:** Add API keys to `.env.local` and restart server

### Issue: Payment modal doesn't open
**Solution:** Check browser console for errors, ensure keys are correct

### Issue: "Payment verification failed"
**Solution:** Ensure `RAZORPAY_KEY_SECRET` matches the Key ID

### Issue: Test mode payments not working
**Solution:** Use test card numbers from Razorpay docs

---

## 🔄 Webhooks (Optional - Advanced)

For production, set up webhooks to handle:
- Payment success notifications
- Payment failures
- Refunds
- Disputes

### Setup Webhooks:
1. Go to Razorpay Dashboard → **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/payments/razorpay/webhook`
3. Select events to track
4. Save webhook secret

---

## 💰 Pricing

**Razorpay Charges:**
- Domestic Cards: 2% per transaction
- International Cards: 3% per transaction
- UPI: 0% (Free until certain limit)
- Net Banking: 2% per transaction
- Wallets: 2% per transaction

**No setup fees, no annual fees**

---

## 📱 Mobile Support

The integration is fully mobile-responsive:
- Works on all devices
- Native UPI apps integration
- Mobile wallets support
- Touch-optimized UI

---

## 🎯 Going Live Checklist

Before switching to live mode:

- [ ] Complete KYC verification
- [ ] Submit business documents
- [ ] Get live API keys approved
- [ ] Replace test keys with live keys
- [ ] Test with small real transaction
- [ ] Set up webhooks
- [ ] Configure settlement account
- [ ] Enable required payment methods
- [ ] Test on mobile devices
- [ ] Set up refund policy

---

## 📞 Support

**Razorpay Support:**
- Email: support@razorpay.com
- Phone: +91-80-6890-6890
- Docs: https://razorpay.com/docs/

**Integration Issues:**
- Check `SETUP.md` for environment setup
- Review API route logs in terminal
- Check browser console for errors

---

## 🔗 Useful Links

- [Razorpay Dashboard](https://dashboard.razorpay.com/)
- [API Documentation](https://razorpay.com/docs/api/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Webhooks Guide](https://razorpay.com/docs/webhooks/)
- [Settlement Guide](https://razorpay.com/docs/settlements/)

---

## ✨ Next Steps

1. **Get Razorpay account** (5 min)
2. **Add API keys** to `.env.local` (1 min)
3. **Test payment** with test cards (2 min)
4. **Go live** when ready

**Your payment gateway is ready to use!** 🚀
