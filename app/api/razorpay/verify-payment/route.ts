import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { sendOrderConfirmationEmail } from '../../../lib/email-service'

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase not configured')
  }

  return createClient(supabaseUrl, serviceKey)
}

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } =
      await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json({ error: 'Missing payment verification data' }, { status: 400 })
    }

    // Recompute signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature
    if (!isAuthentic) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Update order in Supabase
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'success',
        payment_status: 'success',
        payment_id: razorpay_payment_id,
        payment_method: 'razorpay'
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

    return NextResponse.json({ success: true, payment_id: razorpay_payment_id })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 })
  }
}
