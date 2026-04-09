'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { loadRazorpayCheckoutScript } from '../../lib/razorpay-client';

export default function PaymentTestPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  const testPayment = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const scriptLoaded = await loadRazorpayCheckoutScript();
      if (!scriptLoaded || !window.Razorpay) {
        toast.error('Failed to load Razorpay. Check your internet connection.');
        setIsLoading(false);
        return;
      }

      const orderResponse = await fetch('/api/payments/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              id: 'test-1',
              name: 'Test Product',
              price: '100',
              quantity: 1,
            },
          ],
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        toast.error(orderData.error || 'Failed to create order');
        setIsLoading(false);
        return;
      }

      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Star Mens Park',
        description: 'Payment Gateway Test',
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderData.order.id,
                ...response,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.verified) {
              setTestResult('success');
              toast.success('Payment test successful! ✅');
            } else {
              setTestResult('failed');
              toast.error('Payment verification failed');
            }
          } catch (error) {
            setTestResult('failed');
            toast.error('Verification error');
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#111111',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast('Payment cancelled');
          },
        },
      });

      checkout.on('payment.failed', () => {
        setTestResult('failed');
        setIsLoading(false);
        toast.error('Payment failed');
      });

      checkout.open();
    } catch (error) {
      console.error('Test payment error:', error);
      toast.error('Test failed. Check console for details.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              color: '#666',
            }}
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '3rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <CreditCard size={48} style={{ margin: '0 auto 1rem', color: '#111' }} />
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111' }}>
              Payment Gateway Test
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Test your Razorpay integration
            </p>
          </div>

          {testResult && (
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                background: testResult === 'success' ? '#d4edda' : '#f8d7da',
                border: `1px solid ${testResult === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {testResult === 'success' ? (
                <CheckCircle size={24} color="#155724" />
              ) : (
                <XCircle size={24} color="#721c24" />
              )}
              <div>
                <strong style={{ color: testResult === 'success' ? '#155724' : '#721c24' }}>
                  {testResult === 'success' ? 'Test Passed!' : 'Test Failed'}
                </strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#666' }}>
                  {testResult === 'success'
                    ? 'Payment gateway is working correctly'
                    : 'Check your API keys and try again'}
                </p>
              </div>
            </div>
          )}

          <div
            style={{
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ marginBottom: '1rem', color: '#111' }}>Test Instructions:</h3>
            <ol style={{ paddingLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
              <li>Click the Test Payment button below</li>
              <li>Razorpay checkout modal will open</li>
              <li>
                Use test card: <strong>4111 1111 1111 1111</strong>
              </li>
              <li>CVV: Any 3 digits, Expiry: Any future date</li>
              <li>Complete the payment</li>
            </ol>
          </div>

          <div
            style={{
              background: '#fff3cd',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid #ffeaa7',
            }}
          >
            <h4 style={{ marginBottom: '1rem', color: '#856404' }}>Test Card Numbers:</h4>
            <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div>
                <strong>Success:</strong> 4111 1111 1111 1111
              </div>
              <div>
                <strong>Failure:</strong> 4000 0000 0000 0002
              </div>
              <div>
                <strong>UPI:</strong> success@razorpay
              </div>
            </div>
          </div>

          <button
            onClick={testPayment}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              background: isLoading ? '#ccc' : '#111',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={20} />
                Test Payment (₹100)
              </>
            )}
          </button>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              Need to configure Razorpay?
            </p>
            <a
              href="/PAYMENT-GATEWAY-SETUP.md"
              style={{
                color: '#111',
                textDecoration: 'underline',
                fontWeight: '600',
              }}
            >
              View Setup Guide
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#111' }}>✅ Already Integrated</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              Payment gateway is fully integrated. Just add your API keys.
            </p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#111' }}>🔒 Secure</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              Server-side verification with signature validation.
            </p>
          </div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#111' }}>💳 All Methods</h4>
            <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
              Cards, UPI, Net Banking, Wallets supported.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
