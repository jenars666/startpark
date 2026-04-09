import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Casual Shirts',
  description: 'Shop the latest collection of casual shirts and shackets. Find the perfect fit for your everyday style at Star Mens Park, Dindigul.',
  keywords: ['casual shirts', 'shackets', 'everyday wear', 'Dindigul', 'Star Mens Park'],
  openGraph: {
    title: 'Casual Shirts | Star Mens Park',
    description: 'Shop the latest collection of casual shirts and shackets',
    type: 'website',
  },
};

export default function CasualShirtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
