'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import type { CartItem, WishlistItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import {
  buildLoginHref,
  getCurrentPathWithSearch,
  getPendingActionDestination,
  savePendingAuthAction,
  type PendingAuthAction,
} from '@/lib/pendingAuthAction';

type CartActionOptions = {
  returnPath?: string;
  successMessage?: string;
  destination?: string;
  actionType?: 'cart' | 'buy';
  onSuccess?: () => void;
};

type WishlistActionOptions = {
  returnPath?: string;
};

export function useProtectedShoppingActions() {
  const router = useRouter();
  const { user } = useFirebaseAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const queuePendingAction = (action: PendingAuthAction) => {
    savePendingAuthAction(action);
    router.push(buildLoginHref(getPendingActionDestination(action)));
  };

  const addItemsToCart = (items: CartItem[], options: CartActionOptions = {}) => {
    const returnPath = options.returnPath || getCurrentPathWithSearch('/');
    const actionType = options.actionType || (options.destination === '/checkout' ? 'buy' : 'cart');

    if (!user) {
      queuePendingAction({
        type: actionType,
        returnPath,
        cartItems: items,
      });
      return false;
    }

    items.forEach((item) => addToCart(item));

    if (options.onSuccess) {
      options.onSuccess();
    }

    if (options.successMessage) {
      toast.success(options.successMessage);
    }

    if (options.destination) {
      router.push(options.destination);
    }

    return true;
  };

  const addItemToCart = (item: CartItem, options: CartActionOptions = {}) =>
    addItemsToCart([item], options);

  const toggleWishlistItem = (item: WishlistItem, options: WishlistActionOptions = {}) => {
    if (!user) {
      queuePendingAction({
        type: 'wishlist',
        returnPath: options.returnPath || getCurrentPathWithSearch('/'),
        wishlistItem: item,
      });
      return false;
    }

    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
      return true;
    }

    addToWishlist(item);
    return true;
  };

  return {
    user,
    isInWishlist,
    addItemToCart,
    addItemsToCart,
    toggleWishlistItem,
  };
}
