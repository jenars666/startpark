'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2, ChevronRight,
  MapPin, Package, Phone, ShoppingBag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import {
  formatCurrency, formatDate,
  getOrderStatusTone, getUserOrder,
} from '../../lib/customerStore';
import type { Order } from '../../types/order';
import s from './order.module.css';

const STATUS_PILL: Record<string, string> = {
  pending: s.pending, confirmed: s.confirmed, processing: s.processing,
  shipped: s.shipped, delivered: s.delivered, cancelled: s.cancelled,
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Order Placed', confirmed: 'Confirmed', processing: 'Processing',
  shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
};

const STEPS = ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
const STEP_STATUS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const STEP_DESC = [
  'We received your order',
  'Payment verified',
  'Being prepared',
  'On the way',
  'Delivered to you',
];

export default function OrderConfirmationClient({ orderId }: { orderId: string | null }) {
  const router = useRouter();
  const { user, loading } = useFirebaseAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=/profile/orders');
  }, [loading, router, user]);

  useEffect(() => {
    if (!user || !orderId) { setLoadingOrder(false); return; }
    let active = true;
    getUserOrder(user.uid, orderId)
      .then(o => { if (active) setOrder(o); })
      .catch(() => toast.error('Unable to load order details.'))
      .finally(() => { if (active) setLoadingOrder(false); });
    return () => { active = false; };
  }, [orderId, user]);

  if (loading || loadingOrder) {
    return (
      <div className={s.shell}>
        <Header /><Navbar />
        <div className={s.center}>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Loading order details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  if (!order) {
    return (
      <div className={s.shell}>
        <Header /><Navbar />
        <div className={s.wrap}>
          <div className={s.card}>
            <div className={s.emptyWrap}>
              <div className={s.emptyIcon}><Package size={24} /></div>
              <p style={{ fontWeight: 700, color: '#111', margin: 0 }}>Order not found</p>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>
                This order may not exist or belong to your account.
              </p>
              <Link href="/profile/orders" className={s.btnPrimary} style={{ marginTop: '0.5rem' }}>
                View Order History
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tone = getOrderStatusTone(order.status);
  const currentStep = STEP_STATUS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';
  const paymentLabel = order.paymentMethod === 'razorpay' ? 'Online (Razorpay)'
    : order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery'
    : order.paymentMethod?.replaceAll('_', ' ') || '—';

  return (
    <div className={s.shell}>
      <Header />
      <Navbar />

      <div className={s.wrap}>

        {/* ── Success Banner ── */}
        <motion.div
          className={s.successBanner}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className={s.successIconWrap}>
            <CheckCircle2 size={32} color="#fff" strokeWidth={2.5} />
          </div>
          <div className={s.successText}>
            <h1 className={s.successTitle}>Order Confirmed! 🎉</h1>
            <p className={s.successSub}>
              Placed on {formatDate(order.createdAt)} · {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className={s.successOrderNum}>
            <span className={s.successOrderNumLabel}>Order ID</span>
            <span className={s.successOrderNumValue}>{order.orderNumber}</span>
          </div>
        </motion.div>

        {/* ── Order Progress Steps ── */}
        {!isCancelled && (
          <motion.div
            className={s.stepsCard}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className={s.stepsTitle}>Order Progress</p>
            <div className={s.steps}>
              {STEPS.map((label, i) => {
                const isDone = currentStep > i;
                const isActive = currentStep === i;
                return (
                  <div key={label} className={`${s.step} ${isDone ? s.done : ''} ${isActive ? s.active : ''}`}>
                    <div className={s.stepDot}>
                      {isDone ? <CheckCircle2 size={16} strokeWidth={2.5} /> : i + 1}
                    </div>
                    <div className={s.stepContent}>
                      <span className={s.stepLabel}>{label}</span>
                      <span className={s.stepDesc}>{STEP_DESC[i]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        <div className={s.grid}>

          {/* ── LEFT: Items + Delivery ── */}
          <div className={s.leftCol}>
            {/* Order Items */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className={s.cardHead}>
                <h2 className={s.cardTitle}>
                  <span className={s.cardTitleIcon}><ShoppingBag size={13} /></span>
                  Items Ordered
                </h2>
                <span className={`${s.pill} ${STATUS_PILL[tone]}`}>
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>
              <div className={s.itemList}>
                {order.items.map((item, i) => (
                  <motion.div
                    key={`${item.id}-${i}`}
                    className={s.itemRow}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                  >
                    <div className={s.itemImg}>
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        sizes="52px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={s.itemInfo}>
                      <p className={s.itemName}>{item.name}</p>
                      <p className={s.itemMeta}>Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                    <span className={s.itemPrice}>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Price Summary */}
              <div className={s.priceList}>
                <div className={s.priceRow}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal || order.total)}</span>
                </div>
                <div className={s.priceRow}>
                  <span>Shipping</span>
                  <span style={{ color: '#16a34a' }}>Free</span>
                </div>
                <div className={s.priceRowTotal}>
                  <span>Total Paid</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </motion.div>

            {/* Delivery Address */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className={s.cardHead}>
                <h2 className={s.cardTitle}>
                  <span className={s.cardTitleIcon}><MapPin size={13} /></span>
                  Delivery Address
                </h2>
              </div>
              <div className={s.infoList}>
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>Name</span>
                  <span className={s.infoValue}>{order.customer?.fullName || '—'}</span>
                </div>
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>Phone</span>
                  <span className={s.infoValue}>{order.customer?.phone || '—'}</span>
                </div>
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>Email</span>
                  <span className={s.infoValue}>{order.customer?.email || '—'}</span>
                </div>
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>Address</span>
                  <span className={s.infoValue}>
                    {[
                      order.shippingAddress?.addressLine1,
                      order.shippingAddress?.addressLine2,
                      order.shippingAddress?.city,
                      order.shippingAddress?.state,
                      order.shippingAddress?.pincode,
                    ].filter(Boolean).join(', ')}
                  </span>
                </div>
                {order.notes && (
                  <div className={s.infoRow}>
                    <span className={s.infoLabel}>Notes</span>
                    <span className={s.infoValue}>{order.notes}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Payment + Actions ── */}
          <div className={s.rightCol}>
            {/* Payment Info */}
            <motion.div className={s.card} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className={s.cardHead}>
                <h2 className={s.cardTitle}>
                  <span className={s.cardTitleIcon}><CheckCircle2 size={13} /></span>
                  Payment
                </h2>
                <span className={s.payBadge}>
                  <CheckCircle2 size={11} />
                  {order.paymentStatus === 'completed' ? 'Paid' : order.paymentStatus}
                </span>
              </div>
              <div className={s.infoList}>
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>Method</span>
                  <span className={s.infoValue}>{paymentLabel}</span>
                </div>
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>Status</span>
                  <span className={s.infoValue} style={{ textTransform: 'capitalize' }}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.razorpayPaymentId && (
                  <div className={s.infoRow}>
                    <span className={s.infoLabel}>Payment ID</span>
                    <span className={s.infoValue} style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>
                      {order.razorpayPaymentId}
                    </span>
                  </div>
                )}
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>Order Date</span>
                  <span className={s.infoValue}>{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </motion.div>

            {/* Help Info */}
            <motion.div className={s.card} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            {/* Actions */}
              <div className={s.actions}>
                <Link href="/profile/orders" className={s.btnPrimary}>
                  <Package size={15} /> View All Orders
                  <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
                </Link>
                <Link href="/" className={s.btnSecondary}>
                  <ShoppingBag size={15} /> Continue Shopping
                </Link>
                <a href={`tel:${order.customer?.phone}`} className={s.btnSecondary}>
                  <Phone size={15} /> Call for Help
                </a>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
