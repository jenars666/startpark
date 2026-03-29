'use client';

import Header from '../../../../components/Header';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, Star, Minus, Plus, MessageCircle, HelpCircle, Image as ImageIcon, History } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../../../../hooks/useFirebaseAuth';
import { useCart } from '../../../../context/CartContext';
import { useWishlist } from '../../../../context/WishlistContext';
import '../../product.css';

// Consolidating product data from all categories
const allProducts = {
  // Premium
  101: { id: 101, name: 'Manamagan Premium Gold Set', price: '1,599', oldPrice: '2,200', img: '/images/Manamagan/WhatsApp%20Image%202026-03-22%20at%2010.50.07%20AM%20%281%29.jpeg', length: '2 Meters', weight: '0.35kg', desc: 'A royal gold silk vesthi set with a premium matching shirt. Perfect for weddings and grand traditional ceremonies.' },
  102: { id: 102, name: 'Manamagan Royal Green Set', price: '1,599', oldPrice: '2,200', img: '/images/Manamagan/WhatsApp%20Image%202026-03-22%20at%2010.50.07%20AM.jpeg', length: '2 Meters', weight: '0.35kg', desc: 'Exquisite royal green silk set designed for a majestic presence. High-grade silk and premium cotton blend.' },
  103: { id: 103, name: 'Manamagan Premium Blue Set', price: '1,599', oldPrice: '2,200', img: '/images/Manamagan/WhatsApp%20Image%202026-03-22%20at%2010.50.08%20AM.jpeg', length: '2 Meters', weight: '0.35kg', desc: 'Premium blue vesthi and shirt set. Executive styling meets traditional comfort for a sophisticated look.' },
  
  // Tissue
  18: { id: 18, name: 'Mappillai Collection - Pearl White Set', price: '1,150', oldPrice: '1,600', img: '/images/Mappillai/WhatsApp%20Image%202026-03-22%20at%2010.48.53%20PM.jpeg', length: '2 Meters', weight: '0.28kg', desc: 'Lightweight and elegant tissue fabric set in pearl white. Modern yet deeply traditional.' },
  19: { id: 19, name: 'Mappillai Collection - Luxury Cream Set', price: '1,150', oldPrice: '1,600', img: '/images/Mappillai/WhatsApp%20Image%202026-03-22%20at%2010.49.05%20PM.jpeg', length: '2 Meters', weight: '0.28kg', desc: 'Luxury cream tissue set. Perfect for grooming rituals and semi-formal traditional events.' },
  20: { id: 20, name: 'Mappillai Collection - Elegant White Set', price: '1,150', oldPrice: '1,600', img: '/images/Mappillai/WhatsApp%20Image%202026-03-22%20at%2010.49.10%20PM.jpeg', length: '2 Meters', weight: '0.28kg', desc: 'Refined elegance for the special day.' },
  21: { id: 21, name: 'Mappillai Collection - Modern Fit Set', price: '1,150', oldPrice: '1,600', img: '/images/Mappillai/WhatsApp%20Image%202026-03-22%20at%2010.49.13%20PM.jpeg', length: '2 Meters', weight: '0.28kg', desc: 'Tailored for the contemporary traditionalist.' },
  
  // Classic
  5: { id: 5, name: 'Heritage Classic - Imperial Blue Set', price: '950', oldPrice: '1,300', img: '/images/Classic%20Matching%20Set/WhatsApp%20Image%202026-03-22%20at%2010.49.02%20AM.jpeg', length: '2 Meters', weight: '0.30kg', desc: 'Sleek imperial blue matching set for a modern look.' },
  6: { id: 6, name: 'Heritage Classic - Silk Cream Set', price: '950', oldPrice: '1,300', img: '/images/Classic%20Matching%20Set/WhatsApp%20Image%202026-03-22%20at%2010.49.03%20AM%20%281%29.jpeg', length: '2 Meters', weight: '0.30kg', desc: 'Classic cream matching set with a subtle silk finish for everyday elegance.' },
  7: { id: 7, name: 'Traditional Classic Matching Set', price: '1,450', oldPrice: '1,999', img: '/images/Classic%20Matching%20Set/WhatsApp%20Image%202026-03-22%20at%2010.49.03%20AM.jpeg', length: '2 Meters', weight: '0.32kg', desc: 'A blend of comfort and style.' },
};

