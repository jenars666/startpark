'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContextFirebase';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import { formatCurrency, parsePrice } from '../../lib/customerStore';
import styles from '../../components/account/account-ui.module.css';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function CartContent() {
  const router = useRouter();
  const { user } = useFirebaseAuth();
  const { cartItems, removeFromCart, totalItems, totalPrice, updateQuantity } = useCart();

  const handleUpdateQuantity = async (id: number | string, delta: number) => {
    const item = cartItems.find(item => String(item.id) === String(id));
    if (item) {
      await updateQuantity(id, item.quantity + delta);
    }
  };

  const handleRemoveItem = async (id: number | string) => {
    await removeFromCart(id);
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.pageShell}>
        <Header />
        <Navbar />
        <main className={styles.contentWrap}>
          <section className={styles.heroCard}>
            <span className={styles.heroEyebrow}>Saved Cart</span>
            <h1 className={styles.heroTitle}>Your cart is empty.</h1>
            <p className={styles.heroText}>
              Start browsing premium menswear and your selections will stay with you across
              sessions once you sign in.
            </p>
          </section>

          <section className={styles.panel}>
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <ShoppingBag size={28} />
              </div>
              <h2 className={styles.sectionTitle}>Nothing here yet</h2>
              <p className={styles.sectionText}>
                Add products to your cart and come back anytime to continue your order.
              </p>
              <div className={styles.inlineActions}>
                <button className={styles.buttonPrimary} onClick={() => router.push('/')}>
                  Continue Shopping
                </button>
                <button className={styles.buttonSecondary} onClick={() => router.push('/profile')}>
                  Go to Account
                </button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.pageShell}>
      <Header />
      <Navbar />

      <main className={styles.contentWrap}>
        <section className={styles.heroCard}>
          <span className={styles.heroEyebrow}>Saved Cart</span>
          <h1 className={styles.heroTitle}>Your selections are ready.</h1>
          <p className={styles.heroText}>
            Review sizes, quantities, and totals before placing your order. Your cart is
            {user ? ' linked to your account.' : ' stored locally until you sign in.'}
          </p>
          <div className={styles.heroMetaRow}>
            <div className={styles.metaBadge}>
              <ShoppingBag size={16} />
              <span>
                {totalItems} item{totalItems > 1 ? 's' : ''}
              </span>
            </div>
            <div className={styles.metaBadge}>
              <ShieldCheck size={16} />
              <span>{user ? 'Account synced' : 'Sync on login'}</span>
            </div>
          </div>
        </section>

        <div className={`${styles.grid} ${styles.twoColumn}`}>
          <section className={styles.panel}>
            <div className={styles.panelBody}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Cart Items</h2>
                  <p className={styles.sectionText}>
                    Adjust quantities or remove anything you no longer want.
                  </p>
                </div>
                <button className={styles.buttonGhost} onClick={() => router.push('/')}>
                  <ArrowLeft size={16} />
                  Keep Shopping
                </button>
              </div>

              <div className={styles.list}>
                {cartItems.map((item) => {
                  const lineTotal = parsePrice(item.price) * item.quantity;

                  return (
                    <article key={item.id} className={styles.itemCard}>
                      <div className={styles.imageWrap}>
                        <Image
                          src={item.img}
                          alt={item.name}
                          fill
                          sizes="104px"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>

                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        <div className={styles.itemSubtext}>{formatCurrency(parsePrice(item.price))}</div>
                        <div className={styles.qtyRow}>
                          <button
                            className={styles.qtyButton}
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            <Minus size={14} />
                          </button>
                          <span className={styles.qtyValue}>{item.quantity}</span>
                          <button
                            className={styles.qtyButton}
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className={styles.priceColumn}>
                        <span className={styles.priceText}>{formatCurrency(lineTotal)}</span>
                        <button
                          className={styles.buttonDanger}
                          onClick={() => {
                            handleRemoveItem(item.id);
                            toast.success('Removed from cart.');
                          }}
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <aside className={styles.panel}>
            <div className={styles.panelBody}>
              <div className={styles.panelHeader}>
                <div>
                  <h2 className={styles.sectionTitle}>Order Summary</h2>
                  <p className={styles.sectionText}>A clean snapshot before checkout.</p>
                </div>
              </div>

              <div className={styles.summaryList}>
                <div className={styles.summaryRow}>
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>Calculated at order placement</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className={styles.noteCard}>
                {user
                  ? 'Your cart is stored under your customer account and will still be here the next time you log in.'
                  : 'Sign in before checkout and we will attach this cart to your customer account automatically.'}
              </div>

              <div className={styles.actionColumn}>
                <button
                  className={styles.buttonPrimary}
                  onClick={() =>
                    router.push(user ? '/checkout' : '/login?redirect=/checkout')
                  }
                >
                  {user ? 'Continue to Checkout' : 'Sign In to Checkout'}
                </button>
                <button className={styles.buttonSecondary} onClick={() => router.push('/profile')}>
                  View Profile
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className={styles.pageShell}>
        <Header />
        <Navbar />
        <main className={styles.contentWrap}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading cart...</div>
        </main>
        <Footer />
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}
