import { initializeApp, getApps, getApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import type { Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => typeof value === "string" && value.length > 0
);

// Allow builds to succeed even before deployment env vars are configured.
const app: FirebaseApp | null = isFirebaseConfigured
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

export const storage: FirebaseStorage | null = app ? getStorage(app) : null;
export const auth: Auth | null = app ? getAuth(app) : null;
export const googleProvider = app ? new GoogleAuthProvider() : null;
export const db: Firestore | null = app ? getFirestore(app) : null;

export let analytics: Analytics | null = null;
if (app && typeof window !== "undefined") {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}
