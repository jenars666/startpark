# 🔧 Enable UPI in Razorpay Payment Modal

## Current Status

Your Razorpay integration is working, but UPI might not be visible as a separate option. Here's how to fix it:

---

## ✅ Quick Fix: Enable UPI in Razorpay Dashboard

### Step 1: Login to Razorpay Dashboard
```
Visit: https://dashboard.razorpay.com/
Login with your account
```

### Step 2: Enable UPI Payment Method
```
1. Go to Settings → Configuration → Payment Methods
2. Find "UPI" in the list
3. Toggle it ON (enable)
4. Click "Save"
```

### Step 3: Configure UPI Options
```
1. In Payment Methods, click "UPI"
2. Enable these options:
   ✅ UPI Intent (for apps like GPay, PhonePe)
   ✅ UPI Collect (for UPI ID)
   ✅ UPI QR (for QR code)
3. Save changes
```

### Step 4: Test Again
```bash
# Restart your server
npm run dev

# Test payment
Visit: http://localhost:3000/payment-test
```

---

## 🎯 Where is UPI in Razorpay Modal?

Looking at your screenshot, UPI should appear as:

**Option 1: Separate "UPI" Tab**
```
Cards | UPI | Netbanking | Wallet | Pay Later
```

**Option 2: Under "Wallet" Tab**
```
Wallet section includes:
- Paytm
- PhonePe
- Google Pay (UPI)
- Other UPI apps
```

---

## 🔧 Force UPI to Show First

Update your CartSidebar.tsx to prioritize UPI:

```typescript
const checkout = new window.Razorpay({
  key: orderPayload.keyId,
  amount: orderPayload.order.amount,
  currency: orderPayload.order.currency,
  name: 'Star Mens Park',
  description: `Cart checkout for ${totalItems} item${totalItems > 1 ? 's' : ''}`,
  order_id: orderPayload.order.id,
  
  // ADD THIS: Specify preferred payment methods
  config: {
    display: {
      blocks: {
        upi: {
          name: 'Pay using UPI',
          instruments: [
            {
              method: 'upi'
            }
          ]
        },
        card: {
          name: 'Cards',
          instruments: [
            {
              method: 'card'
            }
          ]
        },
        netbanking: {
          name: 'Netbanking',
          instruments: [
            {
              method: 'netbanking'
            }
          ]
        }
      },
      sequence: ['upi', 'card', 'netbanking'], // UPI shows first
      preferences: {
        show_default_blocks: true
      }
    }
  },
  
  handler: async (paymentResponse) => {
    // ... rest of your code
  }
});
```

---

## 📱 Alternative: Add Custom UPI Button

If you want a dedicated UPI button before Razorpay modal, update CartSidebar:

```typescript
// Add this before the main checkout button
<button
  className="upi-quick-btn"
  onClick={() => handleCheckout('upi')}
  style={{
    width: '100%',
    padding: '1rem',
    background: '#5f259f',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  }}
>
  📱 Pay with UPI (GPay, PhonePe, Paytm)
</button>
```

---

## 🧪 Test UPI Payment

### In Razorpay Modal:

1. **Look for UPI tab** (should be visible after enabling)
2. **Or check Wallet tab** (UPI apps listed there)
3. **Enter test UPI ID:** `success@razorpay`
4. **Or select UPI app** from the list

### Test UPI IDs:
```
Success: success@razorpay
Failure: failure@razorpay
```

---

## 🔍 Why UPI Might Not Show

### Reason 1: Not Enabled in Dashboard
**Fix:** Enable in Razorpay Settings → Payment Methods

### Reason 2: Test Mode Restrictions
**Fix:** Some features only work in live mode. Check dashboard.

### Reason 3: Account Not Activated
**Fix:** Complete KYC verification in Razorpay

### Reason 4: Wrong Configuration
**Fix:** Check payment method settings in dashboard

---

## ✅ Verify UPI is Enabled

### Check in Razorpay Dashboard:

```
1. Login to dashboard
2. Settings → Payment Methods
3. Look for "UPI" row
4. Status should be: ✅ Enabled
5. If disabled, click toggle to enable
```

### Check in Test Payment:

```
1. Visit: http://localhost:3000/payment-test
2. Click "Test Payment"
3. Razorpay modal opens
4. Look for "UPI" tab or option
5. Should see UPI apps listed
```

---

## 📞 If UPI Still Not Showing

### Contact Razorpay Support:

**Email:** support@razorpay.com  
**Phone:** +91-80-6890-6890  
**Message:** "I need to enable UPI payment method for my account"

### Provide:
- Your Razorpay account email
- Merchant ID
- Issue: "UPI not showing in payment modal"

---

## 🎯 Quick Actions

1. **Enable UPI in Dashboard** (2 minutes)
   - Settings → Payment Methods → UPI → Enable

2. **Restart Server** (30 seconds)
   ```bash
   npm run dev
   ```

3. **Test Payment** (1 minute)
   - Visit payment-test page
   - Look for UPI option

4. **If not visible, contact Razorpay** (5 minutes)
   - They'll enable it for your account

---

## 💡 Pro Tip

UPI is the most popular payment method in India. Make sure it's:
- ✅ Enabled in dashboard
- ✅ Shows first in payment modal
- ✅ Clearly visible to customers
- ✅ Works on mobile devices

---

**Next Steps:**
1. Login to Razorpay Dashboard
2. Enable UPI in Payment Methods
3. Test again
4. UPI should now be visible! 🎉
