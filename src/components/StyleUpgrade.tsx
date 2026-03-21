'use client';

import { motion } from 'framer-motion';
import './StyleUpgrade.css';

export default function StyleUpgrade() {
  return (
    <section className="style-upgrade-section">
      <div className="container" style={{ maxWidth: '1440px', padding: 0 }}>
        <div className="style-upgrade-grid">
          
          {/* Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className="style-text-col"
          >
            <span className="style-subhead">STEP INTO STYLE</span>
            <h2 className="style-title">
              Because Every Look<br />
              Deserves an Upgrade
            </h2>
            <p className="style-desc">
              Redefine your everyday fashion with pieces that blend trend, comfort, and confidence. Step up your style game effortlessly.
            </p>
            <button className="btn-solid-black">SHOP NOW</button>
          </motion.div>

          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="style-img-col"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1200&q=80')" }}
          />
          
        </div>
      </div>
    </section>
  );
}
