import { db } from '../firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';

export async function addProduct(productData: any) {
  if (!db) throw new Error('Firestore is not initialized');
  const productsRef = collection(db, 'products');
  return addDoc(productsRef, {
    ...productData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updateProduct(productId: string, updateData: any) {
  if (!db) throw new Error('Firestore is not initialized');
  const productRef = doc(db, 'products', productId);
  return updateDoc(productRef, {
    ...updateData,
    updatedAt: Timestamp.now(),
  });
}

export async function deleteProduct(productId: string) {
  if (!db) throw new Error('Firestore is not initialized');
  const productRef = doc(db, 'products', productId);
  return deleteDoc(productRef);
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (!db) throw new Error('Firestore is not initialized');
  const orderRef = doc(db, 'orders', orderId);
  return updateDoc(orderRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}

export async function updateEnquiryStatus(enquiryId: string, status: string) {
  if (!db) throw new Error('Firestore is not initialized');
  const enquiryRef = doc(db, 'enquiries', enquiryId);
  return updateDoc(enquiryRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}

export async function updateGroupOrderStatus(orderId: string, status: string) {
  if (!db) throw new Error('Firestore is not initialized');
  const orderRef = doc(db, 'groupOrders', orderId);
  return updateDoc(orderRef, {
    status,
    updatedAt: Timestamp.now(),
  });
}
