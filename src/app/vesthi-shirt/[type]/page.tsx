'use client';

import Header from '../../../components/Header';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { motion } from 'framer-motion';
import { ShoppingCart, Share2, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { vesthiTypeProducts } from './vesthi-type-products';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import './vesthi-type.css';

export default function VesthiTypePage() {
  const params = useParams();
  const type = (params.type as string)?.toLowerCase() || 'tissue';
  const products = vesthiTypeProducts[type as keyof typeof vesthiTypeProducts] || vesthiTypeProducts.tissue;
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const getHeroData = () => {
    switch (type) {
      case 'premium':
        return {
          title: 'Premium Vesthi & Shirts',
          subtitle: 'Royal Elegance',
          heroImg: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQsIefMEfq_zLP0PIoES19RdgtgYsktfJOtFVvEntr610t6lgFO29A0RCqtDEN1pHsoZwWNZz3MJmqipWtDwZS0EaCOxtjC9nJ2gr6BIKEYHhhKg0CyBUsZAQ'
        };
      case 'tissue':
        return {
          title: 'Tissue Vesthi & Shirts',
          subtitle: 'Lightweight Luxury',
          heroImg: 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTCHWFIF2bG0sDC_aljaZGiCs1RN_iG0zQ1MqWpVJ9Nwy_1lIeovuZ9ppth4xyIzFW7ld1ZBDG0q4QDMLFTtlTU4P-UzUd3evEmaIc5JqloCDgoeGQwU2Z1'
        };
      case 'classic':
      default:
        return {
          title: 'Classic Vesthi & Shirts',
          subtitle: 'Timeless Tradition',
          heroImg: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcT4OrjJZWP4_UyAR2RYr2phzwl3LP54Gy9BRwrsVS3Gw8izGTULUgo6w8ffV-xxDiX9hR4R_mK5Zs7hoKydtqT2GcCNbGbMTR_l773hpYP0ZB7J4GFTXtybZQ'
        };
    }
  };

  const heroData = getHeroData();

  return (
    <div className="vesthi-type-wrapper">
      <Header />
      <Navbar />

      <main>
        {/* Hero Section - Adapted from Casual */}
        <section className={`vesthi-type-hero ${type}-hero`}>
          <div className="vesthi-type-hero-content">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-tag"
            >
              Vesthi Collection
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hero-title"
            >
              {heroData.title} <br /><span>{heroData.subtitle}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hero-desc"
            >
              Explore our premium {type} collection of traditional vesthi and matching shirts, crafted for special occasions.
            </motion.p>
          </div>
            <div className={`vesthi-type-hero-image ${type}-hero-image`}>
              <Image src={heroData.heroImg} alt={heroData.title} fill className="hero-bg-img" style={{ objectFit: 'cover', objectPosition: 'center -10%' }} sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
        </section>

        {/* Collection Section with Toolbar - Flipkart Style */}
        <section className="vesthi-type-collection">
          <div className="container">
            <div className="collection-header">
              <h2 className="collection-title">{heroData.title}</h2>
              <p className="collection-subtitle">Showing all {products.length} masterpieces</p>
            </div>

            {/* Toolbar */}
            <div className="collection-toolbar">
              <div className="results-count">Showing 1 - {products.length} of {products.length} products</div>
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
              {products.map((product, idx) => (
                <Link href={`/vesthi-shirt/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="v-product-card"
                  >
                      <div className="v-product-image-box" style={{ position: 'relative', width: '100%', height: '300px' }}>
                        {product.tag && <span className="v-tag">{product.tag}</span>}
                        <Image
                          src={product.img}
                          alt={product.name}
                          fill
                          className="v-product-image"
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, 300px"
                      />
                      <div className="v-hover-actions">
                        <button 
                          className="v-action-btn" 
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
                          className="v-action-btn" 
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
                          className="v-action-btn" 
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
                    <div className="v-product-details">
                      <h3 className="v-product-name">{product.name}</h3>
                      <div className="v-product-price">
                        <span className="v-old-price">₹{product.oldPrice}</span>
                        <span className="v-new-price">₹{product.price}</span>
                      </div>
                      <button className="v-enquire-btn">
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
        <section className="vesthi-offer">
          <div className="offer-content">
            <h3>Premium Combo</h3>
            <p>Buy Vesthi + Shirt Set and get complimentary pocket square!</p>
            <button className="offer-btn">VIEW OFFERS</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
