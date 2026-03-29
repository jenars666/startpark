'use client';

import Header from '../../../components/Header';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { motion } from 'framer-motion';
import { ShoppingCart, Share2, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formalProducts } from '../formal-products';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import '../formal.css';

export default function FormalProductListPage() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  return (
    <div className="formal-page-wrapper">
      <Header />
      <Navbar />

      <main>
        <section className="formal-hero">
          <div className="formal-hero-content">
            <motion.span className="hero-tag">All Products</motion.span>
            <motion.h1 className="hero-title">
              Formal Shirts <br /><span>Collection</span>
            </motion.h1>
            <motion.p className="hero-desc">
              Complete collection of formal shirts available.
            </motion.p>
          </div>
          <div className="formal-hero-image">
            <div className="image-overlay" />
          </div>
        </section>

        <section className="formal-collection">
          <div className="container">
            <div className="collection-header">
              <h2 className="collection-title">All Formal Products</h2>
              <p className="collection-subtitle">Browse entire formal shirt inventory</p>
            </div>

            <div className="collection-toolbar">
              <div className="results-count">Showing 1 - {formalProducts.length} of {formalProducts.length} products</div>
              <div className="sort-filter">
                <span className="sort-label">Sort by: 
                  <select>
                    <option>Recommended</option>
                  </select>
                </span>
              </div>
            </div>

            <div className="product-grid">
              {formalProducts.map((product, idx) => (
                <Link href={`/formal-shirt/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div className="f-product-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <div className="f-product-image-box">
                      {product.tag && <span className="f-tag">{product.tag}</span>}
                      <img src={product.img} alt={product.name} className="f-product-image" />
                      <div className="f-hover-actions">
                        <button className="f-action-btn" title="Add to Cart" onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart({ id: product.id, name: product.name, price: product.price, img: product.img, quantity: 1 }); }}>
                          <ShoppingCart size={18} />
                        </button>
                        <button className="f-action-btn" title="Wishlist" onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (isInWishlist(product.id)) removeFromWishlist(product.id); else addToWishlist({ id: product.id, name: product.name, price: product.price, img: product.img }); }}>
                          <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        </button>
                        <button className="f-action-btn" title="Share" onClick={(e) => e.preventDefault()}>
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
      </main>

      <Footer />
    </div>
  );
}
