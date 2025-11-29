import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// State mapping for Indian states
const stateMapping: { [key: string]: string } = {
  'mumbai': 'Maharashtra',
  'delhi': 'Delhi',
  'bangalore': 'Karnataka',
  'bengaluru': 'Karnataka',
  'hyderabad': 'Telangana',
  'chennai': 'Tamil Nadu',
  'kolkata': 'West Bengal',
  'pune': 'Maharashtra',
  'ahmedabad': 'Gujarat',
  'jaipur': 'Rajasthan',
  'surat': 'Gujarat',
  'lucknow': 'Uttar Pradesh',
  'kanpur': 'Uttar Pradesh',
  'nagpur': 'Maharashtra',
  'indore': 'Madhya Pradesh',
  'thane': 'Maharashtra',
  'bhopal': 'Madhya Pradesh',
  'visakhapatnam': 'Andhra Pradesh',
  'pimpri': 'Maharashtra',
  'patna': 'Bihar',
  'vadodara': 'Gujarat',
  'ghaziabad': 'Uttar Pradesh',
  'ludhiana': 'Punjab',
  'agra': 'Uttar Pradesh',
  'nashik': 'Maharashtra',
  'faridabad': 'Haryana',
  'meerut': 'Uttar Pradesh',
  'rajkot': 'Gujarat',
  'kalyan': 'Maharashtra',
  'vasai': 'Maharashtra',
  'varanasi': 'Uttar Pradesh',
  'srinagar': 'Jammu and Kashmir',
  'aurangabad': 'Maharashtra',
  'dhanbad': 'Jharkhand',
  'amritsar': 'Punjab',
  'navi mumbai': 'Maharashtra',
  'allahabad': 'Uttar Pradesh',
  'prayagraj': 'Uttar Pradesh',
  'howrah': 'West Bengal',
  'ranchi': 'Jharkhand',
  'gwalior': 'Madhya Pradesh',
  'jabalpur': 'Madhya Pradesh',
  'coimbatore': 'Tamil Nadu'
}

