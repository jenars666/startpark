import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types/product';
import { fetchProductsFromApi, isProductsApiEnabled } from '../lib/productsApi';

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
  const apiMode = isProductsApiEnabled();

  useEffect(() => {
    if (apiMode) {
      let active = true;

      const loadProducts = async () => {
        try {
          const fetchedProducts = await fetchProductsFromApi({
            category: categoryFilter,
            status: 'active',
          });

          if (!active) {
            return;
          }

          const mappedProducts: Product[] = fetchedProducts.map((item: Record<string, unknown>) => {
            const normalizedCategory = normalizeCategory(String(item.category || ''));
            const imageUrl = String(item.imageUrl || item.img || item.image || '');

            return {
              id: String(item._id || item.id || ''),
              name: String(item.name || ''),
              price: item.price != null ? String(item.price) : '0',
              oldPrice: item.oldPrice != null ? String(item.oldPrice) : '',
              img: imageUrl,
              tag: String(item.tag || ''),
              color: String(item.color || ''),
              category: normalizedCategory,
              stock: typeof item.stock === 'number' ? item.stock : 0,
              rating: typeof item.rating === 'number' ? item.rating : undefined,
              reviews: typeof item.reviews === 'number' ? item.reviews : undefined,
              showStockNote: Boolean(item.showStockNote),
              sizes: Array.isArray(item.sizes) ? (item.sizes as string[]) : [],
              discount: typeof item.discount === 'number' ? item.discount : undefined,
            } as Product;
          });

          setProducts(mappedProducts);
        } catch (error) {
          console.error('Error fetching products from API:', error);
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      };

      void loadProducts();
      const intervalId = setInterval(loadProducts, 15000);

      return () => {
        active = false;
        clearInterval(intervalId);
      };
    }

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
  }, [apiMode, categoryFilter]);

  return { products, loading };
}
