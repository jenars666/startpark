import type { User } from 'firebase/auth';
import {
  Timestamp,
  collection,
  doc,
  type DocumentData,
  type DocumentReference,
  type Query as FirestoreQuery,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  orderBy,
  query,
  runTransaction,
  setDoc,
  where,
} from 'firebase/firestore';
import type { CartItem, WishlistItem } from '@/types';
import type {
  DateValue,
  Order,
  OrderCustomer,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  ShippingAddress,
} from '@/types/order';
import type { UserProfile } from '@/types/user';
import { db } from './firebase';

type ProfileSeed = Partial<Pick<UserProfile, 'fullName' | 'phone'>>;

const DEFAULT_ADMIN_EMAILS = ['admin@starmenspark.com'];

function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  const configuredAdminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS
    ?.split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  const adminEmails =
    configuredAdminEmails && configuredAdminEmails.length > 0
      ? configuredAdminEmails
      : DEFAULT_ADMIN_EMAILS;

  return adminEmails.includes(email.trim().toLowerCase());
}

type CreateOrderInput = {
  userId: string;
  items: CartItem[];
  customer: OrderCustomer;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
  discountCode?: string;
  discountAmount?: number;
};

type StatusTone =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

type LegacyShippingAddress = Partial<ShippingAddress> & {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
};

type LegacyOrder = Partial<Order> & {
  items?: OrderItem[];
  shippingAddress?: LegacyShippingAddress;
};

function requireDb() {
  if (!db) {
    throw new Error('Firestore is not configured.');
  }

  return db;
}

function getErrorCode(error: unknown) {
  return typeof error === 'object' && error && 'code' in error
    ? String(error.code)
    : '';
}

export function isFirestoreOfflineError(error: unknown) {
  const code = getErrorCode(error);
  const message =
    typeof error === 'object' && error && 'message' in error
      ? String(error.message).toLowerCase()
      : '';

  return (
    code === 'unavailable' ||
    code === 'failed-precondition' ||
    code === 'deadline-exceeded' ||
    message.includes('offline') ||
    code === 'timeout-exceeded' ||
    message.includes('timeout-exceeded')
  );
}

export function withTimeout<T>(promise: Promise<T>, ms: number = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('timeout-exceeded')), ms)
    )
  ]);
}

async function getDocWithOfflineFallback<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  reference: DocumentReference<AppModelType, DbModelType>
) {
  try {
    return await withTimeout(getDoc(reference));
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      throw error;
    }

    try {
      return await getDocFromCache(reference);
    } catch (cacheError) {
      if (!isFirestoreOfflineError(cacheError)) {
        throw cacheError;
      }

      return null;
    }
  }
}

async function getDocsWithOfflineFallback<
  AppModelType = DocumentData,
  DbModelType extends DocumentData = DocumentData,
>(
  firestoreQuery: FirestoreQuery<AppModelType, DbModelType>
) {
  try {
    return await withTimeout(getDocs(firestoreQuery));
  } catch (error) {
    if (!isFirestoreOfflineError(error)) {
      throw error;
    }

    try {
      return await getDocsFromCache(firestoreQuery);
    } catch (cacheError) {
      if (!isFirestoreOfflineError(cacheError)) {
        throw cacheError;
      }

      return null;
    }
  }
}

export function parsePrice(value: string | number) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  return Number(value.replace(/,/g, '').replace(/[^0-9.]/g, '')) || 0;
}

export function formatCurrency(value: number | undefined | null) {
  if (value === undefined || value === null || isNaN(value)) return 'Rs. 0';
  return `Rs. ${value.toLocaleString('en-IN')}`;
}

export function toDate(value: DateValue) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (typeof value === 'object' && 'toDate' in value) {
    return value.toDate();
  }

  return null;
}

