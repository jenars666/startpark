'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { WishlistItem } from '../types';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number | string) => void;
  isInWishlist: (id: number | string) => boolean;
  totalWishlistItems: number;
  isReady: boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { user, loading: authLoading } = useFirebaseAuth();
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial load & merge logic when user state changes
  useEffect(() => {
    if (authLoading) return;

    const loadWishlist = async () => {
      setLoading(true);
      let localWishlist: WishlistItem[] = [];
      try {
        const saved = localStorage.getItem('star_wishlist');
        if (saved) localWishlist = JSON.parse(saved);
      } catch (e) {
        console.error("Local wishlist parse error", e);
      }

      if (user && db) {
        try {
          console.log('🔄 Loading cloud wishlist for user:', user.uid);
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          
          let cloudWishlist: WishlistItem[] = [];
          if (docSnap.exists() && docSnap.data()?.wishlist) {
            cloudWishlist = docSnap.data()!.wishlist as WishlistItem[];
          }

          // Merge local wishlist into cloud wishlist
          if (localWishlist.length > 0) {
            const merged = [...cloudWishlist];
            localWishlist.forEach(localItem => {
              const existing = merged.find(i => i.id === localItem.id);
              if (!existing) {
                merged.push(localItem);
              }
            });
            cloudWishlist = merged;
            localStorage.removeItem('star_wishlist');
            await setDoc(docRef, { wishlist: cloudWishlist }, { merge: true });
            console.log('☁️ Synced local to cloud:', localWishlist.length, 'new items');
          }
          
          setWishlistItems(cloudWishlist);
          console.log('✅ Wishlist loaded:', cloudWishlist.length, 'items');
        } catch (err: any) {
          // Offline error is expected, just use local items silently
          if (err?.code === 'failed-precondition' || err?.message?.includes('offline')) {
            console.log('📱 Firestore offline. Using local wishlist.');
            setWishlistItems(localWishlist);
          } else {
            console.error("❌ Firestore Error Loading Wishlist:", err);
            toast.error('Wishlist sync failed. Using local items.');
            setWishlistItems(localWishlist);
          }
        }
      } else {
        console.log('📱 Guest mode: using local wishlist');
        setWishlistItems(localWishlist);
      }
      setIsReady(true);
      setLoading(false);
    };

    loadWishlist();
  }, [user, authLoading]);

  // Persist changes
  useEffect(() => {
    if (!isReady) return;

    const saveWishlist = async () => {
      if (user && db) {
        try {
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, { wishlist: wishlistItems }, { merge: true });
          console.log('☁️ Synced to cloud:', wishlistItems.length);
        } catch (err: any) {
          // Offline error is expected, just save locally
          if (err?.code === 'failed-precondition' || err?.message?.includes('offline')) {
            console.log('📱 Firestore offline. Saved locally.');
            localStorage.setItem('star_wishlist_backup', JSON.stringify(wishlistItems));
          } else {
            console.error("❌ Failed to sync wishlist to cloud:", err);
            toast.error('Cloud sync failed. Items saved locally.');
            localStorage.setItem('star_wishlist_backup', JSON.stringify(wishlistItems));
          }
        }
      } else {
        localStorage.setItem('star_wishlist', JSON.stringify(wishlistItems));
      }
    };
    saveWishlist();
  }, [wishlistItems, user, isReady]);

  const addToWishlist = (item: WishlistItem) => {
    console.log('➕ Adding to wishlist:', item);
    if (!isReady) {
      console.warn('⚠️ Wishlist not ready yet');
      return;
    }
    if (wishlistItems.find(i => i.id === item.id)) {
      console.log('ℹ️ Item already in wishlist');
      return;
    }
    setWishlistItems(prev => {
      const newList = [...prev, item];
      console.log('✅ Added to wishlist. Total:', newList.length);
      return newList;
    });
    toast.success('Added to wishlist!');
  };

  const removeFromWishlist = (id: number | string) => {
    console.log('➖ Removing from wishlist:', id);
    if (!wishlistItems.find(i => i.id === id)) {
      return;
    }
    setWishlistItems(prev => {
      const newList = prev.filter(i => i.id !== id);
      console.log('✅ Removed from wishlist. Total:', newList.length);
      return newList;
    });
    toast.success('Removed from wishlist!');
  };

  const isInWishlist = (id: number | string) => {
    return wishlistItems.some(i => i.id === id);
  };

  const totalWishlistItems = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      totalWishlistItems,
      isReady,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
