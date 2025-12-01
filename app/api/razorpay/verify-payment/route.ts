import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { sendOrderConfirmationEmail } from '../../../lib/email-service'

// Ensure Node.js runtime for crypto and external API calls
export const runtime = 'nodejs';

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase configuration:', { 
      hasUrl: !!supabaseUrl, 
      hasServiceKey: !!serviceKey 
    })
    throw new Error('Supabase not configured')
  }

  return createClient(supabaseUrl, serviceKey)
}

export async function POST(request: Request) {
  try {
    console.log('=== Payment Verification Started ===')
    
    // Check environment variables first
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('RAZORPAY_KEY_SECRET is not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    const supabaseAdmin = getSupabaseAdmin()
    
    const { userId } = await auth()
    console.log('User ID:', userId)
    
    if (!userId) {
      console.error('No user ID found in auth')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await request.json()
    console.log('Request body:', requestBody)
    
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = requestBody

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      console.error('Missing required fields:', { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id })
      return NextResponse.json({ error: 'Missing payment verification data' }, { status: 400 })
    }

    // Recompute signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    console.log('Signature verification body:', body)
    console.log('Razorpay secret exists:', !!process.env.RAZORPAY_KEY_SECRET)
    
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    console.log('Expected signature:', expectedSignature)
    console.log('Received signature:', razorpay_signature)
    
    const isAuthentic = expectedSignature === razorpay_signature
    console.log('Signature is authentic:', isAuthentic)
    
    if (!isAuthentic) {
      console.error('Signature verification failed')
      return NextResponse.json({ error: 'Payment verification failed - Invalid signature' }, { status: 400 })
    }

    // Update order in Supabase
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'success',
        payment_status: 'success',
        payment_id: razorpay_payment_id,
        payment_method: 'razorpay',
        razorpay_order_id: razorpay_order_id
      })
      .eq('id', order_id)
      .select()
      .single()

    if (updateError) {
      console.error('Supabase order update error:', updateError)
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }

    // Send order confirmation email
    try {
      if (updatedOrder) {
        const emailData = {
          orderId: updatedOrder.id,
          customerName: updatedOrder.name,
          customerEmail: updatedOrder.email,
          totalAmount: updatedOrder.total_amount,
          items: updatedOrder.items || [],
          paymentId: razorpay_payment_id,
          orderNumber: `ORD-${updatedOrder.id}`,
          address: {
            name: updatedOrder.name,
            address: updatedOrder.address,
            city: updatedOrder.city,
            pincode: updatedOrder.pincode,
            country: updatedOrder.country,
            phone: updatedOrder.phone
          }
        }

        const emailResult = await sendOrderConfirmationEmail(emailData)
        console.log('Email sending result:', emailResult)
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the payment verification if email fails
    }

    // 🚀 Trigger Shiprocket order creation after successful payment verification
    try {
      console.log('=== Triggering Shiprocket Order Creation ===')
      console.log('Order ID for Shiprocket:', order_id)
      
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const shiprocketUrl = `${baseUrl}/api/shiprocket/create-order`
      
      console.log('Calling Shiprocket endpoint:', shiprocketUrl)
      
      const shiprocketResponse = await fetch(shiprocketUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Call': 'payment-verification', // Mark as internal call
        },
        body: JSON.stringify({ orderId: order_id }),
      })

      console.log('Shiprocket response status:', shiprocketResponse.status)
      
      if (!shiprocketResponse.ok) {
        const errorText = await shiprocketResponse.text()
        console.error('Failed to create Shiprocket order:', {
          status: shiprocketResponse.status,
          error: errorText,
          orderId: order_id
        })
      } else {
        const shiprocketResult = await shiprocketResponse.json()
        console.log('Shiprocket order created successfully:', shiprocketResult)
      }
    } catch (shiprocketError: any) {
      console.error('Error creating Shiprocket order:', {
        error: shiprocketError?.message || 'Unknown error',
        orderId: order_id,
        stack: shiprocketError?.stack || 'No stack trace',
        fullError: shiprocketError
      })
      // Don't fail the payment verification if Shiprocket fails
    }

    return NextResponse.json({ 
      success: true, 
      payment_id: razorpay_payment_id,
      order_number: updatedOrder?.order_number || `ORD-${order_id}`
    })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 })
  }
}
