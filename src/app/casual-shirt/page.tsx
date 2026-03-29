'use client';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { ShoppingCart, Share2, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { casualProducts } from './casual-products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import './casual.css';

export default function CasualShirtPage() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  return (
    <div className="casual-page-wrapper">
      <Header />
      <Navbar />

      <main>
        {/* Hero Section - Adapted from Vesthi */}
        <section className="casual-hero">
          <div className="casual-hero-content">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-tag"
            >
              Everyday Collection
            </motion.span>
  <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-title"
            >
              Casual Shirts & <br /><span>Shackets</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-desc"
            >
              Discover effortless style with our premium collection of casual shirts and shackets. Perfect for daily wear, weekends, and casual outings.
            </motion.p>
          </div>
          <div className="casual-hero-image">
            <div className="image-overlay" />
          </div>
        </section>

    {/* Collection Section with Toolbar - Flipkart Style */}
        <section className="casual-collection">
          <div className="container">
            <div className="collection-header">
              <h2 className="collection-title">Casual Collection</h2>
              <p className="collection-subtitle">Explore our curated selection of casual shirts</p>
            </div>

            {/* Toolbar */}
            <div className="collection-toolbar">
              <div className="results-count">Showing 1 - {casualProducts.length} of {casualProducts.length} products</div>
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
              {casualProducts.map((product, idx) => (
                <Link href={`/casual-shirt/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="c-product-card"
                  >
                    <div className="c-product-image-box">
                      {product.tag && <span className="c-tag">{product.tag}</span>}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.img}
                        alt={product.name}
                        className="c-product-image"
                      />
                      <div className="c-hover-actions">
                        <button 
                          className="c-action-btn" 
                          title="Add to Cart"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart({ id: product.id, name: product.name, price: product.price, img: product.img, quantity: 1 });
                          }}
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button 
                          className="c-action-btn" 
                          title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (isInWishlist(product.id)) {
                              removeFromWishlist(product.id);
                            } else {
                              addToWishlist({ id: product.id, name: product.name, price: product.price, img: product.img });
                            }
                          }}
                        >
                          <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                        </button>
                        <button 
                          className="c-action-btn" 
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
                    <div className="c-product-details">
                      <h3 className="c-product-name">{product.name}</h3>
                      <div className="c-product-price">
                        <span className="c-old-price">₹{product.oldPrice}</span>
                        <span className="c-new-price">₹{product.price}</span>
                      </div>
                      <button className="c-enquire-btn">
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
        <section className="casual-offer">
          <div className="offer-content">
            <h3>Summer Combo Deal</h3>
            <p>Buy 2 Casual Shirts & Get 10% OFF on the second one!</p>
            <button className="offer-btn">SHOP COMBO</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

