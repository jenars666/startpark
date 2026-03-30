import crypto from 'node:crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function safeEqual(a: string, b: string) {
  const first = Buffer.from(a, 'utf8');
  const second = Buffer.from(b, 'utf8');

  if (first.length !== second.length) {
    return false;
  }

  return crypto.timingSafeEqual(first, second);
}

export async function POST(request: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return NextResponse.json(
      { error: 'Razorpay verification is not configured. Add RAZORPAY_KEY_SECRET.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const orderId = String(body?.orderId || '');
    const razorpayOrderId = String(body?.razorpay_order_id || '');
    const paymentId = String(body?.razorpay_payment_id || '');
    const signature = String(body?.razorpay_signature || '');

    if (!orderId || !razorpayOrderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Incomplete payment verification payload.' }, { status: 400 });
    }

    if (orderId !== razorpayOrderId) {
      return NextResponse.json({ error: 'Payment order mismatch.' }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const verified = safeEqual(expectedSignature, signature);

    if (!verified) {
      return NextResponse.json({ error: 'Payment signature verification failed.' }, { status: 400 });
    }

    return NextResponse.json({
      verified: true,
      paymentId,
      orderId,
    });
  } catch (error) {
    console.error('Checkout verification route failed:', error);

    return NextResponse.json(
      { error: 'Something went wrong while verifying your payment.' },
      { status: 500 }
    );
  }
}
