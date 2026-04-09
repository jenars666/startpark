import {
  collection,
  query,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface AdminOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  total: number;
  status: string;
  date: string;
  items?: any[];
  customerInfo?: { name?: string; email?: string; phone?: string };
  createdAt?: any;
  userId?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  shippingAddress?: any;
}

function formatDate(value: any): string {
  if (!value) return new Date().toLocaleDateString('en-IN');
  const d = value?.toDate ? value.toDate() : new Date(value);
  if (isNaN(d.getTime())) return new Date().toLocaleDateString('en-IN');
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Real-time subscription to ALL orders in the root `orders` collection.
 * Used by the admin panel Dashboard + Orders tabs.
 */
export function subscribeToAllOrders(
  callback: (orders: AdminOrder[]) => void
): Unsubscribe {
  if (!db) {
    callback([]);
    return () => {};
  }

  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const orders: AdminOrder[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const items = data.items || [];
        const customerName =
          data.customer?.fullName ||
          data.customerInfo?.name ||
          'Guest';
        const productNames =
          items.map((i: any) => i.name).join(', ') || 'Unknown';
        const total = data.total || data.subtotal || 0;

        return {
          id: data.orderNumber || doc.id.slice(-6).toUpperCase(),
          customer: customerName,
          product: productNames,
          amount: `₹${total.toLocaleString('en-IN')}`,
          total,
          status: data.status || 'pending',
          date: formatDate(data.createdAt),
          items,
          customerInfo: data.customer || data.customerInfo,
          createdAt: data.createdAt,
          userId: data.userId,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
          shippingAddress: data.shippingAddress,
        };
      });

      callback(orders);
    },
    (error) => {
      console.error('subscribeToAllOrders error:', error);
      callback([]);
    }
  );
}
