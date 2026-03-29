'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', padding: '2rem', textAlign: 'center' }}>
      <h2>Something went wrong!</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>We couldn't load this page. Please try again.</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
}
