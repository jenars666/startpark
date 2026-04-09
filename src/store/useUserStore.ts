'use client';

import { create } from 'zustand';
import type { User } from 'firebase/auth';
import type { CartItem, WishlistItem } from '@/types';

interface UserStore {
  user: User | null;
  role: 'customer' | 'admin' | null;
  loyaltyCount: number;
  totalRewardsEarned: number;
  cart: CartItem[];
  wishlist: WishlistItem[];
  setUser: (user: User | null) => void;
  setRole: (role: 'customer' | 'admin' | null) => void;
  setLoyalty: (count: number, earned: number) => void;
  setCart: (cart: CartItem[]) => void;
  setWishlist: (wishlist: WishlistItem[]) => void;
  clearAll: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  role: null,
  loyaltyCount: 0,
  totalRewardsEarned: 0,
  cart: [],
  wishlist: [],
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoyalty: (loyaltyCount, totalRewardsEarned) => set({ loyaltyCount, totalRewardsEarned }),
  setCart: (cart) => set({ cart }),
  setWishlist: (wishlist) => set({ wishlist }),
  clearAll: () => set({ user: null, role: null, loyaltyCount: 0, totalRewardsEarned: 0, cart: [], wishlist: [] }),
}));
