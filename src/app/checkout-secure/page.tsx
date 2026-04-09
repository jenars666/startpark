'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Smartphone, Building, Wallet, ArrowLeft, User, Mail, Phone, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContextFirebase';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { OrderService } from '../../lib/orderService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { sanitizeInput, isValidEmail, isValidPhone, isValidPincode } from '../../utils/security';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useFirebaseAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [shippingForm, setShippingForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (cartItems.length === 0) {
      router.push('/cart');
      return;
    }

    loadUserProfile();
  }, [user, cartItems]);

  const loadUserProfile = async () => {
    if (!user || !db) return;
    
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        setShippingForm(prev => ({
          ...prev,
          name: sanitizeInput(data.fullName) || '',
          email: sanitizeInput(data.email) || sanitizeInput(user.email) || '',
          phone: sanitizeInput(data.phone) || ''
        }));
      } else {
        setShippingForm(prev => ({
          ...prev,
          email: sanitizeInput(user.email) || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setShippingForm({
      ...shippingForm,
      [name]: sanitizedValue
    });
  };

  const validateForm = () => {
    const required = ['name', 'phone', 'email', 'address', 'city', 'pincode'];
    for (const field of required) {
      if (!shippingForm[field as keyof typeof shippingForm]) {
        toast.error(`Please fill in ${field.charAt(0).toUpperCase() + field.slice(1)}`);
        return false;
      }
    }
    
    if (!isValidEmail(shippingForm.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!isValidPhone(shippingForm.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    if (!isValidPincode(shippingForm.pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return false;
    }
    
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place order');
      return;
    }

    if (!validateForm()) return;

    setIsPlacingOrder(true);

    try {
      // Create order in Firestore
      const orderId = await OrderService.createOrder(
        user.uid,
        cartItems,
        {
          fullName: shippingForm.name,
          email: shippingForm.email,
          phone: shippingForm.phone,
        },
        {
          addressLine1: shippingForm.address,
          addressLine2: '',
          city: shippingForm.city,
          state: shippingForm.state,
          pincode: shippingForm.pincode
        },
        paymentMethod === 'cod' ? 'cash_on_delivery' : 'upi_transfer'
      );

      if (paymentMethod === 'cod') {
        // Cash on Delivery - Order placed successfully
        await OrderService.updateOrderStatus(user.uid, orderId, 'confirmed');
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/order-success?orderId=${orderId}&amount=${totalPrice}&paymentMethod=cod`);
      } else {
        // Razorpay payment
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: totalPrice * 100,
          currency: 'INR',
          name: 'Star Mens Park',
          description: `Order #${OrderService.generateOrderNumber(orderId)}`,
          order_id: orderId,
          handler: async function (response: any) {
            try {
              // Update order with payment details
              await OrderService.updatePaymentStatus(
                user.uid,
                orderId,
                response.razorpay_payment_id,
                'completed'
              );
              
              clearCart();
              toast.success('Payment successful! Order confirmed.');
              router.push(`/order-success?orderId=${orderId}&amount=${totalPrice}&paymentId=${response.razorpay_payment_id}`);
            } catch (error) {
              console.error('Payment update error:', error);
              toast.error('Payment successful but order update failed. Please contact support.');
            }
          },
          prefill: {
            name: shippingForm.name,
            email: shippingForm.email,
            contact: shippingForm.phone
          },
          theme: {
            color: '#000000'
          },
          modal: {
            ondismiss: function() {
              setIsPlacingOrder(false);
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error('Order placement error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      if (paymentMethod === 'cod') {
        setIsPlacingOrder(false);
      }
    }
  };

  if (loadingProfile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #000', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
            <p>Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Navbar />
      
      <main style={{ flex: 1, padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => router.push('/cart')}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>Checkout</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
          {/* Checkout Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Shipping Address */}
            <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={20} />
                Shipping Address
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={shippingForm.name}
                    onChange={handleInputChange}
                    maxLength={100}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingForm.phone}
                    onChange={handleInputChange}
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingForm.email}
                    onChange={handleInputChange}
                    maxLength={100}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingForm.address}
                    onChange={handleInputChange}
                    placeholder="Street address, apartment, suite, etc."
                    maxLength={200}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingForm.city}
                    onChange={handleInputChange}
                    maxLength={50}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>State</label>
                  <select
                    name="state"
                    value={shippingForm.state}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem' }}>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingForm.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    pattern="[1-9][0-9]{5}"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '0.9rem'
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={20} />
                Payment Method
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'razorpay' ? '#f0f9ff' : 'white' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <CreditCard size={20} />
                  <div>
                    <div style={{ fontWeight: '500' }}>Online Payment</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Cards, UPI, Net Banking, Wallets</div>
                  </div>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', backgroundColor: paymentMethod === 'cod' ? '#f0f9ff' : 'white' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Wallet size={20} />
                  <div>
                    <div style={{ fontWeight: '500' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Pay when you receive</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Order Summary</h2>
              
              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <img
                      src={item.img}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                      ₹{(typeof item.price === 'string' 
                        ? parseFloat(item.price.replace(/,/g, '').replace(/[^0-9.]/g, '')) * item.quantity
                        : item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Shipping</span>
                  <span style={{ color: '#10b981' }}>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: '600', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: isPlacingOrder ? '#6b7280' : '#000',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isPlacingOrder ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                {isPlacingOrder ? 'Placing Order...' : `Place Order - ₹${totalPrice.toLocaleString()}`}
              </button>
              
              <div style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', marginTop: '0.5rem' }}>
                🔒 Secure checkout powered by Razorpay
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          main > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          
          main > div:nth-child(2) > div:first-child {
            order: 2;
          }
          
          main > div:nth-child(2) > div:last-child {
            order: 1;
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
