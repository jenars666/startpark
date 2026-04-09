import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc,
  Timestamp,
  getDocs,
  where,
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { Order } from '@/types/order';
import type { UserProfile } from '@/types/user';

function requireDb() {
  if (!db) throw new Error('Firestore not configured');
  return db;
}

// Real-time Orders Subscription
export function subscribeToOrders(callback: (orders: Order[]) => void) {
  const firestore = requireDb();
  const ordersRef = collection(firestore, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
    callback(orders);
  });
}

// Real-time Customers Subscription
export function subscribeToCustomers(callback: (customers: UserProfile[]) => void) {
  const firestore = requireDb();
  const usersRef = collection(firestore, 'users');
  const q = query(usersRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const customers = snapshot.docs.map(doc => ({
      ...doc.data()
    })) as UserProfile[];
    callback(customers);
  });
}

// Real-time Products Subscription
export function subscribeToProducts(callback: (products: any[]) => void) {
  const firestore = requireDb();
  const productsRef = collection(firestore, 'products');
  
  return onSnapshot(productsRef, (snapshot) => {
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(products);
  });
}

// Real-time Inventory Subscription
export function subscribeToInventory(callback: (inventory: any[]) => void) {
  const firestore = requireDb();
  const inventoryRef = collection(firestore, 'inventory');
  
  return onSnapshot(inventoryRef, (snapshot) => {
    const inventory = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(inventory);
  });
}

// Real-time Reviews Subscription
export function subscribeToReviews(callback: (reviews: any[]) => void) {
  const firestore = requireDb();
  const reviewsRef = collection(firestore, 'reviews');
  const q = query(reviewsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(reviews);
  });
}

// Real-time Coupons Subscription
export function subscribeToCoupons(callback: (coupons: any[]) => void) {
  const firestore = requireDb();
  const couponsRef = collection(firestore, 'coupons');
  
  return onSnapshot(couponsRef, (snapshot) => {
    const coupons = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(coupons);
  });
}

// Real-time Festivals Subscription
export function subscribeToFestivals(callback: (festivals: any[]) => void) {
  const firestore = requireDb();
  const festivalsRef = collection(firestore, 'festivals');
  
  return onSnapshot(festivalsRef, (snapshot) => {
    const festivals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(festivals);
  });
}

// Real-time Staff Subscription
export function subscribeToStaff(callback: (staff: any[]) => void) {
  const firestore = requireDb();
  const staffRef = collection(firestore, 'staff');
  
  return onSnapshot(staffRef, (snapshot) => {
    const staff = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(staff);
  });
}

// Real-time Group Orders Subscription
export function subscribeToGroupOrders(callback: (groupOrders: any[]) => void) {
  const firestore = requireDb();
  const groupOrdersRef = collection(firestore, 'groupOrders');
  const q = query(groupOrdersRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const groupOrders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(groupOrders);
  });
}

// Real-time WhatsApp Enquiries Subscription
export function subscribeToWhatsAppEnquiries(callback: (enquiries: any[]) => void) {
  const firestore = requireDb();
  const enquiriesRef = collection(firestore, 'whatsappEnquiries');
  const q = query(enquiriesRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const enquiries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(enquiries);
  });
}

// Update Order Status
export async function updateOrderStatus(orderId: string, status: string) {
  const firestore = requireDb();
  const orderRef = doc(firestore, 'orders', orderId);
  await updateDoc(orderRef, {
    status,
    updatedAt: Timestamp.now()
  });
}

// Get Dashboard Stats
export async function getDashboardStats() {
  const firestore = requireDb();
  
  const ordersSnap = await getDocs(collection(firestore, 'orders'));
  const customersSnap = await getDocs(collection(firestore, 'users'));
  
  const orders = ordersSnap.docs.map(doc => doc.data() as Order);
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  
  return {
    totalRevenue,
    totalOrders: orders.length,
    totalCustomers: customersSnap.size,
    pendingOrders
  };
}
