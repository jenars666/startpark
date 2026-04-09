'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ChevronRight, Lock, Package, RotateCcw, Truck } from 'lucide-react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContextFirebase';
import { useUserStore } from '../../store/useUserStore';
import { getUserProfile, parsePrice } from '../../lib/customerStore';
import styles from './page.module.css';

const schema = z.object({
  firstName: z.string().min(2, 'Enter first name'),
  lastName:  z.string().min(1, 'Enter last name'),
  email:     z.string().email('Enter valid email'),
  phone:     z.string().regex(/^\d{10}$/, '10-digit phone required'),
  address:   z.string().min(5, 'Enter full address'),
  city:      z.string().min(2, 'Enter city'),
  state:     z.string().min(2, 'Select state'),
  pincode:   z.string().regex(/^\d{6}$/, '6-digit PIN required'),
  notes:     z.string().optional(),
});

type BillingForm = z.infer<typeof schema>;

const INDIAN_STATES = [
  'Tamil Nadu','Karnataka','Kerala','Andhra Pradesh','Telangana',
  'Maharashtra','Gujarat','Rajasthan','Uttar Pradesh','Delhi',
  'West Bengal','Bihar','Madhya Pradesh','Punjab','Haryana',
  'Odisha','Assam','Jharkhand','Uttarakhand','Himachal Pradesh',
];

