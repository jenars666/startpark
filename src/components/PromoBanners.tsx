'use client';

import { motion } from 'framer-motion';
import './PromoBanners.css';

export default function PromoBanners() {
  return (
    <section className="promo-banners-section">
      <div className="container promo-grid">
        
        {/* Banner 1 */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="promo-card promo-card-solid"
        >
          <div className="promo-content">
            <span className="promo-subhead">STEP INTO STYLE</span>
            <h2 className="promo-title">Explore Our<br/>New Collection</h2>
            <a href="#" className="promo-link">SHOP NOW</a>
          </div>
        </motion.div>

        {/* Banner 2 */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="promo-card promo-card-image"
        >
          <div className="promo-content">
            <span className="promo-subhead">MEN'S COLLECTION</span>
            <h2 className="promo-title">Modern Men's<br/>New Look</h2>
            <a href="#" className="promo-link">SHOP NOW</a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
