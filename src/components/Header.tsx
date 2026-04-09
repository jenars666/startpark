'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import {
  Chrome,
  Facebook,
  Heart,
  Instagram,
  LogOut,
  Package,
  Search,
  ShoppingCart,
  User2,
  Youtube,
} from 'lucide-react';
import { signOut as firebaseSignOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { auth } from '../lib/firebase';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { useCart } from '../context/CartContextFirebase';
import { useWishlist } from '../context/WishlistContextFirebase';
import './Header.css';

export default function Header() {
  const { user, loading } = useFirebaseAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlistItems } = useWishlist();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && user) {
      const hasWelcomed = sessionStorage.getItem('star_welcome_toast');
      if (!hasWelcomed) {
        toast.success(`Welcome back, ${user.displayName || 'Star customer'}.`);
        sessionStorage.setItem('star_welcome_toast', 'true');
      }
    }
  }, [loading, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(target) &&
        avatarRef.current &&
        !avatarRef.current.contains(target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    sessionStorage.removeItem('star_welcome_toast');

    if (!auth) {
      toast.error('Authentication is not configured right now.');
      return;
    }

    await firebaseSignOut(auth);
    toast.success('Signed out successfully.');
  };

  const renderProfileDropdown = () => {
    if (!showProfileMenu || !user || typeof document === 'undefined') {
      return null;
    }

    const initials =
      user.displayName?.charAt(0).toUpperCase() ||
      user.email?.charAt(0).toUpperCase() ||
      'S';

    const dropdown = (
      <>
        <div className="profile-backdrop" onClick={() => setShowProfileMenu(false)} />
        <div className="profile-dropdown" ref={profileMenuRef}>
          <div className="profile-dropdown-handle">
            <div className="profile-dropdown-handle-bar" />
          </div>
          <div className="profile-dropdown-arrow" />
          <div className="profile-dropdown-header">
            {user.photoURL ? (
              <div
                style={{ position: 'relative', width: '42px', height: '42px' }}
                className="profile-dropdown-avatar"
              >
                <Image src={user.photoURL} alt="" fill sizes="42px" style={{ objectFit: 'cover' }} />
              </div>
            ) : (
              <div className="profile-dropdown-avatar profile-dropdown-avatar-placeholder">
                {initials}
              </div>
            )}

            <div className="profile-dropdown-info">
              <span className="profile-dropdown-name">
                {user.displayName || 'Star Customer'}
              </span>
              <span className="profile-dropdown-email">{user.email}</span>
            </div>
          </div>

          <div className="profile-dropdown-divider" />

          <div className="profile-dropdown-links">
            <Link
              href="/profile"
              className="profile-dropdown-link"
              onClick={() => setShowProfileMenu(false)}
            >
              <User2 size={16} />
              <span>My Profile</span>
            </Link>
            <Link
              href="/profile/orders"
              className="profile-dropdown-link"
              onClick={() => setShowProfileMenu(false)}
            >
              <Package size={16} />
              <span>My Orders</span>
            </Link>
            <Link
              href="/cart"
              className="profile-dropdown-link"
              onClick={() => setShowProfileMenu(false)}
            >
              <ShoppingCart size={16} />
              <span>My Cart</span>
            </Link>
          </div>

          <div className="profile-dropdown-divider" />

          <button className="profile-dropdown-logout" onClick={handleSignOut}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </>
    );

    return createPortal(dropdown, document.body);
  };

  return (
    <>
      <header className="site-header">
        <div className="announcement-bar">
          <div className="container announcement-content">
            <p>
              Premium menswear in Dindigul. Save your cart, track every order, and shop with a
              polished account experience.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Instagram">
                <Instagram size={14} />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook size={14} />
              </a>
              <a href="#" aria-label="Youtube">
                <Youtube size={14} />
              </a>
              <a href="#" aria-label="Google">
                <Chrome size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="main-header">
          <div className="container header-content">
            <div className="search-bar">
              <input type="text" placeholder="Search premium shirts..." suppressHydrationWarning />
              <button className="search-btn" aria-label="Search" suppressHydrationWarning>
                <Search size={18} />
              </button>
            </div>

            <div className="logo-container">
              <Link href="/" style={{ textDecoration: 'none' }}>
                <Image
                  src="/images/logo.png"
                  alt="Star Mens Park Logo"
                  width={350}
                  height={120}
                  priority
                  quality={100}
                  unoptimized
                  className="site-logo"
                  style={{ objectFit: 'contain' }}
                />
              </Link>
            </div>

            <div className="header-actions">
              {user ? (
                <div className="user-profile" ref={avatarRef}>
                  {user.photoURL ? (
                    <div
                      style={{ position: 'relative', width: '36px', height: '36px' }}
                      className="avatar-circle"
                      onClick={() => setShowProfileMenu((current) => !current)}
                      title={user.displayName || 'Profile'}
                    >
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        fill
                        sizes="36px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div
                      className="avatar-circle avatar-placeholder"
                      title={user.displayName || 'Profile'}
                      onClick={() => setShowProfileMenu((current) => !current)}
                    >
                      {user.displayName?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase() ||
                        'S'}
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="login-btn">
                  LOGIN
                </Link>
              )}

              <div className="action-icons">
                <Link href="/wishlist" className="icon-btn" aria-label="Wishlist">
                  <Heart size={22} className="header-icon" />
                  {totalWishlistItems > 0 ? <span className="badge">{totalWishlistItems}</span> : null}
                </Link>
                <button
                  className="icon-btn cart-btn"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Toggle cart"
                  suppressHydrationWarning
                >
                  <ShoppingCart size={22} className="header-icon" />
                  {totalItems > 0 ? <span className="badge">{totalItems}</span> : null}
                  <div className="cart-text">
                    <span className="cart-label">My Cart</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {renderProfileDropdown()}
    </>
  );
}
