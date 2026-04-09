import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  limit,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';

/* ── Helpers ── */

function formatDate(value: any): string {
  if (!value) return 'N/A';
  const d = value?.toDate ? value.toDate() : new Date(value);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(value: any): string {
  if (!value) return 'N/A';
  const d = value?.toDate ? value.toDate() : new Date(value);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function noopUnsubscribe(): Unsubscribe {
  return () => {};
}

/* ── Customers (from `users` collection) ── */

export interface AdminCustomer {
  name: string;
  email: string;
  orders: number;
  total: string;
  joined: string;
  status: string;
  uid: string;
  phone?: string;
}

/**
 * Real-time subscription to all registered users.
 * Derives order counts, total spend, etc. from user profile data.
 */
export function subscribeToCustomers(
  callback: (customers: AdminCustomer[]) => void
): Unsubscribe {
  if (!db) { callback([]); return noopUnsubscribe(); }

  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const customers: AdminCustomer[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          uid: doc.id,
          name: data.fullName || data.displayName || 'Guest',
          email: data.email || '',
          phone: data.phone || '',
          orders: data.orderCount ?? 0,
          total: `₹${(data.totalSpent ?? 0).toLocaleString('en-IN')}`,
          joined: formatDate(data.createdAt),
          status: data.role === 'admin' ? 'admin' : 'active',
        };
      });
      callback(customers);
    },
    (error) => {
      console.error('subscribeToCustomers error:', error);
      callback([]);
    }
  );
}

/* ── WhatsApp Enquiries (from `enquiries` collection) ── */

export interface AdminEnquiry {
  id: string;
  name: string;
  phone: string;
  message: string;
  date: string;
  status: string;
}

export function subscribeToWhatsAppEnquiries(
  callback: (enquiries: AdminEnquiry[]) => void
): Unsubscribe {
  if (!db) { callback([]); return noopUnsubscribe(); }

  const q = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const enquiries: AdminEnquiry[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || data.customerName || 'Unknown',
          phone: data.phone || data.whatsappNumber || '',
          message: data.message || data.enquiry || '',
          date: formatDateTime(data.createdAt),
          status: data.status || 'new',
        };
      });
      callback(enquiries);
    },
    (error) => {
      console.error('subscribeToWhatsAppEnquiries error:', error);
      callback([]);
    }
  );
}

/* ── Group Orders (orders with type='group' or isGroupOrder=true) ── */

export interface AdminGroupOrder {
  id: string;
  event: string;
  count: number;
  color: string;
  date: string;
  revenue: string;
  status: string;
}

export function subscribeToGroupOrders(
  callback: (groupOrders: AdminGroupOrder[]) => void
): Unsubscribe {
  if (!db) { callback([]); return noopUnsubscribe(); }

  // Listen to a dedicated 'groupOrders' collection OR
  // filter orders collection. We'll use a dedicated collection.
  const q = query(collection(db, 'groupOrders'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const groups: AdminGroupOrder[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          event: data.event || data.groupName || 'Untitled Group',
          count: data.quantity || data.count || 0,
          color: data.color || 'White',
          date: formatDate(data.deadline || data.createdAt),
          revenue: `₹${(data.revenue || data.total || 0).toLocaleString('en-IN')}`,
          status: data.status || 'pending',
        };
      });
      callback(groups);
    },
    (error) => {
      console.error('subscribeToGroupOrders error:', error);
      callback([]);
    }
  );
}

/* ── Stock History (from `stockHistory` collection) ── */

export interface AdminStockEntry {
  product: string;
  qty: string;
  action: string;
  by: string;
  date: string;
}

export function subscribeToStockHistory(
  callback: (history: AdminStockEntry[]) => void
): Unsubscribe {
  if (!db) { callback([]); return noopUnsubscribe(); }

  const q = query(
    collection(db, 'stockHistory'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const history: AdminStockEntry[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const qty = data.quantity || 0;
        return {
          product: data.productName || data.product || 'Unknown',
          qty: qty > 0 ? `+${qty}` : String(qty),
          action: data.action || (qty > 0 ? 'Restock' : 'Sold'),
          by: data.by || data.updatedBy || 'System',
          date: formatDate(data.createdAt),
        };
      });
      callback(history);
    },
    (error) => {
      console.error('subscribeToStockHistory error:', error);
      callback([]);
    }
  );
}

