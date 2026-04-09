import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types/product';

function mapToProduct(id: string, data: Record<string, unknown>): Product {
  const rawSizes = Array.isArray(data.sizes) ? data.sizes : [];
  const mainImage =
    (typeof data.img === 'string' && data.img) ||
    (typeof data.imageUrl === 'string' && data.imageUrl) ||
    (typeof data.image === 'string' && data.image) ||
    '';

  return {
    id,
    name: typeof data.name === 'string' ? data.name : '',
    price: data.price != null ? String(data.price) : '0',
    oldPrice: data.oldPrice != null ? String(data.oldPrice) : '',
    img: mainImage,
    tag: typeof data.tag === 'string' ? data.tag : '',
    rating: typeof data.rating === 'number' ? data.rating : 4.8,
    reviews: typeof data.reviews === 'number' ? data.reviews : 10,
    sizes: rawSizes.length > 0 ? (rawSizes as string[]) : ['S', 'M', 'L', 'XL'],
    description: typeof data.description === 'string' ? data.description : '',
    fabric: typeof data.fabric === 'string' ? data.fabric : '',
    care: typeof data.care === 'string' ? data.care : '',
    color: typeof data.color === 'string' ? data.color : 'Multi',
    discount: typeof data.discount === 'number' ? data.discount : undefined,
    category: typeof data.category === 'string' ? data.category : '',
    showStockNote: Boolean(data.showStockNote),
  };
}

export function useProductById(productId: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(Boolean(productId));
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (!db) {
      setProduct(null);
      setLoading(false);
      setError(new Error('Firestore not initialized'));
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      doc(db, 'products', productId),
      (snap) => {
        if (!snap.exists()) {
          setProduct(null);
          setLoading(false);
          return;
        }

        const data = snap.data() as Record<string, unknown>;
        setProduct(mapToProduct(snap.id, data));
        setLoading(false);
      },
      (snapshotError) => {
        setProduct(null);
        setError(snapshotError);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [productId]);

  return { product, loading, error };
}
