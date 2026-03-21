'use client';

import './Newsletter.css';

export default function Newsletter() {
  return (
    <section className="newsletter-section">
      <div className="container newsletter-container">
        <div className="newsletter-text">
          <h2 className="newsletter-title">Join The Star VIP Club</h2>
          <p className="newsletter-desc">
            Subscribe to receive updates, access to exclusive deals, and 10% off your first group order.
          </p>
        </div>
        
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="newsletter-input"
            required
          />
          <button type="submit" className="newsletter-btn">SUBSCRIBE</button>
        </form>
      </div>
    </section>
  );
}
