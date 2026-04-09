import {
  collection,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface AdminProduct {
  id: string;
  name: string;
  title?: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  soldCount?: number;
  img?: string;
}

/**
 * Real-time subscription to ALL products in the `products` collection.
 * Used by admin Products tab, Inventory tab, and stock management.
 */
export function subscribeToAllProducts(
  callback: (products: AdminProduct[]) => void
): Unsubscribe {
  if (!db) {
    callback([]);
    return () => {};
  }

  const q = query(collection(db, 'products'), orderBy('name', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const products: AdminProduct[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || data.title || 'Unnamed Product',
          title: data.title,
          category: data.category || 'Uncategorized',
          price: typeof data.price === 'number' ? data.price : parseFloat(String(data.price).replace(/[^0-9.]/g, '')) || 0,
          stock: data.stock ?? 0,
          status: data.status || (data.stock === 0 ? 'out_of_stock' : 'active'),
          soldCount: data.soldCount ?? 0,
          img: data.img || data.image || '',
        };
      });

      callback(products);
    },
    (error) => {
      console.error('subscribeToAllProducts error:', error);
      callback([]);
    }
  );
}
