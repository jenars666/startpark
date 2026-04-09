'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronRight, Heart, LogOut, Package,
  Save, ShoppingBag, ShoppingCart, User2, X,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { auth } from '../../lib/firebase';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import {
  formatCurrency, formatDate,
  getOrderStatusTone, getUserOrders,
  getUserProfile, updateUserProfile,
} from '../../lib/customerStore';
import type { Order } from '../../types/order';
import type { UserProfile } from '../../types/user';
import s from './profile.module.css';

const STATUS_PILL: Record<string, string> = {
  pending:    s.pending,
  confirmed:  s.confirmed,
  processing: s.processing,
  shipped:    s.shipped,
  delivered:  s.delivered,
  cancelled:  s.cancelled,
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Placed', confirmed: 'Confirmed', processing: 'Processing',
  shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useFirebaseAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '' });

  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=/profile');
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) { setLoadingData(false); return; }
    let active = true;
    Promise.all([getUserProfile(user.uid), getUserOrders(user.uid)])
      .then(([p, o]) => {
        if (!active) return;
        setProfile(p);
        setOrders(o);
        setEditForm({ fullName: p?.fullName || user.displayName || '', phone: p?.phone || '' });
      })
      .catch(() => toast.error('Unable to load account.'))
      .finally(() => { if (active) setLoadingData(false); });
    return () => { active = false; };
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, editForm);
      setProfile(p => p ? { ...p, ...editForm } : p);
      setIsEditing(false);
      toast.success('Profile updated.');
    } catch {
      toast.error('Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    toast.success('Signed out.');
    router.push('/');
  };

  if (loading || loadingData) {
    return (
      <div className={s.shell}>
        <Header /><Navbar />
        <div className={s.wrap} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Loading your account...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.fullName || user.displayName || 'Star Customer';
  const initials = displayName.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => ['pending','confirmed','processing','shipped'].includes(o.status)).length;
  const lifetimeSpend = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
  const loyaltyCount = profile?.loyaltyCount || 0;
  const loyaltyPct = Math.min((loyaltyCount / 5) * 100, 100);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className={s.shell}>
      <Header />
      <Navbar />

      <div className={s.wrap}>

        {/* ── Hero Banner ── */}
        <motion.div className={s.hero} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className={s.heroBg} />
          <div className={s.heroLeft}>
            <div className={s.heroAvatar}>
              {user.photoURL ? (
                <Image src={user.photoURL} alt={displayName} fill sizes="64px" style={{ objectFit: 'cover' }} />
              ) : initials}
            </div>
            <h1 className={s.heroName}>{displayName}</h1>
            <p className={s.heroEmail}>{profile?.email || user.email}</p>
          </div>
          <div className={s.heroRight}>
            <div className={s.heroStatPill}>
              <span className={s.heroStatNum}>{totalOrders}</span>
              <span className={s.heroStatLabel}>Orders</span>
            </div>
            <div className={s.heroStatPill}>
              <span className={s.heroStatNum}>{activeOrders}</span>
              <span className={s.heroStatLabel}>Active</span>
            </div>
            <div className={s.heroStatPill}>
              <span className={s.heroStatNum}>{formatCurrency(lifetimeSpend)}</span>
              <span className={s.heroStatLabel}>Spent</span>
            </div>
          </div>
        </motion.div>

        <div className={s.grid}>

          {/* ── LEFT COLUMN ── */}
          <div className={s.leftCol}>

            {/* Profile Card */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className={s.cardHead}>
                <h2 className={s.cardTitle}>
                  <span className={`${s.cardTitleIcon}`}><User2 size={14} /></span>
                  Profile
                </h2>
                <div className={s.btnRow}>
                  {isEditing ? (
                    <>
                      <button className={s.btnPrimary} onClick={handleSave} disabled={saving}>
                        <Save size={13} />{saving ? 'Saving...' : 'Save'}
                      </button>
                      <button className={s.btnSecondary} onClick={() => setIsEditing(false)}>
                        <X size={13} />
                      </button>
                    </>
                  ) : (
                    <button className={s.btnSecondary} onClick={() => setIsEditing(true)}>
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className={s.cardBody}>
                {isEditing ? (
                  <div className={s.editGrid}>
                    <div className={s.editField}>
                      <label className={s.editLabel}>Full Name</label>
                      <input className={s.editInput} value={editForm.fullName}
                        onChange={e => setEditForm(f => ({ ...f, fullName: e.target.value }))} />
                    </div>
                    <div className={s.editField}>
                      <label className={s.editLabel}>Phone</label>
                      <input className={s.editInput} value={editForm.phone}
                        onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <div className={s.editField}>
                      <label className={s.editLabel}>Email</label>
                      <input className={s.editInput} value={profile?.email || user.email || ''} disabled />
                    </div>
                  </div>
                ) : (
                  <div className={s.infoList}>
                    {[
                      { label: 'Full Name', value: profile?.fullName || user.displayName || '—' },
                      { label: 'Email', value: profile?.email || user.email || '—' },
                      { label: 'Phone', value: profile?.phone || '—' },
                      { label: 'Member Since', value: formatDate(profile?.createdAt) },
                    ].map(({ label, value }) => (
                      <div key={label} className={s.infoRow}>
                        <span className={s.infoLabel}>{label}</span>
                        <span className={s.infoValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Loyalty Card */}
            <motion.div className={s.loyaltyCard} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className={s.loyaltyTop}>
                <h3 className={s.loyaltyTitle}>⭐ Loyalty Rewards</h3>
                <span className={s.loyaltyCount}>{loyaltyCount} / 5 shirts</span>
              </div>
              <div className={s.loyaltyBar}>
                <div className={s.loyaltyFill} style={{ width: `${loyaltyPct}%` }} />
              </div>
              <p className={s.loyaltyHint}>
                {loyaltyCount >= 5
                  ? '🎉 You have a reward ready to claim!'
                  : `Buy ${5 - loyaltyCount} more shirt${5 - loyaltyCount !== 1 ? 's' : ''} to unlock a free reward`}
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div className={s.card} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className={s.quickLinks}>
                <Link href="/profile/orders" className={s.quickLink}>
                  <span className={`${s.quickLinkIcon} ${s.iconPurple}`}><Package size={16} /></span>
                  My Orders
                  <ChevronRight size={15} className={s.quickLinkArrow} />
                </Link>
                <Link href="/cart" className={s.quickLink}>
                  <span className={`${s.quickLinkIcon} ${s.iconBlue}`}><ShoppingCart size={16} /></span>
                  My Cart
                  <ChevronRight size={15} className={s.quickLinkArrow} />
                </Link>
                <Link href="/wishlist" className={s.quickLink}>
                  <span className={`${s.quickLinkIcon} ${s.iconRed}`}><Heart size={16} /></span>
                  Wishlist
                  <ChevronRight size={15} className={s.quickLinkArrow} />
                </Link>
                <button className={s.quickLink} onClick={handleSignOut}>
                  <span className={`${s.quickLinkIcon} ${s.iconOrange}`}><LogOut size={16} /></span>
                  Sign Out
                  <ChevronRight size={15} className={s.quickLinkArrow} />
                </button>
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className={s.rightCol}>

            {/* Stats */}
            <motion.div className={s.card} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div className={s.statsRow}>
                <div className={s.statItem}>
                  <span className={s.statNum}>{totalOrders}</span>
                  <span className={s.statLbl}>Total Orders</span>
                </div>
                <div className={s.statItem}>
                  <span className={s.statNum}>{activeOrders}</span>
                  <span className={s.statLbl}>In Progress</span>
                </div>
                <div className={s.statItem}>
                  <span className={s.statNum}>{formatCurrency(lifetimeSpend)}</span>
                  <span className={s.statLbl}>Lifetime Spend</span>
                </div>
              </div>
            </motion.div>

            {/* Recent Orders */}
            <motion.div className={s.card} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className={s.cardHead}>
                <h2 className={s.cardTitle}>
                  <span className={s.cardTitleIcon}><Package size={14} /></span>
                  Recent Orders
                </h2>
                <Link href="/profile/orders" className={s.btnSecondary} style={{ fontSize: '0.75rem', padding: '0.4rem 0.875rem' }}>
                  View All
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className={s.empty}>
                  <div className={s.emptyIcon}><ShoppingBag size={22} /></div>
                  <p className={s.emptyTitle}>No orders yet</p>
                  <p className={s.emptyText}>Your orders will appear here after your first purchase.</p>
                  <Link href="/" className={s.btnPrimary} style={{ marginTop: '0.25rem' }}>Start Shopping</Link>
                </div>
              ) : (
                <div className={s.orderList}>
                  {recentOrders.map((order, i) => {
                    const tone = getOrderStatusTone(order.status);
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 + i * 0.05 }}
                      >
                        <Link href={`/order-confirmation?orderId=${order.id}`} className={s.orderRow}>
                          <div className={s.orderIcon}><Package size={18} /></div>
                          <div className={s.orderInfo}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <span className={s.orderNum}>{order.orderNumber}</span>
                              <span className={`${s.pill} ${STATUS_PILL[tone]}`}>
                                {STATUS_LABEL[order.status] || order.status}
                              </span>
                            </div>
                            <div className={s.orderMeta}>
                              {formatDate(order.createdAt)} · {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <span className={s.orderAmount}>{formatCurrency(order.total)}</span>
                          <ChevronRight size={15} style={{ color: '#d1d5db', flexShrink: 0 }} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
