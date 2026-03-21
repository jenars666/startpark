'use client';

import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';
import './FoundersNote.css';

export default function FoundersNote() {
  return (
    <section className="founders-note-section">
      <div className="container">
        <motion.div 
          className="founders-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="founders-header">
            <span className="founders-subtitle">OUR PROMISE</span>
            <h2 className="founders-title">M. Marutha Natrayan</h2>
            <p className="founders-creds">B.E., M.B.A. | Founder, Star Mens Park</p>
          </div>
          
          <div className="founders-message">
            <p>
              "Since our founding, Star Mens Park has been about more than just fitting the Dindigul Bazaar. We engineered a system where quality meets accessibility. Whether you are a college event coordinator looking for 100 matching shirts, or a professional seeking benchmark-quality denim, our supply chain is optimized for your exact needs."
            </p>
          </div>
          
          <div className="founders-badges">
            <div className="badge-light">
              <Star size={18} fill="#f5b000" color="#f5b000" />
              <span>4.7/5 Google Rating</span>
            </div>
            <div className="badge-light">
              <Award size={18} color="#111" />
              <span>670+ Verified Reviews</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
