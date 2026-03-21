'use client';

import { MessageCircle } from 'lucide-react';
import './WhatsAppFloating.css';
import { generateWhatsAppLink } from '../utils/checkoutUtils';

export default function WhatsAppFloating() {
  const handleClick = () => {
    window.open(generateWhatsAppLink('General Inquiry from Website', 1, 'M'), "_blank");
  };

  return (
    <button 
      className="whatsapp-float-btn"
      onClick={handleClick}
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="whatsapp-tooltip">Chat with us</span>
    </button>
  );
}