export function formatDate(value: DateValue) {
  const parsed = toDate(value);

  if (!parsed) {
    return 'N/A';
  }

  return parsed.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function buildOrderNumber(orderId: string) {
  return `SMP-${orderId.slice(-6).toUpperCase()}`;
}

export function getOrderStatusText(status: OrderStatus) {
  switch (status) {
    case 'pending':
      return 'Order placed';
    case 'confirmed':
      return 'Confirmed';
    case 'processing':
      return 'Processing';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Updated';
  }
}

export function getOrderStatusTone(status: OrderStatus): StatusTone {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'confirmed':
      return 'confirmed';
    case 'processing':
      return 'processing';
    case 'shipped':
      return 'shipped';
    case 'delivered':
      return 'delivered';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
}

export function normalizeCartItems(items: CartItem[]) {
  return items
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img,
      quantity: item.quantity,
    }));
}

export function normalizeWishlistItems(items: WishlistItem[]) {
  return items
    .filter((item) => item && item.id !== undefined && item.name && item.img)
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: String(item.price),
      img: item.img,
    }));
}

export function mergeCartItems(primary: CartItem[], secondary: CartItem[]) {
  const merged = new Map<string, CartItem>();

  [...primary, ...secondary].forEach((item) => {
    const key = String(item.id);
    const existing = merged.get(key);

    if (existing) {
      merged.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
      return;
    }

    merged.set(key, { ...item });
  });

  return Array.from(merged.values());
}

export function mergeWishlistItems(primary: WishlistItem[], secondary: WishlistItem[]) {
  const merged = new Map<string, WishlistItem>();

  [...primary, ...secondary].forEach((item) => {
    const key = String(item.id);

    if (!merged.has(key)) {
      merged.set(key, {
        ...item,
        price: String(item.price),
      });
    }
  });

  return Array.from(merged.values());
}

function normalizeOrderItems(items: CartItem[]): OrderItem[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    price: parsePrice(item.price),
    quantity: item.quantity,
    img: item.img,
    category: 'Shirt',
  }));
}

function orderCollection(userId: string) {
  const firestore = requireDb();
  return collection(firestore, 'users', userId, 'orders');
}

function orderDoc(userId: string, orderId: string) {
  const firestore = requireDb();
  return doc(firestore, 'users', userId, 'orders', orderId);
}

function legacyOrderDoc(orderId: string) {
  const firestore = requireDb();
  return doc(firestore, 'orders', orderId);
}

export async function ensureUserProfile(user: User, seed: ProfileSeed = {}) {
  const firestore = requireDb();
  const userRef = doc(firestore, 'users', user.uid);
  const existingSnap = await getDocWithOfflineFallback(userRef);
  const existing = existingSnap?.exists()
    ? (existingSnap.data() as Partial<UserProfile>)
    : {};
  const existingRole =
    existing.role === 'admin' || existing.role === 'customer' ? existing.role : undefined;

  const payload: UserProfile = {
    uid: user.uid,
    fullName: seed.fullName || existing.fullName || user.displayName || 'Star Customer',
    email: user.email || existing.email || '',
    phone: seed.phone || existing.phone || '',
    photoURL: user.photoURL || existing.photoURL || '',
    createdAt: existing.createdAt || Timestamp.now(),
    updatedAt: Timestamp.now(),
    cart: Array.isArray(existing.cart) ? normalizeCartItems(existing.cart) : [],
    wishlist: Array.isArray(existing.wishlist)
      ? (existing.wishlist as WishlistItem[])
      : [],
    role: existingRole ?? (isAdminEmail(user.email) ? 'admin' : 'customer'),
    loyaltyCount: existing.loyaltyCount ?? 0,
    totalRewardsEarned: existing.totalRewardsEarned ?? 0,
  };

  try {
    await withTimeout(setDoc(userRef, payload, { merge: true }), 5000);
  } catch (error) {
    if (!isFirestoreOfflineError(error) && getErrorCode(error) !== 'timeout-exceeded') {
      console.warn('Failed to completely write user profile (it may write when online):', error);
    }
  }
  
  return payload;
}

