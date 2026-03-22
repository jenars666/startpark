'use client';

import Link from 'next/link';
import { Search, Heart, ShoppingCart, User, Instagram, Facebook, Youtube, Chrome } from 'lucide-react';
import './Header.css';

export default function Header() {
  return (
    <header className="site-header">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-content">
          <p>
            Special Offer: Group Shirts from ₹399 — All Sizes 22 to 5XL! <a href="#" className="shop-now-link" style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>Enquire Now →</a>
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
            <Link href="/home">
              <img 
                src="/images/logo.png" 
                alt="Star Mens Park Logo" 
                className="site-logo"
              />
            </Link>
          </div>

          <div className="header-actions">
            <Link href="/login" className="login-btn">LOGIN</Link>
            <div className="action-icons">
              <button className="icon-btn">
                <Heart size={22} className="header-icon" />
                <span className="badge">0</span>
              </button>
              <button className="icon-btn cart-btn">
                <ShoppingCart size={22} className="header-icon" />
                <span className="badge">0</span>
                <div className="cart-text">
                  <span className="cart-label">My Cart</span>
                  <span className="cart-price">$0.00</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
