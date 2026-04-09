'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Chrome } from 'lucide-react';
import { CONTACT_INFO } from '@/config/contact';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        
        {/* Brand / About */}
        <div className="footer-col brand-col">
          <Link href="/home">
            <Image 
              src="/images/logo.png" 
              alt="Star Mens Park Logo" 
              width={350}
              height={120}
              priority
              quality={100}
              unoptimized
              className="footer-logo-img"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <p className="footer-desc">
            We offer a wide range of <strong>premium readymade garments</strong> designed with comfort, quality, and style in mind. Our collection includes <strong>exclusive group shirts</strong>, <strong>branded shirts</strong>, <strong>ethnic wear</strong>, <strong>casual shirts</strong> and <strong>traditional</strong> styles perfect for everyday wear and festive occasions.
          </p>
          <p className="footer-desc">
            Known as the finest in Dindigul Bazaar, we specialize in bulk orders featuring flawlessly fitting <strong>sizes from 22 to 5XL</strong>. Explore our unmatched collections of <strong>festival shirts</strong>, <strong>vesti combos</strong>, <strong>formal trousers</strong>, and <strong>party wear</strong> tailored for the modern Dindigul man.
          </p>
        </div>
        
        {/* Our Stores */}
        <div className="footer-col links-col mt-responsive">
          <h3 className="footer-heading">Delivery Network</h3>
          <ul>
            <li><a href="#">Dindigul (Main Store)</a></li>
            <li><a href="#">Karur</a></li>
            <li><a href="#">Madurai</a></li>
            <li><a href="#">Tiruchirappalli</a></li>
            <li><a href="#">Namakkal</a></li>
            <li><a href="#">Erode</a></li>
          </ul>
        </div>
        
        {/* Quick Links */}
        <div className="footer-col links-col mt-responsive">
          <h3 className="footer-heading">Quick Links</h3>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Return & Refund Policy</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Terms and Conditions</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>

        {/* Help & Support */}
        <div className="footer-col support-col mt-responsive">
          <h3 className="footer-heading">Help & Support</h3>
          <ul className="support-list">
            <li>
              <MapPin size={16} className="support-icon" />
              <span>{CONTACT_INFO.address}</span>
            </li>
            <li>
              <Phone size={16} className="support-icon" />
              <a href={`tel:${CONTACT_INFO.phone}`}>{CONTACT_INFO.phone}</a>
            </li>
            <li>
              <Mail size={16} className="support-icon" />
              <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
            </li>
          </ul>
        </div>

      </div>
      
      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container bottom-content">
          <div className="social-circles">
            <a href={CONTACT_INFO.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
            <a href={CONTACT_INFO.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={16} /></a>
            <a href={CONTACT_INFO.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="Youtube"><Youtube size={16} /></a>
          </div>
          
          <div className="copyright">
            © 2026 Star Mens Park
          </div>
          
          <div className="payment-icons">
            <span className="pay-badge upi">UPI</span>
            <span className="pay-badge paytm">Paytm</span>
            <span className="pay-badge gpay">GPay</span>
            <span className="pay-badge phonepe">पे</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
