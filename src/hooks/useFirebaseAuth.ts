'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { ensureUserProfile, isFirestoreOfflineError } from '../lib/customerStore';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(auth?.currentUser ?? null);
  const [loading, setLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        void ensureUserProfile(currentUser).catch((error) => {
          if (!isFirestoreOfflineError(error)) {
            console.error('Unable to sync user profile:', error);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}
