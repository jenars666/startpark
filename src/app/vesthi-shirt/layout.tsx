import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vesthi & Shirts | Traditional Wear',
  description: 'Explore our premium collection of Vesthi shirts and traditional sets for weddings, festivals, and special occasions at Star Mens Park, Dindigul.',
  keywords: ['vesthi', 'traditional wear', 'wedding attire', 'festival wear', 'ethnic wear', 'Dindigul'],
  openGraph: {
    title: 'Vesthi & Shirts | Star Mens Park',
    description: 'Premium Vesthi and traditional wear for special occasions',
    type: 'website',
  },
};

export default function VesthiShirtLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
