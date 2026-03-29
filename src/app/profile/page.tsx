'use client';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if user is not authenticated and loading is finished
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Loading profile...</div>;
  }

  if (!user) {
    return null; // Will redirect shortly
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Navbar />
      
      <main style={{ flex: 1, padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>My Profile</h1>
        
        <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Account Information</h2>
          <p style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> {user.email}</p>
          {user.uid && <p style={{ color: '#666', fontSize: '0.9rem' }}>User ID: {user.uid}</p>}
        </div>

        <div style={{ marginTop: '2rem', backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Order History</h2>
          <p style={{ color: '#666' }}>You have no past orders.</p>
          {/* Note: Connecting to a database like Supabase/Firebase to fetch orders can go here. */}
        </div>
      </main>

      <Footer />
    </div>
  );
}
