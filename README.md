# Star Mens Park - E-commerce Platform

Premium menswear e-commerce platform built with Next.js 16, featuring Firebase authentication, Razorpay payment gateway, and modern UI/UX.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 💳 Payment Gateway Setup

**Razorpay is already integrated!** Just add your API keys:

1. Get free account at [razorpay.com](https://razorpay.com)
2. Get API keys from dashboard
3. Add to `.env.local`:
```env
RAZORPAY_KEY_ID="rzp_test_YOUR_KEY"
RAZORPAY_KEY_SECRET="YOUR_SECRET"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_YOUR_KEY"
```
4. Test at [http://localhost:3000/payment-test](http://localhost:3000/payment-test)

**📖 Full Guide:** See [PAYMENT-GATEWAY-SETUP.md](./PAYMENT-GATEWAY-SETUP.md)

## ✨ Features

- 🛍️ **Product Categories**: Casual, Formal, Vesthi, Group Shirts
- 🔐 **Authentication**: Firebase Auth with Google OAuth
- 💳 **Payments**: Razorpay (Cards, UPI, Net Banking, Wallets)
- 🛒 **Shopping Cart**: Persistent cart with Firestore sync
- ❤️ **Wishlist**: Save favorite products
- 📱 **Responsive**: Mobile-first design
- ♿ **Accessible**: WCAG compliant
- 🎨 **Neo-Brutalist Design**: Bold, modern UI
- 🔍 **SEO Optimized**: Open Graph, Twitter Cards

## 📁 Project Structure

```
star/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── casual-shirt/       # Casual shirts
│   │   ├── formal-shirt/       # Formal shirts
│   │   ├── vesthi-shirt/       # Traditional wear
│   │   ├── payment-test/       # Payment testing
│   │   └── api/payments/       # Payment API routes
│   ├── components/             # React components
│   ├── context/                # Cart & Wishlist
│   ├── lib/                    # Firebase, Razorpay
│   └── types/                  # TypeScript types
└── public/images/              # Product images
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **Language**: TypeScript
- **UI**: React 19, Framer Motion
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore
- **Payments**: Razorpay
- **Styling**: Custom CSS (Neo-Brutalist)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[PAYMENT-GATEWAY-SETUP.md](./PAYMENT-GATEWAY-SETUP.md)** - Payment integration
- **[PROJECT-ROADMAP.md](./PROJECT-ROADMAP.md)** - Project status & roadmap
- **[FIXES-SUMMARY.md](./FIXES-SUMMARY.md)** - Recent fixes & improvements

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript errors
```

## 🌐 Environment Variables

Create `.env.local` with:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY="your_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your_domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your_project"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your_bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
NEXT_PUBLIC_FIREBASE_APP_ID="your_app_id"

# Razorpay
RAZORPAY_KEY_ID="rzp_test_YOUR_KEY"
RAZORPAY_KEY_SECRET="YOUR_SECRET"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_YOUR_KEY"
```

See [SETUP.md](./SETUP.md) for detailed configuration.

## 🧪 Testing Payment Gateway

1. Add Razorpay keys to `.env.local`
2. Restart server: `npm run dev`
3. Visit: [http://localhost:3000/payment-test](http://localhost:3000/payment-test)
4. Use test card: **4111 1111 1111 1111**

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Manual

```bash
npm run build
npm start
```

## 📱 Payment Methods Supported

- 💳 Credit/Debit Cards (Visa, Mastercard, RuPay, Amex)
- 🏦 Net Banking (All major banks)
- 📱 UPI (Google Pay, PhonePe, Paytm)
- 💰 Wallets (Paytm, Mobikwik, etc.)
- 💵 EMI Options

## 🔒 Security

- ✅ Server-side payment verification
- ✅ HMAC signature validation
- ✅ Environment variables for secrets
- ✅ Firebase security rules
- ✅ HTTPS enforced in production

## 📊 Project Status

✅ **Production Ready**
- Zero TypeScript errors
- Payment gateway integrated
- SEO optimized
- Accessible UI
- Error handling implemented

## 🤝 Contributing

This is a private project for Star Mens Park, Dindigul.

## 📞 Support

For payment gateway issues:
- Razorpay: support@razorpay.com
- Documentation: [PAYMENT-GATEWAY-SETUP.md](./PAYMENT-GATEWAY-SETUP.md)

## 📄 License

Private - Star Mens Park © 2024

---

**Built with ❤️ for Star Mens Park, Dindigul**
