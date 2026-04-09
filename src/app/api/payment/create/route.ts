import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { amount, orderId } = await req.json();

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  const order = await razorpay.orders.create({
    amount:   Math.round(amount * 100), // convert to paise
    currency: 'INR',
    receipt:  orderId,
  });

  return NextResponse.json({ razorpayOrderId: order.id });
}
