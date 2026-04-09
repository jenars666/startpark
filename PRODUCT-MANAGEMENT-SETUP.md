# Product Management Setup Guide

## Overview

Your e-commerce platform uses **Firebase Storage** for product images and **Firestore** for product data. This allows the admin to add products through the admin panel without code deployment.

---

## Quick Start (For Existing Products)

### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `serviceAccountKey.json` in your project root
6. **IMPORTANT**: Add to `.gitignore` immediately

```bash
echo "serviceAccountKey.json" >> .gitignore
```

### Step 2: Install Dependencies

```bash
npm install firebase-admin
npm install -D ts-node
```

### Step 3: Update Upload Script

Edit `scripts/uploadProducts.ts` and add all your products to the `products` array:

```typescript
const products = [
  {
    id: 'casual-001',
    name: 'Premium Cotton Casual Shirt',
    description: 'Comfortable casual shirt',
    price: 1299,
    originalPrice: 1999,
    category: 'Casual Shirt',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    badge: 'Bestseller',
    inStock: true,
    imagePath: './public/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.21 PM.jpeg',
  },
  // Add all your products...
];
```

### Step 4: Run Upload Script

```bash
npx ts-node scripts/uploadProducts.ts
```

This will:
- Upload all images to Firebase Storage
- Save product data to Firestore
- Make images publicly accessible
- Display progress for each product

### Step 5: Verify

Visit your website:
- `http://localhost:3000/casual-shirt` - Should show products
- `http://localhost:3000/formal-shirt` - Should show products

---

## Admin Panel Usage (For Future Products)

### Adding New Products

1. **Login to Admin Panel**
   - Visit: `http://localhost:3000/admin`
   - Click **Products** tab
   - Click **Add Product** button

2. **Upload Images**
   - Click main image area to upload primary product photo
   - Optionally add hover image (shows on card hover)
   - Supports JPG, PNG, WebP

3. **Fill Product Details**
   - Product Name (required)
   - Description
   - Sale Price (required)
   - Original Price (for strikethrough)
   - Category (Casual/Formal/Vesthi/Group)
   - Badge (Bestseller/New/Sale/etc)
   - Color
   - Available Sizes (click to select)
   - Stock Quantity
   - In Stock toggle

4. **Save**
   - Click **Add Product to Store**
   - Images upload to Firebase Storage
   - Product appears live immediately

---

## Firebase Storage Rules

Update your `storage.rules` in Firebase Console:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn()
        && firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /products/{productId}/{fileName} {
      allow read: if true;
      allow write: if isAdmin() && (
        request.resource == null || (
          request.resource.size < 5 * 1024 * 1024
          && request.resource.contentType.matches('image/.*')
        )
      );
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

Rules are now committed in `storage.rules` and wired in `firebase.json` for CLI deploys.

---

## How It Works

```
ADMIN ADDS PRODUCT:
1. Admin uploads image in admin panel
2. Image → Firebase Storage (gets public URL)
3. Product data + image URL → Firestore
4. Website reads from Firestore
5. Product appears live instantly ✅

WEBSITE DISPLAYS PRODUCTS:
1. Page loads → queries Firestore by category
2. Gets product data with Firebase Storage URLs
3. Displays products with images
4. No code deployment needed ✅
```

---

## File Structure

```
star/
├── scripts/
│   └── uploadProducts.ts          # One-time upload script
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── products/
│   │   │       └── add/
│   │   │           └── page.tsx   # Add product page
│   │   ├── casual-shirt/
│   │   │   └── page.tsx           # Reads from Firestore
│   │   └── formal-shirt/
│   │       └── page.tsx           # Reads from Firestore
│   └── lib/
│       └── firebase/
│           ├── adminProductService.ts  # Upload & CRUD
│           └── productService.ts       # Read products
└── serviceAccountKey.json         # Firebase admin key (gitignored)
```

---

## Troubleshooting

### Products not showing on website?
- Check Firestore console - are products there?
- Check browser console for errors
- Verify Firebase config in `.env.local`

### Upload script fails?
- Check `serviceAccountKey.json` exists
- Verify storage bucket name in script
- Check image paths are correct

### Admin can't upload images?
- Check Firebase Storage rules
- Verify user is authenticated
- Check browser console for errors

---

## Next Steps

1. Run upload script to add existing products
2. Delete `public/images/` folder (images now in Firebase)
3. Train admin on using admin panel
4. Set up Firebase Storage backup

---

**Need Help?** Check Firebase Console → Storage and Firestore tabs to verify data.