async function getValidToken() {
  console.log('=== Getting Shiprocket Token ===')
  
  const { data: settings, error: settingsError } = await supabaseAdmin
    .from('shiprocket_settings')
    .select('api_token, token_expires_at')
    .single()

  console.log('Settings retrieved:', { hasToken: !!settings?.api_token, error: settingsError })

  if (!settings?.api_token || new Date(settings.token_expires_at) <= new Date()) {
    console.log('Token expired or missing, refreshing...')
    
    // Refresh token
    const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/shiprocket/login`, {
      method: 'POST',
    })
    
    const loginResponseText = await loginResponse.text()
    console.log('Login response status:', loginResponse.status)
    console.log('Login response:', loginResponseText)
    
    if (!loginResponse.ok) {
      throw new Error(`Failed to refresh Shiprocket token: ${loginResponse.status} - ${loginResponseText}`)
    }
    
    const loginData = JSON.parse(loginResponseText)
    console.log('Login successful, token received')
    return loginData.token
  }
  
  console.log('Using existing token')
  return settings.api_token
}

function getStateFromCity(city: string): string {
  const cityLower = city.toLowerCase().trim()
  return stateMapping[cityLower] || 'Maharashtra' // Default to Maharashtra
}

export async function POST(request: Request) {
  let orderId: string = ''
  
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await request.json()
    orderId = requestBody.orderId
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }
    
    // Get order details from database
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if Shiprocket order already exists
    if (order.shiprocket_order_id) {
      return NextResponse.json({ 
        success: true, 
        message: 'Shiprocket order already exists',
        shiprocket_order_id: order.shiprocket_order_id,
        shipment_id: order.shipment_id 
      })
    }

    // Calculate total weight and dimensions
    let totalWeight = 0
    let maxLength = 0, maxBreadth = 0, totalHeight = 0

    for (const item of order.items) {
      // Try to fetch product details for weight/dimensions
      const { data: product, error: productError } = await supabaseAdmin
        .from('product')
        .select('weight, length, breadth, height')
        .eq('id', item.id)
        .single()

      if (productError) {
        console.log(`Product not found for item ${item.id}, using defaults`)
      }

      const itemWeight = (product?.weight || 0.3) * item.quantity
      totalWeight += itemWeight
      
      maxLength = Math.max(maxLength, product?.length || 25)
      maxBreadth = Math.max(maxBreadth, product?.breadth || 20) 
      totalHeight += (product?.height || 3) * item.quantity
    }

    // Ensure minimum dimensions
    totalWeight = Math.max(0.5, totalWeight) // Minimum 0.5kg
    maxLength = Math.max(20, maxLength)
    maxBreadth = Math.max(15, maxBreadth)
    totalHeight = Math.max(5, totalHeight)

    // Get pickup address from settings
    const { data: settings } = await supabaseAdmin
      .from('shiprocket_settings')
      .select('pickup_address')
      .single()

    const pickupAddress = settings?.pickup_address || {
      pickup_location: "Primary",
      name: "FAVEE",
      email: "orders@favee.com",
      phone: "9876543210",
      address: "123 Fashion Street",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pin_code: "400001"
    }

    // Determine state from city
    const customerState = getStateFromCity(order.city || 'Mumbai')

    // Clean and validate phone number (must be exactly 10 digits)
    let cleanPhone = order.phone?.replace(/\D/g, '') || '9999999999'
    if (cleanPhone.length > 10) {
      cleanPhone = cleanPhone.slice(-10) // Take last 10 digits
    } else if (cleanPhone.length < 10) {
      cleanPhone = cleanPhone.padStart(10, '9') // Pad with 9s if too short
    }

    // Clean and validate pincode (must be exactly 6 digits)
    let cleanPincode = order.pincode?.replace(/\D/g, '') || '400001'
    if (cleanPincode.length !== 6) {
      cleanPincode = '400001' // Default Mumbai pincode
    }

    // Split name into first and last name
    const nameParts = (order.name || 'Customer').split(' ')
    const firstName = nameParts[0] || 'Customer'
    const lastName = nameParts.slice(1).join(' ') || ''

    // Validate and clean address (must be at least 3 characters)
    let cleanAddress = (order.address || '').trim()
    if (cleanAddress.length < 3) {
      cleanAddress = 'Default Address, Mumbai'
    }

    // Prepare Shiprocket order payload
    const shiprocketPayload = {
      order_id: order.id,
      order_date: new Date(order.created_at).toISOString().split('T')[0],
      pickup_location: pickupAddress.pickup_location || "Primary",
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: cleanAddress,
      billing_city: order.city || "Mumbai",
      billing_pincode: cleanPincode,
      billing_state: customerState,
      billing_country: "India",
      billing_email: order.email || "customer@example.com",
      billing_phone: cleanPhone,
      shipping_is_billing: true,
      order_items: order.items.map((item: any, index: number) => ({
        name: (item.title || item.name || `Product ${index + 1}`).substring(0, 50), // Limit name length
        sku: (item.id || item.sku || `SKU${index + 1}`).toString(),
        units: Math.max(1, parseInt(item.quantity) || 1), // Ensure at least 1 unit
        selling_price: Math.max(1, parseFloat(item.price) || 1), // Ensure positive price
        discount: 0,
        tax: 0,
        hsn: 6204 // Default HSN for clothing
      })),
      payment_method: order.payment_status === 'success' ? 'Prepaid' : 'COD',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.discount_amount || 0,
      sub_total: order.total_amount,
      length: Math.ceil(maxLength),
      breadth: Math.ceil(maxBreadth), 
      height: Math.ceil(totalHeight),
      weight: Math.ceil(totalWeight * 1000) / 1000 // Round to 3 decimal places
    }

    // Validate required fields
    if (!shiprocketPayload.billing_phone || shiprocketPayload.billing_phone.length !== 10) {
      throw new Error(`Invalid phone number: ${shiprocketPayload.billing_phone}. Must be exactly 10 digits.`)
    }
    
    if (!shiprocketPayload.billing_pincode || shiprocketPayload.billing_pincode.length !== 6) {
      throw new Error(`Invalid pincode: ${shiprocketPayload.billing_pincode}. Must be exactly 6 digits.`)
    }

    if (!shiprocketPayload.billing_address || shiprocketPayload.billing_address.length < 3) {
      throw new Error(`Invalid address: ${shiprocketPayload.billing_address}. Must be at least 3 characters.`)
    }

    if (!shiprocketPayload.order_items || shiprocketPayload.order_items.length === 0) {
      throw new Error('Order must contain at least one item')
    }

    console.log('Creating Shiprocket order with payload:', JSON.stringify(shiprocketPayload, null, 2))

    const token = await getValidToken()
    
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(shiprocketPayload),
    })

    const responseText = await response.text()
    
    if (!response.ok) {
      console.error('Shiprocket API error response:', responseText)
      throw new Error(`Shiprocket API error (${response.status}): ${responseText}`)
    }

    let shiprocketResponse
    try {
      shiprocketResponse = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Invalid JSON response from Shiprocket: ${responseText}`)
    }

    console.log('Shiprocket response:', shiprocketResponse)

    // Update order with Shiprocket details
    const updateData = {
      shiprocket_order_id: shiprocketResponse.order_id?.toString(),
      shipment_id: shiprocketResponse.shipment_id?.toString(),
      shipping_status: 'pickup_scheduled',
      order_weight: totalWeight,
      order_length: maxLength,
      order_breadth: maxBreadth,
      order_height: totalHeight,
      status: 'processing',
      updated_at: new Date().toISOString()
    }

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', orderId)

    if (updateError) {
      console.error('Failed to update order with Shiprocket details:', updateError)
    }

    // Log the shipment creation
    await supabaseAdmin
      .from('shipping_logs')
      .insert({
        order_id: orderId,
        shiprocket_order_id: shiprocketResponse.order_id?.toString(),
        event_type: 'order_created',
        status_to: 'pickup_scheduled',
        api_response: shiprocketResponse
      })

    return NextResponse.json({ 
      success: true, 
      shiprocket_order_id: shiprocketResponse.order_id,
      shipment_id: shiprocketResponse.shipment_id,
      message: 'Shiprocket order created successfully'
    })

  } catch (error: any) {
    console.error('Shiprocket order creation error:', error)
    
    // Log the error
    try {
      if (orderId) {
        await supabaseAdmin
          .from('shipping_logs')
          .insert({
            order_id: orderId,
            event_type: 'order_created',
            error_message: error.message
          })
      }
    } catch (logError) {
      console.error('Failed to log shipping error:', logError)
    }

    return NextResponse.json({ 
      error: error.message || 'Failed to create Shiprocket order',
      details: error.stack 
    }, { status: 500 })
  }
}