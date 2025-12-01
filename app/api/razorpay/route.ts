import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Ensure Node.js runtime for Razorpay compatibility
export const runtime = 'nodejs';

export async function POST(request: Request) {
const body = await request.json();
const amount = body.amount;

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Missing Razorpay environment variables');
  return NextResponse.json({ error: 'Razorpay configuration missing' }, { status: 500 });
}

// Validate amount
if (!amount || amount <= 0) {
  return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
}

const razorpay = new Razorpay({
key_id: process.env.RAZORPAY_KEY_ID,
key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const options = {
amount: Math.round(Number(amount) * 100), // ensure it's a number and convert to paise
currency: 'INR',
receipt: 'receipt_order_' + Date.now(),
};

try {
const order = await razorpay.orders.create(options);
return NextResponse.json(order);
} catch (err: any) {
console.error('Razorpay order creation error:', err);
return NextResponse.json({ 
  error: 'Order creation failed', 
  details: err?.message || 'Unknown error',
  code: err?.code 
}, { status: 500 });
}
}