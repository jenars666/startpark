'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import './ProductReviews.css';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductReviewsProps {
  productId: string | number;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReview: Review = {
      id: Date.now().toString(),
      userName: 'User',
      rating,
      comment,
      date: new Date().toISOString()
    };
    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment('');
  };

  return (
    <div className="product-reviews">
      <h2>Customer Reviews</h2>
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="rating-input">
          <label>Your Rating</label>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                fill={star <= (hoveredRating || rating) ? '#fbbf24' : 'none'}
                stroke={star <= (hoveredRating || rating) ? '#fbbf24' : '#d1d5db'}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        <div className="comment-input">
          <label>Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            required
          />
        </div>

        <button type="submit" disabled={rating === 0}>
          Submit Review
        </button>
      </form>

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      fill={star <= review.rating ? '#fbbf24' : 'none'}
                      stroke={star <= review.rating ? '#fbbf24' : '#d1d5db'}
                    />
                  ))}
                </div>
                <span className="review-date">
                  {new Date(review.date).toLocaleDateString()}
                </span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <p className="review-author">- {review.userName}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