const COUPONS: Record<string, number> = {
  'STAR10': 10,
  'FIRST20': 20,
  'DINDIGUL': 15,
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');

  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  const discountAmount = Math.round(subtotal * discount / 100);
  const total = subtotal - discountAmount;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BillingForm>({
    resolver: zodResolver(schema),
    defaultValues: { city: 'Dindigul', state: 'Tamil Nadu' },
  });

  useEffect(() => {
    if (!user) { router.push('/login?redirect=/checkout'); return; }
    getUserProfile(user.uid).then((profile) => {
      if (!profile) return;
      const parts = (profile.fullName || '').split(' ');
      setValue('firstName', parts[0] || '');
      setValue('lastName', parts.slice(1).join(' ') || '');
      setValue('email', profile.email || user.email || '');
      setValue('phone', profile.phone || '');
    }).catch(() => {});
  }, [user, router, setValue]);

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) { toast.error('Enter a coupon code'); return; }
    if (couponApplied === code) { toast.error('Coupon already applied'); return; }
    const pct = COUPONS[code];
    if (!pct) { toast.error('Invalid coupon code'); return; }
    setDiscount(pct);
    setCouponApplied(code);
    toast.success(`${pct}% discount applied! 🎉`);
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponApplied('');
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const onSubmit = async (billing: BillingForm) => {
    if (!user) { toast.error('Please login first'); return; }
    if (cartItems.length === 0) { toast.error('Your cart is empty'); return; }
    setLoading(true);

    try {
      if (paymentMethod === 'cod') {
        const res = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: 'COD', razorpay_payment_id: 'COD', razorpay_signature: 'COD',
            uid: user.uid, items: cartItems, totalAmount: total, billing, paymentMethod: 'COD',
          }),
        });
        const data = await res.json();
        if (data.success) {
          await clearCart();
          toast.success('Order placed! 🎉');
          router.push(`/order-confirmation?orderId=${data.orderId}`);
        } else {
          toast.error(data.error || 'Failed to place order');
          setLoading(false);
        }
        return;
      }

      // Online — create Razorpay order
      const createRes = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, orderId: `ORD-${Date.now()}` }),
      });
      const { razorpayOrderId, error: createError } = await createRes.json();

      if (!razorpayOrderId) {
        toast.error(createError || 'Could not initiate payment');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: 'INR',
        name: 'Star Mens Park',
        description: 'Premium Menswear — Dindigul',
        order_id: razorpayOrderId,
        prefill: { name: `${billing.firstName} ${billing.lastName}`, email: billing.email, contact: billing.phone },
        theme: { color: '#7c3aed' },
        config: {
          display: {
            blocks: {
              upi: { name: 'Pay via UPI', instruments: [{ method: 'upi', flows: ['qr', 'intent', 'collect', 'vpa'] }] },
              other: { name: 'Other Methods', instruments: [{ method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }] },
            },
            sequence: ['block.upi', 'block.other'],
            preferences: { show_default_blocks: false },
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, uid: user.uid, items: cartItems, totalAmount: total, billing, paymentMethod: 'Online' }),
          });
          const result = await verifyRes.json();
          if (result.success) {
            toast.success('Payment successful! ✅');
            await clearCart();
            router.push(`/order-confirmation?orderId=${result.orderId}`);
          } else {
            toast.error('Payment verification failed. Contact support.');
          }
          setLoading(false);
        },
        modal: { ondismiss: () => { setLoading(false); toast.error('Payment cancelled.'); } },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on('payment.failed', (res: any) => {
        toast.error(`Payment failed: ${res.error?.description || 'Try again.'}`);
        setLoading(false);
      });
      rzp.open();

    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Header />
      <Navbar />

      <main className={styles.checkoutPage}>
        <div className={styles.checkoutContainer}>

          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <ChevronRight size={12} />
            <Link href="/cart">Cart</Link>
            <ChevronRight size={12} />
            <span>Checkout</span>
          </nav>

          <motion.h1
            className={styles.pageTitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Secure Checkout
          </motion.h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.contentGrid}>

              {/* ── LEFT COLUMN ── */}
              <div className={styles.billingSection}>

                {/* Contact */}
                <motion.div className={styles.card} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <h2 className={styles.cardTitle}>Contact Information</h2>
                  <div className={styles.fieldGrid}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>First Name *</label>
                      <input className={styles.input} {...register('firstName')} placeholder="Karthik" />
                      {errors.firstName && <p className={styles.fieldError}>{errors.firstName.message}</p>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Last Name *</label>
                      <input className={styles.input} {...register('lastName')} placeholder="S" />
                      {errors.lastName && <p className={styles.fieldError}>{errors.lastName.message}</p>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Phone *</label>
                      <input className={styles.input} type="tel" {...register('phone')} placeholder="9876543210" />
                      {errors.phone && <p className={styles.fieldError}>{errors.phone.message}</p>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>Email *</label>
                      <input className={styles.input} type="email" {...register('email')} placeholder="you@gmail.com" />
                      {errors.email && <p className={styles.fieldError}>{errors.email.message}</p>}
                    </div>
                  </div>
                </motion.div>

                {/* Shipping */}
                <motion.div className={styles.card} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className={styles.cardTitle}>Shipping Address</h2>
                  <div className={styles.fieldGrid}>
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <label className={styles.fieldLabel}>Street Address *</label>
                      <input className={styles.input} {...register('address')} placeholder="House No., Street, Area" />
                      {errors.address && <p className={styles.fieldError}>{errors.address.message}</p>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>City *</label>
                      <input className={styles.input} {...register('city')} placeholder="Dindigul" />
                      {errors.city && <p className={styles.fieldError}>{errors.city.message}</p>}
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel}>PIN Code *</label>
                      <input className={styles.input} {...register('pincode')} maxLength={6} placeholder="624001" />
                      {errors.pincode && <p className={styles.fieldError}>{errors.pincode.message}</p>}
                    </div>
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <label className={styles.fieldLabel}>State *</label>
                      <select className={styles.select} {...register('state')}>
                        <option value="">Select state</option>
                        {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className={styles.fieldError}>{errors.state.message}</p>}
                    </div>
                    <div className={`${styles.field} ${styles.fieldFull}`}>
                      <label className={styles.fieldLabel}>Order Notes (optional)</label>
                      <textarea className={styles.textarea} {...register('notes')} rows={3} placeholder="Special delivery instructions..." />
                    </div>
                  </div>
                </motion.div>

                {/* Payment Method */}
                <motion.div className={styles.card} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className={styles.cardTitle}>Payment Method</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label className={`${styles.paymentOption} ${paymentMethod === 'online' ? styles.selected : ''}`}>
                      <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} style={{ accentColor: '#7c3aed', width: '18px', height: '18px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#111', fontWeight: 600, fontSize: '0.9rem' }}>Pay Online</p>
                        <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.125rem' }}>UPI · GPay · PhonePe · Cards · NetBanking</p>
                      </div>
                      <div className={styles.paymentBadges}>
                        {['UPI', 'GPay', 'Cards'].map(b => <span key={b} className={styles.badge}>{b}</span>)}
                      </div>
                    </label>
                    <label className={`${styles.paymentOption} ${paymentMethod === 'cod' ? styles.selected : ''}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} style={{ accentColor: '#10b981', width: '18px', height: '18px' }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#111', fontWeight: 600, fontSize: '0.9rem' }}>Cash on Delivery</p>
                        <p style={{ color: '#6b7280', fontSize: '0.75rem', marginTop: '0.125rem' }}>Pay when your order arrives</p>
                      </div>
                      <div className={styles.paymentBadges}>
                        <span className={styles.badge}>COD</span>
                      </div>
                    </label>
                  </div>
                </motion.div>

              </div>

              {/* ── RIGHT COLUMN: Order Summary ── */}
              <motion.div
                className={`${styles.card} ${styles.summaryCard}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2 className={styles.cardTitle}>
                  Your Order
                  <span style={{ color: '#374151', fontWeight: 400, fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                    ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
                  </span>
                </h2>

                {/* Cart Items */}
                <div className={styles.orderItems}>
                  {cartItems.length === 0 ? (
                    <p style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>
                      Your cart is empty
                    </p>
                  ) : cartItems.map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <div style={{ position: 'relative', width: '52px', height: '60px', flexShrink: 0 }}>
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          sizes="52px"
                          style={{ objectFit: 'cover', borderRadius: '6px' }}
                        />
                      </div>
                      <div className={styles.orderItemText}>
                        <p className={styles.orderItemName}>{item.name}</p>
                        <p className={styles.orderItemQty}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ color: '#111', fontWeight: 700, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        ₹{(parsePrice(item.price) * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className={styles.couponRow}>
                  {couponApplied ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '0.625rem 0.875rem' }}>
                      <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
                        🎉 {couponApplied} — {discount}% off
                      </span>
                      <button type="button" onClick={removeCoupon} style={{ color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem' }}>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        className={styles.couponInput}
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                      />
                      <button type="button" className={styles.couponBtn} onClick={applyCoupon}>
                        Apply
                      </button>
                    </>
                  )}
                </div>

                <hr className={styles.summaryDivider} />

                {/* Price Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className={styles.summaryRow}>
                      <span style={{ color: '#10b981' }}>Discount ({discount}%)</span>
                      <span style={{ color: '#10b981' }}>−₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className={styles.summaryRow}>
                    <span>Shipping</span>
                    <span style={{ color: '#10b981' }}>Free</span>
                  </div>
                  <div className={styles.total}>
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* CTA */}
                <motion.button
                  type="submit"
                  className={styles.ctaButton}
                  disabled={loading || cartItems.length === 0}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading
                    ? 'Processing... 🔄'
                    : paymentMethod === 'online'
                    ? `Pay ₹${total.toLocaleString('en-IN')} 🔒`
                    : `Place Order (COD) 🚚`}
                </motion.button>

                {/* Trust Badges */}
                <div className={styles.trustBadges}>
                  <div className={styles.trustBadge}>
                    <Lock size={12} />
                    <span>SSL Secure</span>
                  </div>
                  <div className={styles.trustBadge}>
                    <Truck size={12} />
                    <span>Free Shipping</span>
                  </div>
                  <div className={styles.trustBadge}>
                    <RotateCcw size={12} />
                    <span>Easy Returns</span>
                  </div>
                  <div className={styles.trustBadge}>
                    <Package size={12} />
                    <span>Secure Packing</span>
                  </div>
                </div>
              </motion.div>

            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
