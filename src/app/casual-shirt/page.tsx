'use client';

import { useState, useMemo } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProductSearch from '../../components/ProductSearch';
import { motion } from 'framer-motion';
import { ShoppingCart, Share2, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '../../hooks/useProducts';
import { useGuestGuard } from '../../hooks/useGuestGuard';
import { useCart } from '../../context/CartContextFirebase';
import { useWishlist } from '../../context/WishlistContextFirebase';
import { analytics } from '../../utils/analytics';
import './casual.css';

type CasualFilters = {
  priceRange: [number, number];
  sortBy: 'price-low' | 'price-high' | 'newest' | 'popular';
  color: string;
};

export default function CasualShirtPage() {
  const { guardAddToCart, guardWishlist } = useGuestGuard();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<CasualFilters>({
    priceRange: [0, 10000],
    sortBy: 'popular',
    color: 'all',
  });

  const { products: casualProducts, loading } = useProducts('Casual Shirt');

  const filteredProducts = useMemo(() => {
    let result = [...casualProducts];

    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    result = result.filter(p => {
      const price = parseFloat(p.price.toString().replace(',', ''));
      const priceMatch = price >= activeFilters.priceRange[0] && price <= activeFilters.priceRange[1];
      const colorMatch = activeFilters.color === 'all' || p.color === activeFilters.color;
      return priceMatch && colorMatch;
    });

    if (activeFilters.sortBy === 'price-low') {
      result.sort((a, b) => parseFloat(a.price.toString().replace(',', '')) - parseFloat(b.price.toString().replace(',', '')));
    } else if (activeFilters.sortBy === 'price-high') {
      result.sort((a, b) => parseFloat(b.price.toString().replace(',', '')) - parseFloat(a.price.toString().replace(',', '')));
    }

    return result;
  }, [searchQuery, activeFilters]);

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

            {/* Search & Filters */}
            <ProductSearch
              onSearch={(q) => { setSearchQuery(q); analytics.search(q); }}
              onFilter={(filters) =>
                setActiveFilters((current) => ({
                  ...current,
                  ...filters,
                }))
              }
            />

            {/* Toolbar */}
            <div className="collection-toolbar">
              <div className="results-count">Showing {filteredProducts.length} of {casualProducts.length} products</div>
              <div className="sort-filter">
                <span className="sort-label">Sort by: 
                  <select 
                    title="Sort products"
                    value={activeFilters.sortBy}
                    onChange={(e) =>
                      setActiveFilters({
                        ...activeFilters,
                        sortBy: e.target.value as CasualFilters['sortBy'],
                      })
                    }
                  >
                    <option value="popular">Recommended</option>
                    <option value="price-low">Price Low-High</option>
                    <option value="price-high">Price High-Low</option>
                  </select>
                </span>
                <span className="filter-label">Filter: 
                  <select 
                    title="Filter by color"
                    value={activeFilters.color}
                    onChange={(e) => setActiveFilters({ ...activeFilters, color: e.target.value })}
                  >
                    <option value="all">All Colors</option>
                    <option value="Black">Black</option>
                    <option value="White">White</option>
                    <option value="Navy">Navy</option>
                    <option value="Grey">Grey</option>
                    <option value="Beige">Beige</option>
                    <option value="Brown">Brown</option>
                    <option value="Blue">Blue</option>
                    <option value="Green">Green</option>
                    <option value="Multi">Multi</option>
                  </select>
                </span>
              </div>
            </div>

            <div className="product-grid">
              {filteredProducts.length === 0 ? (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                  No products found matching your search.
                </div>
              ) : filteredProducts.map((product, idx) => (
                <Link href={`/casual-shirt/product/${product.id}`} key={product.id} className="product-card-link">
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
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const item = { id: product.id, name: product.name, price: product.price, img: product.img, quantity: 1 };
                            if (!guardAddToCart(item)) return;
                            await addToCart(item);
                            analytics.addToCart(
                              product.id,
                              product.name,
                              parseFloat(product.price.toString().replace(',', ''))
                            );
                          }}
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button 
                          className="c-action-btn" 
                          title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const item = { id: product.id, name: product.name, price: product.price, img: product.img };
                            if (isInWishlist(product.id)) {
                              await removeFromWishlist(product.id);
                            } else {
                              if (!guardWishlist(item)) return;
                              await addToWishlist(item);
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