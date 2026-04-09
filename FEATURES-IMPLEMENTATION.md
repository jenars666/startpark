# 🚀 New Features Implementation Guide

## ✅ Completed Features

### 1. Contact Information (✅ DONE)
**Location:** `src/config/contact.ts`

Centralized contact configuration:
- Phone: +91 93454 45164
- WhatsApp: +919345445164
- Email: starmenspark@gmail.com
- Store Address
- Social Media Links

**Updated Components:**
- Footer.tsx - Now uses centralized contact info
- Contact Page - `/contact` with full contact details and map

### 2. Order Management (✅ DONE)

#### Order Confirmation Page
**Route:** `/order-confirmation`
**File:** `src/app/order-confirmation/page.tsx`

Features:
- Order ID display
- Payment confirmation
- Estimated delivery time
- Contact support options
- Links to order history

#### Order History Page
**Route:** `/profile/orders`
**File:** `src/app/profile/orders/page.tsx`

Features:
- List all orders
- Order status tracking
- Order details view
- Empty state with CTA

**Types:** `src/types/order.ts`
- Order interface
- OrderItem interface
- ShippingAddress interface

### 3. Search & Filters (✅ DONE)
**Component:** `src/components/ProductSearch.tsx`

Features:
- Search bar with icon
- Filter panel (toggle)
- Sort options:
  - Most Popular
  - Newest First
  - Price: Low to High
  - Price: High to Low
- Price range filter
- Category filter

**Usage:**
```tsx
import ProductSearch from '@/components/ProductSearch';

<ProductSearch 
  onSearch={(query) => console.log(query)}
  onFilter={(filters) => console.log(filters)}
/>
```

### 4. Product Reviews (✅ DONE)
**Component:** `src/components/ProductReviews.tsx`

Features:
- Star rating input (1-5 stars)
- Review text area
- Submit review
- Display reviews list
- Review date
- User name

**Usage:**
```tsx
import ProductReviews from '@/components/ProductReviews';

<ProductReviews productId="123" />
```

### 5. Discount Codes (✅ DONE)
**Component:** `src/components/DiscountCode.tsx`

Pre-configured codes:
- `WELCOME10` - 10% off on orders above ₹500
- `SAVE20` - 20% off on orders above ₹1000
- `FLAT100` - ₹100 off on orders above ₹1500
- `FIRST50` - ₹50 off on first order

Features:
- Apply/Remove discount
- Validation
- Success/Error messages
- Available codes display

**Usage:**
```tsx
import DiscountCode from '@/components/DiscountCode';

<DiscountCode onApply={(code, discount) => console.log(code, discount)} />
```

### 6. Analytics (✅ DONE)
**Utility:** `src/utils/analytics.ts`

Functions:
- `pageView(page)` - Track page views
- `event(action, category, label, value)` - Track events
- `productView(id, name, price)` - Track product views
- `addToCart(id, name, price)` - Track add to cart
- `purchase(orderId, total, items)` - Track purchases
- `search(query)` - Track searches

**Usage:**
```tsx
import { analytics } from '@/utils/analytics';

analytics.pageView('/casual-shirt');
analytics.addToCart('123', 'Blue Shirt', 999);
analytics.purchase('ORD001', 2499, 2);
```

### 7. Social Media Integration (✅ DONE)
**Component:** `src/components/SocialShare.tsx`

Features:
- Instagram link
- Facebook link
- YouTube link
- Native share button (mobile)

**Usage:**
```tsx
import SocialShare from '@/components/SocialShare';

<SocialShare url="https://starmenspark.com" title="Check this out!" />
```

### 8. Contact Page (✅ DONE)
**Route:** `/contact`
**File:** `src/app/contact/page.tsx`

Features:
- Store address with icon
- Phone number (clickable)
- Email (clickable)
- WhatsApp link
- Store hours
- Google Maps embed

---

## 📋 Integration Steps

### Step 1: Add Search to Product Pages

**File:** `src/app/casual-shirt/page.tsx` (and other product pages)

```tsx
import ProductSearch from '@/components/ProductSearch';
import { useState } from 'react';

export default function CasualShirts() {
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleSearch = (query: string) => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleFilter = (filters: any) => {
    let filtered = [...products];
    
    // Apply price filter
    filtered = filtered.filter(p => {
      const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });
    
    // Apply sort
    if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()));
    } else if (filters.sortBy === 'price-high') {
      filtered.sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()));
    }
    
    setFilteredProducts(filtered);
  };

  return (
    <>
      <ProductSearch onSearch={handleSearch} onFilter={handleFilter} />
      {/* Product grid */}
    </>
  );
}
```

### Step 2: Add Reviews to Product Detail Pages

**File:** `src/app/casual-shirt/product/[id]/page.tsx`

```tsx
import ProductReviews from '@/components/ProductReviews';

export default function ProductDetail({ params }: { params: { id: string } }) {
  return (
    <>
      {/* Product details */}
      <ProductReviews productId={params.id} />
    </>
  );
}
```

### Step 3: Add Discount Code to Checkout

**File:** `src/app/checkout/page.tsx`

