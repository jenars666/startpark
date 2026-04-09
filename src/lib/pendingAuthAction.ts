'use client';

import type { User } from 'firebase/auth';
import type { CartItem, WishlistItem } from '@/types';
import {
  getUserCart,
  getUserWishlist,
  mergeCartItems,
  mergeWishlistItems,
  saveUserCart,
  saveUserWishlist,
} from './customerStore';
import { sanitizeInternalPath } from './internalPaths';

export type PendingAuthActionType = 'cart' | 'wishlist' | 'buy';

export type PendingAuthAction = {
  type: PendingAuthActionType;
  returnPath: string;
  cartItem?: CartItem;
  cartItems?: CartItem[];
  wishlistItem?: WishlistItem;
};

const PENDING_AUTH_ACTION_KEY = 'star_pending_auth_action';

function isBrowser() {
  return typeof window !== 'undefined';
}
export { sanitizeInternalPath } from './internalPaths';

export function getCurrentPathWithSearch(fallback: string = '/') {
  if (!isBrowser()) {
    return fallback;
  }

  return sanitizeInternalPath(
    `${window.location.pathname}${window.location.search}${window.location.hash}`,
    fallback
  );
}

export function getPendingActionDestination(action: PendingAuthAction | null | undefined) {
  if (!action) {
    return '/';
  }

  return action.type === 'buy'
    ? '/checkout'
    : sanitizeInternalPath(action.returnPath, '/');
}

export function getResolvedPostAuthPath(
  action: PendingAuthAction | null | undefined,
  fallbackPath: string
) {
  return action ? getPendingActionDestination(action) : sanitizeInternalPath(fallbackPath, '/');
}

export function buildLoginHref(redirectPath: string) {
  const safePath = sanitizeInternalPath(redirectPath, '/');
  return `/login?redirect=${encodeURIComponent(safePath)}`;
}

export function readPendingAuthAction(): PendingAuthAction | null {
  if (!isBrowser()) {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(PENDING_AUTH_ACTION_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as PendingAuthAction;

    if (!parsed || typeof parsed !== 'object' || !parsed.type) {
      clearPendingAuthAction();
      return null;
    }

    return {
      ...parsed,
      returnPath: sanitizeInternalPath(parsed.returnPath, '/'),
    };
  } catch {
    clearPendingAuthAction();
    return null;
  }
}

export function savePendingAuthAction(action: PendingAuthAction) {
  if (!isBrowser()) {
    return;
  }

  const payload: PendingAuthAction = {
    ...action,
    returnPath: sanitizeInternalPath(action.returnPath, '/'),
  };

  window.sessionStorage.setItem(PENDING_AUTH_ACTION_KEY, JSON.stringify(payload));
}

export function clearPendingAuthAction() {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(PENDING_AUTH_ACTION_KEY);
}

export async function applyPendingAuthAction(user: User, action: PendingAuthAction | null) {
  if (!action) {
    return null;
  }

  if (action.type === 'wishlist' && action.wishlistItem) {
    const existingWishlist = await getUserWishlist(user.uid);
    const nextWishlist = mergeWishlistItems(existingWishlist, [action.wishlistItem]);
    await saveUserWishlist(user.uid, nextWishlist);
    return 'Saved to your wishlist.';
  }

  const queuedCartItems = action.cartItems || (action.cartItem ? [action.cartItem] : []);
  if ((action.type === 'cart' || action.type === 'buy') && queuedCartItems.length > 0) {
    const existingCart = await getUserCart(user.uid);
    const nextCart = mergeCartItems(existingCart, queuedCartItems);
    await saveUserCart(user.uid, nextCart);
    return action.type === 'buy'
      ? 'Your item is ready for checkout.'
      : 'Added to your cart.';
  }

  return null;
}
