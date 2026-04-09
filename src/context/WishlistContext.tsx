'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { WishlistItem } from '../types';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import {
  getUserWishlist,
  isFirestoreOfflineError,
  mergeWishlistItems,
  normalizeWishlistItems,
  saveUserWishlist,
} from '../lib/customerStore';

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
const LOCAL_WISHLIST_KEY = 'star_wishlist';
const USER_WISHLIST_BACKUP_PREFIX = 'star_wishlist_backup_';

function readStoredWishlist(storageKey: string) {
  if (typeof window === 'undefined') {
    return [] as WishlistItem[];
  }

  try {
    const savedWishlist = localStorage.getItem(storageKey);
    if (!savedWishlist) {
      return [] as WishlistItem[];
    }

    const parsed = JSON.parse(savedWishlist) as WishlistItem[];
    return normalizeWishlistItems(Array.isArray(parsed) ? parsed : []);
  } catch (error) {
    console.error('Failed to parse local wishlist:', error);
    return [] as WishlistItem[];
  }
}

function persistStoredWishlist(storageKey: string, items: WishlistItem[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(storageKey, JSON.stringify(normalizeWishlistItems(items)));
}

function clearStoredWishlist(storageKey: string) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(storageKey);
}

function getUserWishlistBackupKey(userId: string) {
  return `${USER_WISHLIST_BACKUP_PREFIX}${userId}`;
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useFirebaseAuth();
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    let isActive = true;

    const loadWishlist = async () => {
      setLoading(true);
      const guestWishlist = readStoredWishlist(LOCAL_WISHLIST_KEY);
      const previousUserId = previousUserIdRef.current;

      if (!user) {
        if (isActive) {
          if (previousUserId) {
            clearStoredWishlist(LOCAL_WISHLIST_KEY);
            clearStoredWishlist(getUserWishlistBackupKey(previousUserId));
          }

          setWishlistItems([]);
          setIsReady(true);
          setLoading(false);
        }

        previousUserIdRef.current = null;
        return;
      }

      try {
        const cloudWishlist = await getUserWishlist(user.uid);
        const backupWishlist = readStoredWishlist(getUserWishlistBackupKey(user.uid));
        const mergedWishlist = mergeWishlistItems(
          cloudWishlist,
          mergeWishlistItems(backupWishlist, guestWishlist)
        );

        if (guestWishlist.length > 0 || backupWishlist.length > 0) {
          try {
            await saveUserWishlist(user.uid, mergedWishlist);
            clearStoredWishlist(LOCAL_WISHLIST_KEY);
            clearStoredWishlist(getUserWishlistBackupKey(user.uid));
          } catch (error) {
            persistStoredWishlist(getUserWishlistBackupKey(user.uid), mergedWishlist);

            if (!isFirestoreOfflineError(error)) {
              console.error('Failed to merge your saved wishlist into this account:', error);
            }
          }
        } else {
          clearStoredWishlist(getUserWishlistBackupKey(user.uid));
        }

        if (isActive) {
          setWishlistItems(mergedWishlist);
        }
      } catch (error) {
        if (isActive) {
          setWishlistItems(
            mergeWishlistItems(
              readStoredWishlist(getUserWishlistBackupKey(user.uid)),
              guestWishlist
            )
          );
        }

        if (!isFirestoreOfflineError(error)) {
          console.error('Wishlist sync failed:', error);
          toast.error('Wishlist sync failed. Using local items.');
        }
      } finally {
        if (isActive) {
          setIsReady(true);
          setLoading(false);
        }

        previousUserIdRef.current = user.uid;
      }
    };

    void loadWishlist();

    return () => {
      isActive = false;
    };
  }, [user, authLoading]);

  useEffect(() => {
    if (!isReady || !user) {
      return;
    }

    const saveWishlist = async () => {
      try {
        await saveUserWishlist(user.uid, wishlistItems);
        clearStoredWishlist(getUserWishlistBackupKey(user.uid));
      } catch (error: unknown) {
        if (!isFirestoreOfflineError(error)) {
          console.error('CRITICAL: Wishlist sync failed:', error);
          const errorCode =
            typeof error === 'object' && error && 'code' in error
              ? String(error.code)
              : 'unknown';
          toast.error(`Cloud sync failed (${errorCode}). Items saved locally.`);
        } else {
          console.warn('Wishlist sync deferred: Device is offline or timeout exceeded');
        }

        persistStoredWishlist(getUserWishlistBackupKey(user.uid), wishlistItems);
      }
    };

    void saveWishlist();
  }, [wishlistItems, user, isReady]);

  const addToWishlist = (item: WishlistItem) => {
    if (
      !isReady ||
      wishlistItems.find((wishlistItem) => String(wishlistItem.id) === String(item.id))
    ) {
      return;
    }

    setWishlistItems((currentItems) => [...currentItems, ...normalizeWishlistItems([item])]);
    toast.success('Added to wishlist!');
  };

  const removeFromWishlist = (id: number | string) => {
    if (!wishlistItems.find((item) => String(item.id) === String(id))) {
      return;
    }

    setWishlistItems((currentItems) =>
      currentItems.filter((item) => String(item.id) !== String(id))
    );
    toast.success('Removed from wishlist!');
  };

  const isInWishlist = (id: number | string) =>
    wishlistItems.some((item) => String(item.id) === String(id));

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        totalWishlistItems: wishlistItems.length,
        isReady,
        loading,
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