/* ── Coupons (from `promotions` collection where type='coupon') ── */

export interface AdminCoupon {
  code: string;
  type: string;
  value: string;
  used: number;
  expiry: string;
  status: string;
}

export function subscribeToCoupons(
  callback: (coupons: AdminCoupon[]) => void
): Unsubscribe {
  if (!db) { callback([]); return noopUnsubscribe(); }

  const q = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const coupons: AdminCoupon[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          code: data.code || doc.id,
          type: data.discountType || data.type || 'Flat',
          value: data.discountType === 'percentage'
            ? `${data.discount || data.value}%`
            : `₹${data.discount || data.value || 0}`,
          used: data.usedCount ?? data.used ?? 0,
          expiry: formatDate(data.expiresAt || data.expiry),
          status: data.active === false ? 'expired' : 'active',
        };
      });
      callback(coupons);
    },
    (error) => {
      console.error('subscribeToCoupons error:', error);
      callback([]);
    }
  );
}

/* ── Festivals (from `festivals` collection) ── */

export interface AdminFestival {
  name: string;
  date: string;
  enquiries: string;
  status: string;
}

export function subscribeToFestivals(
  callback: (festivals: AdminFestival[]) => void
): Unsubscribe {
  if (!db) { callback([]); return noopUnsubscribe(); }

  const q = query(collection(db, 'festivals'), orderBy('date', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const festivals: AdminFestival[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const festDate = data.date?.toDate ? data.date.toDate() : new Date(data.date);
        const isPast = festDate < new Date();
        return {
          name: data.name || 'Unnamed Festival',
          date: formatDate(data.date),
          enquiries: `${data.enquiries ?? data.preOrderCount ?? 0} enquiries`,
          status: isPast ? 'completed' : (data.status || 'upcoming'),
        };
      });
      callback(festivals);
    },
    (error) => {
      console.error('subscribeToFestivals error:', error);
      callback([]);
    }
  );
}

/* ── Staff (from `staff` collection) ── */

export interface AdminStaffMember {
  name: string;
  role: string;
  access: string;
  status: string;
}

export function subscribeToStaff(
  callback: (staff: AdminStaffMember[]) => void
): Unsubscribe {
  if (!db) { callback([]); return noopUnsubscribe(); }

  const q = query(collection(db, 'staff'));

  return onSnapshot(
    q,
    (snapshot) => {
      const staff: AdminStaffMember[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          name: data.name || 'Unknown',
          role: data.role || 'staff',
          access: data.access || 'View Only',
          status: data.status || 'active',
        };
      });
      callback(staff);
    },
    (error) => {
      console.error('subscribeToStaff error:', error);
      callback([]);
    }
  );
}

/* ── Top Products (from `products` collection by soldCount) ── */

export interface AdminTopProduct {
  name: string;
  sold: number;
  revenue: string;
}

export function subscribeToTopProducts(
  callback: (products: AdminTopProduct[]) => void
): Unsubscribe {
  if (!db) { callback([]); return noopUnsubscribe(); }

  const q = query(
    collection(db, 'products'),
    orderBy('soldCount', 'desc'),
    limit(5)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const products: AdminTopProduct[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const price = typeof data.price === 'number'
          ? data.price
          : parseFloat(String(data.price).replace(/[^0-9.]/g, '')) || 0;
        const sold = data.soldCount ?? 0;
        return {
          name: data.name || data.title || 'Unknown',
          sold,
          revenue: `₹${(sold * price).toLocaleString('en-IN')}`,
        };
      });
      callback(products);
    },
    (error) => {
      console.error('subscribeToTopProducts error:', error);
      callback([]);
    }
  );
}

/* ── Reviews (from `reviews` collection) ── */

export interface AdminReview {
  name: string;
  rating: number;
  text: string;
  date: string;
  productName?: string;
}

export function subscribeToReviews(
  callback: (reviews: AdminReview[]) => void
): Unsubscribe {
  if (!db) { callback([]); return noopUnsubscribe(); }

  const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const reviews: AdminReview[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          name: data.userName || data.name || 'Anonymous',
          rating: data.rating ?? 5,
          text: data.comment || data.text || data.review || '',
          date: formatDate(data.createdAt),
          productName: data.productName || '',
        };
      });
      callback(reviews);
    },
    (error) => {
      console.error('subscribeToReviews error:', error);
      callback([]);
    }
  );
}
