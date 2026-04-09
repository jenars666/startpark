import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formal Shirts',
  description: 'Shop sophisticated formal shirts and dress shirts for professional occasions. Perfect fit for office and business meetings at Star Mens Park, Dindigul.',
  keywords: ['formal shirts', 'dress shirts', 'office wear', 'business attire', 'Dindigul'],
  openGraph: {
    title: 'Formal Shirts | Star Mens Park',
    description: 'Shop sophisticated formal shirts for professional occasions',
    type: 'website',
  },
};

export default function FormalShirtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
