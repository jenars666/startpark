# Star Mens Park - Shop Owner Setup Guide

## 🎯 Quick Start (5 Minutes)

### Step 1: Register Your Account

1. Open the website: `http://localhost:3000`
2. Click **Register** (top right)
3. Sign up with Google or Email
4. Remember your email address

### Step 2: Get Admin Access

**Tell the developer your email address.** They will run:
```bash
npx ts-node scripts/makeAdmin.ts your-email@gmail.com
```

You'll see: `✅ Successfully made your-email@gmail.com an admin!`

### Step 3: Access Admin Panel

1. Refresh the website
2. Click your profile icon → **Admin Dashboard**
3. You'll see the admin panel

---

## 📦 Adding Products (Easy!)

### Go to Add Product Page

1. In admin panel, click **Products** tab
2. Click **Add Product** button
3. You'll see the product form

### Fill Product Details

**Main Image** (Required)
- Click the upload box
- Select product image (JPG/PNG, max 5MB)
- Image uploads automatically

**Hover Image** (Optional)
- Add a second angle/view
- Shows when customer hovers over product

**Product Name** (Required)
- Example: "Premium Cotton Casual Shirt"

**Description**
- Key features and details
- Example: "Comfortable casual shirt perfect for everyday wear"

**Prices**
- **Sale Price**: Current selling price (₹999)
- **Original Price**: Strikethrough price (₹1499)

**Category** (Required)
- Casual Shirt
- Formal Shirt
- Vesthi Shirt
- Group Shirt

**Badge** (Optional)
- Bestseller
- New
- Sale
- Premium
- Limited

**Color**
- Select main color

**Sizes** (Required)
- Click sizes to select: S, M, L, XL, 2XL, 3XL, 4XL, 5XL
- Selected sizes turn blue

**Stock Quantity**
- Default: 100 units
- Change as needed

**In Stock Toggle**
- Keep ON to show product on website
- Turn OFF to hide product

### Save Product

Click **Add Product to Store** button

You'll see:
- Upload progress (if images are large)
- Success message
- Product appears on website instantly!

---

## 🎨 Product Image Tips

### Best Practices

✅ **Good Images:**
- Clear, well-lit photos
- White or plain background
- Product centered
- High resolution (at least 800x1000px)
- File size under 5MB

❌ **Avoid:**
- Blurry photos
- Dark/shadowy images
- Cluttered backgrounds
- Very small images
- Files over 5MB

### Image Sizes

- **Recommended**: 1200x1600px (3:4 ratio)
- **Minimum**: 800x1000px
- **Maximum file size**: 5MB

---

## 📋 Adding Multiple Products

### Workflow

1. Prepare all product images in a folder
2. Name them clearly (e.g., "casual-shirt-1.jpg")
3. Open admin panel
4. Add products one by one:
   - Upload image
   - Fill details
   - Click save
   - Repeat

### Time Estimate

- **Per product**: 2-3 minutes
- **10 products**: 20-30 minutes
- **50 products**: 2-3 hours

### Tips for Speed

- Keep product details in a spreadsheet
- Copy-paste descriptions
- Use similar prices for same category
- Select all sizes at once

---

## ✅ Checking Your Products

### View on Website

**Casual Shirts:**
- Go to: `http://localhost:3000/casual-shirt`
- Your products appear instantly

**Formal Shirts:**
- Go to: `http://localhost:3000/formal-shirt`

**All Products:**
- Admin panel → Products tab
- See complete list

---

## 🔧 Common Issues

### "Permission Denied" Error

**Problem**: You're not set as admin yet

**Solution**: 
1. Tell developer your email
2. They run: `npx ts-node scripts/makeAdmin.ts your-email@gmail.com`
3. Refresh page

### Image Upload Fails

**Problem**: Image too large or wrong format

**Solution**:
- Check file size (must be under 5MB)
- Use JPG or PNG format
- Compress image if needed

### Product Not Showing

**Problem**: Wrong category or "In Stock" is OFF

**Solution**:
- Check category matches page (Casual Shirt → casual-shirt page)
- Make sure "In Stock" toggle is ON

---

## 📞 Need Help?

Contact your developer with:
- Screenshot of the issue
- Product name you're trying to add
- Error message (if any)

---

## 🎉 You're Ready!

Once you've added all products:
1. Tell your developer
2. They'll deploy to production
3. Your website goes live!

**Good luck! 🚀**
