'use client';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { ShoppingCart, Share2, Heart, ArrowRight } from 'lucide-react';
import './vesthi.css';

const vProducts = [
  {
    id: 1,
    name: 'Premium Silk Vesthi with Golden Border',
    price: '1,499',
    oldPrice: '2,100',
    img: '/images/groupshirt.png',
    tag: 'Best Seller'
  },
  {
    id: 2,
    name: 'Executive White Cotton Shirt & Vesthi Set',
    price: '2,250',
    oldPrice: '2,999',
    img: '/images/group2.png',
    tag: 'Premium'
  },
  {
    id: 3,
    name: 'Kalyan Traditional Pattu Vesthi',
    price: '3,500',
    oldPrice: '4,500',
    img: '/images/groupshirt.png',
    tag: 'New'
  },
  {
    id: 4,
    name: 'Pure Cotton Wedding Vesthi Collection',
    price: '1,200',
    oldPrice: '1,800',
    img: '/images/group2.png',
    tag: 'Traditional'
  }
];

export default function VesthiShirtPage() {
  return (
    <div className="vesthi-page-wrapper">
      <Header />
      <Navbar />

      <main>
        {/* Category Hero */}
        <section className="vesthi-hero">
          <div className="vesthi-hero-content">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-tag"
            >
              Exclusive Collection
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-title"
            >
              Vesthi & <br /><span>Premium Shirts</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-desc"
            >
              Elevate your traditional look with our premium collection of Vesthis and exquisitely tailored shirts. Perfect for weddings, festivals, and every special occasion.
            </motion.p>
          </div>
          <div className="vesthi-hero-image">
            <div className="image-overlay" />
          </div>
        </section>

        {/* Top Categories Section */}
        <section className="vesthi-types">
          <div className="container">
            <h2 className="section-title text-center">Top Categories</h2>
            <div className="types-grid">
              <motion.div
                whileHover={{ y: -10 }}
                className="type-card"
                onClick={() => window.location.href = '/vesthi-shirt/premium'}
              >
                <div className="type-image silk-bg" />
                <div className="type-overlay">
                  <h3>Premium Vesthi&Shirts </h3>
                  <p>Premium Wedding Wear</p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -10 }}
                className="type-card"
                onClick={() => window.location.href = '/vesthi-shirt/tissue'}
              >
                <div className="type-image cotton-bg" />
                <div className="type-overlay">
                  <h3> tissue Vesthi&Shirts</h3>
                  <p>Everyday Traditional</p>
                </div>
              </motion.div>
              <motion.div
                whileHover={{ y: -10 }}
                className="type-card"
                onClick={() => window.location.href = '/vesthi-shirt/classic'}
              >
                <div className="type-image wedding-bg" />
                <div className="type-overlay">
                  <h3>Classic Vesthi&Shirts</h3>
                  <p>Heritage Classic Collection</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Collection Section */}
        <section className="vesthi-collection">
          <div className="container">
            <div className="collection-header">
              <h2 className="collection-title">Traditional Elegance</h2>
              <p className="collection-subtitle">Explore our finest selection of Vesthis and matching shirts.</p>
            </div>

            <div className="product-grid">
              {vProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="v-product-card"
                >
                  <div className="v-product-image-box">
                    {product.tag && <span className="v-tag">{product.tag}</span>}
                    <div
                      className="v-product-image"
                      style={{ backgroundImage: `url(${product.img})` }}
                    />
                    <div className="v-hover-actions">
                      <button className="v-action-btn" title="Add to Cart"><ShoppingCart size={18} /></button>
                      <button className="v-action-btn" title="Add to Wishlist"><Heart size={18} /></button>
                      <button className="v-action-btn" title="Share Product"><Share2 size={18} /></button>
                    </div>
                  </div>
                  <div className="v-product-details">
                    <h3 className="v-product-name">{product.name}</h3>
                    <div className="v-product-price">
                      <span className="v-old-price">₹{product.oldPrice}</span>
                      <span className="v-new-price">₹{product.price}</span>
                    </div>
                    <button className="v-enquire-btn">
                      ENQUIRE NOW <ArrowRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Special Offer Section */}
        <section className="vesthi-offer">
          <div className="offer-content">
            <h3>Special Combo Offer</h3>
            <p>Buy any Silk Vesthi and get a Premium Formal Shirt at 20% OFF!</p>
            <button className="offer-btn">CLAIM OFFER</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
