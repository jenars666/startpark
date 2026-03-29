'use client';

import { useState, useEffect } from 'react';
import Header from '../../../../components/Header';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Heart, Share2, ArrowLeft, Star, 
  Minus, Plus, ShieldCheck, Truck, Clock 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import '../../../vesthi-shirt/product.css';
import { useFirebaseAuth } from '../../../../hooks/useFirebaseAuth';
import { useCart } from '../../../../context/CartContext';
import { useWishlist } from '../../../../context/WishlistContext';

// Consolidated data from all group shirt pages
const allGroupProducts: Record<string, any> = {
  g1: { id: 'g1', name: 'Family Matching Silk Group Shirts', price: '4599', oldPrice: '5200', img: '/images/groupshirt.png', material: 'Silk blend', occasion: 'Family Gatherings', desc: 'Elegant silk blend group shirts for your entire family. Celebrate your events in unified joy and style.' },
  g2: { id: 'g2', name: 'Corporate Team Cotton Shirts', price: '12250', oldPrice: '15999', img: '/images/group2.png', material: 'Pure Premium Cotton', occasion: 'Office & Events', desc: 'Bulk sets of professional team wear crafted for ultimate comfort over long hours.' },
  g3: { id: 'g3', name: 'Wedding Groomsmen Traditional Set', price: '8500', oldPrice: '10500', img: '/images/groupshirt.png', material: 'Traditional Weave', occasion: 'Weddings', desc: 'Stand out together. Make the groom\'s squad look sharp and coordinated.' },
  g4: { id: 'g4', name: 'Premium Festive Group Collection', price: '6200', oldPrice: '7800', img: '/images/group2.png', material: 'Art Silk', occasion: 'Festivals', desc: 'Richly crafted shirts to light up festive occasions, offering both comfort and regal vibes.' },
  w1: { id: 'w1', name: 'Groomsmen Silk Shirts Set', price: '12500', oldPrice: '15000', img: '/images/groupshirt.png', material: 'Pure Silk', occasion: 'Webdings', desc: 'The most stunning silk matching sets designed explicitly for groomsmen.' },
  w2: { id: 'w2', name: 'Family Matching Kurta Set', price: '18200', oldPrice: '20000', img: '/images/group2.png', material: 'Cotton Silk', occasion: 'Sangeet / Haldi', desc: 'Elegant traditional wear for the extended family.' },
  c1: { id: 'c1', name: 'Executive Team White Shirts 10-Pack', price: '15000', oldPrice: '20000', img: '/images/group2.png', material: 'Cotton Poplin', occasion: 'Corporate', desc: 'Crisp white shirts tailored to perfection for the entire executive team.' },
  c2: { id: 'c2', name: 'Premium Office Casual Set', price: '12000', oldPrice: '14500', img: '/images/groupshirt.png', material: 'Linen Blend', occasion: 'Corporate Retreats', desc: 'Relaxed yet unified team style for Friday wear and offsites.' },
  f1: { id: 'f1', name: 'Deepavali Family Pack', price: '9500', oldPrice: '12000', img: '/images/groupshirt.png', material: 'Satin Cotton', occasion: 'Festivals', desc: 'Bright, joyous colors in matching sets for the celebration of light.' },
  f2: { id: 'f2', name: 'Pongal Traditional Group Set', price: '8200', oldPrice: '10500', img: '/images/group2.png', material: 'Khadi Cotton', occasion: 'Pongal / Harvest', desc: 'Breathable, authentic traditional fabric for harvest celebrations.' },
};

