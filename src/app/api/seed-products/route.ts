import { NextResponse } from 'next/server';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const products = [
  // Casual Shirts - New Updated
  { name: 'Premium Cotton Casual Shirt', price: '1,299', oldPrice: '1,999', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.21 PM.jpeg', tag: 'Bestseller', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Stylish Check Casual Shirt', price: '1,199', oldPrice: '1,799', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.22 PM (1).jpeg', tag: 'New', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Classic Casual Shirt', price: '1,099', oldPrice: '1,699', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.22 PM.jpeg', tag: '', color: 'Blue', category: 'Casual Shirt' },
  { name: 'Modern Fit Casual Shirt', price: '1,249', oldPrice: '1,849', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.23 PM.jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Trendy Casual Shirt', price: '1,149', oldPrice: '1,749', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.24 PM (1).jpeg', tag: 'Sale', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Comfort Fit Casual Shirt', price: '1,299', oldPrice: '1,899', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.24 PM.jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Designer Casual Shirt', price: '1,399', oldPrice: '1,999', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.25 PM.jpeg', tag: 'Premium', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Smart Casual Shirt', price: '1,199', oldPrice: '1,799', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.26 PM (1).jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Elegant Casual Shirt', price: '1,249', oldPrice: '1,849', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.26 PM.jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Relaxed Casual Shirt', price: '1,099', oldPrice: '1,699', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.28 PM (1).jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Urban Casual Shirt', price: '1,349', oldPrice: '1,949', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.28 PM (2).jpeg', tag: 'New', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Contemporary Casual Shirt', price: '1,199', oldPrice: '1,799', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.28 PM.jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Versatile Casual Shirt', price: '1,299', oldPrice: '1,899', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.29 PM.jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Everyday Casual Shirt', price: '1,149', oldPrice: '1,749', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.35 PM.jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Weekend Casual Shirt', price: '1,249', oldPrice: '1,849', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.36 PM (1).jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Casual Cotton Shirt', price: '1,199', oldPrice: '1,799', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.36 PM.jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Printed Casual Shirt', price: '1,299', oldPrice: '1,899', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.37 PM (1).jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Striped Casual Shirt', price: '1,149', oldPrice: '1,749', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.37 PM.jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Checked Casual Shirt', price: '1,249', oldPrice: '1,849', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.38 PM (1).jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  { name: 'Solid Casual Shirt', price: '1,099', oldPrice: '1,699', img: '/images/casual/new updated/WhatsApp Image 2026-04-02 at 1.33.38 PM.jpeg', tag: '', color: 'Multi', category: 'Casual Shirt' },
  
  // Formal Shirts
  { name: 'OFFICE READY LIGHT GREY SHIRT', price: '1,599', oldPrice: '2,299', img: '/images/formal paline/WhatsApp Image 2026-03-25 at 9.13.25 PM (1).jpeg', tag: 'Premium', color: 'Grey', category: 'Formal Shirt' },
  { name: 'ELEGANT NAVY FORMAL SHIRT', price: '1,799', oldPrice: '2,499', img: '/images/formal paline/WhatsApp Image 2026-03-25 at 9.13.25 PM.jpeg', tag: 'Bestseller', color: 'Navy', category: 'Formal Shirt' },
  { name: 'STRUCTURED FORMAL BLACK SHIRT', price: '1,699', oldPrice: '2,399', img: '/images/formal paline/WhatsApp Image 2026-03-29 at 9.43.22 PM.jpeg', tag: '', color: 'Black', category: 'Formal Shirt' },
  { name: 'SLIM FIT FORMAL BLUE SHIRT', price: '1,499', oldPrice: '2,199', img: '/images/formal paline/WhatsApp Image 2026-03-29 at 9.43.23 PM (1).jpeg', tag: 'New', color: 'Blue', category: 'Formal Shirt' },
  { name: 'CLASSIC FORMAL WHITE SHIRT', price: '1,399', oldPrice: '1,999', img: '/images/formal paline/WhatsApp Image 2026-03-29 at 9.43.23 PM.jpeg', tag: '', color: 'White', category: 'Formal Shirt' },
];

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Firebase not initialized' }, { status: 500 });
    }

    const productsRef = collection(db, 'products');
    
    for (const product of products) {
      await addDoc(productsRef, product);
    }

    return NextResponse.json({ 
      success: true, 
      message: `${products.length} products seeded successfully` 
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed products' }, { status: 500 });
  }
}
