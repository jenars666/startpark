'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Share2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  categoryPath: string;
  index?: number;
  cardClassName?: string;
  imageClassName?: string;
  detailsClassName?: string;
  priceClassName?: string;
  buttonClassName?: string;
  useNextImage?: boolean;
}

export default function ProductCard({
  product,
  categoryPath,
  index = 0,
  cardClassName = 'product-card',
  imageClassName = 'product-image',
  detailsClassName = 'product-details',
  priceClassName = 'product-price',
  buttonClassName = 'enquire-btn',
  useNextImage = false,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      quantity: 1,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
      });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} at Star Mens Park`,
        url: `${window.location.origin}/${categoryPath}/product/${String(product.id)}`,
      }).catch(() => {});
    }
  };

  return (
    <Link
      href={`/${categoryPath}/product/${product.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.05 }}
        className={cardClassName}
      >
        <div className={`${imageClassName}-box`}>
          {product.tag && <span className="product-tag">{product.tag}</span>}
          {useNextImage ? (
            <Image
              src={product.img}
              alt={product.name}
              fill
              className={imageClassName}
              sizes="(max-width: 768px) 100vw, 300px"
            />
          ) : (
            <img
              src={product.img}
              alt={product.name}
              className={imageClassName}
            />
          )}
          <div className="hover-actions">
            <button
              className="action-btn"
              title="Add to Cart"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={18} aria-hidden="true" />
            </button>
            <button
              className="action-btn"
              title={isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              onClick={handleWishlistToggle}
              aria-label={
                isInWishlist(product.id)
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
            >
              <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} aria-hidden="true" />
            </button>
            <button
              className="action-btn"
              title="Share"
              onClick={handleShare}
              aria-label={`Share ${product.name}`}
            >
              <Share2 size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className={detailsClassName}>
          <h3 className="product-name">{product.name}</h3>
          <div className={priceClassName}>
            {product.oldPrice && (
              <span className="old-price">₹{product.oldPrice}</span>
            )}
            <span className="new-price">₹{product.price}</span>
          </div>
          <button className={buttonClassName} aria-label={`View details for ${product.name}`}>
            VIEW DETAILS <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
