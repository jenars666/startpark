import { Metadata } from 'next';

interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = '/images/logo.png',
  url = 'https://starmenspark.com'
}: PageMetadata): Metadata {
  const fullTitle = `${title} | Star Mens Park - Dindigul`;
  
  return {
    title: fullTitle,
    description,
    keywords: ['Star Mens Park', 'Dindigul', 'Menswear', ...keywords].join(', '),
    authors: [{ name: 'Star Mens Park' }],
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Star Mens Park',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
