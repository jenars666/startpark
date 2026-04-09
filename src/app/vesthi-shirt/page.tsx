'use client';

import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { ShoppingCart, Share2, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '../../hooks/useProducts';
import { useGuestGuard } from '../../hooks/useGuestGuard';
import { useCart } from '../../context/CartContextFirebase';
import { useWishlist } from '../../context/WishlistContextFirebase';
import './vesthi.css';

export default function VesthiShirtPage() {
  const { guardAddToCart, guardWishlist } = useGuestGuard();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const { products: vesthiMainProducts, loading } = useProducts('Vesthi');

  return (
    <div className="vesthi-page-wrapper">
      <Header />
      <Navbar />

      <main>
        <section className="vesthi-hero">
          <div className="vesthi-hero-content">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="hero-tag">
              Exclusive Collection
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="hero-title">
              Vesthi & <br /><span>Premium Shirts</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="hero-desc">
              Elevate your traditional look with our premium collection of Vesthis and exquisitely tailored shirts. Perfect for weddings, festivals, and every special occasion.
            </motion.p>
          </div>
          <div className="vesthi-hero-image">
            <Image src="/images/groupshirt.png" alt="Hero" fill className="hero-bg-img" style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="image-overlay" />
          </div>
        </section>

        <section className="vesthi-types">
          <div className="container">
            <h2 className="collection-title text-center">Top Categories</h2>
            <div className="types-grid">
              <Link href="/vesthi-shirt/premium" className="type-card-link">
                <motion.div whileHover={{ y: -10 }} className="type-card">
                  <div className="type-image cotton-bg" />
                  <div className="type-overlay"><h3>Premium</h3><p>Ethnic Wear</p></div>
                </motion.div>
              </Link>
              <Link href="/vesthi-shirt/tissue" className="type-card-link">
                <motion.div whileHover={{ y: -10 }} className="type-card">
                  <div className="type-image silk-bg" />
                  <div className="type-overlay"><h3>Tissue</h3><p>Everyday</p></div>
                </motion.div>
              </Link>
              <Link href="/vesthi-shirt/classic" className="type-card-link">
                <motion.div whileHover={{ y: -10 }} className="type-card">
                  <div className="type-image wedding-bg" />
                  <div className="type-overlay"><h3>Classic</h3><p>Heritage</p></div>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>

        <section className="vesthi-collection">
          <div className="container">
            <div className="collection-header">
              <h2 className="collection-title">Featured Collection</h2>
              <p className="collection-subtitle">Best selling Vesthi combinations</p>
            </div>
            <div className="collection-toolbar">
              <div className="results-count">Showing 1 - {vesthiMainProducts.length} products</div>
              <div className="sort-filter">
                <span className="sort-label">
                  Sort by:
                  <select aria-label="Sort products">
                    <option>Recommended</option>
                    <option>Price Low to High</option>
                    <option>Price High to Low</option>
                  </select>
                </span>
                <span className="filter-label" aria-label="Filter">All Fabrics</span>
              </div>
            </div>
            <div className="product-grid">
              {vesthiMainProducts.map((product, idx) => (
                <Link href={`/vesthi-shirt/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="v-product-card"
                  >
                    <div className="v-product-image-box">
                      {product.tag && <span className="v-tag">{product.tag}</span>}
                      <Image src={product.img} alt={product.name} fill className="v-product-image" sizes="(max-width: 768px) 100vw, 300px" />
                      <div className="v-hover-actions">
                        <button
                          className="v-action-btn"
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
                          className="v-action-btn"
                          title="Wishlist"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const item = { id: product.id, name: product.name, price: product.price, img: product.img };
                            if (isInWishlist(product.id)) { await removeFromWishlist(product.id); }
                            else { if (!guardWishlist(item)) return; await addToWishlist(item); }
                          }}
                        >
                          <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          className="v-action-btn"
                          title="Share"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        >
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="v-product-details">
                      <h3 className="v-product-name">{product.name}</h3>
                      <div className="v-product-price">
                        <span className="v-old-price">₹{product.oldPrice}</span>
                        <span className="v-new-price">₹{product.price}</span>
                      </div>
                      <button className="v-enquire-btn">VIEW DETAILS <ArrowRight size={14} /></button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="vesthi-offer">
          <div className="offer-content">
            <h3>Vesthi Combo Special</h3>
            <p>Buy Vesthi + Shirt Set, get pocket square FREE!</p>
            <button className="offer-btn">VIEW DEALS</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
