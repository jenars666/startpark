'use client';

import { motion } from 'framer-motion';
import { handleInstantCheckout } from '../utils/checkoutUtils';
import { BarChart2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import './Catalog.css';

const latestProducts = [
  { id: 11, name: 'Oversized Casual Shacket Shirt Black', img: 'https://images.unsplash.com/photo-1594938298596-eb5fd3822758?w=600&q=80', discount: '-36%', oldPrice: '1,699', price: '1,080' },
  { id: 12, name: 'Oversized Casual Shacket Shirt White', img: 'https://images.unsplash.com/photo-1620012253295-c159f0f9b3ec?w=600&q=80', discount: '-36%', oldPrice: '1,699', price: '1,080' },
  { id: 13, name: 'Poly Textured Oversized Shirt Lt Blue', img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80', discount: '-44%', oldPrice: '889', price: '499' },
  { id: 14, name: 'Poly Textured Oversized Shirt Maroon', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80', discount: '-44%', oldPrice: '499', price: '555' },
  { id: 15, name: 'Slim Fit Cotton Check Shirt Pink', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80', discount: '-16%', oldPrice: '1,055', price: '889' },
];

export default function LatestCollection() {
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