export async function getUserProfile(userId: string) {
  const firestore = requireDb();
  const userRef = doc(firestore, 'users', userId);
  const userSnap = await getDocWithOfflineFallback(userRef);

  if (!userSnap?.exists()) {
    return null;
  }

  return userSnap.data() as UserProfile;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'fullName' | 'phone' | 'photoURL' | 'email'>>
) {
  const firestore = requireDb();
  const userRef = doc(firestore, 'users', userId);

  await setDoc(
    userRef,
    {
      ...updates,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

export async function getUserCart(userId: string) {
  const profile = await getUserProfile(userId);
  return Array.isArray(profile?.cart) ? normalizeCartItems(profile.cart) : [];
}

export async function getUserWishlist(userId: string) {
  const profile = await getUserProfile(userId);
  return Array.isArray(profile?.wishlist)
    ? normalizeWishlistItems(profile.wishlist as WishlistItem[])
    : [];
}

export async function saveUserCart(userId: string, items: CartItem[]) {
  const firestore = requireDb();
  const userRef = doc(firestore, 'users', userId);

  try {
    await withTimeout(
      setDoc(
        userRef,
        {
          cart: normalizeCartItems(items),
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      ),
      5000
    );
  } catch (error) {
    console.warn('Failed to sync cart via store (will save locally):', error);
    throw error;
  }
}

export async function saveUserWishlist(userId: string, items: WishlistItem[]) {
  const firestore = requireDb();
  const userRef = doc(firestore, 'users', userId);

  try {
    await withTimeout(
      setDoc(
        userRef,
        {
          wishlist: normalizeWishlistItems(items),
          updatedAt: Timestamp.now(),
        },
        { merge: true }
      ),
      5000
    );
  } catch (error) {
    console.warn('Failed to sync wishlist via store (will save locally):', error);
    throw error;
  }
}

export async function createUserOrder(input: CreateOrderInput) {
  const firestore = requireDb();
  const rootOrderRef = doc(collection(firestore, 'orders'));
  const userOrderRef = orderDoc(input.userId, rootOrderRef.id);
  const userRef = doc(firestore, 'users', input.userId);

  await runTransaction(firestore, async (transaction) => {
    const items = normalizeOrderItems(input.items);

    if (items.length === 0) {
      throw new Error('Your cart is empty.');
    }

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = input.discountAmount || 0;
    const total = Math.max(subtotal - discountAmount, 0);
    const now = Timestamp.now();

    const orderPayload: Omit<Order, 'id'> = {
      userId: input.userId,
      orderNumber: buildOrderNumber(rootOrderRef.id),
      items,
      itemCount,
      subtotal,
      total,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: input.paymentMethod,
      createdAt: now,
      updatedAt: now,
      customer: {
        fullName: input.customer.fullName.trim(),
        email: input.customer.email.trim(),
        phone: input.customer.phone.trim(),
      },
      shippingAddress: {
        addressLine1: input.shippingAddress.addressLine1.trim(),
        addressLine2: input.shippingAddress.addressLine2?.trim() || '',
        city: input.shippingAddress.city.trim(),
        state: input.shippingAddress.state.trim(),
        pincode: input.shippingAddress.pincode.trim(),
      },
      notes: input.notes?.trim() || '',
      discountCode: input.discountCode || '',
      discountAmount,
    };

    const shirtsInOrder = items.reduce((sum, item) => {
      return item.category === 'Shirt' ? sum + item.quantity : sum;
    }, 0);

    const userSnapshot = await transaction.get(userRef);
    const userData = userSnapshot.data() as UserProfile;
    const currentLoyalty = userData?.loyaltyCount || 0;
    const newLoyalty = currentLoyalty + shirtsInOrder;

    transaction.set(rootOrderRef, { ...orderPayload, loyaltyProcessed: true });
    transaction.set(userOrderRef, { ...orderPayload, loyaltyProcessed: true });
    transaction.set(
      userRef,
      {
        fullName: input.customer.fullName.trim(),
        email: input.customer.email.trim(),
        phone: input.customer.phone.trim(),
        cart: [],
        loyaltyCount: newLoyalty,
        updatedAt: now,
      },
      { merge: true }
    );
  });

  return rootOrderRef.id;
}

export async function claimLoyaltyReward(userId: string) {
  const firestore = requireDb();
  const userRef = doc(firestore, 'users', userId);

  await runTransaction(firestore, async (transaction) => {
    const userSnapshot = await transaction.get(userRef);
    if (!userSnapshot.exists()) return;

    const userData = userSnapshot.data() as UserProfile;
    const currentCount = userData.loyaltyCount || 0;

    if (currentCount < 5) {
      throw new Error('Not enough purchases to claim a reward yet.');
    }

    transaction.update(userRef, {
      loyaltyCount: currentCount - 5,
      totalRewardsEarned: (userData.totalRewardsEarned || 0) + 1,
      updatedAt: Timestamp.now(),
    });
  });
}

export async function getUserOrders(userId: string) {
  const firestore = requireDb();
  const nextOrders = await getDocsWithOfflineFallback(
    query(orderCollection(userId), orderBy('createdAt', 'desc'))
  );
  const results = new Map<string, Order>();

  nextOrders?.forEach((orderSnapshot) => {
    results.set(orderSnapshot.id, {
      id: orderSnapshot.id,
      ...(orderSnapshot.data() as Omit<Order, 'id'>),
    });
  });

  let legacyOrders;

  try {
    legacyOrders = await getDocs(
      query(
        collection(firestore, 'orders'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
    );
  } catch (error) {
    console.warn('Legacy order query failed. Skipping legacy fallback.', error);
    legacyOrders = null;
  }

  legacyOrders?.forEach((orderSnapshot) => {
    const data = orderSnapshot.data() as LegacyOrder;
    const legacyAddress = data.shippingAddress;

    if (results.has(orderSnapshot.id)) {
      return;
    }

    results.set(orderSnapshot.id, {
      id: orderSnapshot.id,
      ...data,
      orderNumber: data.orderNumber || buildOrderNumber(orderSnapshot.id),
      itemCount:
        data.itemCount ||
        (Array.isArray(data.items)
          ? data.items.reduce((sum, item) => sum + item.quantity, 0)
          : 0),
      subtotal: data.subtotal || data.total || 0,
      paymentMethod: data.paymentMethod || 'cash_on_delivery',
      paymentStatus: data.paymentStatus || 'pending',
      customer: data.customer || {
        fullName: legacyAddress?.name || 'Star Customer',
        email: '',
        phone: legacyAddress?.phone || '',
      },
      shippingAddress: {
        addressLine1: legacyAddress?.addressLine1 || legacyAddress?.address || '',
        addressLine2: legacyAddress?.addressLine2 || '',
        city: legacyAddress?.city || '',
        state: legacyAddress?.state || '',
        pincode: legacyAddress?.pincode || '',
      },
    } as Order);
  });

  return Array.from(results.values()).sort((left, right) => {
    const rightDate = toDate(right.createdAt)?.getTime() || 0;
    const leftDate = toDate(left.createdAt)?.getTime() || 0;
    return rightDate - leftDate;
  });
}

export async function getUserOrder(userId: string, orderId: string) {
  const userOrderSnapshot = await getDocWithOfflineFallback(orderDoc(userId, orderId));

  if (userOrderSnapshot?.exists()) {
    return {
      id: userOrderSnapshot.id,
      ...(userOrderSnapshot.data() as Omit<Order, 'id'>),
    } as Order;
  }

  const legacySnapshot = await getDocWithOfflineFallback(legacyOrderDoc(orderId));

  if (!legacySnapshot?.exists()) {
    return null;
  }

  const data = legacySnapshot.data() as LegacyOrder;

  if (data.userId !== userId) {
    return null;
  }

  const legacyAddress = data.shippingAddress;

  return {
    id: legacySnapshot.id,
    ...data,
    orderNumber: data.orderNumber || buildOrderNumber(legacySnapshot.id),
    itemCount:
      data.itemCount ||
      (Array.isArray(data.items)
        ? data.items.reduce((sum, item) => sum + item.quantity, 0)
        : 0),
    subtotal: data.subtotal || data.total || 0,
    paymentMethod: data.paymentMethod || 'cash_on_delivery',
    paymentStatus: data.paymentStatus || 'pending',
    customer: data.customer || {
      fullName: legacyAddress?.name || 'Star Customer',
      email: '',
      phone: legacyAddress?.phone || '',
    },
    shippingAddress: {
      addressLine1: legacyAddress?.addressLine1 || legacyAddress?.address || '',
      addressLine2: legacyAddress?.addressLine2 || '',
      city: legacyAddress?.city || '',
      state: legacyAddress?.state || '',
      pincode: legacyAddress?.pincode || '',
    },
  } as Order;
}
