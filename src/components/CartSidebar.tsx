'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import {
  loadRazorpayCheckoutScript,
  type RazorpayFailureResponse,
  type RazorpaySuccessResponse,
} from '../lib/razorpay-client';
import './CartSidebar.css';

export default function CartSidebar() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const { user } = useFirebaseAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (cartItems.length === 0 || isCheckingOut) {
      return;
    }

    setIsCheckingOut(true);

    try {
      const scriptLoaded = await loadRazorpayCheckoutScript();

      if (!scriptLoaded || !window.Razorpay) {
        toast.error('Unable to load checkout right now.');
        setIsCheckingOut(false);
        return;
      }

      const orderResponse = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const orderPayload = await orderResponse.json();

      if (!orderResponse.ok) {
        toast.error(orderPayload?.error || 'Unable to start checkout.');
        setIsCheckingOut(false);
        return;
      }

      const verifySuccessfulPayment = async (paymentResponse: RazorpaySuccessResponse) => {
        const verifyResponse = await fetch('/api/payments/razorpay/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderPayload.order.id,
            ...paymentResponse,
          }),
        });

        const verificationPayload = await verifyResponse.json();

        if (!verifyResponse.ok || !verificationPayload?.verified) {
          throw new Error(verificationPayload?.error || 'Payment verification failed.');
        }

        clearCart();
        setIsCartOpen(false);
        toast.success('Payment successful. Your order is confirmed.');
      };

      const checkout = new window.Razorpay({
        key: orderPayload.keyId,
        amount: orderPayload.order.amount,
        currency: orderPayload.order.currency,
        name: 'Star Mens Park',
        description: `Cart checkout for ${totalItems} item${totalItems > 1 ? 's' : ''}`,
        order_id: orderPayload.order.id,
        handler: async (paymentResponse) => {
          try {
            await verifySuccessfulPayment(paymentResponse);
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Payment completed but verification failed.';
            toast.error(message);
          } finally {
            setIsCheckingOut(false);
          }
        },
        prefill: {
          name: user?.displayName ?? undefined,
          email: user?.email ?? undefined,
          contact: user?.phoneNumber ?? undefined,
        },
        notes: {
          cart_items: String(totalItems),
        },
        theme: {
          color: '#111111',
        },
        modal: {
          ondismiss: () => {
            setIsCheckingOut(false);
          },
        },
      });

      checkout.on('payment.failed', (paymentError: RazorpayFailureResponse) => {
        toast.error(paymentError.error?.description || 'Payment was not completed.');
        setIsCheckingOut(false);
      });

      checkout.open();
    } catch (error) {
      console.error('Checkout start failed:', error);
      const message = error instanceof Error ? error.message : 'Unable to start checkout.';
      toast.error(message);
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
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
                        <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="80px" />
                      </div>
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <div className="cart-item-price">₹{item.price}</div>
                        <div className="cart-item-controls">
                          <div className="cart-qty-box">
                            <button onClick={() => updateQuantity(item.id, -1)}>
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)}>
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            className="remove-item-btn"
                            onClick={() => removeFromCart(item.id)}
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

            {cartItems.length > 0 && (
              <div className="cart-footer-summary">
                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <span className="total-val">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <p className="shipping-note">Shipping and taxes calculated at checkout.</p>
                <button
                  className="checkout-btn-main"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? 'OPENING CHECKOUT...' : 'PROCEED TO CHECKOUT'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
