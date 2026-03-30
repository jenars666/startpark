'use client';

import { type FormEvent, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BadgePercent,
  CheckCircle2,
  ChevronDown,
  Heart,
  Search,
  Share2,
  ShoppingBag,
  Star,
  ThumbsUp,
  Truck,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { vesthiMainProducts } from '../../vesthi-main-products';
import { useCart } from '../../../../context/CartContext';
import { useWishlist } from '../../../../context/WishlistContext';
import './product-detail.css';

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
const RATING_BREAKDOWN = [
  { label: '5', value: '85%' },
  { label: '4', value: '10%' },
  { label: '3', value: '3%' },
  { label: '2', value: '1%' },
  { label: '1', value: '1%' },
];

type DetailSection = 'features' | 'care' | 'style';
type ReviewCard = {
  name: string;
  date: string;
  title: string;
  body: string;
  rating: number;
  helpful: number;
  images: string[];
  verified: boolean;
  source: 'base' | 'user';
};
type ReviewDraft = {
  name: string;
  title: string;
  body: string;
  rating: number;
};

const EMPTY_REVIEW_DRAFT: ReviewDraft = {
  name: '',
  title: '',
  body: '',
  rating: 5,
};

function parsePrice(value: string | number) {
  if (typeof value === 'number') return value;
  return Number(value.replace(/,/g, '')) || 0;
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('en-IN').format(parsePrice(value));
}

function getDiscount(product: { price: string; oldPrice: string; discount?: number }) {
  if (product.discount) return product.discount;

  const current = parsePrice(product.price);
  const old = parsePrice(product.oldPrice);

  if (!old || old <= current) return 0;
  return Math.round(((old - current) / old) * 100);
}

function renderStars(rating: number, className?: string) {
  return Array.from({ length: 5 }, (_, index) => {
    const filled = rating >= index + 1 || (rating > index && rating < index + 1);

    return (
      <Star
        key={`${rating}-${index}`}
        className={className}
        fill={filled ? 'currentColor' : 'none'}
        strokeWidth={1.7}
      />
    );
  });
}

export default function VesthiProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  const product = vesthiMainProducts.find((item) => item.id === productId) || vesthiMainProducts[0];

  return <VesthiProductDetailView key={product.id} product={product} />;
}

