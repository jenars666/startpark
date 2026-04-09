'use client';

import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowRight, ChevronDown, Navigation, ExternalLink, Building2, Star } from 'lucide-react';
import { CONTACT_INFO } from '@/config/contact';
import ScrollReveal from '@/components/ScrollReveal';
import './contact.css';

/* ─────────────────────────────────────────────────
   CUSTOM MAGNETIC CURSOR
───────────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    const onEnter = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('a,button,.magnetic')) setIsHover(true);
    };
    const onLeave = () => setIsHover(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onEnter);
    window.addEventListener('mouseout', onLeave);
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onEnter);
      window.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className={`cursor-ring ${isHover ? 'cursor-ring--hover' : ''}`} />
    </>
  );
}

/* ─────────────────────────────────────────────────
   PILL CONTACT CHIP
───────────────────────────────────────────────── */
function ContactChip({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="contact-chip magnetic">
      <span className="chip-icon">{icon}</span>
      <span className="chip-body">
        <span className="chip-label">{label}</span>
        <span className="chip-value">{value}</span>
      </span>
      <ArrowRight size={16} className="chip-arrow" />
    </a>
  );
}

/* ─────────────────────────────────────────────────
   INTERACTIVE LOCATION CARD — Neighbourhood SVG Map
   Store SVG centre ≈ (248,197) in viewBox 720×480
   → CSS overlay at: left≈34%, top≈41%
───────────────────────────────────────────────── */
function InteractiveLocationCard() {
  const [pinDropped, setPinDropped] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPinDropped(true), 500);
    const t2 = setTimeout(() => setBadgeVisible(true), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_INFO.address)}`;

  return (
    <div className="loc-card">

      {/* ── MAP CANVAS ── */}
      <div className="loc-map-canvas">
        <svg className="loc-map-svg" viewBox="0 0 720 480"
          preserveAspectRatio="none" fill="none"
          xmlns="http://www.w3.org/2000/svg">

          {/* MAP PAPER */}
          <rect width="720" height="480" fill="#f2ece1"/>

          {/* ── LAND BLOCK FILLS ── */}
          <rect x="0"   y="0"   width="165" height="132" fill="#ede7d9"/>
          <rect x="180" y="0"   width="130" height="132" fill="#ede7d9"/>
          <rect x="326" y="0"   width="184" height="132" fill="#ddeef8"/>
          <rect x="524" y="0"   width="196" height="132" fill="#ede7d9"/>
          <rect x="0"   y="147" width="165" height="93"  fill="#ede7d9"/>
          <rect x="180" y="147" width="130" height="93"  fill="#ede7d9"/>
          <rect x="326" y="147" width="184" height="93"  fill="#ede7d9"/>
          <rect x="524" y="147" width="196" height="93"  fill="#ede7d9"/>
          <rect x="0"   y="256" width="165" height="121" fill="#c2e89e"/>
          <rect x="180" y="256" width="130" height="121" fill="#ede7d9"/>
          <rect x="326" y="256" width="184" height="121" fill="#ede7d9"/>
          <rect x="524" y="256" width="196" height="121" fill="#ede7d9"/>
          <rect x="0"   y="392" width="165" height="88"  fill="#ede7d9"/>
          <rect x="180" y="392" width="130" height="88"  fill="#e4f2d4"/>
          <rect x="326" y="392" width="184" height="88"  fill="#ede7d9"/>
          <rect x="524" y="392" width="196" height="88"  fill="#ede7d9"/>

          {/* ── ROAD CASINGS ── */}
          <line x1="0" y1="246" x2="720" y2="246" stroke="#c5b9a0" strokeWidth="26"/>
          <line x1="314" y1="0" x2="314" y2="480" stroke="#c5b9a0" strokeWidth="20"/>
          <line x1="0" y1="140" x2="720" y2="140" stroke="#cfc3ad" strokeWidth="14"/>
          <line x1="0" y1="384" x2="720" y2="384" stroke="#cfc3ad" strokeWidth="14"/>
          <line x1="174" y1="0" x2="174" y2="480" stroke="#cfc3ad" strokeWidth="14"/>
          <line x1="518" y1="0" x2="518" y2="480" stroke="#cfc3ad" strokeWidth="14"/>
          <line x1="0"   y1="308" x2="314" y2="308" stroke="#d4c8b2" strokeWidth="8"/>
          <line x1="418" y1="140" x2="418" y2="246" stroke="#d4c8b2" strokeWidth="8"/>
          <line x1="518" y1="312" x2="720" y2="312" stroke="#d4c8b2" strokeWidth="8"/>

          {/* ── ROADS (white) ── */}
          <line x1="0" y1="246" x2="720" y2="246" stroke="#fff" strokeWidth="20"/>
          <line x1="314" y1="0" x2="314" y2="480" stroke="#fff" strokeWidth="15"/>
          <line x1="0" y1="140" x2="720" y2="140" stroke="#fff" strokeWidth="10"/>
          <line x1="0" y1="384" x2="720" y2="384" stroke="#fff" strokeWidth="10"/>
          <line x1="174" y1="0" x2="174" y2="480" stroke="#fff" strokeWidth="10"/>
          <line x1="518" y1="0" x2="518" y2="480" stroke="#fff" strokeWidth="10"/>
          <line x1="0"   y1="308" x2="314" y2="308" stroke="#fff" strokeWidth="6"/>
          <line x1="418" y1="140" x2="418" y2="246" stroke="#fff" strokeWidth="6"/>
          <line x1="518" y1="312" x2="720" y2="312" stroke="#fff" strokeWidth="6"/>

          {/* Centre-line dashes on main E-W road */}
          {[0,72,144,216,342,414,486,558,630].map(x => (
            <line key={x} x1={x+4} y1="246" x2={x+48} y2="246"
              stroke="#e8d8c0" strokeWidth="1.5" strokeDasharray="26 14"/>
          ))}

          {/* ── ROAD LABELS ── */}
          <text x="444" y="237" fill="#a09080" fontSize="10" fontWeight="700" fontFamily="sans-serif" letterSpacing="1.2">MAIN ROAD / BAZAAR</text>
          <text x="8"   y="237" fill="#a09080" fontSize="10" fontWeight="700" fontFamily="sans-serif" letterSpacing="1.2">MAIN ROAD / BAZAAR</text>
          <text x="324" y="76"  transform="rotate(90 324 76)"  textAnchor="middle" fill="#a89880" fontSize="9" fontWeight="600" fontFamily="sans-serif">GANDHI STREET</text>
          <text x="324" y="408" transform="rotate(90 324 408)" textAnchor="middle" fill="#a89880" fontSize="9" fontWeight="600" fontFamily="sans-serif">GANDHI STREET</text>
          <text x="6"   y="134" fill="#b8a890" fontSize="8" fontFamily="sans-serif">V.O.C. ROAD</text>
          <text x="530" y="134" fill="#b8a890" fontSize="8" fontFamily="sans-serif">BIRLA NAGAR RD</text>
          <text x="6"   y="378" fill="#b8a890" fontSize="8" fontFamily="sans-serif">NEHRU STREET</text>
          <text x="184" y="134" fill="#b8a890" fontSize="8" fontFamily="sans-serif">ANNA ROAD</text>

          {/* ── MUNICIPAL PARK ── */}
          <rect x="4" y="260" width="165" height="118" rx="3" fill="#9ada78" opacity="0.48"/>
          {[[26,284],[58,300],[94,276],[128,296],[46,326],[86,340],[122,316]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r="9" fill="#60a840" opacity="0.55"/>
          ))}
          <text x="86" y="370" fill="#367020" fontSize="9" fontWeight="700" fontFamily="sans-serif" textAnchor="middle">MUNICIPAL PARK</text>

          {/* ── NEARBY LANDMARKS ── */}

          {/* BUS STAND */}
          <rect x="6" y="6" width="126" height="60" rx="6" fill="#dce8f8" stroke="#90b8e8" strokeWidth="1.5"/>
          <rect x="6" y="6" width="126" height="18" rx="6" fill="#5a8ed0"/>
          <rect x="6" y="18" width="126" height="6" fill="#5a8ed0"/>
          <text x="69" y="21" fill="#fff" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">CENTRAL BUS STAND</text>
          <text x="69" y="39" fill="#2a5890" fontSize="8" fontFamily="sans-serif" textAnchor="middle">City Bus Terminal</text>
          <text x="69" y="54" fill="#4a70a8" fontSize="7.5" fontFamily="sans-serif" textAnchor="middle">350 m north of store</text>

          {/* ST. MARY'S HIGHER SECONDARY SCHOOL */}
          <rect x="330" y="5" width="184" height="60" rx="6" fill="#fdf0e6" stroke="#daaa78" strokeWidth="1.5"/>
          <rect x="330" y="5" width="184" height="18" rx="6" fill="#c0864a"/>
          <rect x="330" y="17" width="184" height="6" fill="#c0864a"/>
          <text x="422" y="21" fill="#fff" fontSize="8.2" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">ST. MARY'S HR. SEC. SCHOOL</text>
          <text x="422" y="39" fill="#805020" fontSize="8" fontFamily="sans-serif" textAnchor="middle">Educational Institution</text>
          <text x="422" y="52" fill="#a07040" fontSize="7.5" fontFamily="sans-serif" textAnchor="middle">Large Compound</text>
          <rect x="498" y="70" width="7" height="22" rx="1" fill="#5080c0" opacity="0.85"/>
          <rect x="491" y="77" width="21" height="8"  rx="1" fill="#5080c0" opacity="0.85"/>

          {/* SBI BANK / ATM */}
          <rect x="180" y="152" width="102" height="44" rx="4" fill="#fef4c0" stroke="#ddb820" strokeWidth="1.5"/>
          <text x="231" y="171" fill="#705010" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">SBI BANK</text>
          <text x="231" y="185" fill="#906020" fontSize="7.5" fontFamily="sans-serif" textAnchor="middle">ATM · Open 24/7</text>

          {/* SRI VELLAI VINAYAGAR KOVIL */}
          <rect x="526" y="152" width="105" height="44" rx="4" fill="#fce5c4" stroke="#e09038" strokeWidth="1.5"/>
          <text x="578" y="169" fill="#8a3810" fontSize="8" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">SRI VELLAI</text>
          <text x="578" y="181" fill="#8a3810" fontSize="8" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">VINAYAGAR KOVIL</text>
          <line x1="616" y1="143" x2="616" y2="163" stroke="#c03030" strokeWidth="2.5"/>
          <polygon points="616,143 628,150 616,157" fill="#c03030"/>

          {/* SARAVANA STORES (neighbouring shop) */}
          <rect x="327" y="152" width="86" height="44" rx="4" fill="#f0e4f8" stroke="#b878d8" strokeWidth="1.5"/>
          <text x="370" y="171" fill="#602890" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">SARAVANA</text>
          <text x="370" y="185" fill="#7838a8" fontSize="7.5" fontFamily="sans-serif" textAnchor="middle">STORES</text>

          {/* HOTEL ROYAL */}
          <rect x="526" y="262" width="110" height="50" rx="4" fill="#fce8e8" stroke="#e09090" strokeWidth="1.5"/>
          <text x="581" y="281" fill="#802020" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">HOTEL ROYAL</text>
          <text x="581" y="296" fill="#a04040" fontSize="8" fontFamily="sans-serif" textAnchor="middle">Restaurant &amp; Rooms</text>
          <text x="581" y="307" fill="#c06060" fontSize="7" fontFamily="sans-serif" textAnchor="middle">AC / Non-AC Dining</text>

          {/* VEGETABLE MARKET */}
          <rect x="182" y="394" width="126" height="50" rx="4" fill="#e0f0cc" stroke="#88c050" strokeWidth="1.5"/>
          <rect x="182" y="394" width="126" height="17" rx="5" fill="#88c050"/>
          <rect x="182" y="405" width="126" height="6" fill="#88c050"/>
          <text x="245" y="408" fill="#fff" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">VEGETABLE MARKET</text>
          <text x="245" y="424" fill="#367010" fontSize="8" fontFamily="sans-serif" textAnchor="middle">Daily 6 AM – 1 PM</text>
          <text x="245" y="436" fill="#4e8020" fontSize="7.5" fontFamily="sans-serif" textAnchor="middle">400 m south of store</text>

          {/* PETROL BUNK */}
          <rect x="330" y="394" width="106" height="50" rx="4" fill="#fef0cc" stroke="#d0a030" strokeWidth="1.5"/>
          <text x="383" y="415" fill="#806018" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">PETROL BUNK</text>
          <text x="383" y="429" fill="#a08028" fontSize="7.5" fontFamily="sans-serif" textAnchor="middle">BPCL · Open 24 Hrs</text>

          {/* INTERNET CAFE */}
          <rect x="526" y="394" width="100" height="50" rx="4" fill="#e8eef8" stroke="#90a8d0" strokeWidth="1.5"/>
          <text x="576" y="415" fill="#304878" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" textAnchor="middle">SPEED NET</text>
          <text x="576" y="429" fill="#506090" fontSize="7.5" fontFamily="sans-serif" textAnchor="middle">Internet Cafe</text>

          {/* ── OUR STORE — HIGHLIGHTED ── */}
          <circle cx="248" cy="196" r="54" fill="rgba(22,163,74,0.1)"/>
          <rect x="184" y="152" width="128" height="90" rx="7"
            fill="#c6f0d6" stroke="#16a34a" strokeWidth="2.5"/>
          <rect x="184" y="152" width="128" height="22" rx="7" fill="#16a34a" opacity="0.92"/>
          <rect x="184" y="168" width="128" height="6" fill="#16a34a" opacity="0.92"/>
          <text x="248" y="169" fill="#fff" fontSize="9.5" fontWeight="900"
            fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">STAR MEN'S PARK</text>
          <text x="248" y="197" fill="#0a6028" fontSize="8.5" fontWeight="700"
            fontFamily="sans-serif" textAnchor="middle">Flagship Store</text>
          <text x="248" y="212" fill="#16a34a" fontSize="7.5"
            fontFamily="sans-serif" textAnchor="middle">Premium Menswear</text>
          <text x="248" y="229" fill="#1e8040" fontSize="7"
            fontFamily="sans-serif" textAnchor="middle">Mon–Sat · 9 AM – 9 PM</text>
          {/* Star decoration inside store */}
          <polygon points="248,176 250,182 257,182 251,186 253,193 248,189 243,193 245,186 239,182 246,182"
            fill="rgba(255,255,255,0.6)"/>

          {/* ── COMPASS ── */}
          <g transform="translate(692,454)">
            <circle cx="0" cy="0" r="21" fill="rgba(255,255,255,0.93)" stroke="#c0b098" strokeWidth="1.5"/>
            <polygon points="0,-17 -3.5,-5 3.5,-5" fill="#16a34a"/>
            <polygon points="0,17 -3.5,5 3.5,5" fill="#c0aa88"/>
            <polygon points="15,0 5,-2.5 5,2.5" fill="#c0aa88"/>
            <polygon points="-15,0 -5,-2.5 -5,2.5" fill="#c0aa88"/>
            <circle cx="0" cy="0" r="2.5" fill="#16a34a"/>
            <text x="0" y="-19" textAnchor="middle" fill="#1a4030" fontSize="7" fontWeight="800" fontFamily="sans-serif">N</text>
          </g>

          {/* ── SCALE BAR ── */}
          <g transform="translate(14,462)">
            <rect x="0" y="0" width="100" height="6" rx="1" fill="rgba(255,255,255,0.85)" stroke="#b0a080" strokeWidth="1"/>
            <rect x="0" y="0" width="50" height="6" rx="1" fill="#8a7a60"/>
            <text x="0"  y="17" fill="#8a7060" fontSize="7.5" fontFamily="sans-serif">0</text>
            <text x="42" y="17" fill="#8a7060" fontSize="7.5" fontFamily="sans-serif">250m</text>
            <text x="88" y="17" fill="#8a7060" fontSize="7.5" fontFamily="sans-serif">500m</text>
          </g>
        </svg>

        {/* ── ANIMATED PIN (store at ~34% x, ~41% y) ── */}
        <div className={`loc-pin-wrap loc-pin-wrap--store ${pinDropped ? 'loc-pin--dropped' : ''}`}>
          <div className="loc-pin-shadow"/>
          <div className="loc-pin">
            <Star size={14} fill="#fff" stroke="none"/>
          </div>
        </div>

        {/* Radar ripples centered on store */}
        <div className={`loc-radar loc-radar--store ${pinDropped ? 'loc-radar--active' : ''}`}>
          <span className="loc-ripple loc-ripple--1"/>
          <span className="loc-ripple loc-ripple--2"/>
          <span className="loc-ripple loc-ripple--3"/>
        </div>

        {/* "You are here" floating badge */}
        <div className={`loc-badge loc-badge--name loc-badge--store-name ${badgeVisible ? 'loc-badge--visible' : ''}`}>
          <Building2 size={12}/>
          <span>Star Men&apos;s Park ★</span>
        </div>
      </div>

      {/* ── RIGHT: INFO PANEL ── */}
      <div className="loc-info">
        <div className="loc-info-eyebrow">
          <span className="loc-pulse"/>
          <span>Open Now</span>
        </div>

        <h3 className="loc-info-title">Star Men&apos;s Park</h3>
        <p className="loc-info-addr">{CONTACT_INFO.address}</p>

        <div className="loc-info-stats">
          <div className="loc-stat">
            <span className="loc-stat-val">9AM</span>
            <span className="loc-stat-lbl">Opens</span>
          </div>
          <div className="loc-stat-divider"/>
          <div className="loc-stat">
            <span className="loc-stat-val">9PM</span>
            <span className="loc-stat-lbl">Closes</span>
          </div>
          <div className="loc-stat-divider"/>
          <div className="loc-stat">
            <span className="loc-stat-val">Mon-Sat</span>
            <span className="loc-stat-lbl">Week</span>
          </div>
        </div>
        {/* Sunday hours info box */}
        <div className="loc-info-stats" style={{ marginTop: '10px', background: '#f7fafd', borderRadius: '10px', padding: '10px 0', display: 'flex', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
          <div className="loc-stat">
            <span className="loc-stat-val">9:30</span>
            <span className="loc-stat-lbl">Opens</span>
          </div>
          <div className="loc-stat-divider"/>
          <div className="loc-stat">
            <span className="loc-stat-val">9:30</span>
            <span className="loc-stat-lbl">Closes</span>
          </div>
          <div className="loc-stat-divider"/>
          <div className="loc-stat">
            <span className="loc-stat-val">Sun</span>
            <span className="loc-stat-lbl">Day</span>
          </div>
        </div>

        <div className="loc-info-coords">
          <MapPin size={13}/>
          <span>Dindigul, Tamil Nadu, India</span>
        </div>

        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="loc-cta magnetic">
          <Navigation size={16}/>
          <span>Get Directions</span>
          <ExternalLink size={13} className="loc-cta-ext"/>
        </a>

        <a href={`tel:${CONTACT_INFO.phone}`} className="loc-secondary magnetic">
          <Phone size={14}/>
          <span>Call the Store</span>
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   FAQ ROW
───────────────────────────────────────────────── */
function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-row ${open ? 'faq-open' : ''}`}>
      <button className="faq-trigger magnetic" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <ChevronDown size={18} className="faq-chevron" />
      </button>
      <div className="faq-body">
        <p>{a}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   PAGE EXPORT
