'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Heart, Trash2, ShoppingCart, Check, Share2, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import type { WishlistItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import './wishlist.css';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isReady, loading } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useFirebaseAuth();
  const [addedToCart, setAddedToCart] = useState<Set<string | number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Calculate filtered items - BEFORE any conditional returns
  const filteredItems = useMemo(() => {
    const filtered = wishlistItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort by selected option
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.toString().replace(/,/g, '')) || 0;
          const priceB = parseInt(b.price.toString().replace(/,/g, '')) || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parseInt(a.price.toString().replace(/,/g, '')) || 0;
          const priceB = parseInt(b.price.toString().replace(/,/g, '')) || 0;
          return priceB - priceA;
        });
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        // Keep original order
        break;
    }
    return filtered;
  }, [wishlistItems, searchQuery, sortBy]);

  // Calculate total price - BEFORE any conditional returns
  const totalPrice = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      const price = parseInt(item.price.toString().replace(/,/g, '')) || 0;
      return acc + price;
    }, 0);
  }, [filteredItems]);

  // Handle add all to cart
  const handleAddAllToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    filteredItems.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        img: item.img,
        quantity: 1
      });
    });
    setAddedToCart(new Set(filteredItems.map(i => i.id)));
    toast.success(`Added ${filteredItems.length} items to cart!`);
    setTimeout(() => {
      setAddedToCart(new Set());
    }, 2000);
  };

  // Handle move to cart
  const handleMoveToCart = (item: any) => {
    if (!user) {
      toast.error('Please login to add to cart');
      return;
    }
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      img: item.img,
      quantity: 1
    });
    setAddedToCart(prev => new Set([...prev, item.id]));
    toast.success('Added to cart!');
    setTimeout(() => {
      setAddedToCart(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 2000);
  };

  // Handle remove from wishlist
  const handleRemove = (id: string | number) => {
    removeFromWishlist(id);
    toast.success('Removed from wishlist');
  };

  // Handle share
  const handleShare = () => {
    const shareText = `Check out my wishlist with ${wishlistItems.length} items! 💝`;
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: shareText,
        url: currentUrl
      }).catch(() => {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(currentUrl);
        toast.success('Wishlist link copied!');
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(currentUrl);
      toast.success('Wishlist link copied to clipboard!');
    }
  };

  // NOW the conditional returns are OK - all hooks are already called
  if (loading || !isReady) {
    return (
      <div className="wishlist-page">
        <Header />
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <Header />
        <Navbar />
        <main className="container">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="empty-state-container"
          >
            <div className="empty-icon-wrapper">
              <Heart className="empty-icon" size={120} strokeWidth={1} />
              <div className="icon-glow"></div>
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p className="empty-description">
              No items saved yet! Start adding your favorite products to your wishlist and they'll appear here.
            </p>
            <div className="empty-features">
              <div className="feature">
                <Heart size={24} />
                <span>Save items for later</span>
              </div>
              <div className="feature">
                <ShoppingCart size={24} />
                <span>Quick checkout</span>
              </div>
              <div className="feature">
                <Share2 size={24} />
                <span>Share with friends</span>
              </div>
            </div>
            <Link href="/vesthi-shirt" className="btn-primary-large">
              START SHOPPING NOW
            </Link>
            <p className="empty-subtext">Browse our latest collection and find something you love</p>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <Header />
      <Navbar />
      <main className="container wishlist-main">
        {/* Header Section */}
        <div className="wishlist-header">
          <div className="header-top">
            <div>
              <h1>My Wishlist</h1>
              <p className="wishlist-count">{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved</p>
            </div>
            <div className="header-actions">
              <button className="btn-share" onClick={handleShare}>
                <Share2 size={20} /> Share Wishlist
              </button>
              {filteredItems.length > 0 && (
                <button className="btn-add-all" onClick={handleAddAllToCart}>
                  <ShoppingCart size={20} /> Add All to Cart
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-section">
            <div className="search-box">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search in wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Filters and Sort */}
            <div className="filter-sort-section">
              <button 
                className={`filter-btn ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} /> Filters
              </button>

              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                title="Sort products by"
                aria-label="Sort products"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <p>Showing <strong>{filteredItems.length}</strong> of <strong>{wishlistItems.length}</strong> items</p>
          {filteredItems.length > 0 && (
            <p className="total-value">Total Value: <span className="price-badge">₹{totalPrice.toLocaleString('en-IN')}</span></p>
          )}
        </div>

        {/* Product Grid */}
        {filteredItems.length === 0 ? (
          <div className="no-results">
            <Search size={48} />
            <h3>No items found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div 
                  key={item.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03 }}
                  className="wishlist-card"
                >
                    <div className="card-image-container" style={{ position: 'relative', width: '100%', height: '300px' }}>
                      <Image src={item.img} alt={item.name} fill className="card-image" style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 300px" />
                    <div className="image-overlay">
                      <Heart className="heart-badge" size={32} fill="white" color="white" />
                    </div>
                    <div className="card-badge">In Wishlist</div>
                  </div>

                  <div className="card-content">
                    <h3 className="product-name">{item.name}</h3>
                    
                    <div className="price-section">
                      <span className="product-price">₹{item.price}</span>
                    </div>

                    <div className="card-actions">
                      <button 
                        className={`btn-add-cart ${addedToCart.has(item.id) ? 'added' : ''}`}
                        onClick={() => handleMoveToCart(item)}
                        disabled={addedToCart.has(item.id)}
                      >
                        {addedToCart.has(item.id) ? (
                          <>
                            <Check size={18} /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={18} /> Add to Cart
                          </>
                        )}
                      </button>
                      <button 
                        className="btn-remove-item"
                        onClick={() => handleRemove(item.id)}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Continue Shopping CTA */}
        {filteredItems.length > 0 && (
          <div className="continue-shopping">
            <Link href="/vesthi-shirt" className="btn-link">← Continue Shopping</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

