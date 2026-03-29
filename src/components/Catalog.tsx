'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateWhatsAppLink, handleInstantCheckout } from '../utils/checkoutUtils';
import { BarChart2, ExternalLink, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './Catalog.css';

const circleCategories = [
  { name: 'Group Shirts', img: 'images/group2.png', link: '/group-shirt' },
  { name: 'Vesti &Shirt', img: '/images/groupshirt.png', link: '/vesthi-shirt' },
  { name: 'Bottoms', img: '/images/bottoms.png', link: '#' },
  { name: 'Casual', img: '/images/casual2.png', link: '/casual-shirt' },
  { name: 'Designer Shirts', img: 'images/desigher.png', link: '#' },
  { name: 'Formal', img: 'images/formal.png', link: '#' },
];

const trendingProducts = [
  {
    id: 1,
    name: 'Dipdyed With Puff Sleeve Printed Dropshoulder Shirt- Blue',
    img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
    discount: '-10%',
    oldPrice: '1,055',
    price: '950'
  },
  {
    id: 2,
    name: 'Urban Heritage Embroidered Shirt',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80',
    discount: '-29%',
    oldPrice: '1,399',
    price: '990',
    variants: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&q=80',
      'https://images.unsplash.com/photo-1594938298596-eb5fd3822758?w=100&q=80',
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=100&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100&q=80'
    ]
  },
  {
    id: 3,
    name: 'Earth Drip Abstract Zip-Collar Statement Shirt',
    img: 'https://images.unsplash.com/photo-1594938298596-eb5fd3822758?w=600&q=80',
    discount: '-27%',
    oldPrice: '1,300',
    price: '949'
  },
  {
    id: 4,
    name: 'Stylish Deadpool Back Printed Oversize T-shirt',
    img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
    discount: '-33%',
    oldPrice: '1,199',
    price: '799'
  },
  {
    id: 5,
    name: 'Gangster Plain Satin Shirt- Green',
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    discount: '-45%',
    oldPrice: '999',
    price: '549'
  },
];

export default function Catalog() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('recommended');
  const [priceFilter, setPriceFilter] = useState('all');

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...trendingProducts];
    
    // Search Filter
    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    // Price Filter
    if (priceFilter === 'under-1000') {
      result = result.filter(p => parseInt(p.price.replace(/,/g, '')) < 1000);
    } else if (priceFilter === 'over-1000') {
      result = result.filter(p => parseInt(p.price.replace(/,/g, '')) >= 1000);
    }

    // Sort Order
    if (sortOrder === 'price-low-high') {
      result.sort((a, b) => parseInt(a.price.replace(/,/g, '')) - parseInt(b.price.replace(/,/g, '')));
    } else if (sortOrder === 'price-high-low') {
      result.sort((a, b) => parseInt(b.price.replace(/,/g, '')) - parseInt(a.price.replace(/,/g, '')));
    }
    
    return result;
  }, [searchTerm, sortOrder, priceFilter]);

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'Vesti &Shirt') {
      router.push('/vesthi-shirt');
    } else if (categoryName === 'GROUP SHIRT' || categoryName === 'Group Shirts') {
      router.push('/group-shirt');
    } else if (categoryName === 'Casual') {
      router.push('/casual-shirt');
    } else {
      window.open(generateWhatsAppLink(categoryName, 1, 'M'), "_blank");
    }
  };

  return (
    <div className="catalog-wrapper">
      {/* Shop by Categories Section */}
      <section className="shop-by-categories-section">
        <div className="container text-center">
          <h2 className="section-title">Shop by Categories</h2>
          <p className="section-subtitle">
            Explore our refined categories for a seamless shopping experience.
          </p>

          <div className="categories-row">
            {circleCategories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="category-circle-item"
              >
                <div
                  className="circle-image"
                  style={{ backgroundImage: `url(${cat.img})` }}
                  onClick={() => handleCategoryClick(cat.name)}
                />
                <h3 className="circle-label" onClick={() => handleCategoryClick(cat.name)} style={{ cursor: 'pointer' }}>{cat.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="trending-now-section">
        <div className="container text-center">
          <h2 className="section-title">Trending Now</h2>
          <p className="section-subtitle">
            Explore the newest additions to our collection<br />
            crafted for the modern man who loves to stay ahead in fashion.
          </p>

          <div className="catalog-toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', textAlign: 'left' }}>
            <div className="search-box" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '0.5rem 1rem', flex: '1', minWidth: '250px' }}>
              <Search size={18} style={{ color: '#6b7280', marginRight: '0.5rem' }} />
              <input 
                type="text" 
                placeholder="Search trending products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
              />
            </div>
            <div className="filter-sort-controls" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={18} style={{ color: '#6b7280' }} />
                <select 
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', outline: 'none' }}
                >
                  <option value="all">All Prices</option>
                  <option value="under-1000">Under ₹1,000</option>
                  <option value="over-1000">₹1,000 & Above</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  style={{ padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '4px', outline: 'none' }}
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="trending-grid-wrapper">
            <button className="nav-arrow left-arrow" aria-label="Previous items"><ChevronLeft size={20} /></button>

            <div className="trending-grid">
              <AnimatePresence>
                {filteredAndSortedProducts.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    style={{ gridColumn: '1 / -1', padding: '3rem', color: '#6b7280' }}
                  >
                    No products found matching your criteria.
                  </motion.div>
                ) : (
                  filteredAndSortedProducts.map((prod, index) => (
                    <motion.div
                      key={prod.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.3 }}
                      className="product-card"
                    >
                  <div
                    className="product-image-container"
                    onClick={() => handleInstantCheckout(parseInt(prod.price.replace(',', '')), prod.name)}
                  >
                    <div className="discount-badge">{prod.discount}</div>

                    <div
                      className="product-image"
                      style={{ backgroundImage: `url(${prod.img})` }}
                    />

                    {/* Hover Actions Right */}
                    <div className="hover-actions-right">
                      <button className="hover-icon-btn" aria-label="View Statistics"><BarChart2 size={16} /></button>
                      <button className="hover-icon-btn" aria-label="Open Link"><ExternalLink size={16} /></button>
                    </div>
                  </div>

                  <div className="product-info">
                    <h4 className="product-name">{prod.name}</h4>
                    <p className="product-pricing">
                      <span className="old-price">₹{prod.oldPrice}</span>
                      <span className="new-price">₹{prod.price}</span>
                    </p>

                    {prod.variants && (
                      <div className="product-variants">
                        {prod.variants.map((v, i) => (
                          <div key={i} className="variant-thumbnail" style={{ backgroundImage: `url(${v})` }} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
                ))
              )}
              </AnimatePresence>
            </div>

            <button className="nav-arrow right-arrow" aria-label="Next items"><ChevronRight size={20} /></button>
          </div>

          <div className="shop-more-container">
            <button className="btn-shop-more">SHOP MORE</button>
          </div>
        </div>
      </section>
    </div>
  );
}