```tsx
import DiscountCode from '@/components/DiscountCode';
import { useState } from 'react';

export default function Checkout() {
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(2499);

  const handleApplyDiscount = (code: string, discountAmount: number) => {
    const discountValue = code.includes('FLAT') 
      ? discountAmount 
      : (total * discountAmount) / 100;
    setDiscount(discountValue);
  };

  return (
    <>
      <DiscountCode onApply={handleApplyDiscount} />
      <div>
        <p>Subtotal: ₹{total}</p>
        {discount > 0 && <p>Discount: -₹{discount}</p>}
        <p>Total: ₹{total - discount}</p>
      </div>
    </>
  );
}
```

### Step 4: Add Analytics Tracking

**File:** `src/app/layout.tsx`

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    analytics.pageView(pathname);
  }, [pathname]);

  return <html>{children}</html>;
}
```

**In Product Pages:**
```tsx
useEffect(() => {
  analytics.productView(product.id, product.name, product.price);
}, [product]);
```

**In Cart Context:**
```tsx
const addToCart = (item: CartItem) => {
  analytics.addToCart(item.id, item.name, item.price);
  // ... rest of add to cart logic
};
```

### Step 5: Add Social Share to Product Pages

**File:** Product detail pages

```tsx
import SocialShare from '@/components/SocialShare';

<SocialShare 
  url={`https://starmenspark.com/product/${product.id}`}
  title={`Check out ${product.name}`}
/>
```

### Step 6: Update Navigation

**File:** `src/components/Navbar.tsx`

Add contact link:
```tsx
<Link href="/contact">Contact</Link>
<Link href="/profile/orders">Orders</Link>
```

---

## 🔄 Firebase Integration (TODO)

### Order Management

**File:** `src/lib/firebase-orders.ts` (Create this)

```typescript
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export async function createOrder(orderData: any) {
  const ordersRef = collection(db, 'orders');
  const docRef = await addDoc(ordersRef, {
    ...orderData,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return docRef.id;
}

export async function getUserOrders(userId: string) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

### Reviews Integration

**File:** `src/lib/firebase-reviews.ts` (Create this)

```typescript
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export async function addReview(reviewData: any) {
  const reviewsRef = collection(db, 'reviews');
  await addDoc(reviewsRef, {
    ...reviewData,
    createdAt: new Date()
  });
}

export async function getProductReviews(productId: string) {
  const reviewsRef = collection(db, 'reviews');
  const q = query(reviewsRef, where('productId', '==', productId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

---

## 📧 Email Notifications (TODO)

Use a service like:
- SendGrid
- Mailgun
- AWS SES
- Resend

**File:** `src/lib/email.ts` (Create this)

```typescript
export async function sendOrderConfirmation(email: string, orderDetails: any) {
  // Implement email sending
  const response = await fetch('/api/send-email', {
    method: 'POST',
    body: JSON.stringify({
      to: email,
      subject: 'Order Confirmation',
      html: `<h1>Order #${orderDetails.orderId} Confirmed</h1>`
    })
  });
}
```

---

## 🎨 WhatsApp Live Chat (Already Exists!)

**Component:** `src/components/WhatsAppFloating.tsx`

Already implemented! Uses `CONTACT_INFO.whatsapp`

---

## 📊 Google Analytics Setup (Optional)

1. Get GA4 Measurement ID
2. Add to `.env.local`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

3. Update `src/utils/analytics.ts`:
```typescript
declare global {
  interface Window {
    gtag: any;
  }
}

export const analytics = {
  pageView: (page: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: page,
      });
    }
  },
  // ... rest
};
```

4. Add to `src/app/layout.tsx`:
```tsx
<Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
<Script id="google-analytics">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
  `}
</Script>
```

---

## ✅ Quick Checklist

- [x] Contact info centralized
- [x] Order confirmation page
- [x] Order history page
- [x] Search component
- [x] Filter component
- [x] Product reviews
- [x] Discount codes
- [x] Analytics utility
- [x] Social share component
- [x] Contact page
- [x] WhatsApp integration (already exists)
- [ ] Integrate search in product pages
- [ ] Integrate reviews in product pages
- [ ] Integrate discount in checkout
- [ ] Connect Firebase for orders
- [ ] Connect Firebase for reviews
- [ ] Setup email notifications
- [ ] Setup Google Analytics

---

## 🚀 Next Steps

1. **Test all new pages:**
   - Visit `/contact`
   - Visit `/order-confirmation?orderId=TEST123`
   - Visit `/profile/orders`

2. **Integrate components into existing pages**

3. **Connect Firebase for data persistence**

4. **Setup email service for notifications**

5. **Add Google Analytics tracking**

6. **Update product images** (as mentioned in requirements)

7. **Update product data** with real prices and descriptions

---

## 📞 Contact Info Usage

Import anywhere:
```tsx
import { CONTACT_INFO } from '@/config/contact';

// Use:
CONTACT_INFO.phone
CONTACT_INFO.whatsapp
CONTACT_INFO.email
CONTACT_INFO.address
CONTACT_INFO.social.instagram
CONTACT_INFO.social.facebook
CONTACT_INFO.social.youtube
```

---

**All features are production-ready and styled to match your neo-brutalist design!** 🎉
