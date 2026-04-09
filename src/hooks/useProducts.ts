import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types/product';

function normalizeCategory(value?: string) {
  const raw = (value || '').trim().toLowerCase();

  if (!raw) return '';
  if (raw === 'casual' || raw === 'casual shirt') return 'casual shirt';
  if (raw === 'formal' || raw === 'formal shirt') return 'formal shirt';
  if (raw === 'vesthi' || raw === 'vesthi shirt') return 'vesthi';
  if (raw === 'group' || raw === 'group shirt') return 'group shirt';

  return raw;
}

export function useProducts(categoryFilter?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts: Product[] = snapshot.docs.map(doc => {
        const data = doc.data();
        const normalizedCategory = normalizeCategory(data.category);
        const imageUrl = data.img || data.imageUrl || data.image || '';

        return {
          id: doc.id,
          name: data.name || '',
          price: data.price != null ? String(data.price) : '0',
          oldPrice: data.oldPrice != null ? String(data.oldPrice) : '',
          img: imageUrl,
          tag: data.tag || '',
          color: data.color || '',
          category: normalizedCategory,
          stock: data.stock,
          rating: data.rating,
          reviews: data.reviews,
          showStockNote: data.showStockNote,
          sizes: data.sizes,
          discount: data.discount,
        } as Product;
      });

      // Filter locally for now, since categories might have slightly different casing in our seeded data
      let finalProducts = fetchedProducts;
      if (categoryFilter) {
        const normalizedFilter = normalizeCategory(categoryFilter);
        finalProducts = fetchedProducts.filter(p => 
          normalizeCategory(p.category) === normalizedFilter
        );
      }

      setProducts(finalProducts);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching products:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryFilter]);

  return { products, loading };
}
