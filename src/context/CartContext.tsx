'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { CartItem } from '../types';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { 
  getUserCart, 
  isFirestoreOfflineError, 
  mergeCartItems, 
  normalizeCartItems, 
  saveUserCart 
} from '../lib/customerStore';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const LOCAL_CART_KEY = 'star_cart';
const USER_CART_BACKUP_PREFIX = 'star_cart_backup_';

function readStoredCart(storageKey: string) {
  if (typeof window === 'undefined') {
    return [] as CartItem[];
  }

  try {
    const savedCart = localStorage.getItem(storageKey);
    if (!savedCart) {
      return [] as CartItem[];
    }

    const parsed = JSON.parse(savedCart) as CartItem[];
    return normalizeCartItems(Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    console.error('Failed to parse local cart:', error);
    return [] as CartItem[];
  }
}

function persistStoredCart(storageKey: string, items: CartItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(normalizeCartItems(items)));
}

function clearStoredCart(storageKey: string) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(storageKey);
}

function getUserCartBackupKey(userId: string) {
  return `${USER_CART_BACKUP_PREFIX}${userId}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, loading } = useFirebaseAuth();
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }

    let isActive = true;

    const loadCart = async () => {
      const guestCart = readStoredCart(LOCAL_CART_KEY);
      const previousUserId = previousUserIdRef.current;

      if (!user) {
        if (isActive) {
          if (previousUserId) {
            clearStoredCart(LOCAL_CART_KEY);
            clearStoredCart(getUserCartBackupKey(previousUserId));
          }

          setCartItems([]);
          setIsInitialized(true);
        }

        previousUserIdRef.current = null;
        return;
      }

      try {
        const cloudCart = await getUserCart(user.uid);
        const backupCart = readStoredCart(getUserCartBackupKey(user.uid));
        const mergedCart = mergeCartItems(cloudCart, mergeCartItems(backupCart, guestCart));

        if (!isActive) {
          return;
        }

        setCartItems(mergedCart);
        setIsInitialized(true);

        if (guestCart.length > 0 || backupCart.length > 0) {
          try {
            await saveUserCart(user.uid, mergedCart);
            clearStoredCart(LOCAL_CART_KEY);
            clearStoredCart(getUserCartBackupKey(user.uid));
          } catch (error) {
            persistStoredCart(getUserCartBackupKey(user.uid), mergedCart);
            if (!isFirestoreOfflineError(error)) {
              console.error('Failed to merge your saved cart into this account:', error);
            }
          }
        } else {
          clearStoredCart(getUserCartBackupKey(user.uid));
        }
      } catch (error) {
        console.error('Failed to load saved cart:', error);

        if (!isActive) {
          return;
        }

        setCartItems(
          mergeCartItems(
            readStoredCart(getUserCartBackupKey(user.uid)),
            guestCart
          )
        );
        setIsInitialized(true);

        if (!isFirestoreOfflineError(error)) {
          toast.error('Unable to load your saved cart right now.');
        }
      } finally {
        previousUserIdRef.current = user.uid;
      }
    };

    void loadCart();

    return () => {
      isActive = false;
    };
  }, [user, loading]);

  useEffect(() => {
    if (!isInitialized || loading || !user) {
      return;
    }

    const syncCart = async () => {
      try {
        await saveUserCart(user.uid, cartItems);
        clearStoredCart(getUserCartBackupKey(user.uid));
      } catch (error: unknown) {
        if (!isFirestoreOfflineError(error)) {
          console.error('Failed to sync cart to Firestore:', error);
          const errorCode =
            typeof error === 'object' && error && 'code' in error
              ? String(error.code)
              : 'unknown';
          toast.error(`Cart cloud sync failed (${errorCode}). Items saved locally.`);
        }

        persistStoredCart(getUserCartBackupKey(user.uid), cartItems);
      }
    };

    void syncCart();
  }, [cartItems, user, isInitialized, loading]);

  const addToCart = (item: CartItem) => {
    setCartItems((previousCart) => {
      const existingItem = previousCart.find(
        (cartItem) => String(cartItem.id) === String(item.id)
      );

      if (existingItem) {
        return previousCart.map((cartItem) =>
          String(cartItem.id) === String(item.id)
            ? {
                ...cartItem,
                quantity: cartItem.quantity + item.quantity,
              }
            : cartItem
        );
      }

      return [...previousCart, item];
    });

    toast.success('Added to your cart.');
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((previousCart) =>
      previousCart.filter((item) => String(item.id) !== String(id))
    );
  };

  const updateQuantity = (id: number | string, delta: number) => {
    setCartItems((previousCart) =>
      previousCart.map((item) => {
        if (String(item.id) !== String(id)) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(1, item.quantity + delta),
        };
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const priceValue =
      typeof item.price === 'string'
        ? Number(item.price.replace(/,/g, '').replace(/[^0-9.]/g, '')) || 0
        : item.price;

    return sum + priceValue * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};
