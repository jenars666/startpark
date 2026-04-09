import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    uid,
    items,
    totalAmount,
    billing,
    paymentMethod,
  } = await req.json();

  if (!uid || !items || !totalAmount || !billing) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // COD — skip signature verification
  if (paymentMethod !== 'COD') {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
    }

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }
  }

  if (!db) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
  }

  const orderId = `ORD-${Date.now()}`;
  const orderNumber = `SMP-${orderId.slice(-6).toUpperCase()}`;

  // Normalise items — ensure price is a number
  const normalisedItems = (items as Array<{ id: string | number; name: string; price: string | number; img: string; quantity: number }>).map((item) => ({
    id: item.id,
    name: item.name,
    price: typeof item.price === 'string'
      ? Number(item.price.replace(/,/g, '').replace(/[^0-9.]/g, '')) || 0
      : item.price,
    img: item.img,
    quantity: item.quantity,
    category: 'Shirt',
  }));

  const subtotal = normalisedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = typeof totalAmount === 'number' ? totalAmount : subtotal;

  // Map billing → customer + shippingAddress (matches Order type)
  const customer = {
    fullName: `${billing.firstName || ''} ${billing.lastName || ''}`.trim(),
    email:    billing.email    || '',
    phone:    billing.phone    || '',
  };

  const shippingAddress = {
    addressLine1: billing.address  || '',
    addressLine2: '',
    city:         billing.city     || '',
    state:        billing.state    || '',
    pincode:      billing.pincode  || '',
  };

  const orderDoc = {
    orderId,
    orderNumber,
    userId:            uid,
    items:             normalisedItems,
    itemCount:         normalisedItems.reduce((sum, i) => sum + i.quantity, 0),
    subtotal,
    total,
    status:            'pending',
    paymentStatus:     paymentMethod === 'COD' ? 'pending' : 'completed',
    paymentMethod:     paymentMethod === 'COD' ? 'cash_on_delivery' : 'razorpay',
    razorpayOrderId:   razorpay_order_id   || null,
    razorpayPaymentId: razorpay_payment_id || null,
    customer,
    shippingAddress,
    notes:             billing.notes || '',
    discountCode:      '',
    discountAmount:    0,
    createdAt:         serverTimestamp(),
    updatedAt:         serverTimestamp(),
  };

  // Save to both collections (matches getUserOrder lookup)
  await Promise.all([
    setDoc(doc(db, 'orders', orderId), orderDoc),
    setDoc(doc(db, 'users', uid, 'orders', orderId), orderDoc),
    setDoc(doc(db, 'carts', uid), { userId: uid, items: [], updatedAt: serverTimestamp() }),
  ]);

  return NextResponse.json({ success: true, orderId });
}
