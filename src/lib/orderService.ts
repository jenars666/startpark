import { doc, updateDoc } from 'firebase/firestore';
import type { CartItem } from '../types';
import type {
  Order,
  OrderCustomer,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingAddress,
} from '../types/order';
import { db } from './firebase';
import {
  buildOrderNumber,
  createUserOrder,
  getOrderStatusText,
  getUserOrder as getSavedUserOrder,
  getUserOrders as getSavedUserOrders,
} from './customerStore';

export class OrderService {
  static async createOrder(
    userId: string,
    cartItems: CartItem[],
    customer: OrderCustomer,
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethod = 'cash_on_delivery'
  ) {
    return createUserOrder({
      userId,
      items: cartItems,
      customer,
      shippingAddress,
      paymentMethod,
    });
  }

  static async updateOrderStatus(userId: string, orderId: string, status: OrderStatus) {
    if (!db) {
      throw new Error('Firestore is not configured.');
    }

    const payload = {
      status,
      updatedAt: new Date(),
    };

    await Promise.all([
      updateDoc(doc(db, 'users', userId, 'orders', orderId), payload),
      updateDoc(doc(db, 'orders', orderId), payload),
    ]);
  }

  static async updatePaymentStatus(
    userId: string,
    orderId: string,
    paymentId: string,
    paymentStatus: PaymentStatus
  ) {
    if (!db) {
      throw new Error('Firestore is not configured.');
    }

    const payload = {
      paymentId,
      paymentStatus,
      status: paymentStatus === 'completed' ? 'confirmed' : 'pending',
      updatedAt: new Date(),
    };

    await Promise.all([
      updateDoc(doc(db, 'users', userId, 'orders', orderId), payload),
      updateDoc(doc(db, 'orders', orderId), payload),
    ]);
  }

  static async getOrder(userId: string, orderId: string) {
    return getSavedUserOrder(userId, orderId);
  }

  static async getUserOrders(userId: string) {
    return getSavedUserOrders(userId);
  }

  static generateOrderNumber(orderId: string) {
    return buildOrderNumber(orderId);
  }

  static getStatusText(status: Order['status']) {
    return getOrderStatusText(status);
  }
}
