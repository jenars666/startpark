# 💳 Payment Gateway - Quick Reference

## ⚡ 5-Minute Setup

### 1. Get Razorpay Account (2 min)
```
→ Visit: https://razorpay.com/
→ Click "Sign Up" (Free)
→ Verify email & phone
```

### 2. Get API Keys (1 min)
```
→ Login to dashboard
→ Settings → API Keys
→ Generate Test Key
→ Copy Key ID & Secret
```

### 3. Add to Project (1 min)
```env
# Edit: e:\star\.env.local
RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_HERE"
RAZORPAY_KEY_SECRET="YOUR_SECRET_HERE"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_HERE"
```

### 4. Test (1 min)
```bash
npm run dev
# Visit: http://localhost:3000/payment-test
# Use card: 4111 1111 1111 1111
```

---

## 🧪 Test Cards

| Purpose | Card Number | Result |
|---------|-------------|--------|
| Success | 4111 1111 1111 1111 | ✅ Payment succeeds |
| Failure | 4000 0000 0000 0002 | ❌ Payment fails |
| UPI | success@razorpay | ✅ UPI success |

**CVV:** Any 3 digits  
**Expiry:** Any future date

---

## 📍 Important URLs

| Purpose | URL |
|---------|-----|
| Test Page | http://localhost:3000/payment-test |
| Razorpay Dashboard | https://dashboard.razorpay.com/ |
| API Keys | https://dashboard.razorpay.com/app/keys |
| Documentation | https://razorpay.com/docs/ |

---

## 🔍 How It Works

```
User clicks "Checkout"
    ↓
Create Order API (/api/payments/razorpay/order)
    ↓
Razorpay Modal Opens
    ↓
User Pays
    ↓
Verify Payment API (/api/payments/razorpay/verify)
    ↓
Cart Cleared ✅
```

---

## ✅ What's Already Done

- ✅ API routes created
- ✅ Frontend integration complete
- ✅ Cart checkout flow ready
- ✅ Payment verification implemented
- ✅ Error handling added
- ✅ Test page created

**You only need to add API keys!**

---

## 💰 Pricing

- **Setup Fee:** ₹0
- **Annual Fee:** ₹0
- **Transaction Fee:**
  - Cards: 2%
  - UPI: Free (up to limit)
  - Net Banking: 2%
  - Wallets: 2%

---

## 🚨 Troubleshooting

### "Razorpay is not configured"
→ Add keys to `.env.local` and restart server

### Modal doesn't open
→ Check browser console for errors
→ Verify keys are correct

### Payment verification failed
→ Ensure `RAZORPAY_KEY_SECRET` matches Key ID

---

## 📞 Support

**Razorpay:**
- Email: support@razorpay.com
- Phone: +91-80-6890-6890

**Documentation:**
- Full Guide: [PAYMENT-GATEWAY-SETUP.md](./PAYMENT-GATEWAY-SETUP.md)
- Setup: [SETUP.md](./SETUP.md)

---

## 🎯 Next Steps

1. ✅ Get Razorpay account
2. ✅ Add API keys
3. ✅ Test with test cards
4. ✅ Go live when ready

**Your payment gateway is ready! 🚀**
