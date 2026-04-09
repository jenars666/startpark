import {
  collection, doc, addDoc, updateDoc, deleteDoc,
  serverTimestamp, Timestamp
} from 'firebase/firestore';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from 'firebase/storage';
import { db, storage } from '../firebase';

export interface ProductData {
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  category: string;
  sizes: string[];
  tag: string;
  inStock: boolean;
  img: string;
  imageUrl?: string;
  hoverImg?: string;
  hoverImageUrl?: string;
  color: string;
  stock: number;
}

const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const DEFAULT_UPLOAD_STALL_TIMEOUT_MS = 120000;

// Upload image to Firebase Storage
export async function uploadProductImage(
  file: File,
  productId: string,
  slot: 'main' | 'hover',
  onProgress?: (percent: number) => void,
  stallTimeoutMs: number = DEFAULT_UPLOAD_STALL_TIMEOUT_MS
): Promise<string> {
  if (!storage) throw new Error('Firebase Storage not initialized');
  if (file.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
    throw new Error('Image size exceeds the 5MB Firebase Storage limit.');
  }

  const extension = file.name.split('.').pop() || 'jpg';
  const storageRef = ref(storage, `products/${productId}/${slot}.${extension}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    let settled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastTransferred = 0;

    const clearStallTimer = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    const armStallTimer = () => {
      clearStallTimer();
      timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        uploadTask.cancel();
        reject(
          new Error(
            `Upload timed out after ${Math.round(stallTimeoutMs / 1000)} seconds without progress. Verify Firebase Storage bucket and rules.`
          )
        );
      }, stallTimeoutMs);
    };

    armStallTimer();

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(percent);

        // Reset timeout only when upload keeps moving forward.
        if (snapshot.bytesTransferred > lastTransferred) {
          lastTransferred = snapshot.bytesTransferred;
          armStallTimer();
        }
      },
      (error) => {
        if (settled) return;
        settled = true;
        clearStallTimer();
        reject(error);
      },
      async () => {
        if (settled) return;
        settled = true;
        clearStallTimer();

        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

// Add new product
export async function addProduct(data: ProductData): Promise<string> {
  if (!db) throw new Error('Firestore not initialized');

  const mainImageUrl = data.img || data.imageUrl || '';
  const hoverImageUrl = data.hoverImg || data.hoverImageUrl || '';

  const docRef = await addDoc(collection(db, 'products'), {
    ...data,
    img: mainImageUrl,
    imageUrl: mainImageUrl,
    hoverImg: hoverImageUrl,
    hoverImageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Update product
export async function updateProduct(id: string, updates: Partial<ProductData>): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  await updateDoc(doc(db, 'products', id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete product and its images
export async function deleteProduct(id: string, imageUrl?: string, hoverUrl?: string): Promise<void> {
  if (!db) throw new Error('Firestore not initialized');

  await deleteDoc(doc(db, 'products', id));

  if (storage) {
    if (imageUrl) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (e) {
        console.warn('Failed to delete main image:', e);
      }
    }
    if (hoverUrl) {
      try {
        const hoverRef = ref(storage, hoverUrl);
        await deleteObject(hoverRef);
      } catch (e) {
        console.warn('Failed to delete hover image:', e);
      }
    }
  }
}
