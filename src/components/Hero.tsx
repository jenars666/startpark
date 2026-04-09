'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Background Layer: Grid Collage */}
      <div className="hero-collage">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className={`collage-item img-${i % 8}`} />
        ))}
      </div>
      <div className="hero-overlay" />

      {/* Content Layer */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hero-center-box"
        >
          <h1 className="hero-giant-logo">
            𝕾𝖙𝖆𝖗<br /><span>𝕄𝔼ℕ𝕊 ℙ𝔸ℝ𝕂</span>
          </h1>

          <h2 className="hero-slogan">Elevating Men's Style in Dindigul</h2>
          <button
            className="hero-explore-btn"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            suppressHydrationWarning
          >
            EXPLORE COLLECTION
          </button>

          <div className="hero-sublinks">
            <a href="#">Group Shirts</a> <span className="separator">|</span>
            <Link href="/vesthi-shirt">Vesti &Shirt</Link> <span className="separator">|</span>
            <a href="#">Designer Shirts</a> <span className="separator">|</span>
            <div className="hero-dropdown">
              <a href="#">Shirts</a>
              <div className="hero-dropdown-menu">
                <Link href="/casual-shirt">Casual</Link>
                <Link href="#">Formal</Link>
                <Link href="#">Flannels</Link>
                <Link href="#">Polos</Link>
              </div>
            </div> <span className="separator">|</span>
            <a href="#">Bottoms</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
