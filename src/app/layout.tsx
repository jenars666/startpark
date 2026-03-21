import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Star Mens Park | Dindigul",
  description: "Premium Menswear & Bulk Group Shirts in Dindigul Bazaar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
