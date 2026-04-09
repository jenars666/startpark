# ✅ Enable UPI in Razorpay TEST MODE

## Yes, UPI Works in Test Mode!

You can absolutely test UPI payments in test mode. Here's how:

---

## 🎯 Enable UPI in Test Mode (3 Steps)

### Step 1: Login to Razorpay Dashboard (Test Mode)

```
1. Visit: https://dashboard.razorpay.com/
2. Login with your account
3. Make sure you're in TEST MODE (check top-right corner)
   Should show: "Test Mode" toggle ON
```

### Step 2: Enable UPI Payment Method

```
1. Click on "Settings" (gear icon) in left sidebar
2. Go to "Configuration" → "Payment Methods"
3. Scroll down to find "UPI"
4. Toggle it ON (Enable)
5. Click "Save Changes"
```

**Screenshot Guide:**
```
Dashboard → Settings → Configuration → Payment Methods
↓
Find: UPI
Status: [Toggle to ON]
↓
Save Changes
```

### Step 3: Restart Your Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## 🧪 Test UPI After Enabling

### Test UPI IDs (Razorpay Test Mode):

```
✅ Success: success@razorpay
❌ Failure: failure@razorpay
```

### Test Steps:

```
1. Visit: http://localhost:3000/payment-test
2. Click "Test Payment (₹100)"
3. Razorpay modal opens
4. Look for "UPI" tab (should be visible now)
5. Click "UPI" tab
6. Enter: success@razorpay
7. Click "Pay"
8. Payment succeeds! ✅
```

---

## 📱 What You'll See After Enabling

### Current (Without UPI):
```
Payment Options:
- Cards
- Netbanking
- Wallet
- Pay Later
```

### After Enabling UPI:
```
Payment Options:
- UPI ← NEW!
  - Enter UPI ID
  - Select UPI App
  - Scan QR Code
- Cards
- Netbanking
- Wallet
- Pay Later
```

---

## 🔍 If UPI Tab Still Not Showing

### Option 1: Check Payment Method Settings

```
Dashboard → Settings → Payment Methods → UPI
Ensure:
✅ UPI is Enabled
✅ Test Mode is ON
✅ Changes are Saved
```

### Option 2: Clear Browser Cache

```
1. Close Razorpay modal
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart server: npm run dev
4. Try payment again
```

### Option 3: Check Account Activation

```
Dashboard → Account
Status should be: "Activated" or "Test Mode Active"
```

### Option 4: Try Different Browser

```
Sometimes cache issues prevent UPI from showing
Try: Chrome Incognito or Firefox Private Window
```

---

## 💡 Alternative: Click on "Wallet" Tab

**UPI might already be there!**

In your screenshot, I see "Wallet" option. Click on it:

```
1. In Razorpay modal, click "Wallet" tab
2. Look for UPI options inside:
   - Paytm
   - PhonePe  
   - Google Pay
   - Enter UPI ID
```

UPI apps are sometimes grouped under "Wallet" section!

---

## 🎯 Quick Test Right Now

### Without Enabling (Check Wallet Tab):

```
1. Keep your current payment modal open
2. Click on "Wallet" tab
3. Look for:
   - "Enter UPI ID" field
   - UPI app icons (GPay, PhonePe, Paytm)
4. If you see these, UPI is already available!
```

### Test UPI in Wallet Tab:

```
1. Click "Wallet" tab
2. Look for "Enter UPI ID" or "UPI" option
3. Enter: success@razorpay
4. Click Pay
5. Should work! ✅
```

---

## 📞 If Still Not Working

### Contact Razorpay Support:

**Email:** support@razorpay.com  
**Phone:** +91-80-6890-6890  
**Chat:** Available in dashboard (bottom-right)

**Message Template:**
```
Subject: Enable UPI in Test Mode

Hi Razorpay Team,

I'm using test mode with Key ID: rzp_test_SXnZq3LHuJIzHM

I need to enable UPI payment method for testing.
Currently, I only see Cards, Netbanking, Wallet, and Pay Later.

Please enable UPI for my test account.

Thank you!
```

---

## ✅ Verification Checklist

After enabling UPI, verify:

- [ ] Login to Razorpay Dashboard
- [ ] Confirm in TEST MODE (top-right toggle)
- [ ] Go to Settings → Payment Methods
- [ ] Find "UPI" in the list
- [ ] Toggle is ON (enabled)
- [ ] Click "Save Changes"
- [ ] Restart server: `npm run dev`
- [ ] Test payment: http://localhost:3000/payment-test
- [ ] Look for "UPI" tab in modal
- [ ] Or check "Wallet" tab for UPI options
- [ ] Test with: `success@razorpay`

---

## 🎨 Expected UPI Options in Test Mode

### In UPI Tab:
```
✅ Enter UPI ID
✅ Select UPI App (GPay, PhonePe, Paytm)
✅ QR Code (scan with any UPI app)
```

### Test UPI IDs:
```
success@razorpay → ✅ Payment succeeds
failure@razorpay → ❌ Payment fails
```

---

## 💰 Test Mode vs Live Mode

### Test Mode (Current):
- ✅ Free to test
- ✅ No real money
- ✅ Use test UPI IDs
- ✅ All features available
- ✅ No KYC required

### Live Mode (Production):
- 💰 Real money transactions
- 📋 KYC required
- 🔑 Live API keys needed
- ✅ Real UPI IDs work

---

## 🚀 Quick Actions

### Action 1: Check Wallet Tab NOW
```
In your current modal:
Click "Wallet" → Look for UPI options
```

### Action 2: Enable in Dashboard
```
Dashboard → Settings → Payment Methods → UPI → Enable
```

### Action 3: Test
```
Restart server → Test payment → Use success@razorpay
```

---

## 📸 What to Look For

### In Dashboard:
```
Settings → Payment Methods
↓
UPI Row:
[UPI] [Toggle: ON] [Save]
      ↑ Should be green/enabled
```

### In Payment Modal:
```
Tabs: [UPI] [Cards] [Netbanking] [Wallet]
       ↑ Should be visible
```

### In Wallet Tab:
```
Options:
- Paytm
- PhonePe
- Google Pay
- Enter UPI ID ← Look for this
```

---

## ✨ Summary

**Current Status:** Test mode, UPI not visible  
**Solution 1:** Enable UPI in dashboard  
**Solution 2:** Check "Wallet" tab (UPI might be there)  
**Test UPI ID:** `success@razorpay`  
**Time Needed:** 3 minutes  

---

**🎯 DO THIS NOW:**

1. **Quick Check:** Click "Wallet" tab in your current modal
2. **If no UPI:** Enable in Dashboard → Settings → Payment Methods
3. **Restart:** `npm run dev`
4. **Test:** Use `success@razorpay`

**UPI will work in test mode! 🎉**