export default function GroupProductDetail() {
  const params = useParams();
  const router = useRouter();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const productId = decodeURIComponent(rawId || '');
  
  const product = allGroupProducts[productId];
  
  const { user } = useFirebaseAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [qty, setQty] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [dynamicRecs, setDynamicRecs] = useState<any[]>([]);

  useEffect(() => {
    // Generate some recommended products
    const otherProducts = Object.values(allGroupProducts).filter(p => p.id !== productId);
    // Shuffle and pick 5
    const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
    setDynamicRecs(shuffled.slice(0, 5));
  }, [productId]);

  if (!product) {
    return (
      <div className="product-page-wrapper">
        <Header />
        <Navbar />
        <main className="container" style={{ padding: '10rem 0', textAlign: 'center' }}>
          <h2>Product Not Found</h2>
          <p>We could not find the item you are looking for.</p>
          <Link href="/group-shirt" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
            Back to Category
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const pNum = parseInt(product.price.replace(/,/g, ''));
  const opNum = parseInt(product.oldPrice.replace(/,/g, ''));
  const discount = Math.round(((opNum - pNum) / opNum) * 100);

  const handleAction = (action: 'cart' | 'buy') => {
    if (!user) {
      if (action === 'buy') {
        router.push(`/login?redirect=/checkout`);
      } else {
        router.push(`/login?redirect=/group-shirt/product/${productId}`);
      }
      return;
    }

    if (action === 'cart') {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: qty
      });
      alert('Item added to cart!');
    } else {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: qty
      });
      router.push('/checkout');
    }
  };

  return (
    <div className="product-page-wrapper">
      <Header />
      <Navbar />

      <main className="product-main">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/group-shirt"><ArrowLeft size={16} /> Back to Group Shirts</Link>
          </div>

          <div className="product-grid-layout">
            <div className="product-gallery">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="main-image-container"
                style={{ position: 'relative', width: '100%', height: '500px' }}
              >
                <Image src={product.img} alt={product.name} fill className="main-image" style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
              </motion.div>
            </div>
            
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-rating">
                <div className="stars">
                  {[1,2,3,4,5].map(star => (
                    <Star key={star} size={16} fill={star <= 4 ? "#ffc107" : "none"} color="#ffc107" />
                  ))}
                </div>
                <span className="review-count">(124 Reviews)</span>
              </div>

              <div className="price-block">
                <span className="current-price">₹{product.price}</span>
                {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
                <span className="tax-note">Inclusive of all taxes</span>
              </div>

              <p className="product-description">{product.desc}</p>

              <div className="specifications">
                <div className="spec-item">
                  <span className="spec-label">Material:</span>
                  <span className="spec-value">{product.material}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Occasion:</span>
                  <span className="spec-value">{product.occasion}</span>
                </div>
              </div>

              <div className="action-area">
                <div className="quantity-selector">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={18} /></button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}><Plus size={18} /></button>
                </div>

                <div className="button-group">
                  <button className="add-to-cart-btn" onClick={() => handleAction('cart')}>
                    <ShoppingCart size={20} /> ADD TO CART
                  </button>
                  <button className="buy-now-btn" onClick={() => handleAction('buy')}>
                    BUY IT NOW
                  </button>
                </div>

                <div className="secondary-actions">
                  <button 
                    className={`action-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                    onClick={() => {
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id);
                      } else {
                        addToWishlist({ id: product.id, name: product.name, price: product.price, img: product.img });
                      }
                    }}
                  >
                    <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} /> 
                    {isInWishlist(product.id) ? "Remove" : "Add to Wishlist"}
                  </button>
                  <button className="action-btn">
                    <Share2 size={18} /> Share
                  </button>
                </div>
              </div>

              <div className="trust-badges">
                <div className="badge">
                  <ShieldCheck size={24} />
                  <span>100% Original</span>
                </div>
                <div className="badge">
                  <Truck size={24} />
                  <span>Free Shipping</span>
                </div>
                <div className="badge">
                  <Clock size={24} />
                  <span>7 Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar / Recommended Products */}
        {dynamicRecs.length > 0 && (
          <section className="similar-products">
            <div className="container">
              <h2 className="section-title">You May Also Like</h2>
              <div className="recommendations-scroll">
                {dynamicRecs.map((rec) => (
                  <Link href={`/group-shirt/product/${rec.id}`} key={rec.id} className="rec-card">
                      <div className="rec-img" style={{ position: 'relative', width: '100%', height: '200px' }}>
                        <Image src={rec.img} alt={rec.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 50vw, 200px" />
                    </div>
                    <div className="rec-details">
                      <h4>{rec.name}</h4>
                      <div className="rec-price">
                        <span className="new">₹{rec.price}</span>
                        <span className="old">₹{rec.oldPrice}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}