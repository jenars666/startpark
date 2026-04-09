'use client';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { ShoppingCart, Share2, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '../../hooks/useProducts';
import { useGuestGuard } from '../../hooks/useGuestGuard';
import { useCart } from '../../context/CartContextFirebase';
import { useWishlist } from '../../context/WishlistContextFirebase';
import './formal.css';

export default function FormalShirtPage() {
  const { guardAddToCart, guardWishlist } = useGuestGuard();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const { products: formalProducts, loading } = useProducts('Formal Shirt');


  // Desired order by product name (from images):
  // 1. OFFICE READY LIGHT GREY SHIRT
  // 2. ELEGANT NAVY FORMAL SHIRT
  // 3. STRUCTURED FORMAL BLACK SHIRT
  // 4. SLIM FIT FORMAL BLUE SHIRT
  // 5. CLASSIC FORMAL WHITE SHIRT
  const desiredOrder = [
    'OFFICE READY LIGHT GREY SHIRT',
    'ELEGANT NAVY FORMAL SHIRT',
    'STRUCTURED FORMAL BLACK SHIRT',
    'SLIM FIT FORMAL BLUE SHIRT',
    'CLASSIC FORMAL WHITE SHIRT'
  ];

  // Remove duplicates and sort by desired order
  const uniqueFormalProducts = formalProducts.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.img === product.img)
  ).sort((a, b) => {
    const aIdx = desiredOrder.indexOf(a.name.trim().toUpperCase());
    const bIdx = desiredOrder.indexOf(b.name.trim().toUpperCase());
    if (aIdx === -1 && bIdx === -1) return 0;
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  return (
    <div className="formal-page-wrapper">
      <Header />
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="formal-hero">
          <div className="formal-hero-content">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-tag"
            >
              Professional Collection
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-title"
            >
              Formal Shirts & <br /><span>Dress Shirts</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-desc"
            >
              Elevate your professional wardrobe with our sophisticated collection of formal shirts. Tailored for boardrooms, business meetings, and important occasions.
            </motion.p>
          </div>
          <div className="formal-hero-image">
            <div className="image-overlay" />
          </div>
        </section>

        {/* Collection Section */}
        <section className="formal-collection">
          <div className="container">
            <div className="collection-header">
              <h2 className="collection-title">Formal Collection</h2>
              <p className="collection-subtitle">Explore our curated selection of formal shirts</p>
            </div>

            {/* Toolbar */}
            <div className="collection-toolbar">
              <div className="results-count">Showing 1 - {uniqueFormalProducts.length} of {uniqueFormalProducts.length} products</div>
              <div className="sort-filter">
                <span className="sort-label">Sort by: 
                  <select title="Sort products">
                    <option>Recommended</option>
                    <option>Price Low-High</option>
                    <option>Price High-Low</option>
                  </select>
                </span>
                <span className="filter-label">Filter: All Colors</span>
              </div>
            </div>

            <div className="product-grid">
              {uniqueFormalProducts.map((product, idx) => (
                <Link href={`/formal-shirt/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="f-product-card"
                  >
                    <div className="f-product-image-box">
                      {product.tag && <span className="f-tag">{product.tag}</span>}
                      <img
                        src={product.img}
                        alt={product.name}
                        className="f-product-image"
                      />
                      <div className="f-hover-actions">
                        <button 
                          className="f-action-btn" 
                          title="Add to Cart"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const item = { id: product.id, name: product.name, price: product.price, img: product.img, quantity: 1 };
                            if (!guardAddToCart(item)) return;
                            await addToCart(item);
                          }}
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button 
                          className="f-action-btn" 
                          title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const item = { id: product.id, name: product.name, price: product.price, img: product.img };
                            if (isInWishlist(product.id)) { await removeFromWishlist(product.id); }
                            else { if (!guardWishlist(item)) return; await addToWishlist(item); }
                          }}
                        >
                          <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        </button>
                        <button 
                          className="f-action-btn" 
                          title="Share"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="f-product-details">
                      <h3 className="f-product-name">{product.name}</h3>
                      <div className="f-product-price">
                        <span className="f-old-price">₹{product.oldPrice}</span>
                        <span className="f-new-price">₹{product.price}</span>
                      </div>
                      <button className="f-enquire-btn">
                        VIEW DETAILS <ArrowRight size={14} />
                      </button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Offer Section */}
        <section className="formal-offer">
          <div className="offer-content">
            <h3>Boardroom Bundle Deal</h3>
            <p>Buy 3 Formal Shirts & Save 15% on Your Professional Wardrobe Upgrade!</p>
            <button className="offer-btn">SHOP BUNDLE</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
