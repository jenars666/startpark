'use client';

import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import './CartSidebar.css';

export default function CartSidebar() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="cart-overlay"
          />
          
          {/* Sidebar */}
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
                      <div className="cart-item-img" style={{ position: 'relative', width: '80px', height: '100px' }}>
                        <Image src={item.img} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="80px" />
                      </div>
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <div className="cart-item-price">₹{item.price}</div>
                        <div className="cart-item-controls">
                          <div className="cart-qty-box">
                            <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
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
                <button className="checkout-btn-main">PROCEED TO CHECKOUT</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
