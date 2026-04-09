import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContextFirebase";
import { WishlistProvider } from "../context/WishlistContextFirebase";
import AuthProvider from "../providers/AuthProvider";
import CartSidebar from "../components/CartSidebar";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: "Star Mens Park | Premium Menswear in Dindigul",
    template: "%s | Star Mens Park"
  },
  description: "Premium Menswear & Bulk Group Shirts in Dindigul Bazaar. Shop casual shirts, formal wear, vesthi sets, and designer collections.",
  keywords: ['Star Mens Park', 'Dindigul', 'Menswear', 'Shirts', 'Vesthi', 'Group Shirts', 'Formal Wear', 'Casual Shirts', 'Tamil Nadu'],
  authors: [{ name: 'Star Mens Park' }],
  openGraph: {
    title: "Star Mens Park | Premium Menswear in Dindigul",
    description: "Premium Menswear & Bulk Group Shirts in Dindigul Bazaar",
    url: 'https://starmenspark.com',
    siteName: 'Star Mens Park',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Star Mens Park | Premium Menswear in Dindigul",
    description: "Premium Menswear & Bulk Group Shirts in Dindigul Bazaar",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <CartSidebar />
              <Toaster position="bottom-right" toastOptions={{ duration: 4000 }} />
              {children}
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
