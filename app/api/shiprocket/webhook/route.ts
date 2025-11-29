import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const statusMapping = {
  'pickup_scheduled': 'pickup_scheduled',
  'picked_up': 'picked_up', 
  'in_transit': 'in_transit',
  'out_for_delivery': 'out_for_delivery',
  'delivered': 'delivered',
  'cancelled': 'cancelled',
  'returned': 'returned'
}

export async function POST(request: Request) {
  try {
    const body = await request.text()
    
    console.log('Shiprocket webhook received:', body)

    // Verify webhook signature if available
    const signature = request.headers.get('x-shiprocket-signature')
    if (process.env.SHIPROCKET_WEBHOOK_SECRET && signature) {
      // TODO: Implement signature verification
      // const expectedSignature = crypto
      //   .createHmac('sha256', process.env.SHIPROCKET_WEBHOOK_SECRET)
      //   .update(body)
      //   .digest('hex')
      // if (signature !== expectedSignature) {
      //   return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      // }
    }

    let webhookData
    try {
      webhookData = JSON.parse(body)
    } catch (e) {
      console.error('Invalid JSON in webhook:', body)
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { 
      order_id, 
      shipment_id, 
      awb_code, 
      courier_company_id: courier_id,
      courier_name,
      current_status,
      delivered_date,
      pickup_date,
      tracking_url,
      expected_delivery_date 
    } = webhookData

    if (!order_id) {
      console.error('No order_id in webhook data:', webhookData)
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
    }

    // Map Shiprocket status to our status
    const shippingStatus = statusMapping[current_status as keyof typeof statusMapping] || current_status

    // Prepare update data
    const updateData: any = {
      shipping_status: shippingStatus,
      updated_at: new Date().toISOString()
    }

    if (awb_code) updateData.awb_code = awb_code
    if (courier_id) updateData.courier_id = courier_id
    if (courier_name) updateData.courier_name = courier_name
    if (tracking_url) updateData.tracking_url = tracking_url
    if (pickup_date) updateData.pickup_date = new Date(pickup_date).toISOString()
    if (expected_delivery_date) updateData.expected_delivery_date = expected_delivery_date
    if (delivered_date) {
      updateData.actual_delivery_date = new Date(delivered_date).toISOString()
      updateData.status = 'delivered'
    }

    // Get current order to check previous status
    const { data: currentOrder } = await supabaseAdmin
      .from('orders')
      .select('shipping_status, name, email, order_number')
      .eq('shiprocket_order_id', order_id.toString())
      .single()

    // Update order based on Shiprocket order ID
    const { data: updatedOrder, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('shiprocket_order_id', order_id.toString())
      .select('*')
      .single()

    if (error) {
      console.error('Failed to update order:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // Log the webhook event
    await supabaseAdmin
      .from('shipping_logs')
      .insert({
        order_id: updatedOrder?.id,
        shiprocket_order_id: order_id.toString(),
        event_type: 'webhook_received',
        status_from: currentOrder?.shipping_status,
        status_to: shippingStatus,
        webhook_data: webhookData
      })

    // Send status update email for important status changes
    if (['picked_up', 'out_for_delivery', 'delivered'].includes(shippingStatus)) {
      try {
        // Import the email function here to avoid circular dependencies
        const { sendShippingUpdateEmail } = await import('@/lib/email-service')
        
        await sendShippingUpdateEmail({
          orderId: updatedOrder.id,
          customerName: updatedOrder.name,
          customerEmail: updatedOrder.email,
          orderNumber: updatedOrder.order_number || updatedOrder.id,
          shippingStatus,
          awbCode: awb_code,
          courierName: courier_name,
          trackingUrl: tracking_url,
          estimatedDelivery: expected_delivery_date
        })
      } catch (emailError) {
        console.error('Failed to send shipping update email:', emailError)
        // Don't fail the webhook if email fails
      }
    }

    console.log(`Webhook processed: Order ${order_id} status updated to ${shippingStatus}`)

    return NextResponse.json({ success: true, status: shippingStatus })

  } catch (error: any) {
    console.error('Shiprocket webhook error:', error)
    
    // Log the webhook error
    try {
      await supabaseAdmin
        .from('shipping_logs')
        .insert({
          event_type: 'webhook_received',
          error_message: error.message,
          webhook_data: JSON.parse(await request.text())
        })
    } catch (logError) {
      console.error('Failed to log webhook error:', logError)
    }

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Handle GET requests for webhook verification
export async function GET() {
  return NextResponse.json({ 
    message: 'Shiprocket webhook endpoint is active',
    timestamp: new Date().toISOString()
  })
}