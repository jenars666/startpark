'use client';

import Link from 'next/link';
import { Menu, Tag, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="site-navbar" role="navigation" aria-label="Main navigation">
      <div className="container nav-content">
        <button 
          className="nav-shop-btn" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-menu"
          aria-label="Toggle navigation menu"
          suppressHydrationWarning
        >
          {isMobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          SHOP BY CATEGORIES
        </button>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="main-menu" role="menubar">
          <li role="none"><a href="#" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>NEW ARRIVALS</a></li>
          <li role="none"><a href="#" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>TRENDING NOW</a></li>
          <li role="none"><Link href="/vesthi-shirt" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>VESTHI&SHIRT</Link></li>
          <li role="none"><Link href="/group-shirt" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>GROUP SHIRT</Link></li>
          <li className="dropdown" role="none">
            <a href="#" role="menuitem" aria-haspopup="true" aria-expanded="false">BOTTOMS <ChevronDown size={14} className="dropdown-arrow" aria-hidden="true" /></a>
            <ul className="dropdown-menu" role="menu" aria-label="Bottoms submenu">
              <li role="none"><a href="#" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>Jeans</a></li>
              <li role="none"><a href="#" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>Chinos</a></li>
              <li role="none"><a href="#" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>Joggers</a></li>
              <li role="none"><a href="#" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>Cargos</a></li>
              <li role="none"><a href="#" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>Shorts</a></li>
            </ul>
          </li>
          <li className="dropdown" role="none">
            <a href="#" role="menuitem" aria-haspopup="true" aria-expanded="false">SHIRTS <ChevronDown size={14} className="dropdown-arrow" aria-hidden="true" /></a>
            <ul className="dropdown-menu" role="menu" aria-label="Shirts submenu">
              <li role="none"><Link href="/casual-shirt" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>Casual</Link></li>
              <li role="none"><Link href="/formal-shirt" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>Formal</Link></li>
              <li role="none"><a href="#" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>Flannels</a></li>
              <li role="none"><a href="#" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>Polos</a></li>
            </ul>
          </li>
          <li role="none" className="nav-mobile-contact"><Link href="/contact" role="menuitem" onClick={() => setIsMobileMenuOpen(false)}>CONTACT</Link></li>
        </ul>

        <button className="nav-offers-btn" aria-label="View best offers" suppressHydrationWarning>
          <Tag size={18} aria-hidden="true" />
          BEST OFFERS
        </button>
      </div>
    </nav>
  );
}
