'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import styles from '../app/checkout/page.module.css'; // Reuse input styles

interface CheckoutPromoProps {
  onDiscountChange: (discount: number) => void;
  className?: string;
}

export default function CheckoutPromo({ onDiscountChange, className = '' }: CheckoutPromoProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const handleApply = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      // Simulate API call - replace with real /api/promo/verify
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const validCodes = {
        'WELCOME10': 0.1,
        'STAR20': 0.2,
        'FIRSTORDER15': 0.15,
        'DINDIGUL5': 0.05,
      };

      const discountRate = validCodes[code.toUpperCase() as keyof typeof validCodes];
      
      if (discountRate) {
        const amount = discountRate * 100; // e.g., 10%
        setDiscount(amount);
        onDiscountChange(amount);
        setApplied(true);
        toast.success(`₹${amount.toFixed(0)} discount applied! 🎉`);
      } else {
        toast.error('Invalid promo code. Try WELCOME10 or STAR20.');
      }
    } catch {
      toast.error('Promo validation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setDiscount(0);
    setApplied(false);
    onDiscountChange(0);
    toast.success('Discount removed.');
  };

  return (
    <motion.div 
      className={`${styles.promoSection} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          💎 Got a Promo Code?
        </h3>
        {applied && (
          <motion.button
            onClick={handleRemove}
            className={`${styles.promoButton} bg-red-500 hover:bg-red-600 text-sm`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Remove
          </motion.button>
        )}
      </div>
      
      <div className="flex gap-2">
        <input
          className={styles.promoInput}
          placeholder="Enter promo code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        <motion.button
          className={styles.promoButton}
          onClick={handleApply}
          disabled={!code.trim() || loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? '...' : 'Apply'}
        </motion.button>
      </div>

      {applied && discount > 0 && (
        <motion.p 
          className="text-green-400 font-bold text-sm mt-3 flex items-center gap-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          ✅ ₹{discount.toFixed(0)} OFF applied!
        </motion.p>
      )}
    </motion.div>
  );
}
