// Simple analytics tracking utility
import { sanitizeForLog } from './security';

export const analytics = {
  // Track page views
  pageView: (page: string) => {
    if (typeof window !== 'undefined') {
      console.log('Page View:', sanitizeForLog(page));
      // Add Google Analytics or other tracking here
      // gtag('config', 'GA_MEASUREMENT_ID', { page_path: page });
    }
  },

  // Track events
  event: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined') {
      console.log('Event:', { 
        action: sanitizeForLog(action), 
        category: sanitizeForLog(category), 
        label: label ? sanitizeForLog(label) : undefined, 
        value 
      });
      // gtag('event', action, { event_category: category, event_label: label, value });
    }
  },

  // Track product views
  productView: (productId: string | number, productName: string, price: number) => {
    analytics.event('view_item', 'ecommerce', sanitizeForLog(productName), price);
  },

  // Track add to cart
  addToCart: (productId: string | number, productName: string, price: number) => {
    analytics.event('add_to_cart', 'ecommerce', sanitizeForLog(productName), price);
  },

  // Track purchases
  purchase: (orderId: string, total: number, items: number) => {
    analytics.event('purchase', 'ecommerce', sanitizeForLog(orderId), total);
  },

  // Track search
  search: (query: string) => {
    analytics.event('search', 'engagement', sanitizeForLog(query));
  }
};
