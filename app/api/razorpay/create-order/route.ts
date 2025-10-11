import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    console.log('=== RAZORPAY ORDER CREATION DEBUG ===');
    console.log('Request body:', { amount, currency, receipt });
    console.log('Environment variables:');
    console.log('NEXT_PUBLIC_RAZORPAY_KEY_ID:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
    console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '[PRESENT]' : '[MISSING]');

    // Validate required fields
    if (!amount || amount <= 0) {
      console.log('Invalid amount:', amount);
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay environment variables');
      return NextResponse.json({ error: 'Razorpay configuration missing' }, { status: 500 });
    }

    // Import and initialize Razorpay
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    console.log('Razorpay instance created successfully');

    // Create order data
    const orderData = {
      amount: Math.round(Number(amount) * 100), // ensure it's a number and convert to paise
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    console.log('Order data to send to Razorpay:', orderData);

    // Create the order
    const order = await razorpay.orders.create(orderData);
    console.log('Razorpay order created:', order);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      status: order.status,
    });

  } catch (error: any) {
    console.error('=== RAZORPAY ORDER CREATION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);

    return NextResponse.json(
      { 
        error: 'Failed to create Razorpay order', 
        details: error.message,
        type: error.constructor.name 
      },
      { status: 500 }
    );
  }
}