function VesthiProductDetailView({ product }: { product: (typeof vesthiMainProducts)[number] }) {
  const router = useRouter();
  const { addToCart, totalItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const discount = getDiscount(product);

  const galleryImages = useMemo(() => {
    const pool = [
      product.img,
      ...vesthiMainProducts
        .filter((item) => item.id !== product.id && item.tag === product.tag)
        .map((item) => item.img),
      ...vesthiMainProducts.filter((item) => item.id !== product.id).map((item) => item.img),
    ];

    return Array.from(new Set(pool)).slice(0, 3);
  }, [product.id, product.img, product.tag]);

  const relatedProducts = useMemo(() => {
    const seen = new Set<string>([product.img]);

    return vesthiMainProducts
      .filter((item) => item.id !== product.id)
      .filter((item) => {
        if (seen.has(item.img)) return false;
        seen.add(item.img);
        return true;
      })
      .slice(0, 3);
  }, [product.id, product.img]);

  const featureItems = useMemo(
    () => [
      `${product.tag || 'Premium'} vesthi set with coordinated silk finish and traditional drape retention`,
      'Signature ceremonial fit with structured collar and authentic occasion-ready styling',
      'Soft-luster weave for weddings, receptions, temple visits, and festive celebrations',
    ],
    [product.tag]
  );

  const careItems = useMemo(
    () => [
      'Dry clean recommended or gentle cold water wash with similar shades',
      'Steam iron on low to maintain fabric sheen and structure',
      'Store in breathable cotton bag to preserve ceremonial quality',
    ],
    []
  );

  const baseReviewCards = useMemo<ReviewCard[]>(
    () => [
      {
        name: 'Ravi Kumar',
        date: 'Oct 12, 2023',
        title: 'Perfect Wedding Set',
        body: `The ${product.tag?.toLowerCase() || 'premium'} vesthi looks even better in person. Perfect drape and comfort for full ceremony day.`,
        rating: 5,
        helpful: 24,
        images: galleryImages.slice(0, 2),
        verified: true,
        source: 'base',
      },
      {
        name: 'Priya S.',
        date: 'Sep 28, 2023',
        title: 'Excellent Festive Quality',
        body: `Great fit for family functions. The fabric holds shape well and the matching is impeccable.`,
        rating: 4,
        helpful: 12,
        images: [],
        verified: true,
        source: 'base',
      },
    ],
    [galleryImages, product.tag]
  );

  const [selectedSize, setSelectedSize] = useState('M');
  const [openSection, setOpenSection] = useState<DetailSection | null>('features');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewDraft, setReviewDraft] = useState<ReviewDraft>(EMPTY_REVIEW_DRAFT);
  const [reviewError, setReviewError] = useState('');
  const [reviews, setReviews] = useState<ReviewCard[]>(baseReviewCards);

  const wishlistActive = isInWishlist(product.id);
  const userReviews = reviews.filter((review) => review.source === 'user');
  const displayedReviewCount = (product.reviews || 10) + userReviews.length;
  const totalRatingValue = (product.rating || 4.8) * (product.reviews || 10) + userReviews.reduce((sum, review) => sum + review.rating, 0);
  const displayedRating = totalRatingValue / displayedReviewCount;
  const reviewCount = displayedReviewCount.toLocaleString('en-IN');

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/vesthi-shirt');
  };

  const addCurrentProductToCart = () => {
    addToCart({
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} (${selectedSize})`,
      price: product.price,
      img: product.img,
      quantity: 1,
    });
  };

  const handleBuyNow = () => {
    addCurrentProductToCart();
    toast.success('Added to bag. Continue checkout from cart.');
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `http://localhost:3000/vesthi-shirt/product/${product.id}`;
    const shareData = {
      title: product.name,
      text: `Check out this vesthi set: ${product.name}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Product link copied.');
    } catch {
      toast.error('Unable to share.');
    }
  };

  const toggleWishlist = () => {
    if (wishlistActive) {
      removeFromWishlist(product.id);
      return;
    }
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
    });
  };

  const handleHelpfulClick = (index: number) => {
    setReviews((prev) =>
      prev.map((review, itemIndex) =>
        itemIndex === index ? { ...review, helpful: review.helpful + 1 } : review
      )
    );
  };

  const handleReviewFieldChange = (field: keyof ReviewDraft, value: string | number) => {
    setReviewDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
    setReviewError('');
  };

  const handleReviewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = reviewDraft.name.trim();
    const title = reviewDraft.title.trim();
    const body = reviewDraft.body.trim();

    if (!name || !title || !body || !reviewDraft.rating) {
      setReviewError('Please fill name, rating, title, review.');
      return;
    }

    const submittedReview: ReviewCard = {
      name,
      title,
      body,
      rating: reviewDraft.rating,
      helpful: 0,
      images: [],
      verified: false,
      source: 'user',
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setReviews((prev) => [submittedReview, ...prev]);
    setShowReviewForm(false);
    setReviewDraft(EMPTY_REVIEW_DRAFT);
    setReviewError('');
    toast.success('Review submitted. Thanks!');
  };

  const renderAccordionButton = (section: DetailSection, label: string) => {
    const isOpen = openSection === section;

    return (
      <button
        type="button"
        className="atelier-accordion-trigger"
        onClick={() => setOpenSection(isOpen ? null : section)}
      >
        <span>{label}</span>
        <ChevronDown className={`atelier-chevron ${isOpen ? 'atelier-chevron-open' : ''}`} />
      </button>
    );
  };

  return (
    <div className="atelier-product-page">
      <header className="atelier-topbar">
        <div className="atelier-topbar-inner">
          <div className="atelier-brand-block">
            <button type="button" className="atelier-icon-button" onClick={handleBack} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
            <Link href="/" className="atelier-wordmark">
              VESTHI
            </Link>
          </div>

          <div className="atelier-top-actions">
            <button
              type="button"
              className="atelier-icon-button"
              onClick={() => router.push('/vesthi-shirt')}
              aria-label="Browse vesthi shirts"
            >
              <Search size={19} />
            </button>
            <button
              type="button"
              className={`atelier-icon-button ${wishlistActive ? 'is-active' : ''}`}
              onClick={toggleWishlist}
              aria-label={wishlistActive ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={19} fill={wishlistActive ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              className="atelier-icon-button atelier-cart-button"
              onClick={addCurrentProductToCart}
              aria-label="Add to bag"
            >
              <ShoppingBag size={19} />
              {totalItems > 0 && <span className="atelier-cart-count">{Math.min(totalItems, 99)}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="atelier-detail-main">
        <section className="atelier-gallery-section">
          <div className="atelier-gallery-stage">
            {product.tag && <span className="atelier-product-tag">{product.tag}</span>}

            <Image
              src={product.img}
              alt={product.name}
              fill
              className="atelier-gallery-image"
              sizes="100vw"
              priority
            />

            <div className="atelier-rating-pill">
              <span className="atelier-rating-value">{(product.rating || 4.8).toFixed(1)}</span>
              <Star size={14} fill="currentColor" />
              <span className="atelier-rating-divider" />
              <span>{reviewCount}</span>
            </div>
          </div>
        </section>

        <section className="atelier-summary-card">
          <div className="atelier-copy-block">
            <p className="atelier-overline">Vesthi Collection</p>
            <h1 className="atelier-product-title">{product.name}</h1>
            <p className="atelier-product-subtitle">
              Premium vesthi and shirt set for weddings, receptions, and traditional occasions with authentic ceremonial styling.
            </p>
          </div>

          <div className="atelier-price-row">
            <span className="atelier-current-price">₹{formatCurrency(product.price)}</span>
            <span className="atelier-old-price">₹{formatCurrency(product.oldPrice)}</span>
            <span className="atelier-discount">({discount}% OFF)</span>
          </div>

          <p className="atelier-tax-note">inclusive of all taxes</p>

          <div className="atelier-offer-panel">
            <div className="atelier-offer-item">
              <BadgePercent size={18} />
              <span>Bank Offer: 10% instant discount on Axis Bank cards</span>
            </div>
            <div className="atelier-offer-item">
              <Truck size={18} />
              <span>Free shipping on orders above ₹1,999</span>
            </div>
          </div>

          <div className="atelier-cta-row">
            <button type="button" className="atelier-secondary-cta" onClick={addCurrentProductToCart}>
              <ShoppingBag size={18} />
              Add to Bag
            </button>
            <button type="button" className="atelier-primary-cta" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          <div className="atelier-utility-row">
            <button type="button" className="atelier-utility-button" onClick={toggleWishlist}>
              <Heart size={16} fill={wishlistActive ? 'currentColor' : 'none'} />
              {wishlistActive ? 'Saved' : 'Wishlist'}
            </button>
            <button type="button" className="atelier-utility-button" onClick={handleShare}>
              <Share2 size={16} />
              Share
            </button>
          </div>
        </section>

        <section className="atelier-size-panel">
          <div className="atelier-panel-head">
            <h2>Select Size</h2>
            <button type="button" className="atelier-text-button" onClick={() => setShowSizeChart(true)}>
              Size Chart
            </button>
          </div>

          <div className="atelier-size-grid">
            {ALL_SIZES.map((size) => {
              const unavailable = !(product.sizes || []).includes(size);

              return (
                <button
                  type="button"
                  key={size}
                  className={`atelier-size-chip ${selectedSize === size ? 'is-selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                  disabled={unavailable}
                >
                  {size}
                </button>
              );
            })}
          </div>

          <p className="atelier-stock-note">ONLY 2 LEFT AT THIS PRICE</p>
        </section>

        <section className="atelier-details-panel">
          <div className="atelier-accordion-item">
            {renderAccordionButton('features', 'Product Features')}
            {openSection === 'features' && (
              <div className="atelier-accordion-body">
                {featureItems.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
            )}
          </div>

          <div className="atelier-accordion-item">
            {renderAccordionButton('care', 'Fabric & Care')}
            {openSection === 'care' && (
              <div className="atelier-accordion-body">
                {careItems.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
            )}
          </div>

          <div className="atelier-accordion-item">
            {renderAccordionButton('style', 'Style Note')}
            {openSection === 'style' && (
              <div className="atelier-accordion-body">
                <p>
                  Pair this vesthi set with gold jewelry, minimal footwear, and traditional accessories for complete ceremonial elegance.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="atelier-related-section">
          <div className="atelier-section-title-row">
            <h2>You Might Also Like</h2>
            <Link href="/vesthi-shirt" className="atelier-inline-link">
              Browse collection
            </Link>
          </div>

          <div className="atelier-related-rail no-scrollbar">
            {relatedProducts.map((related) => (
              <Link href={`/vesthi-shirt/product/${related.id}`} className="atelier-related-card" key={related.id}>
                <div className="atelier-related-image-wrap">
                  <Image
                    src={related.img}
                    alt={related.name}
                    fill
                    className="atelier-related-image"
                    sizes="(max-width: 768px) 72vw, 220px"
                  />
                </div>
                <p className="atelier-related-brand">Vesthi</p>
                <p className="atelier-related-name">{related.name}</p>
                <p className="atelier-related-price">₹{formatCurrency(related.price)}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="atelier-reviews-section">
          <div className="atelier-section-title-row">
            <h2>Customer Reviews</h2>
            <button
              type="button"
              className="atelier-inline-link atelier-inline-button"
              onClick={() => setShowReviewForm(true)}
            >
              Write a Review
            </button>
          </div>

          <div className="atelier-review-summary">
            <div className="atelier-overall-rating">
              <strong>{displayedRating.toFixed(1)}</strong>
              <div className="atelier-stars-row">{renderStars(displayedRating, 'atelier-star-icon')}</div>
              <span>{reviewCount} Reviews</span>
            </div>

            <div className="atelier-rating-breakdown">
              {RATING_BREAKDOWN.map((item) => (
                <div className="atelier-breakdown-row" key={item.label}>
                  <span>{item.label}</span>
                  <div className="atelier-progress-track">
                    <div className="atelier-progress-fill" style={{ width: item.value }} />
                  </div>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {showReviewForm && (
            <form className="atelier-review-form" onSubmit={handleReviewSubmit}>
              <div className="atelier-review-form-header">
                <div>
                  <h3>Write a Review</h3>
                  <p>Share your fit, fabric, and styling feedback for this vesthi set.</p>
                </div>
                <button
                  type="button"
                  className="atelier-review-close"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewError('');
                  }}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="atelier-review-form-grid">
                <label className="atelier-field">
                  <span>Your Name</span>
                  <input
                    type="text"
                    value={reviewDraft.name}
                    onChange={(event) => handleReviewFieldChange('name', event.target.value)}
                    placeholder="Enter your name"
                  />
                </label>

                <label className="atelier-field">
                  <span>Review Title</span>
                  <input
                    type="text"
                    value={reviewDraft.title}
                    onChange={(event) => handleReviewFieldChange('title', event.target.value)}
                    placeholder="Summarize your experience"
                  />
                </label>
              </div>

              <div className="atelier-rating-picker">
                <span>Your Rating</span>
                <div className="atelier-rating-buttons">
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1;
                    const active = reviewDraft.rating >= value;

                    return (
                      <button
                        type="button"
                        key={value}
                        className={`atelier-rating-star-button ${active ? 'is-active' : ''}`}
                        onClick={() => handleReviewFieldChange('rating', value)}
                        aria-label={`Give ${value} star${value > 1 ? 's' : ''}`}
                      >
                        <Star size={18} fill={active ? 'currentColor' : 'none'} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="atelier-field">
                <span>Your Review</span>
                <textarea
                  value={reviewDraft.body}
                  onChange={(event) => handleReviewFieldChange('body', event.target.value)}
                  rows={5}
                  placeholder="Tell shoppers about fit, fabric, and ceremonial look."
                />
              </label>

              {reviewError && <p className="atelier-form-error">{reviewError}</p>}

              <div className="atelier-review-form-actions">
                <button
                  type="button"
                  className="atelier-review-cancel"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewError('');
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="atelier-review-submit">
                  Submit Review
                </button>
              </div>
            </form>
          )}

          <div className="atelier-review-list">
            {reviews.map((review, index) => (
              <article className="atelier-review-card" key={`${review.name}-${review.date}`}>
                <div className="atelier-review-head">
                  <div>
                    <div className="atelier-review-author">
                      <span>{review.name}</span>
                      {review.verified && (
                        <span className="atelier-verified-badge">
                          <CheckCircle2 size={12} />
                          Verified
                        </span>
                      )}
                      {!review.verified && <span className="atelier-review-fresh-badge">New Review</span>}
                    </div>
                    <div className="atelier-mini-stars">{renderStars(review.rating, 'atelier-mini-star')}</div>
                  </div>
                  <time>{review.date}</time>
                </div>

                <h3>{review.title}</h3>
                <p className="atelier-review-copy">{review.body}</p>

                {review.images.length > 0 && (
                  <div className="atelier-review-images no-scrollbar">
                    {review.images.map((image, imageIndex) => (
                      <div className="atelier-review-image-wrap" key={`${image}-${imageIndex}`}>
                        <Image src={image} alt="" fill className="atelier-review-image" sizes="64px" />
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="atelier-helpful-button"
                  onClick={() => handleHelpfulClick(index)}
                >
                  <ThumbsUp size={14} />
                  Helpful ({review.helpful})
                </button>
              </article>
            ))}
          </div>

          <div className="atelier-review-footer">
            <button
              type="button"
              className="atelier-inline-link atelier-inline-button"
              onClick={() => toast('More reviews coming soon.')}
            >
              View All {reviewCount} Reviews
            </button>
          </div>
        </section>
      </main>

      <div className="atelier-sticky-footer">
        <div className="atelier-sticky-price">
          <strong>₹{formatCurrency(product.price)}</strong>
          <span>Size {selectedSize}</span>
        </div>
        <button type="button" className="atelier-sticky-wishlist" onClick={toggleWishlist} aria-label="Toggle wishlist">
          <Heart size={18} fill={wishlistActive ? 'currentColor' : 'none'} />
        </button>
        <button type="button" className="atelier-sticky-cta" onClick={addCurrentProductToCart}>
          Add to Bag
        </button>
      </div>

      {showSizeChart && (
        <div className="atelier-modal-backdrop" role="presentation" onClick={() => setShowSizeChart(false)}>
          <div
            className="atelier-size-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Size chart"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="atelier-modal-header">
              <h2>Vesthi Set Size Chart</h2>
              <button type="button" className="atelier-icon-button" onClick={() => setShowSizeChart(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="atelier-table-wrap">
              <table className="atelier-size-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Chest</th>
                    <th>Shoulder</th>
                    <th>Length</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>S</td>
                    <td>38"</td>
                    <td>16.5"</td>
                    <td>28"</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>40"</td>
                    <td>17"</td>
                    <td>29"</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>42"</td>
                    <td>17.5"</td>
                    <td>30"</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>44"</td>
                    <td>18"</td>
                    <td>31"</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>46"</td>
                    <td>18.5"</td>
                    <td>31.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

