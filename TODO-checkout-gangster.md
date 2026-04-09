# Gangster-Style Checkout Enhancement ✅ APPROVED

## Plan Summary
- Add promo code input + discount logic
- Extract inline styles to page.module.css (glassmorphism, gradients, hovers)
- Add framer-motion animations (stagger, lift, shimmer)
- Enhance payments (UPI badges, secure indicators)
- Product images in summary, better mobile resp.

## Steps
- [x] 1. Create TODO-checkout-gangster.md (this file)

- [ ] 2. Create src/app/checkout/page.module.css w/ gangster-style dark glassmorphism

- [ ] 3. Create src/components/CheckoutPromo.tsx (promo input)

- [ ] 4. Update src/app/checkout/page.tsx:
  - Import CSS, Promo component
  - Add promo state/discount calc
  - motion.div wrappers (Hero shimmer, form stagger)
  - Product images in summary (from cart)
  - Gradient CTA (#7c3aed-#3b82f6)
  - UPI/COD badges polish

- [ ] 5. Update Navbar.tsx to link /checkout prominently

- [ ] 6. Test: npm run dev && open http://localhost:3000/checkout
  - Form validation, promo apply, Razorpay flow
  - Mobile resp, hovers

- [ ] 7. Mark complete, update TODO-checkout-ui.md
