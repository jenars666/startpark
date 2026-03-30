import { NextResponse } from 'next/server';

type CheckoutItem = {
  id: string | number;
  name: string;
  price: string | number;
  quantity: number;
};

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parsePrice(value: string | number) {
  if (typeof value === 'number') {
    return value;
  }

  return Number(value.replace(/,/g, '').replace(/[^0-9.]/g, '')) || 0;
}

function buildReceipt() {
  return `star_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`.slice(0, 40);
}

export async function POST(request: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: 'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const items = Array.isArray(body?.items) ? (body.items as CheckoutItem[]) : [];

    if (items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    const totalAmount = items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      return sum + parsePrice(item.price) * quantity;
    }, 0);

    if (totalAmount <= 0) {
      return NextResponse.json({ error: 'Unable to create a payment for zero amount.' }, { status: 400 });
    }

    const amountInPaise = Math.round(totalAmount * 100);
    const receipt = buildReceipt();
    const itemSummary = items
      .map((item) => `${item.name} x${item.quantity}`)
      .join(', ')
      .slice(0, 240);

    const authorization = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authorization}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          source: 'star_web_cart',
          item_count: String(items.length),
          items: itemSummary,
        },
      }),
      cache: 'no-store',
    });

    if (!razorpayResponse.ok) {
      const errorText = await razorpayResponse.text();
      console.error('Razorpay order creation failed:', errorText);

      return NextResponse.json(
        { error: 'Could not start checkout right now. Please try again.' },
        { status: 502 }
      );
    }

    const order = await razorpayResponse.json();

    return NextResponse.json({
      keyId,
      order,
      amount: totalAmount,
      currency: 'INR',
    });
  } catch (error) {
    console.error('Checkout order route failed:', error);

    return NextResponse.json(
      { error: 'Something went wrong while preparing your payment.' },
      { status: 500 }
    );
  }
}
