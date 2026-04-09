'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Heart, Trash2, ShoppingCart, Check, Share2, Search, Filter } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContextFirebase';
import { useCart } from '../../context/CartContextFirebase';
import { useGuestGuard } from '../../hooks/useGuestGuard';
import type { WishlistItem } from '../../types';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import './wishlist.css';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { guardAddToCart } = useGuestGuard();
  const [addedToCart, setAddedToCart] = useState<Set<string | number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  const filteredItems = useMemo(() => {
    const filtered = wishlistItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
      default:
        break;
    }
    return filtered;
  }, [wishlistItems, searchQuery, sortBy]);

  const totalPrice = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
      const price = parseInt(item.price.toString().replace(/,/g, '')) || 0;
      return acc + price;
    }, 0);
  }, [filteredItems]);

  const handleMoveToCart = async (item: WishlistItem) => {
    const cartItem = { id: item.id, name: item.name, price: item.price, img: item.img, quantity: 1 };
    if (!guardAddToCart(cartItem)) return;
    await addToCart(cartItem);
    setAddedToCart(prev => new Set([...prev, item.id]));
    setTimeout(() => {
      setAddedToCart(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 2000);
  };

  const handleAddAllToCart = async () => {
    for (const item of filteredItems) {
      const cartItem = { id: item.id, name: item.name, price: item.price, img: item.img, quantity: 1 };
      if (!guardAddToCart(cartItem)) return;
      await addToCart(cartItem);
    }
    setAddedToCart(new Set(filteredItems.map(i => i.id)));
    toast.success(`Added ${filteredItems.length} items to cart!`);
    setTimeout(() => setAddedToCart(new Set()), 2000);
  };

  const handleRemove = async (id: string | number) => {
    await removeFromWishlist(id);
  };

  const handleShare = () => {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      navigator.share({ title: 'My Wishlist', text: `Check out my wishlist with ${wishlistItems.length} items! 💝`, url: currentUrl })
        .catch(() => { navigator.clipboard.writeText(currentUrl); toast.success('Wishlist link copied!'); });
    } else {
      navigator.clipboard.writeText(currentUrl);
      toast.success('Wishlist link copied to clipboard!');
    }
  };

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
              No items saved yet! Start adding your favorite products to your wishlist and they&apos;ll appear here.
            </p>
            <div className="empty-features">
              <div className="feature"><Heart size={24} /><span>Save items for later</span></div>
              <div className="feature"><ShoppingCart size={24} /><span>Quick checkout</span></div>
              <div className="feature"><Share2 size={24} /><span>Share with friends</span></div>
            </div>
            <Link href="/vesthi-shirt" className="btn-primary-large">START SHOPPING NOW</Link>
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
                onChange={(e) => setSortBy(e.target.value as SortOption)}
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

        <div className="results-summary">
          <p>Showing <strong>{filteredItems.length}</strong> of <strong>{wishlistItems.length}</strong> items</p>
          {filteredItems.length > 0 && (
            <p className="total-value">Total Value: <span className="price-badge">₹{totalPrice.toLocaleString('en-IN')}</span></p>
          )}
        </div>

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
                          <><Check size={18} /> Added</>
                        ) : (
                          <><ShoppingCart size={18} /> Add to Cart</>
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
