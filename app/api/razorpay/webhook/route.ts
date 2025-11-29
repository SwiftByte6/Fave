import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { sendOrderConfirmationEmail } from '@/lib/email-service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined

const supabaseAdmin = supabaseUrl && serviceKey
  ? createClient(supabaseUrl, serviceKey)
  : null

export async function POST(request: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity)
        break
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity)
        break
      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Add helper function for Shiprocket order creation
async function triggerShiprocketOrderCreation(orderId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/shiprocket/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Failed to create Shiprocket order:', errorText)
      return false
    }

    const result = await response.json()
    console.log('Shiprocket order created successfully:', result)
    return true
  } catch (error) {
    console.error('Error creating Shiprocket order:', error)
    return false
  }
}

async function handlePaymentCaptured(payment: any) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase client not initialized');
      return;
    }
    // Get order details first
    const { data: orderData, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('razorpay_order_id', payment.order_id)
      .single()

    if (fetchError || !orderData) {
      console.error('Order not found for payment:', payment.order_id)
      return
    }

    // Generate order number if not exists
    const orderNumber = orderData.order_number || `ORD-${Date.now().toString().slice(-6)}`

    // Update order status to success
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: 'success',
        payment_status: 'success',
        payment_id: payment.id,
        payment_method: 'razorpay',
        order_number: orderNumber
      })
      .eq('razorpay_order_id', payment.order_id)

    if (error) {
      console.error('Error updating order status:', error)
      return
    }

    // Send confirmation email
    try {
      const emailResult = await sendOrderConfirmationEmail({
        orderId: orderData.id,
        customerName: orderData.name,
        customerEmail: orderData.email,
        totalAmount: parseFloat(orderData.total_amount),
        items: orderData.items || [],
        paymentId: payment.id,
        orderNumber: orderNumber,
        address: {
          name: orderData.name,
          address: orderData.address,
          city: orderData.city || '',
          pincode: orderData.pincode || '',
          country: orderData.country || 'India',
          phone: orderData.phone
        }
      })

      if (!emailResult.success) {
        console.error('Email sending failed:', emailResult.error)
      }
    } catch (emailError) {
      console.error('Email service error:', emailError)
    }

    // 🚀 NEW: Auto-create Shiprocket order after successful payment
    try {
      console.log('Triggering Shiprocket order creation for order:', orderData.id)
      const shiprocketSuccess = await triggerShiprocketOrderCreation(orderData.id)
      
      if (shiprocketSuccess) {
        console.log('Shiprocket order created successfully for order:', orderData.id)
      } else {
        console.error('Shiprocket order creation failed for order:', orderData.id)
      }
    } catch (shiprocketError) {
      console.error('Shiprocket order creation failed:', shiprocketError)
      // Don't fail the payment process if Shiprocket fails
    }

    console.log('Payment captured and order updated successfully:', payment.id)
  } catch (error) {
    console.error('Error handling payment captured:', error)
  }
}

async function handlePaymentFailed(payment: any) {
  try {
    if (!supabaseAdmin) {
      console.error('Supabase client not initialized');
      return;
    }
    // Update order status to cancelled
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: 'cancelled',
        payment_status: 'failed',
        payment_id: payment.id
      })
      .eq('razorpay_order_id', payment.order_id);

    if (error) {
      console.error('Error updating order status:', error)
    }

    console.log('Payment failed and order cancelled:', payment.id)
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}

