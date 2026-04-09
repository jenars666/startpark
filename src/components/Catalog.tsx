'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWhatsAppLink, handleInstantCheckout } from '../utils/checkoutUtils';
import { BarChart2, ExternalLink, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '../hooks/useProducts';
import './Catalog.css';

const circleCategories = [
  { name: 'Group Shirts',   img: 'images/group2.png',      link: '/group-shirt' },
  { name: 'Vesti & Shirt',  img: '/images/groupshirt.png', link: '/vesthi-shirt' },
  { name: 'Bottoms',        img: '/images/bottoms.png',    link: '#' },
  { name: 'Casual',         img: '/images/casual2.png',    link: '/casual-shirt' },
  { name: 'Designer Shirts',img: 'images/desigher.png',    link: '#' },
  { name: 'Formal',         img: 'images/formal.png',      link: '/formal-shirt' },
];

export default function Catalog() {
  const { products } = useProducts();
  const trendingProducts = products.slice(0, 10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recommended');
  const [priceFilter, setPriceFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    let result = [...trendingProducts];

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (priceFilter === 'under-1000') {
      result = result.filter(p => parseInt(p.price.replace(/,/g, '')) < 1000);
    } else if (priceFilter === 'over-1000') {
      result = result.filter(p => parseInt(p.price.replace(/,/g, '')) >= 1000);
    }

    if (sortOrder === 'price-low-high') {
      result.sort((a, b) => parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, '')));
    } else if (sortOrder === 'price-high-low') {
      result.sort((a, b) => parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, '')));
    }

    return result;
  }, [trendingProducts, searchTerm, sortOrder, priceFilter]);

  const handleCategoryClick = (categoryName: string) => {
    window.open(generateWhatsAppLink(categoryName, 1, 'M'), '_blank');
  };

  return (
    <div className="catalog-wrapper">

      {/* Shop by Categories */}
      <section className="shop-by-categories-section">
        <div className="container text-center">
          <h2 className="section-title">Shop by Categories</h2>
          <p className="section-subtitle">
            Explore our refined categories for a seamless shopping experience.
          </p>
          <div className="categories-row">
            {circleCategories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="category-circle-item"
              >
                {cat.link !== '#' ? (
                  <Link href={cat.link} className="category-link" aria-label={`Open ${cat.name}`}>
                    <div className="circle-image" style={{ backgroundImage: `url(${cat.img})` }} />
                    <h3 className="circle-label">{cat.name}</h3>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="category-link category-link-button"
                    onClick={() => handleCategoryClick(cat.name)}
                    aria-label={`Open ${cat.name}`}
                  >
                    <div className="circle-image" style={{ backgroundImage: `url(${cat.img})` }} />
                    <h3 className="circle-label">{cat.name}</h3>
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section className="trending-now-section">
        <div className="container text-center">
          <h2 className="section-title">Trending Now</h2>
          <p className="section-subtitle">
            Explore the newest additions to our collection<br />
            crafted for the modern man who loves to stay ahead in fashion.
          </p>

          {/* Toolbar */}
          <div className="catalog-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', textAlign: 'left' }}>
            <div className="search-box" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '0.5rem 1rem', flex: '1', minWidth: '250px' }}>
              <Search size={18} style={{ color: '#6b7280', marginRight: '0.5rem' }} />
              <input
                type="text"
                placeholder="Search trending products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={18} style={{ color: '#6b7280' }} />
                <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', outline: 'none' }}>
                  <option value="all">All Prices</option>
                  <option value="under-1000">Under ₹1,000</option>
                  <option value="over-1000">₹1,000 & Above</option>
                </select>
              </div>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', outline: 'none' }}>
                <option value="recommended">Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className="trending-grid-wrapper">
            <button className="nav-arrow left-arrow" aria-label="Previous items"><ChevronLeft size={20} /></button>

            <div className="trending-grid">
              <AnimatePresence>
                {filteredProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ gridColumn: '1 / -1', padding: '3rem', color: '#6b7280' }}
                  >
                    No products found matching your criteria.
                  </motion.div>
                ) : (
                  filteredProducts.map((prod) => (
                    <motion.div
                      key={prod.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="product-card"
                    >
                      <div
                        className="product-image-container"
                        onClick={() => handleInstantCheckout(parseInt(prod.price.replace(',', '')), prod.name)}
                      >
                        <div className="discount-badge">{prod.discount}</div>
                        <div className="product-image" style={{ backgroundImage: `url(${prod.img})` }} />
                        <div className="hover-actions-right">
                          <button className="hover-icon-btn" aria-label="View Statistics"><BarChart2 size={16} /></button>
                          <button className="hover-icon-btn" aria-label="Open Link"><ExternalLink size={16} /></button>
                        </div>
                      </div>
                      <div className="product-info">
                        <h4 className="product-name">{prod.name}</h4>
                        <p className="product-pricing">
                          <span className="old-price">₹{prod.oldPrice}</span>
                          <span className="new-price">₹{prod.price}</span>
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            <button className="nav-arrow right-arrow" aria-label="Next items"><ChevronRight size={20} /></button>
          </div>

          <div className="shop-more-container">
            <button className="btn-shop-more">SHOP MORE</button>
          </div>
        </div>
      </section>

    </div>
  );
}
