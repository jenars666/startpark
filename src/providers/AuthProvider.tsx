'use client';

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { onSnapshot, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { getCartFromFirestore } from '@/lib/firebase/cartService';
import { getWishlistFromFirestore } from '@/lib/firebase/wishlistService';
import { useUserStore } from '@/store/useUserStore';
import { consumePendingAction, resolvePendingAction } from '@/lib/pendingAction';
import type { UserProfile } from '@/types/user';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setRole, setLoyalty, setCart, setWishlist, clearAll } = useUserStore();

  useEffect(() => {
    if (!auth || !db) return;

    let profileUnsub: () => void = () => {};

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && db) {
        setUser(user);

        // 1. Real-time profile listener — reads role + loyalty
        profileUnsub = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;
            const role = data.role || 'customer';

            // Update Zustand role
            setRole(role);

            // Set role cookie so middleware can read it
            document.cookie = `user-role=${role}; path=/; max-age=86400; SameSite=Strict`;

            setLoyalty(data.loyaltyCount || 0, data.totalRewardsEarned || 0);
          } else {
            // New user — default to customer
            setRole('customer');
            document.cookie = `user-role=customer; path=/; max-age=86400; SameSite=Strict`;
          }
        });

        // 2. Load cart + wishlist
        const [cart, wishlist] = await Promise.all([
          getCartFromFirestore(user.uid),
          getWishlistFromFirestore(user.uid),
        ]);
        setCart(cart);
        setWishlist(wishlist);

        // 3. Complete any pending guest action
        const pending = consumePendingAction();
        if (pending) {
          await resolvePendingAction(pending, user.uid);
        }

      } else {
        profileUnsub();
        clearAll();
        // Clear role cookie on logout
        document.cookie = 'user-role=; path=/; max-age=0';
      }
    });

    return () => {
      unsub();
      profileUnsub();
    };
  }, [setUser, setRole, setLoyalty, setCart, setWishlist, clearAll]);

  return <>{children}</>;
}
