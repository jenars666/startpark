'use client';

import { useUserStore } from '@/store/useUserStore';
import { useCart } from '@/context/CartContextFirebase';
import { useWishlist } from '@/context/WishlistContextFirebase';
import { useGuestGuard } from '@/hooks/useGuestGuard';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function TestPage() {
  const { user } = useUserStore();
  const { cartItems, addToCart, totalItems } = useCart();
  const { wishlistItems, addToWishlist, isInWishlist } = useWishlist();
  const { guardAddToCart, guardWishlist } = useGuestGuard();

  const testProduct = {
    id: 'test-1',
    name: 'Test Shirt',
    price: '999',
    img: '/images/casual/casual-1.jpg',
    quantity: 1,
  };

  const testWishlistItem = {
    id: 'test-1',
    name: 'Test Shirt',
    price: '999',
    img: '/images/casual/casual-1.jpg',
  };

  const handleAddToCart = async () => {
    if (!guardAddToCart(testProduct)) return;
    await addToCart(testProduct);
  };

  const handleAddToWishlist = async () => {
    if (!guardWishlist(testWishlistItem)) return;
    await addToWishlist(testWishlistItem);
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Firebase Sync Test Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>User Status</h2>
        {user ? (
          <div>
            <p>✅ Logged in as: {user.email}</p>
            <button onClick={handleLogout} style={{ padding: '8px 16px', marginTop: '10px' }}>
              Logout
            </button>
          </div>
        ) : (
          <p>❌ Not logged in</p>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Cart Test</h2>
        <p>Total Items: {totalItems}</p>
        <p>Cart Items: {cartItems.length}</p>
        <button onClick={handleAddToCart} style={{ padding: '8px 16px', marginRight: '10px' }}>
          Add Test Item to Cart
        </button>
        
        {cartItems.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h3>Cart Contents:</h3>
            {cartItems.map((item, index) => (
              <div key={index} style={{ padding: '5px', border: '1px solid #eee', margin: '5px 0' }}>
                {item.name} - ₹{item.price} (Qty: {item.quantity})
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>Wishlist Test</h2>
        <p>Wishlist Items: {wishlistItems.length}</p>
        <p>Test item in wishlist: {isInWishlist('test-1') ? '✅ Yes' : '❌ No'}</p>
        <button onClick={handleAddToWishlist} style={{ padding: '8px 16px', marginRight: '10px' }}>
          Add Test Item to Wishlist
        </button>
        
        {wishlistItems.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <h3>Wishlist Contents:</h3>
            {wishlistItems.map((item, index) => (
              <div key={index} style={{ padding: '5px', border: '1px solid #eee', margin: '5px 0' }}>
                {item.name} - ₹{item.price}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2>Test Instructions</h2>
        <ol>
          <li>If not logged in, click "Add to Cart" or "Add to Wishlist" - should redirect to login</li>
          <li>Login with your account</li>
          <li>Should automatically complete the pending action and return here</li>
          <li>Try adding items while logged in - should sync to Firestore</li>
          <li>Logout and login again - should restore your data</li>
          <li>Open in another browser/device with same account - should see same data</li>
        </ol>
      </div>
    </div>
  );
}