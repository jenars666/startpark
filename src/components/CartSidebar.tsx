'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContextFirebase';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { formatCurrency, parsePrice } from '../lib/customerStore';
import './CartSidebar.css';

export default function CartSidebar() {
  const router = useRouter();
  const { user } = useFirebaseAuth();
  const {
    cartItems,
    clearCart,
    isCartOpen,
    removeFromCart,
    setIsCartOpen,
    totalItems,
    totalPrice,
    updateQuantity,
  } = useCart();

  const handleUpdateQuantity = async (id: number | string, delta: number) => {
    const item = cartItems.find(item => String(item.id) === String(id));
    if (item) {
      await updateQuantity(id, item.quantity + delta);
    }
  };

  const handleRemoveItem = async (id: number | string) => {
    await removeFromCart(id);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push(user ? '/checkout' : '/login?redirect=/checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    router.push('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="cart-overlay"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="cart-sidebar"
          >
            <div className="cart-header-title">
              <div className="cart-title-row">
                <ShoppingBag size={24} />
                <h2>SHOPPING CART</h2>
              </div>
              <button
                className="close-cart-btn"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            <div className="cart-items-container">
              {cartItems.length === 0 ? (
                <div className="empty-cart-msg">
                  <p>Your cart is empty</p>
                  <button className="start-shopping-btn" onClick={() => setIsCartOpen(false)}>
                    START SHOPPING
                  </button>
                </div>
              ) : (
                <div className="cart-items-list no-scrollbar">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div
                        className="cart-item-img"
                        style={{ position: 'relative', width: '80px', height: '100px' }}
                      >
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          sizes="80px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <div className="cart-item-price">{formatCurrency(parsePrice(item.price))}</div>
                        <div className="cart-item-controls">
                          <div className="cart-qty-box">
                            <button onClick={() => handleUpdateQuantity(item.id, -1)}>
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => handleUpdateQuantity(item.id, 1)}>
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            className="remove-item-btn"
                            onClick={() => {
                              handleRemoveItem(item.id);
                              toast.success('Removed from cart.');
                            }}
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 ? (
              <div className="cart-footer-summary">
                <div className="cart-subtotal">
                  <span>
                    Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''})
                  </span>
                  <span className="total-val">{formatCurrency(totalPrice)}</span>
                </div>
                <p className="shipping-note">
                  {user
                    ? 'Your saved cart is linked to your account.'
                    : 'Sign in at checkout to save this cart to your account.'}
                </p>
                <button className="checkout-btn-main" onClick={handleCheckout}>
                  {user ? 'CONTINUE TO CHECKOUT' : 'SIGN IN TO CHECKOUT'}
                </button>
                <button className="start-shopping-btn" onClick={handleViewCart}>
                  VIEW FULL CART
                </button>
                <button
                  className="start-shopping-btn"
                  onClick={() => {
                    handleClearCart();
                    toast.success('Cart cleared.');
                  }}
                >
                  CLEAR CART
                </button>
              </div>
            ) : null}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
