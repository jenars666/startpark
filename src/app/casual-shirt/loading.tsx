export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ 
          border: '4px solid rgba(0, 0, 0, 0.1)', 
          width: '36px', 
          height: '36px', 
          borderRadius: '50%', 
          borderLeftColor: '#09f', 
          animation: 'spin 1s ease infinite', 
          margin: '0 auto 1rem' 
        }}></div>
        <p>Loading products...</p>
        <style>{`
          @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
        `}</style>
      </div>
    </div>
  );
}
