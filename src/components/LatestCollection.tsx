'use client';

import { motion } from 'framer-motion';
import { handleInstantCheckout } from '../utils/checkoutUtils';
import { BarChart2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import './Catalog.css';

export default function LatestCollection() {
  const { products } = useProducts();
  const latestProducts = products.slice().reverse().slice(0, 6);
  return (
    <div className="catalog-wrapper" style={{ paddingTop: '2rem' }}>
      <section className="trending-now-section">
        <div className="container text-center">
          <h2 className="section-title">Latest Collection</h2>
          <p className="section-subtitle">
            Explore our newest arrivals featuring trendy shirts, jeans, and T-shirts crafted for comfort and confidence.<br/>
            Step into the season with style that sets you apart.
          </p>

          <div className="trending-grid-wrapper">
            <button className="nav-arrow left-arrow" aria-label="Previous"><ChevronLeft size={20} /></button>
            
            <div className="trending-grid">
              {latestProducts.map((prod, index) => (
                <motion.div 
                  key={prod.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="product-card"
                >
                  <div 
                    className="product-image-container"
                    onClick={() => handleInstantCheckout(parseInt(prod.price.replace(',','')), prod.name)}
                  >
                    <div className="discount-badge">{prod.discount}</div>
                    
                    <div 
                      className="product-image" 
                      style={{ backgroundImage: `url(${prod.img})` }} 
                    />

                    <div className="hover-actions-right">
                      <button className="hover-icon-btn" aria-label="Stats"><BarChart2 size={16} /></button>
                      <button className="hover-icon-btn" aria-label="Link"><ExternalLink size={16} /></button>
                    </div>
                  </div>

                  <div className="product-info">
                    <h4 className="product-name">{prod.name}</h4>
                    <p className="product-pricing">
                      <span className="old-price">₹{prod.oldPrice}</span>
                      {prod.id === 14 ? (
                        <span className="new-price">- ₹{prod.price}</span>
                      ) : (
                        <span className="new-price">₹{prod.price}</span>
                      )}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="nav-arrow right-arrow" aria-label="Next"><ChevronRight size={20} /></button>
          </div>
        </div>
      </section>
    </div>
  );
}
