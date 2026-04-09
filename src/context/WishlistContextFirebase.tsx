'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { subscribeToWishlist, saveWishlistToFirestore } from '@/lib/firebase/wishlistService';
import type { WishlistItem } from '@/types';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: number | string) => Promise<void>;
  isInWishlist: (id: number | string) => boolean;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, wishlist, setWishlist } = useUserStore();

  // Subscribe to real-time wishlist updates when user is logged in
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToWishlist(user.uid, (items) => {
      setWishlist(items);
    });

    return unsubscribe;
  }, [user, setWishlist]);

  const addToWishlist = async (item: WishlistItem) => {
    if (!user) {
      console.warn('Cannot add to wishlist: user not authenticated');
      return;
    }

    const alreadyInWishlist = wishlist.some(wishlistItem => 
      String(wishlistItem.id) === String(item.id)
    );

    if (alreadyInWishlist) {
      toast.error('Item already in wishlist!');
      return;
    }

    const updatedWishlist = [...wishlist, item];
    setWishlist(updatedWishlist);
    await saveWishlistToFirestore(user.uid, updatedWishlist);
    toast.success('Added to wishlist!');
  };

  const removeFromWishlist = async (id: number | string) => {
    if (!user) return;

    const updatedWishlist = wishlist.filter(item => String(item.id) !== String(id));
    setWishlist(updatedWishlist);
    await saveWishlistToFirestore(user.uid, updatedWishlist);
    toast.success('Removed from wishlist!');
  };

  const isInWishlist = (id: number | string) => {
    return wishlist.some(item => String(item.id) === String(id));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        totalWishlistItems: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};