'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, delta: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, loading } = useFirebaseAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initial load & merge logic when user state changes
  useEffect(() => {
    if (loading) return;

    const loadCart = async () => {
      let localCart: CartItem[] = [];
      try {
        const saved = localStorage.getItem('star_cart');
        if (saved) localCart = JSON.parse(saved);
      } catch (e) {
        console.error("Local cart parse error", e);
      }

      if (user && db) {
        try {
          // User logged in: fetch from Firestore
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          let cloudCart: CartItem[] = [];
          if (docSnap.exists() && docSnap.data().cart) {
            cloudCart = docSnap.data().cart;
          }

          // Merge local cart into cloud cart if local cart has items
          if (localCart.length > 0) {
            const merged = [...cloudCart];
            localCart.forEach(localItem => {
              const existing = merged.find(i => i.id === localItem.id);
              if (existing) {
                existing.quantity += localItem.quantity;
              } else {
                merged.push(localItem);
              }
            });
            cloudCart = merged;
            // Clean local cart after merging to cloud
            localStorage.removeItem('star_cart');
            // Save merged to cloud
            await setDoc(docRef, { cart: cloudCart }, { merge: true });
          }
          
          setCartItems(cloudCart);
        } catch (err: any) {
          // Offline error is expected, just use local items silently
          if (err?.code === 'failed-precondition' || err?.message?.includes('offline')) {
            console.log('📱 Firestore offline. Using local cart.');
            setCartItems(localCart);
          } else {
            console.error("Firestore Error Loading Cart. Using local cache.", err);
            setCartItems(localCart);
          }
        }
      } else {
        // Guest user: use local
        setCartItems(localCart);
      }
      setIsInitialized(true);
    };

    loadCart();
  }, [user, loading]);

  // Persist changes
  useEffect(() => {
    if (!isInitialized) return; // don't overwrite during initial load

    const saveCart = async () => {
      if (user && db) {
        try {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, { cart: cartItems }, { merge: true });
        } catch (err: any) {
          // Offline error is expected, just save locally
          if (err?.code === 'failed-precondition' || err?.message?.includes('offline')) {
            console.log('📱 Firestore offline. Saved locally.');
            localStorage.setItem('star_cart_backup', JSON.stringify(cartItems));
          } else {
            console.warn("Failed to sync cart to cloud:", err);
            localStorage.setItem('star_cart_backup', JSON.stringify(cartItems));
          }
        }
      } else {
        localStorage.setItem('star_cart', JSON.stringify(cartItems));
      }
    };
    saveCart();
  }, [cartItems, user, isInitialized]);

  const addToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    toast.success('Added to Cart!');
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number | string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: number | string, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = cartItems.reduce((acc, i) => {
    const priceStr = typeof i.price === 'string' ? i.price.replace(/,/g, '').replace(/[^0-9.]/g, '') : '0';
    return acc + (parseFloat(priceStr || '0') * i.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      isCartOpen,
      setIsCartOpen,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
