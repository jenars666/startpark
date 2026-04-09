'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { subscribeToCart, saveCartToFirestore } from '@/lib/firebase/cartService';
import type { CartItem } from '@/types';
import toast from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (id: number | string) => Promise<void>;
  updateQuantity: (id: number | string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, cart, setCart } = useUserStore();
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Subscribe to real-time cart updates when user is logged in
  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToCart(user.uid, (items) => {
      setCart(items);
    });

    return unsubscribe;
  }, [user, setCart]);

  const addToCart = async (item: CartItem) => {
    if (!user) {
      console.warn('Cannot add to cart: user not authenticated');
      return;
    }

    const existingItem = cart.find(cartItem => String(cartItem.id) === String(item.id));
    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = cart.map(cartItem =>
        String(cartItem.id) === String(item.id)
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    } else {
      updatedCart = [...cart, item];
    }

    setCart(updatedCart);
    await saveCartToFirestore(user.uid, updatedCart);
    toast.success('Added to cart!');
    setIsCartOpen(true);
  };

  const removeFromCart = async (id: number | string) => {
    if (!user) return;

    const updatedCart = cart.filter(item => String(item.id) !== String(id));
    setCart(updatedCart);
    await saveCartToFirestore(user.uid, updatedCart);
    toast.success('Removed from cart!');
  };

  const updateQuantity = async (id: number | string, quantity: number) => {
    if (!user) return;

    const updatedCart = cart.map(item =>
      String(item.id) === String(id)
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );

    setCart(updatedCart);
    await saveCartToFirestore(user.uid, updatedCart);
  };

  const clearCart = async () => {
    if (!user) return;

    setCart([]);
    await saveCartToFirestore(user.uid, []);
    toast.success('Cart cleared!');
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const priceValue = typeof item.price === 'string'
      ? Number(item.price.replace(/,/g, '').replace(/[^0-9.]/g, '')) || 0
      : item.price;
    return sum + priceValue * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems: cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};