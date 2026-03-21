'use client';

import { motion } from 'framer-motion';
import { generateWhatsAppLink, handleInstantCheckout } from '../utils/checkoutUtils';
import { BarChart2, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import './Catalog.css';

const circleCategories = [
  { name: 'Group Shirts', img: 'images/group2.png' },
  { name: 'Vesti &Shirt', img: '/images/groupshirt.png' },
  { name: 'Bottoms', img: '/images/bottoms.png' },
  { name: 'Casual', img: 'images/casual2.png' },
  { name: 'Designer shirts', img: 'images/desigher.png' },
  { name: 'Formal', img: 'images/formal.png' },
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
                  onClick={() => window.open(generateWhatsAppLink(cat.name, 1, 'M'), "_blank")}
                />
                <h3 className="circle-label">{cat.name}</h3>
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

          <div className="trending-grid-wrapper">
            <button className="nav-arrow left-arrow" aria-label="Previous items"><ChevronLeft size={20} /></button>

            <div className="trending-grid">
              {trendingProducts.map((prod, index) => (
                <motion.div
                  key={prod.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
              ))}
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
