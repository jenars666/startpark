'use client';

import Header from '../../../../components/Header';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { use } from 'react';
import { ShoppingCart, Heart, Share2, Ruler, Truck, Shield } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '../../../../context/CartContext';
import { useWishlist } from '../../../../context/WishlistContext';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.id;
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  // Basic mock data based on ID
  const product = {
    id: productId,
    name: 'Featured Casual Shirt ' + productId,
    price: productId === '11' || productId === '12' ? '1,080' : '950',
    oldPrice: productId === '11' || productId === '12' ? '1,699' : '1,300',
    img: productId === '11' ? '/images/casual/WhatsApp Image 2026-03-25 at 8.59.32 PM.jpeg' : 
         productId === '12' ? '/images/casual/WhatsApp Image 2026-03-25 at 8.59.33 PM.jpeg' :
         productId === '14' ? '/images/casual/WhatsApp Image 2026-03-25 at 8.59.35 PM.jpeg' :
         '/images/casual/WhatsApp Image 2026-03-25 at 8.59.34 PM.jpeg',
    description: 'Elevate your everyday wardrobe with our premium casual shirts. Tailored for comfort and styled for impact, this piece seamlessly transitions from relaxed weekends to casual office days. Made from breathable, high-quality fabric that gets softer with every wash.',
    features: ['100% Premium Cotton', 'Pre-shrunk fabric', 'Machine washable', 'Modern fit']
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <Navbar />

      <main className="flex-grow pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative">
              <Image src={product.img} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="flex gap-4">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-black transition-colors relative">
                  <Image src={product.img} alt={`Thumbnail ${idx}`} fill style={{ objectFit: 'cover' }} className="opacity-70 hover:opacity-100 transition-opacity" sizes="96px" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-xl text-gray-400 line-through">₹{product.oldPrice}</span>
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold ml-auto">Sale</span>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-900">Select Size</span>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
                  <Ruler size={16} /> Size Guide
                </button>
              </div>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                  <button key={size} className="w-14 h-14 border border-gray-300 rounded-full flex items-center justify-center font-medium text-gray-700 hover:border-black hover:bg-black hover:text-white transition-all">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-8">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart({
                    id: product.id as unknown as number,
                    name: product.name,
                    price: parseInt(product.price.replace(/,/g, '')).toString(),
                    img: product.img,
                    quantity: 1
                  });
                }}
                className="flex-1 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  if (isInWishlist(product.id as string)) {
                    removeFromWishlist(product.id as string);
                  } else {
                    addToWishlist({
                      id: product.id as unknown as number,
                      name: product.name,
                      price: parseInt(product.price.replace(/,/g, '')).toString(),
                      img: product.img
                    });
                  }
                }}
                className="w-14 border border-gray-300 rounded-xl flex items-center justify-center text-gray-600 hover:text-red-500 hover:border-red-500 transition-colors"
              >
                <Heart size={24} />
              </button>
              <button className="w-14 border border-gray-300 rounded-xl flex items-center justify-center text-gray-600 hover:text-blue-500 hover:border-blue-500 transition-colors">
                <Share2 size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-6 mb-8">
              <div className="flex items-start gap-3">
                <Truck className="text-gray-400 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Free Delivery</h4>
                  <p className="text-xs text-gray-500 mt-1">On orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="text-gray-400 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Secure Payment</h4>
                  <p className="text-xs text-gray-500 mt-1">100% secure checkout</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-4">Product Features</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}