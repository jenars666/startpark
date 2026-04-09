import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '../firebase';
import { WishlistItem } from '../../types';

// Load wishlist when user logs in
export async function getWishlistFromFirestore(uid: string): Promise<WishlistItem[]> {
  if (!db) return [];
  
  try {
    const snap = await getDoc(doc(db, 'wishlists', uid));
    return snap.exists() ? snap.data().items ?? [] : [];
  } catch (error) {
    console.error('Error loading wishlist from Firestore:', error);
    return [];
  }
}

// Save entire wishlist
export async function saveWishlistToFirestore(uid: string, items: WishlistItem[]): Promise<void> {
  if (!db) return;
  
  try {
    await setDoc(doc(db, 'wishlists', uid), { 
      userId: uid, 
      items,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error saving wishlist to Firestore:', error);
    throw error;
  }
}

// Add item to wishlist
export async function addItemToWishlist(uid: string, item: WishlistItem): Promise<void> {
  const existing = await getWishlistFromFirestore(uid);
  const alreadyIn = existing.some(i => i.id === item.id);
  
  if (!alreadyIn) {
    await saveWishlistToFirestore(uid, [...existing, item]);
  }
}

// Remove item from wishlist
export async function removeItemFromWishlist(uid: string, itemId: string | number): Promise<void> {
  const existing = await getWishlistFromFirestore(uid);
  const updated = existing.filter(i => i.id !== itemId);
  await saveWishlistToFirestore(uid, updated);
}

// Check if item is in wishlist
export async function isItemInWishlist(uid: string, itemId: string | number): Promise<boolean> {
  const wishlist = await getWishlistFromFirestore(uid);
  return wishlist.some(item => item.id === itemId);
}

// Clear wishlist
export async function clearWishlistInFirestore(uid: string): Promise<void> {
  await saveWishlistToFirestore(uid, []);
}

// Real-time wishlist listener
export function subscribeToWishlist(uid: string, callback: (items: WishlistItem[]) => void): Unsubscribe {
  if (!db) return () => {};
  
  return onSnapshot(doc(db, 'wishlists', uid), (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback(data.items ?? []);
    } else {
      callback([]);
    }
  }, (error) => {
    console.error('Wishlist subscription error:', error);
  });
}