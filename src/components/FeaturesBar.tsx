'use client';

import { Truck, RefreshCw, ShieldCheck, HeadphonesIcon } from 'lucide-react';
import './FeaturesBar.css';

export default function FeaturesBar() {
  const features = [
    { icon: <Truck size={28} />, title: "Free Shipping", subtitle: "On orders above ₹999" },
    { icon: <RefreshCw size={28} />, title: "7-Day Returns", subtitle: "Easy return policy" },
    { icon: <ShieldCheck size={28} />, title: "100% Secure", subtitle: "Verified UPI Payments" },
    { icon: <HeadphonesIcon size={28} />, title: "24/7 Support", subtitle: "WhatsApp Assistance" },
  ];

  return (
    <div className="features-bar-wrapper">
      <div className="container">
        <div className="features-grid">
          {features.map((item, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon">{item.icon}</div>
              <div className="feature-text">
                <h4>{item.title}</h4>
                <p>{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
