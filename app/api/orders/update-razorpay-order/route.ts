import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

    const { orderId, razorpayOrderId } = await request.json()

    if (!orderId || !razorpayOrderId) {
      return NextResponse.json({ error: 'Missing order ID or Razorpay order ID' }, { status: 400 })
    }

    // Update order with Razorpay order ID
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        razorpay_order_id: razorpayOrderId
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('Order update error:', updateError)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Update Razorpay order ID error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update order' }, { status: 500 })
  }
}
