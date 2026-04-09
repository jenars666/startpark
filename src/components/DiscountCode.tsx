'use client';

import { useState } from 'react';
import { Tag, Check, X } from 'lucide-react';
import './DiscountCode.css';

interface DiscountCodeProps {
  onApply: (code: string, discount: number) => void;
}

const DISCOUNT_CODES = {
  'WELCOME10': { discount: 10, type: 'percentage', minAmount: 500 },
  'SAVE20': { discount: 20, type: 'percentage', minAmount: 1000 },
  'FLAT100': { discount: 100, type: 'fixed', minAmount: 1500 },
  'FIRST50': { discount: 50, type: 'fixed', minAmount: 0 }
};

export default function DiscountCode({ onApply }: DiscountCodeProps) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  const handleApply = () => {
    const upperCode = code.toUpperCase();
    const discount = DISCOUNT_CODES[upperCode as keyof typeof DISCOUNT_CODES];
    
    if (discount) {
      const discountAmount = discount.type === 'percentage' 
        ? discount.discount 
        : discount.discount;
      onApply(upperCode, discountAmount);
      setApplied(true);
      setError('');
    } else {
      setError('Invalid discount code');
      setApplied(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setApplied(false);
    setError('');
    onApply('', 0);
  };

  return (
    <div className="discount-code">
      <div className="discount-input-group">
        <Tag size={20} />
        <input
          type="text"
          placeholder="Enter discount code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          disabled={applied}
        />
        {applied ? (
          <button onClick={handleRemove} className="remove-btn">
            <X size={18} />
          </button>
        ) : (
          <button onClick={handleApply} className="apply-btn">
            Apply
          </button>
        )}
      </div>

      {applied && (
        <div className="success-message">
          <Check size={16} />
          <span>Discount code applied successfully!</span>
        </div>
      )}

      {error && (
        <div className="error-message">
          <X size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="available-codes">
        <p className="codes-title">Available Codes:</p>
        <div className="codes-list">
          <div className="code-item">
            <strong>WELCOME10</strong> - 10% off on orders above ₹500
          </div>
          <div className="code-item">
            <strong>SAVE20</strong> - 20% off on orders above ₹1000
          </div>
          <div className="code-item">
            <strong>FLAT100</strong> - ₹100 off on orders above ₹1500
          </div>
          <div className="code-item">
            <strong>FIRST50</strong> - ₹50 off on first order
          </div>
        </div>
      </div>
    </div>
  );
}
