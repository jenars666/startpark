import type { CartItem, WishlistItem } from './index';
import type { DateValue } from './order';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  photoURL?: string;
  role?: 'customer' | 'admin';
  createdAt?: DateValue;
  updatedAt?: DateValue;
  cart?: CartItem[];
  wishlist?: WishlistItem[];
  loyaltyCount?: number;
  totalRewardsEarned?: number;
}

export interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
}
