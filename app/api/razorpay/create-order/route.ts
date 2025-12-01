import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Ensure Node.js runtime for Razorpay compatibility
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    try {
      console.log("ENV", {
        id: process.env.RAZORPAY_KEY_ID,
        secret: process.env.RAZORPAY_KEY_SECRET,
      });

      console.log("BODY", body);
    } catch (e) {
      console.log("ERROR in logging", e);
    }

    console.log('=== RAZORPAY ORDER CREATION DEBUG ===');
    console.log('Request body:', { amount, currency, receipt });
    console.log('Environment variables:');
    console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
    console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET ? '[PRESENT]' : '[MISSING]');

    // Validate required fields
    if (!amount || amount <= 0) {
      console.log('Invalid amount:', amount);
      return NextResponse.json({ error: 'Valid amount is required' }, { status: 400 });
    }

    // Validate environment variables
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay environment variables');
      return NextResponse.json({ error: 'Razorpay configuration missing' }, { status: 500 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
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
    console.error('Error type:', error?.constructor?.name || 'Unknown');
    console.error('Error message:', error?.message || 'No message');
    console.error('Error code:', error?.code || 'No code');
    console.error('Error status:', error?.status || 'No status');
    console.error('Full error object:', JSON.stringify(error, null, 2));

    // Handle specific Razorpay errors
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { 
          error: 'Network error connecting to Razorpay', 
          details: 'Please check your internet connection and try again',
          code: error.code
        },
        { status: 503 }
      );
    }

    if (error?.status === 400 || error?.status === 401) {
      return NextResponse.json(
        { 
          error: 'Razorpay authentication error', 
          details: 'Please check your Razorpay credentials',
          status: error.status
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to create Razorpay order', 
        details: error?.message || 'Unknown error occurred',
        type: error?.constructor?.name || 'Unknown',
        code: error?.code
      },
      { status: 500 }
    );
  }
}