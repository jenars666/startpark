'use client';

import { useState } from 'react';
import { QrCode, Copy, CheckCircle, Smartphone } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface UpiPaymentProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', icon: '🟢', color: '#4285F4' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: '#5f259f' },
  { id: 'paytm', name: 'Paytm', icon: '🔵', color: '#00BAF2' },
  { id: 'bhim', name: 'BHIM UPI', icon: '🟠', color: '#ff6b00' },
  { id: 'amazonpay', name: 'Amazon Pay', icon: '🟡', color: '#FF9900' },
  { id: 'whatsapp', name: 'WhatsApp Pay', icon: '🟢', color: '#25D366' },
];

export default function UpiPayment({ amount, orderId, onSuccess, onCancel }: UpiPaymentProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Your UPI ID - Replace with actual UPI ID
  const merchantUpiId = 'starmenspark@paytm'; // Replace with your actual UPI ID
  const merchantName = 'Star Mens Park';

  // Generate UPI payment URL
  const generateUpiUrl = (app: string) => {
    const upiUrl = `upi://pay?pa=${merchantUpiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`;
    
    const appUrls: Record<string, string> = {
      gpay: `tez://upi/pay?${upiUrl.split('?')[1]}`,
      phonepe: `phonepe://pay?${upiUrl.split('?')[1]}`,
      paytm: `paytmmp://pay?${upiUrl.split('?')[1]}`,
      bhim: upiUrl,
      amazonpay: upiUrl,
      whatsapp: upiUrl,
    };

    return appUrls[app] || upiUrl;
  };

  // Generate QR code URL (using Google Charts API)
  const qrCodeUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(
    `upi://pay?pa=${merchantUpiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=Order ${orderId}`
  )}&choe=UTF-8`;

  const handleAppClick = (appId: string) => {
    setSelectedApp(appId);
    const upiUrl = generateUpiUrl(appId);
    
    // Open UPI app
    window.location.href = upiUrl;
    
    // Show processing state
    setIsProcessing(true);
    toast.success(`Opening ${UPI_APPS.find(a => a.id === appId)?.name}...`);
    
    // Simulate payment verification (in production, use webhooks)
    setTimeout(() => {
      setIsProcessing(false);
      // In production, verify payment status from backend
    }, 3000);
  };

  const handleManualUpi = () => {
    if (!upiId.trim()) {
      toast.error('Please enter UPI ID');
      return;
    }

    const upiUrl = `upi://pay?pa=${upiId}&pn=${merchantName}&am=${amount}&cu=INR&tn=Order ${orderId}`;
    window.location.href = upiUrl;
    
    setIsProcessing(true);
    toast.success('Opening UPI app...');
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(merchantUpiId);
    toast.success('UPI ID copied!');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Smartphone size={48} style={{ margin: '0 auto 1rem', color: '#5f259f' }} />
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#111' }}>
          Pay with UPI
        </h2>
        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#5f259f' }}>
          ₹{amount.toLocaleString('en-IN')}
        </p>
      </div>

      {/* UPI Apps Grid */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#666' }}>
          Choose UPI App:
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
          }}
        >
          {UPI_APPS.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              disabled={isProcessing}
              style={{
                padding: '1rem',
                border: `2px solid ${selectedApp === app.id ? app.color : '#e0e0e0'}`,
                borderRadius: '12px',
                background: selectedApp === app.id ? `${app.color}10` : 'white',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{app.icon}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#333' }}>
                {app.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* QR Code Section */}
      <div
        style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setShowQR(!showQR)}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontWeight: '600',
            color: '#333',
          }}
        >
          <QrCode size={20} />
          {showQR ? 'Hide QR Code' : 'Show QR Code'}
        </button>

        {showQR && (
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <div
              style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '12px',
                display: 'inline-block',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={qrCodeUrl}
                alt="UPI QR Code"
                style={{ width: '250px', height: '250px', display: 'block' }}
              />
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              Scan with any UPI app to pay
            </p>
          </div>
        )}
      </div>

      {/* Manual UPI ID Entry */}
      <div
        style={{
          background: '#fff3cd',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '1px solid #ffeaa7',
        }}
      >
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#856404' }}>
          Or Enter UPI ID Manually:
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="yourname@upi"
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          />
          <button
            onClick={handleManualUpi}
            disabled={isProcessing}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#5f259f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
            }}
          >
            Pay
          </button>
        </div>
      </div>

      {/* Merchant UPI ID */}
      <div
        style={{
          background: '#e8f5e9',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #c8e6c9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.85rem', color: '#2e7d32', marginBottom: '0.25rem' }}>
              Pay to:
            </p>
            <p style={{ fontSize: '1rem', fontWeight: '600', color: '#1b5e20' }}>
              {merchantUpiId}
            </p>
          </div>
          <button
            onClick={copyUpiId}
            style={{
              padding: '0.5rem 1rem',
              background: 'white',
              border: '1px solid #2e7d32',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#2e7d32',
              fontWeight: '600',
            }}
          >
            <Copy size={16} />
            Copy
          </button>
        </div>
      </div>

      {/* Processing State */}
      {isProcessing && (
        <div
          style={{
            background: '#fff3cd',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center',
            border: '1px solid #ffeaa7',
          }}
        >
          <p style={{ color: '#856404', fontWeight: '600' }}>
            ⏳ Waiting for payment confirmation...
          </p>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
            Complete payment in your UPI app
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '1rem',
            background: 'white',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            color: '#666',
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSuccess}
          style={{
            flex: 1,
            padding: '1rem',
            background: '#4caf50',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle size={20} />
          I've Paid
        </button>
      </div>

      {/* Instructions */}
      <div style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#666' }}>
        <p style={{ marginBottom: '0.5rem' }}>📱 How to pay:</p>
        <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Select your UPI app or scan QR code</li>
          <li>Verify amount and merchant details</li>
          <li>Enter UPI PIN to complete payment</li>
          <li>Click "I've Paid" after successful payment</li>
        </ol>
      </div>
    </div>
  );
}
