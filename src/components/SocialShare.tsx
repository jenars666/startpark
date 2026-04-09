'use client';

import { Instagram, Facebook, Youtube, Share2 } from 'lucide-react';
import { CONTACT_INFO } from '@/config/contact';
import './SocialShare.css';

interface SocialShareProps {
  url?: string;
  title?: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check out Star Mens Park';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <div className="social-share">
      <div className="social-links">
        <a 
          href={CONTACT_INFO.social.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-btn instagram"
          aria-label="Instagram"
        >
          <Instagram size={20} />
        </a>
        
        <a 
          href={CONTACT_INFO.social.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-btn facebook"
          aria-label="Facebook"
        >
          <Facebook size={20} />
        </a>
        
        <a 
          href={CONTACT_INFO.social.youtube} 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-btn youtube"
          aria-label="YouTube"
        >
          <Youtube size={20} />
        </a>

        <button 
          onClick={handleShare}
          className="social-btn share"
          aria-label="Share"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}
