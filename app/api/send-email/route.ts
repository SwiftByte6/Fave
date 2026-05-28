import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { mapOrderToEmailData, sendOrderConfirmationEmail } from '@/lib/email-service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined

const supabaseAdmin = supabaseUrl && serviceKey
  ? createClient(supabaseUrl, serviceKey)
  : null

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (body?.orderId) {
      if (!supabaseAdmin) {
        return NextResponse.json({ success: false, error: 'Server not configured' }, { status: 500 })
      }

      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', body.orderId)
        .single()

      if (error || !order) {
        return NextResponse.json({ success: false, error: error?.message || 'Order not found' }, { status: 404 })
      }

      const paymentId = body.paymentId || order.payment_id || 'processing'
      const result = await sendOrderConfirmationEmail(
        mapOrderToEmailData(order, paymentId, order.order_number)
      )

      return NextResponse.json(result)
    }

    const result = await sendOrderConfirmationEmail(body)
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Email API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to send email' 
    }, { status: 500 })
  }
}
