'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { useProductUpdates } from '@/hooks/useSocket';
import { Product } from '@/types/product';

const USE_MONGODB = process.env.NEXT_PUBLIC_USE_MONGODB === 'true';

export function useProductsMongoDB(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [category]);

  useProductUpdates((event, data) => {
    if (event === 'created') {
      if (!category || data.category === category) {
        setProducts(prev => [normalizeProduct(data), ...prev]);
      }
    } else if (event === 'updated') {
      setProducts(prev => prev.map(p => p.id === data._id ? normalizeProduct(data) : p));
    } else if (event === 'deleted') {
      setProducts(prev => prev.filter(p => p.id !== data.id));
    }
  });

  async function loadProducts() {
    try {
      setLoading(true);
      const data = await apiClient.getProducts({ category, limit: 100 });
      const normalized = data.data.map(normalizeProduct);
      setProducts(normalized);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function normalizeProduct(p: any): Product {
    return {
      id: p._id || p.id,
      name: p.name,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : '',
      img: p.imageUrl || p.img,
      tag: p.tag || '',
      color: p.color || '',
      category: p.category,
      stock: p.stock || 0,
      sizes: p.sizes || [],
    };
  }

  return { products, loading, error };
}
