'use client';

import Link from 'next/link';
import { Menu, Tag, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="site-navbar">
      <div className="container nav-content">
        <button className="nav-shop-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          SHOP BY CATEGORIES
        </button>

        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>NEW ARRIVALS</a></li>
          <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>TRENDING NOW</a></li>
          <li><Link href="/vesthi-shirt" onClick={() => setIsMobileMenuOpen(false)}>VESTHI&SHIRT</Link></li>
          <li><Link href="/group-shirt" onClick={() => setIsMobileMenuOpen(false)}>GROUP SHIRT</Link></li>
          <li className="dropdown">
            <a href="#">BOTTOMS <ChevronDown size={14} className="dropdown-arrow" /></a>
            <ul className="dropdown-menu">
              <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Jeans</a></li>
              <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Chinos</a></li>
              <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Joggers</a></li>
              <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Cargos</a></li>
              <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Shorts</a></li>
            </ul>
          </li>
          <li className="dropdown">
            <a href="#">SHIRTS <ChevronDown size={14} className="dropdown-arrow" /></a>
            <ul className="dropdown-menu">
              <li><Link href="/casual-shirt" onClick={() => setIsMobileMenuOpen(false)}>Casual</Link></li>
              <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Formal</a></li>
              <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Flannels</a></li>
              <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Polos</a></li>
            </ul>
          </li>
        </ul>

        <button className="nav-offers-btn">
          <Tag size={18} />
          BEST OFFERS
        </button>
      </div>
    </nav>
  );
}
