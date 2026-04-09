# Star Mens Park - Setup & Deployment Guide

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase account
- Razorpay account (for payments)
- Git installed

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Authentication (Optional - for NextAuth if needed)
AUTH_SECRET=generate_random_secret_here

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)
5. Enable Storage (optional):
   - Go to Storage
   - Get started with default rules

#### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Razorpay Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Go to Settings > API Keys
3. Generate Test/Live keys
4. Add keys to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
star/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── casual-shirt/       # Casual shirts category
│   │   ├── formal-shirt/       # Formal shirts category
│   │   ├── vesthi-shirt/       # Traditional vesthi category
│   │   ├── group-shirt/        # Group/bulk orders
│   │   ├── login/              # Authentication
│   │   ├── profile/            # User profile
│   │   ├── wishlist/           # Saved items
│   │   ├── admin/              # Admin dashboard
│   │   └── api/                # API routes
│   │       └── payments/       # Payment endpoints
│   ├── components/             # Reusable React components
│   ├── context/                # React Context (Cart, Wishlist)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and configurations
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Helper functions
├── public/                     # Static assets
│   └── images/                 # Product images
└── ...config files
```

## 🧪 Testing

### Type Check
```bash
npm run type-check
```

### Lint
```bash
npm run lint
```

### Build Test
```bash
npm run build
```

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Adding New Product Categories

1. Create product data file: `src/app/[category]/[category]-products.ts`
2. Create page: `src/app/[category]/page.tsx`
3. Create layout: `src/app/[category]/layout.tsx`
4. Add CSS: `src/app/[category]/[category].css`
5. Update navigation in `src/components/Navbar.tsx`

### Customizing Theme

Edit `src/app/globals.css` to change:
- Colors (CSS variables)
- Fonts
- Neo-brutalist design elements

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify all Firebase environment variables are correct
- Check Firebase project settings
- Ensure Firestore and Authentication are enabled

### Payment Issues
- Verify Razorpay keys are correct
- Check if using test/live mode consistently
- Ensure API routes are accessible

### Build Errors
- Run `npm run type-check` to find TypeScript errors
- Clear `.next` folder: `rm -rf .next` (or `rmdir /s .next` on Windows)
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📝 Important Notes

- **Database**: Using Firebase Firestore (Supabase removed)
- **Authentication**: Firebase Auth with Google OAuth
- **Payments**: Razorpay integration (test mode by default)
- **Images**: Stored in `/public/images/` directory
- **Cart Sync**: Automatic sync between local storage and Firestore

## 🔐 Security Checklist

- [ ] Never commit `.env.local` to version control
- [ ] Use environment variables for all secrets
- [ ] Set up proper Firestore security rules
- [ ] Enable CORS only for your domain in production
- [ ] Use HTTPS in production
- [ ] Validate all user inputs
- [ ] Implement rate limiting for API routes

## 📞 Support

For issues or questions:
- Check PROJECT-ROADMAP.md for known issues
- Review Firebase and Razorpay documentation
- Check Next.js 16 documentation for framework-specific issues

## 🎯 Next Steps After Setup

1. Add product images to `/public/images/`
2. Update product data in category files
3. Customize branding (logo, colors, fonts)
4. Test payment flow in test mode
5. Set up Firebase security rules
6. Configure domain and deploy