───────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <>
      <CustomCursor />

      <main className="cp-root">
        {/* ── BACKGROUND ── */}
        <div className="cp-bg-layer" aria-hidden="true">
          <div className="cp-bg-noise" />
          <div className="cp-bg-grad-a" />
          <div className="cp-bg-grad-b" />
          <div className="cp-bg-lines" />
        </div>

        {/* ── HERO ── */}
        <section className="cp-hero">
          <ScrollReveal direction="up" delay={0}>
            <div className="cp-hero-eyebrow">
              <span className="eyebrow-dot" />
              <span>Support &amp; Operations</span>
            </div>
            <h1 className="cp-hero-h1">
              Talk to us.<br />
              <em>We ship fast.</em>
            </h1>
            <p className="cp-hero-sub">
              Premium menswear, concierge-level service. Reach our product team for orders, styling, and enterprise inquiries — we respond in under 2 hours.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.15}>
            <div className="chip-grid">
              <ContactChip icon={<MessageSquare size={18} />} label="WhatsApp VIP" value="Chat with a Stylist" href={`https://wa.me/${CONTACT_INFO.whatsapp}`} />
              <ContactChip icon={<Phone size={18} />} label="Contact No" value={CONTACT_INFO.phone} href={`tel:${CONTACT_INFO.phone}`} />
              <ContactChip icon={<Mail size={18} />} label="Email" value={CONTACT_INFO.email} href={`mailto:${CONTACT_INFO.email}`} />
              <ContactChip icon={<Clock size={18} />} label="Hours" value="Everyday 9AM–9PM" href="#faq" />
            </div>
          </ScrollReveal>
        </section>

        {/* ── MAIN GRID ── */}
        <section className="cp-grid-section">
          <ScrollReveal direction="up" delay={0.05}>
            <div className="cp-main-grid">

              {/* CONTACT FORM */}
              <div className="cp-panel cp-panel--form">
                <div className="cp-panel-label">Send a Message</div>
                <h2 className="cp-panel-title">Direct Line</h2>
                <p className="cp-panel-sub">Fill in your details and we'll route your inquiry to the right team immediately.</p>

                <form className="cp-form" onSubmit={e => e.preventDefault()}>
                  <div className="cp-field-row">
                    <div className="cp-field">
                      <label className="cp-label">Name</label>
                      <input className="cp-input" type="text" placeholder="Your full name" />
                    </div>
                    <div className="cp-field">
                      <label className="cp-label">Email</label>
                      <input className="cp-input" type="email" placeholder="you@company.com" />
                    </div>
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Phone</label>
                    <input className="cp-input" type="tel" placeholder="+91 00000 00000" />
                  </div>
                  <div className="cp-field">
                    <label className="cp-label" htmlFor="inquiry-subject">Subject</label>
                    <select id="inquiry-subject" className="cp-input cp-select" title="Subject">
                      <option value="">Select inquiry type</option>
                      <option>Product Inquiry</option>
                      <option>Custom / Bulk Order</option>
                      <option>Shipping &amp; Tracking</option>
                      <option>Return &amp; Exchange</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Message</label>
                    <textarea className="cp-input cp-textarea" rows={4} placeholder="How can we help you today?" />
                  </div>
                  <button type="submit" className="cp-submit magnetic">
                    <span>Send Message</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>

              {/* RIGHT COLUMN */}
              <div className="cp-right-col">
                {/* Status Card */}
                <div className="cp-panel cp-panel--status">
                  <div className="cp-panel-label">Live Status</div>
                  <div className="status-rows">
                    <div className="status-row">
                      <span className="status-indicator green" />
                      <span className="status-name">WhatsApp Support</span>
                      <span className="status-val">Online</span>
                    </div>
                    <div className="status-row">
                      <span className="status-indicator green" />
                      <span className="status-name">Phone Contact`</span>
                      <span className="status-val">Available</span>
                    </div>
                    <div className="status-row">
                      <span className="status-indicator yellow" />
                      <span className="status-name">Email Queue</span>
                      <span className="status-val">&lt; 2 hrs</span>
                    </div>
                    <div className="status-row">
                      <span className="status-indicator green" />
                      <span className="status-name">Order Operations</span>
                      <span className="status-val">Active</span>
                    </div>
                  </div>
                </div>

                {/* Hours Card */}
                <div className="cp-panel cp-panel--hours">
                  <div className="cp-panel-label">Operating Hours</div>
                  <div className="hours-grid">
                    <div className="hours-row">
                      <span>Monday – Saturday</span>
                      <span className="hours-time">9:00 AM – 9:00 PM</span>
                    </div>
                    <div className="hours-divider" />
                    <div className="hours-row">
                      <span>Sunday</span>
                      <span className="hours-time">9:30 AM – 9:30 PM</span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cp-panel cp-panel--cta magnetic"
                >
                  <div className="cta-icon-wrap">
                    <MessageSquare size={28} />
                  </div>
                  <div className="cta-body">
                    <strong>Chat on WhatsApp</strong>
                    <span>Instant access to our styling advisory team.</span>
                  </div>
                  <ArrowRight size={20} className="cta-arrow" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ── LOCATION SECTION ── */}
        <section className="cp-map-section">
          <ScrollReveal direction="up" delay={0.05}>
            <div className="cp-map-header">
              <div className="cp-panel-label">Flagship Store</div>
              <h2 className="cp-section-title">Find Us</h2>
              <p className="cp-section-sub">Visit us in-store for the full premium experience.</p>
            </div>
            <InteractiveLocationCard />
          </ScrollReveal>
        </section>

        {/* ── FAQ SECTION ── */}
        <section className="cp-faq-section" id="faq">
          <ScrollReveal direction="up" delay={0.05}>
            <div className="cp-faq-layout">
              <div className="cp-faq-left">
                <div className="cp-panel-label">FAQ</div>
                <h2 className="cp-section-title">Common Questions</h2>
              </div>
              <div className="cp-faq-right">
                <FaqRow
                  q="How quickly do you respond to inquiries?"
                  a="We guarantee a response within 2 hours during business hours. WhatsApp replies are typically instantaneous during operational windows."
                />
                <FaqRow
                  q="Can I request custom or bulk group orders?"
                  a="Yes — corporate orders, wedding groups, and event bulk purchases are handled by our dedicated enterprise operations team. Use the contact form above and select 'Custom / Bulk Order'."
                />
                <FaqRow
                  q="What is your return and exchange policy?"
                  a="We offer hassle-free returns and exchanges within 7 days of delivery for all unworn, tagged products. Contact us to initiate the process."
                />
                <FaqRow
                  q="Do you offer VIP styling consultations?"
                  a="Absolutely. Our WhatsApp concierge line provides one-on-one virtual styling sessions with our product experts at no additional cost."
                />
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </>
  );
}
