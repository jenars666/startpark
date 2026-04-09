import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';
import { CartItem } from '../../types';

// Load cart when user logs in
export async function getCartFromFirestore(uid: string): Promise<CartItem[]> {
  if (!db) return [];
  
  try {
    const snap = await getDoc(doc(db, 'carts', uid));
    return snap.exists() ? snap.data().items ?? [] : [];
  } catch (error) {
    console.error('Error loading cart from Firestore:', error);
    return [];
  }
}

// Save entire cart (call this after every add/remove/update)
export async function saveCartToFirestore(uid: string, items: CartItem[]): Promise<void> {
  if (!db) return;
  
  try {
    await setDoc(doc(db, 'carts', uid), { 
      userId: uid, 
      items,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving cart to Firestore:', error);
    throw error;
  }
}

// Add single item (merges quantity if same id)
export async function addItemToCart(uid: string, newItem: CartItem): Promise<void> {
  const existing = await getCartFromFirestore(uid);
  const idx = existing.findIndex(i => i.id === newItem.id);
  
  if (idx >= 0) {
    existing[idx].quantity += newItem.quantity;
  } else {
    existing.push(newItem);
  }
  
  await saveCartToFirestore(uid, existing);
}

// Remove item
export async function removeItemFromCart(uid: string, itemId: string | number): Promise<void> {
  const existing = await getCartFromFirestore(uid);
  const updated = existing.filter(i => i.id !== itemId);
  await saveCartToFirestore(uid, updated);
}

// Update item quantity
export async function updateItemQuantity(uid: string, itemId: string | number, newQuantity: number): Promise<void> {
  const existing = await getCartFromFirestore(uid);
  const updated = existing.map(item => 
    item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
  );
  await saveCartToFirestore(uid, updated);
}

// Clear cart (after order placed)
export async function clearCartInFirestore(uid: string): Promise<void> {
  await saveCartToFirestore(uid, []);
}

// Real-time cart listener
export function subscribeToCart(uid: string, callback: (items: CartItem[]) => void): Unsubscribe {
  if (!db) return () => {};
  
  return onSnapshot(doc(db, 'carts', uid), (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback(data.items ?? []);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('Cart subscription error:', error);
  });
}