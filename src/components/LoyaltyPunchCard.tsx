'use client';

import { motion } from 'framer-motion';
import { Star, ShieldCheck } from 'lucide-react';
import './LoyaltyPunchCard.css';
import { useState, useEffect } from 'react';

export default function LoyaltyPunchCard() {
  const [purchases, setPurchases] = useState(0);

  useEffect(() => {
    // Simulate fetching purchases
    setPurchases(3);
  }, []);

  return (
    <section className="loyalty-section">
      <div className="container">
        <motion.div 
          className="loyalty-card-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          <div className="loyalty-header">
            <h2 className="loyalty-title">The Star VIP Club</h2>
            <p className="loyalty-desc">Earn your reward. Buy 5 shirts, get the 6th free.</p>
          </div>
          
          <div className="punch-grid">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className={`punch-hole ${purchases >= item ? 'filled' : ''}`}>
                {purchases >= item ? (
                  <Star size={24} fill="#111" color="#111" />
                ) : (
                  <span className="punch-num">{item}</span>
                )}
              </div>
            ))}
            <div className={`punch-hole reward-hole ${purchases >= 5 ? 'unlocked' : ''}`}>
                <ShieldCheck size={28} color={purchases >= 5 ? "#fff" : "#888"} />
            </div>
          </div>
          
          <div className="loyalty-footer">
            <p className="loyalty-status-text">
              <span className="status-highlight">{5 - purchases} purchases</span> away from your free branded shirt.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
