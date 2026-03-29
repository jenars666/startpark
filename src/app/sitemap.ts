import { MetadataRoute } from 'next';
import { casualProducts } from './casual-shirt/casual-products';
import { vesthiMainProducts } from './vesthi-shirt/vesthi-main-products';

// Replace with your actual deployed domain later
const URL = 'https://starecommerce.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Base routes
  const routes = ['', '/casual-shirt', '/group-shirt', '/vesthi-shirt', '/wishlist'].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic casual shirts
  const casualProductRoutes = casualProducts.map((product) => ({
    url: `${URL}/casual-shirt/product/${product.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Dynamic vesthi shirts
  const vesthiProductRoutes = vesthiMainProducts.map((product) => ({
    url: `${URL}/vesthi-shirt/product/${product.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...casualProductRoutes, ...vesthiProductRoutes];
}
