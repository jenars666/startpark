'use client';

import Header from '../../../components/Header';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import '../group-shirt.css';
import { useGuestGuard } from '../../../hooks/useGuestGuard';
import { useCart } from '../../../context/CartContextFirebase';
import { useWishlist } from '../../../context/WishlistContextFirebase';

type GroupCollectionProduct = {
  id: string;
  name: string;
  price: string;
  oldPrice: string;
  img: string;
};

type GroupCollection = {
  title: string;
  desc: string;
  heroImg: string;
  products: GroupCollectionProduct[];
};

const groupCollectionData: Record<string, GroupCollection> = {
  wedding: {
    title: 'Wedding Party',
    desc: 'Premium group shirts for groomsmen and family members. Celebrate in united elegance.',
    heroImg: '/images/groupshirt.png',
    products: [
      { id: 'w1', name: 'Groomsmen Silk Shirts Set', price: '12,500', oldPrice: '15,000', img: '/images/groupshirt.png' },
      { id: 'w2', name: 'Family Matching Kurta Set', price: '18,200', oldPrice: '20,000', img: '/images/group2.png' },
    ]
  },
  corporate: {
    title: 'Corporate Teams',
    desc: 'Professional and comfortable matching shirts for your entire organization.',
    heroImg: '/images/group2.png',
    products: [
      { id: 'c1', name: 'Executive Team White Shirts 10-Pack', price: '15,000', oldPrice: '20,000', img: '/images/group2.png' },
      { id: 'c2', name: 'Premium Office Casual Set', price: '12,000', oldPrice: '14,500', img: '/images/groupshirt.png' },
    ]
  },
  festive: {
    title: 'Festive Matching',
    desc: 'Colorful and vibrant group wear for your grand celebrations and festivals.',
    heroImg: '/images/groupshirt.png',
    products: [
      { id: 'f1', name: 'Deepavali Family Pack', price: '9,500', oldPrice: '12,000', img: '/images/groupshirt.png' },
      { id: 'f2', name: 'Pongal Traditional Group Set', price: '8,200', oldPrice: '10,500', img: '/images/group2.png' },
    ]
  }
};

export default function GroupTypePage() {
  const params = useParams();
  const typeStr = Array.isArray(params.type) ? params.type[0] : params.type;
  const type = typeStr?.toLowerCase() || 'wedding';
  const collection = groupCollectionData[type] || groupCollectionData['wedding'];

  const { guardAddToCart, guardWishlist } = useGuestGuard();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="group-page-wrapper">
      <Header />
      <Navbar />

      <main>
        <section
          className="type-collection-hero"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${collection.heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            padding: '6rem 0'
          }}
        >
          <div className="container">
            <Link href="/group-shirt" className="back-link" style={{ color: '#fff', marginBottom: '2rem', display: 'inline-flex' }}>
              <ArrowLeft size={20} /> Back to Group Shirts
            </Link>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="collection-page-title"
              style={{ color: '#fff' }}
            >
              {collection.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="collection-page-desc"
              style={{ color: '#ddd' }}
            >
              {collection.desc}
            </motion.p>
          </div>
        </section>

        <section className="collection-grid-section">
          <div className="container">
            <div className="product-grid">
              {collection.products.map((product, idx) => (
                <Link href={`/group-shirt/product/${product.id}`} key={product.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="v-product-card"
                  >
                    <div className="v-product-image-box">
                      <div className="v-product-image" style={{ backgroundImage: `url(${product.img})` }} />
                      <div className="v-hover-actions">
                        <button
                          className="v-action-btn"
                          title="Add to Cart"
                          onClick={async (e) => {
                            e.preventDefault();
                            const item = { id: product.id, name: product.name, price: product.price, img: product.img, quantity: 1 };
                            if (!guardAddToCart(item)) return;
                            await addToCart(item);
                          }}
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button
                          className="v-action-btn"
                          title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                          onClick={async (e) => {
                            e.preventDefault();
                            const item = { id: product.id, name: product.name, price: product.price, img: product.img };
                            if (isInWishlist(product.id)) { await removeFromWishlist(product.id); }
                            else { if (!guardWishlist(item)) return; await addToWishlist(item); }
                          }}
                        >
                          <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} color={isInWishlist(product.id) ? '#d32f2f' : 'currentColor'} />
                        </button>
                        <button className="v-action-btn" title="Share Product" onClick={(e) => e.preventDefault()}>
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="v-product-details">
                      <h3 className="v-product-name">{product.name}</h3>
                      <div className="v-product-price">
                        <span className="v-old-price">₹{product.oldPrice}</span>
                        <span className="v-new-price">₹{product.price}</span>
                      </div>
                      <button className="v-enquire-btn" onClick={(e) => e.preventDefault()}>
                        ENQUIRE BULK
                      </button>
                    </div>
                  </motion.div>
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
