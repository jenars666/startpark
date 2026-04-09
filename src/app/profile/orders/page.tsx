'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../../../components/Header';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useFirebaseAuth } from '../../../hooks/useFirebaseAuth';
import {
  formatCurrency,
  formatDate,
  getOrderStatusText,
  getOrderStatusTone,
  getUserOrders,
} from '../../../lib/customerStore';
import type { Order } from '../../../types/order';
import styles from '../../../components/account/account-ui.module.css';

const STATUS_CLASS_NAMES = {
  pending: styles.tonePending,
  confirmed: styles.toneConfirmed,
  processing: styles.toneProcessing,
  shipped: styles.toneShipped,
  delivered: styles.toneDelivered,
  cancelled: styles.toneCancelled,
};

export default function OrderHistoryPage() {
  const router = useRouter();
  const { user, loading } = useFirebaseAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/profile/orders');
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) {
      setLoadingOrders(false);
      return;
    }

    let isActive = true;

    const loadOrders = async () => {
      try {
        const orderList = await getUserOrders(user.uid);
        if (isActive) {
          setOrders(orderList);
        }
      } catch (error) {
        console.error('Unable to load order history:', error);
        toast.error('Unable to load your order history right now.');
      } finally {
        if (isActive) {
          setLoadingOrders(false);
        }
      }
    };

    void loadOrders();

    return () => {
      isActive = false;
    };
  }, [user]);

  if (loading || loadingOrders) {
    return (
      <div className={styles.pageShell}>
        <Header />
        <Navbar />
        <main className={styles.contentWrap}>
          <section className={styles.heroCard}>
            <span className={styles.heroEyebrow}>Orders</span>
            <h1 className={styles.heroTitle}>Loading your order history.</h1>
            <p className={styles.heroText}>Pulling in every order linked to your account.</p>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.pageShell}>
      <Header />
      <Navbar />

      <main className={styles.contentWrap}>
        <section className={styles.heroCard}>
          <span className={styles.heroEyebrow}>Orders</span>
          <h1 className={styles.heroTitle}>Every order, in one place.</h1>
          <p className={styles.heroText}>
            These orders are tied to your account and stay available whenever you sign back in.
          </p>
          <div className={styles.heroMetaRow}>
            <div className={styles.metaBadge}>
              <Package size={16} />
              <span>{orders.length} saved orders</span>
            </div>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelBody}>
            <div className={styles.panelHeader}>
              <div>
                <h2 className={styles.sectionTitle}>Order History</h2>
                <p className={styles.sectionText}>
                  From your earliest purchase to the most recent order request.
                </p>
              </div>
              <div className={styles.inlineActions}>
                <button className={styles.buttonGhost} onClick={() => router.push('/profile')}>
                  <ArrowLeft size={16} />
                  Back to Profile
                </button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Package size={28} />
                </div>
                <h3 className={styles.sectionTitle}>No orders yet</h3>
                <p className={styles.sectionText}>
                  Once you place an order it will be listed here with its saved status.
                </p>
                <Link href="/" className={styles.buttonPrimary}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className={styles.list}>
                {orders.map((order) => {
                  const tone = getOrderStatusTone(order.status);

                  return (
                    <article key={order.id} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <div>
                          <h3 className={styles.orderTitle}>{order.orderNumber}</h3>
                          <div className={styles.orderMeta}>
                            {formatDate(order.createdAt)} - {order.itemCount} item
                            {order.itemCount > 1 ? 's' : ''} - {order.paymentMethod.replaceAll('_', ' ')}
                          </div>
                        </div>
                        <span className={`${styles.pill} ${STATUS_CLASS_NAMES[tone]}`}>
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>

                      <div className={styles.itemNames}>
                        {order.items.map((item) => item.name).join(', ')}
                      </div>

                      <div className={styles.splitGrid}>
                        <div className={styles.noteCard}>
                          <strong>Total</strong>
                          <div>{formatCurrency(order.total)}</div>
                        </div>
                        <div className={styles.noteCard}>
                          <strong>Delivery To</strong>
                          <div>
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        </div>
                      </div>

                      <div className={styles.inlineActions}>
                        <Link
                          href={`/order-confirmation?orderId=${order.id}`}
                          className={styles.buttonSecondary}
                        >
                          View Order
                        </Link>
                        <Link href="/cart" className={styles.buttonGhost}>
                          Shop Again
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
