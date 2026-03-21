'use client';

import { Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { customerReviews } from '../data/reviews';
import './CustomerReviews.css';

export default function CustomerReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Scroll automatically every 3 seconds if not hovered
    const interval = setInterval(() => {
      if (!isHovered && scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        
        // If we've reached the end of the scroll container, loop back
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Otherwise, push it to the right by one 'page' of cards (e.g. 100% of client width)
          scrollRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
        }
      }
    }, 3000); // 3 seconds interval stringently applied

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="customer-reviews-section">
      <div className="container text-center">
        <h2 className="reviews-title">Happy Customers, 670+ Real Reviews</h2>
        
        <div 
          className="reviews-scroll-container" 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {customerReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#f5b000" color="#f5b000" />
                ))}
              </div>
              <p className="review-text">{review.text}</p>
              <div className="review-author">
                <h4 className="author-name">{review.name}</h4>
                <span className="author-location">{review.location}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </section>
  );
}
