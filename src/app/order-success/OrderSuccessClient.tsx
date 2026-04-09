'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Package, Truck, MapPin, Phone, Mail } from 'lucide-react';

type OrderSuccessClientProps = {
  amount: string;
  orderId: string;
  paymentId: string;
};

export default function OrderSuccessClient({
  amount,
  orderId,
  paymentId,
}: OrderSuccessClientProps) {
  const router = useRouter();
  const orderDate = new Date();
  const estimatedDeliveryDate = new Date(orderDate);
  estimatedDeliveryDate.setDate(orderDate.getDate() + 5);
  const orderDetails = {
    orderId,
    amount,
    paymentId,
    date: orderDate.toLocaleDateString('en-IN'),
    status: 'confirmed',
    estimatedDelivery: estimatedDeliveryDate.toLocaleDateString('en-IN'),
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '3rem',
            textAlign: 'center',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: '#4caf50',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <CheckCircle size={48} color="white" />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111' }}>
            Order Confirmed!
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '1rem' }}>
            Thank you for your purchase
          </p>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>
            Order ID: <strong>{orderId}</strong>
          </p>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#111' }}>
            Order Details
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <span style={{ color: '#666' }}>Order Date:</span>
              <strong>{orderDetails.date}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <span style={{ color: '#666' }}>Payment ID:</span>
              <strong>{paymentId}</strong>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid #f0f0f0',
              }}
            >
              <span style={{ color: '#666' }}>Total Amount:</span>
              <strong style={{ fontSize: '1.2rem', color: '#4caf50' }}>
                â‚¹{Number(amount).toLocaleString('en-IN')}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Estimated Delivery:</span>
              <strong>{orderDetails.estimatedDelivery}</strong>
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#111' }}>
            Order Status
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#4caf50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={20} color="white" />
              </div>
              <div>
                <strong>Order Confirmed</strong>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                  Your order has been confirmed
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Package size={20} color="#666" />
              </div>
              <div>
                <strong>Processing</strong>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                  We&apos;re preparing your order
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck size={20} color="#666" />
              </div>
              <div>
                <strong>Shipped</strong>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                  Your order is on the way
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MapPin size={20} color="#666" />
              </div>
              <div>
                <strong>Delivered</strong>
                <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>
                  Order delivered successfully
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#111' }}>
            Need Help?
          </h2>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Phone size={20} color="#4caf50" />
              <div>
                <strong>Call Us</strong>
                <p style={{ margin: 0, color: '#666' }}>+91 93454 45164</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail size={20} color="#4caf50" />
              <div>
                <strong>Email Us</strong>
                <p style={{ margin: 0, color: '#666' }}>starmenspark@gmail.com</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <MapPin size={20} color="#4caf50" />
              <div>
                <strong>Visit Store</strong>
                <p style={{ margin: 0, color: '#666' }}>Dindigul Bazaar, Tamil Nadu</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => router.push('/profile/orders')}
            style={{
              padding: '1rem',
              background: 'white',
              border: '2px solid #111',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            View Orders
          </button>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '1rem',
              background: '#111',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              color: 'white',
              fontSize: '1rem',
            }}
          >
            Continue Shopping
          </button>
        </div>

        <div
          style={{
            background: '#e3f2fd',
            border: '1px solid #90caf9',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, color: '#1976d2', fontSize: '0.9rem' }}>
            ðŸ“§ Order confirmation email has been sent to your registered email address
          </p>
        </div>
      </div>
    </div>
  );
}
