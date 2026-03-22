'use client';

import Link from 'next/link';
import { Menu, Tag } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="site-navbar">
      <div className="container nav-content">
        <button className="nav-shop-btn">
          <Menu size={20} />
          SHOP BY CATEGORIES
        </button>

        <ul className="nav-links">
          <li><a href="#">NEW ARRIVALS</a></li>
          <li><a href="#">TRENDING NOW</a></li>
          <li><Link href="/vesthi-shirt">VESTHI&SHIRT</Link></li>
          <li className="dropdown">
            <a href="#">BOTTOMS <span className="dropdown-arrow">v</span></a>
            <ul className="dropdown-menu">
              <li><a href="#">Jeans</a></li>
              <li><a href="#">Chinos</a></li>
              <li><a href="#">Joggers</a></li>
              <li><a href="#">Cargos</a></li>
              <li><a href="#">Shorts</a></li>
            </ul>
          </li>
          <li className="dropdown">
            <a href="#">SHIRTS <span className="dropdown-arrow">v</span></a>
            <ul className="dropdown-menu">
              <li><a href="#">Casual</a></li>
              <li><a href="#">Formal</a></li>
              <li><a href="#">Flannels</a></li>
              <li><a href="#">Polos</a></li>
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
