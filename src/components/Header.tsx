'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Heart, ShoppingCart, Instagram, Facebook, Youtube, Chrome, LogOut } from 'lucide-react';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Header.css';

export default function Header() {
  const { user, loading } = useFirebaseAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlistItems } = useWishlist();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // For portal rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      const hasWelcomed = sessionStorage.getItem('welcome_toast_shown');
      if (!hasWelcomed) {
        toast.success(`Welcome back, ${user.displayName || 'User'}!`, {
          icon: '👋',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
        sessionStorage.setItem('welcome_toast_shown', 'true');
      }
    }
  }, [loading, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        profileMenuRef.current && !profileMenuRef.current.contains(target) &&
        avatarRef.current && !avatarRef.current.contains(target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setShowProfileMenu(false);
    sessionStorage.removeItem('welcome_toast_shown');
    if (!auth) {
      toast.error('Authentication is not configured right now.');
      return;
    }
    await firebaseSignOut(auth);
    toast.success('Signed out successfully');
  };

  // Render dropdown via portal so it's never clipped by header ancestors
  const renderProfileDropdown = () => {
    if (!showProfileMenu || !user || !mounted) return null;

    const dropdownContent = (
      <>
        <div className="profile-backdrop" onClick={() => setShowProfileMenu(false)} />
        <div className="profile-dropdown" ref={profileMenuRef}>
          <div className="profile-dropdown-handle">
            <div className="profile-dropdown-handle-bar" />
          </div>
          <div className="profile-dropdown-arrow" />
          <div className="profile-dropdown-header">
            {user.photoURL ? (
              <div style={{ position: 'relative', width: '40px', height: '40px' }} className="profile-dropdown-avatar">
                <Image src={user.photoURL} alt="" fill sizes="40px" style={{ objectFit: 'cover' }} />
              </div>
            ) : (
              <div className="profile-dropdown-avatar profile-dropdown-avatar-placeholder">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div className="profile-dropdown-info">
              <span className="profile-dropdown-name">{user.displayName || 'User'}</span>
              <span className="profile-dropdown-email">{user.email}</span>
            </div>
          </div>
          <div className="profile-dropdown-divider" />
          <button className="profile-dropdown-logout" onClick={handleSignOut}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </>
    );

    return createPortal(dropdownContent, document.body);
  };

  return (
    <>
      <header className="site-header">
        {/* Announcement Bar */}
        <div className="announcement-bar">
          <div className="container announcement-content">
            <p>
              Special Offer: Group Shirts from ₹399 — All Sizes 22 to 5XL! <Link href="/group-shirt" className="shop-now-link">Enquire Now →</Link>
            </p>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><Instagram size={14} /></a>
              <a href="#" aria-label="Facebook"><Facebook size={14} /></a>
              <a href="#" aria-label="Youtube"><Youtube size={14} /></a>
              <a href="#" aria-label="Google"><Chrome size={14} /></a>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="main-header">
          <div className="container header-content">
            <div className="search-bar">
              <input type="text" placeholder="Search products..." />
              <button className="search-btn" aria-label="Search">
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
                    <div style={{ position: 'relative', width: '32px', height: '32px' }} className="avatar-circle" onClick={() => setShowProfileMenu(!showProfileMenu)} title={user.displayName || "Profile"}>
                      <Image
                        src={user.photoURL}
                        alt={user.displayName || "User"}
                        fill
                        sizes="32px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div 
                      className="avatar-circle avatar-placeholder"
                      title={user.displayName || "Profile"}
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="login-btn">LOGIN</Link>
              )}
              <div className="action-icons">
                <Link href="/wishlist" className="icon-btn" aria-label="Wishlist">
                  <Heart size={22} className="header-icon" />
                  {totalWishlistItems > 0 && <span className="badge">{totalWishlistItems}</span>}
                </Link>
                <button 
                  className="icon-btn cart-btn" 
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Toggle cart"
                >
                  <ShoppingCart size={22} className="header-icon" />
                  {totalItems > 0 && <span className="badge">{totalItems}</span>}
                  <div className="cart-text">
                    <span className="cart-label">My Cart</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Portal-rendered dropdown — always renders at body level */}
      {renderProfileDropdown()}
    </>
  );
}
