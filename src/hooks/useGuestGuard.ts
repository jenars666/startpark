import { useUserStore } from '@/store/useUserStore';
import { savePendingAction } from '@/lib/pendingAction';
import { useRouter, usePathname } from 'next/navigation';
import { CartItem, WishlistItem } from '@/types';

export function useGuestGuard() {
  const { user: firebaseUser } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  function guardAddToCart(item: CartItem) {
    if (!firebaseUser) {
      savePendingAction({ type: 'cart', returnPath: pathname, cartItem: item });
      router.push('/login');
      return false; // blocked
    }
    return true; // allowed — proceed
  }

  function guardBuyNow(item: CartItem) {
    if (!firebaseUser) {
      savePendingAction({ type: 'buy', returnPath: pathname, cartItem: item });
      router.push('/login');
      return false;
    }
    return true;
  }

  function guardWishlist(item: WishlistItem) {
    if (!firebaseUser) {
      savePendingAction({ type: 'wishlist', returnPath: pathname, wishlistItem: item });
      router.push('/login');
      return false;
    }
    return true;
  }

  return { guardAddToCart, guardBuyNow, guardWishlist };
}