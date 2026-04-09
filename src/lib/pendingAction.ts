import { CartItem, WishlistItem } from '@/types';
import { addItemToCart } from './firebase/cartService';
import { addItemToWishlist } from './firebase/wishlistService';
import { getCartFromFirestore } from './firebase/cartService';
import { getWishlistFromFirestore } from './firebase/wishlistService';
import { useUserStore } from '@/store/useUserStore';

export type PendingAuthAction = {
  type: 'cart' | 'wishlist' | 'buy';
  returnPath: string;
  cartItem?: CartItem;
  wishlistItem?: WishlistItem;
  savedAt: number;
};

// Save pending action before redirecting to login
export function savePendingAction(action: Omit<PendingAuthAction, 'savedAt'>) {
  const payload: PendingAuthAction = { ...action, savedAt: Date.now() };
  try {
    sessionStorage.setItem('pendingAction', JSON.stringify(payload));
  } catch {
    localStorage.setItem('pendingAction', JSON.stringify(payload));
  }
}

// Read + delete pending action after login
export function consumePendingAction(): PendingAuthAction | null {
  const raw =
    sessionStorage.getItem('pendingAction') ||
    localStorage.getItem('pendingAction');

  if (!raw) return null;

  const parsed: PendingAuthAction = JSON.parse(raw);

  // Expire after 10 minutes
  if (Date.now() - parsed.savedAt > 10 * 60 * 1000) {
    clearPendingAction();
    return null;
  }

  clearPendingAction();
  return parsed;
}

export function clearPendingAction() {
  sessionStorage.removeItem('pendingAction');
  localStorage.removeItem('pendingAction');
}

// Execute the action after login
export async function resolvePendingAction(
  action: PendingAuthAction,
  uid: string
) {
  const store = useUserStore.getState();

  if (action.type === 'cart' && action.cartItem) {
    await addItemToCart(uid, action.cartItem);
    const updated = await getCartFromFirestore(uid);
    store.setCart(updated);
    window.location.href = action.returnPath; // back to product page
  }

  if (action.type === 'buy' && action.cartItem) {
    await addItemToCart(uid, action.cartItem);
    const updated = await getCartFromFirestore(uid);
    store.setCart(updated);
    window.location.href = '/checkout'; // go straight to checkout
  }

  if (action.type === 'wishlist' && action.wishlistItem) {
    await addItemToWishlist(uid, action.wishlistItem);
    const updated = await getWishlistFromFirestore(uid);
    store.setWishlist(updated);
    window.location.href = action.returnPath; // back to product page
  }
}