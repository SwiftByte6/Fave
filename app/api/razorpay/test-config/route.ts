import { NextResponse } from 'next/server';

// Ensure Node.js runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    const config: any = {
      hasKeyId: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      keyIdLength: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.length || 0,
      keySecretLength: process.env.RAZORPAY_KEY_SECRET?.length || 0,
      keyIdPrefix: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.substring(0, 8) || 'N/A',
      nodeVersion: process.version,
      platform: process.platform,
      runtime: 'nodejs'
    };

    // Test Razorpay import
    try {
      const Razorpay = require('razorpay');
      config.razorpayImportSuccess = true;
      
      // Try to create instance
      if (config.hasKeyId && config.hasKeySecret) {
        new Razorpay({
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        config.razorpayInstanceSuccess = true;
      } else {
        config.razorpayInstanceSuccess = false;
        config.missingCredentials = true;
      }
    } catch (error: any) {
      config.razorpayImportSuccess = false;
      config.razorpayError = error.message;
    }

    return NextResponse.json(config);
  } catch (error: any) {
    return NextResponse.json({
      error: 'Configuration test failed',
      details: error.message
    }, { status: 500 });
  }
}