export default function ProductDetailPage() {
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist, loading: wishlistLoading, isReady } = useWishlist();
  const params = useParams();
  const id = params.id as string;
  const productId = parseInt(id);
  const product = allProducts[productId as keyof typeof allProducts] || allProducts[101];
  
  const [qty, setQty] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [dynamicRecs, setDynamicRecs] = useState<any[]>([]);

  const handleAction = (action: string) => {
    if (action === 'cart') {
      addToCart({
        id: productId,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: qty
      });
    } else {
      if (!user) {
        router.push('/login');
        return;
      }
      router.push('/checkout');
    }
  };
  // Dynamic Recommendations (randomly pick 5 others)
  useEffect(() => {
    const others = Object.keys(allProducts)
      .map(Number)
      .filter(otherId => otherId !== productId);
    
    const shuffled = others.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5).map(sId => allProducts[sId as keyof typeof allProducts]);
    setDynamicRecs(selected);
  }, [productId]);

  return (
    <div className="product-detail-wrapper">
      <Header />
      <Navbar />

      <main>
       <div className="container back-container">
          <Link href="/vesthi-shirt" className="back-link-custom">
             BACK TO COLLECTIONS
          </Link>
        </div>

        <div className="container product-section">
          <div className="product-grid-main">
            {/* Left: Image */}
              <div className="product-image-container" style={{ position: 'relative', width: '100%', height: '500px' }}>
                <motion.div
                  key={product.img} // Force re-animation on image change
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="main-product-img"
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </div>
            {/* Right: Info */}
            <div className="product-info-column">
              <div className="product-header-group">
                <h1>{product.name}</h1>
                <div className="rating-row">
                  <Star size={16} fill="#ffc107" stroke="#ffc107" />
                  <Star size={16} fill="#ffc107" stroke="#ffc107" />
                  <Star size={16} fill="#ffc107" stroke="#ffc107" />
                  <Star size={16} fill="#ffc107" stroke="#ffc107" />
                  <Star size={16} fill="#ccc" stroke="#ccc" />
                  <span className="rating-count">4.8 (120 reviews)</span>
                </div>
                
                <div className="price-container">
                  <div className="price-tag">
                    <span className="discount-percent">
                      ↓{Math.round((1 - (parseInt((product.price as string).replace(/,/g, '')) / parseInt((product.oldPrice as string).replace(/,/g, '')))) * 100)}%
                    </span>
                    <span className="old-price-lg">₹{product.oldPrice}</span>
                    <span className="new-price-lg">₹{product.price}</span>
                  </div>
                </div>

                <div className="product-badges">
                  <span className="p-badge">Premium Pure Cotton</span>
                  <span className="p-badge">Executive Quality</span>
                </div>
              </div>

              <p className="product-desc-text">
                {product.desc} Our garments are designed with comfort, quality, and perfection in mind. 
                Perfect for weddings, festivals, and grand celebrations.
              </p>

              <div className="spec-list">
                <div className="spec-item">
                  <span className="spec-label">Length</span>
                  <span className="spec-value">{product.length}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Weight</span>
                  <span className="spec-value">{product.weight}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Material</span>
                  <span className="spec-value">Premium Silk/Cotton</span>
                </div>
              </div>

              <div className="purchase-actions">
                <div className="quantity-picker">
                  <span className="qty-label">Quantity</span>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity"><Minus size={16} /></button>
                    <span className="qty-num">{qty}</span>
                    <button className="qty-btn" onClick={() => setQty(qty + 1)} aria-label="Increase quantity"><Plus size={16} /></button>
                  </div>
                </div>

                <div className="buy-buttons sticky-mobile-footer">
                  <button className="add-btn" onClick={() => handleAction('cart')}>ADD TO CART</button>
                  <button className="buy-btn" onClick={() => handleAction('buy')}>BUY IT NOW</button>
                </div>

                <div className="extra-actions">
                  <button 
                    className="extra-action-btn"
                    disabled={!isReady || wishlistLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id);
                      } else {
                        addToWishlist({ id: product.id, name: product.name, price: product.price, img: product.img });
                      }
                    }}
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} color={isInWishlist(product.id) ? "#d32f2f" : "currentColor"} /> 
                    {isInWishlist(product.id) ? "SAVED TO WISHLIST" : "ADD TO WISHLIST"}
                  </button>
                  <button className="extra-action-btn">
                    <Share2 size={18} /> SHARE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Reviews Section */}
        <section className="reviews-section">
          <div className="container">
            <div className="reviews-container">
              <div className="reviews-header-modern">
                <div className="reviews-title-block">
                  <h2>Customer Reviews</h2>
                  <div className="reviews-summary-mini">
                    <div className="summary-stars">
                      <Star size={16} fill="#ffc107" stroke="#ffc107" />
                      <Star size={16} fill="#ffc107" stroke="#ffc107" />
                      <Star size={16} fill="#ffc107" stroke="#ffc107" />
                      <Star size={16} fill="#ffc107" stroke="#ffc107" />
                      <Star size={16} fill="#ffc107" stroke="#ffc107" />
                    </div>
                    <span>Based on 124 reviews</span>
                  </div>
                </div>
                <button className="write-review-btn-premium" onClick={() => setShowReviewForm(!showReviewForm)}>
                  {showReviewForm ? 'CANCEL' : 'WRITE A REVIEW'}
                </button>
              </div>

              {showReviewForm && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="review-form-box-premium"
                >
                  <h3 className="review-form-title">Share Your Experience</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Your Rating</label>
                      <div className="rating-stars-input-premium">
                        <Star size={28} className="star-input-icon" />
                        <Star size={28} className="star-input-icon" />
                        <Star size={28} className="star-input-icon" />
                        <Star size={28} className="star-input-icon" />
                        <Star size={28} className="star-input-icon" />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" placeholder="Enter your name" className="premium-input" />
                    </div>
                    <div className="form-group full-width">
                      <label>Review Content</label>
                      <textarea rows={4} placeholder="What did you like or dislike?" className="premium-input"></textarea>
                    </div>
                    <div className="form-group full-width">
                      <label>Add a Photo</label>
                      <div className="premium-upload-zone">
                        <ImageIcon size={32} />
                        <span>Tap to upload a photo of your purchase</span>
                      </div>
                    </div>
                  </div>
                  <button className="submit-review-btn-premium">POST REVIEW</button>
                </motion.div>
              )}

              <div className="reviews-list-empty">
                <div className="empty-state-icon">
                  <Star size={48} strokeWidth={1} />
                </div>
                <h3>No reviews yet</h3>
                <p>Be the first to share your thoughts about this product!</p>
                
                <div className="review-perks">
                  <div className="perk-item">
                    <MessageCircle size={18} />
                    <span>Verified Purchase</span>
                  </div>
                  <div className="perk-item">
                    <HelpCircle size={18} />
                    <span>Helpful Community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Products */}
        <section className="recommended-section">
          <div className="container">
            <h2>Recommended For You</h2>
            <div className="rec-grid">
              {dynamicRecs.map((prod) => (
                <Link href={`/vesthi-shirt/product/${prod.id}`} key={prod.id} className="rec-card">
                    <div className="rec-img-box" style={{ position: 'relative', width: '100%', height: '200px' }}>
                      <Image src={prod.img} alt={prod.name} fill className="rec-img" style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 200px" />
                  </div>
                  <div className="rec-info">
                    <h3 className="rec-name">{prod.name}</h3>
                    <div className="rec-price">₹{prod.price}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
