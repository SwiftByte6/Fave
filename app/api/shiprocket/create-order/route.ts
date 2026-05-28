import { NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/supabase/auth'
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

async function getValidShiprocketToken() {
  console.log('=== Getting Valid Shiprocket Bearer Token ===')
  
  try {
    // Check environment variables first
    console.log('Checking environment variables...')
    console.log('SHIPROCKET_API_EMAIL:', !!process.env.SHIPROCKET_API_EMAIL)
    console.log('SHIPROCKET_API_PASSWORD:', !!process.env.SHIPROCKET_API_PASSWORD)
    console.log('SHIPROCKET_BASE_URL:', process.env.SHIPROCKET_BASE_URL)
    
    if (!process.env.SHIPROCKET_API_EMAIL || !process.env.SHIPROCKET_API_PASSWORD || !process.env.SHIPROCKET_BASE_URL) {
      throw new Error('Shiprocket API credentials not configured in environment variables')
    }

    // Try to check if we have a valid stored token (ignore errors for now)
    let settings = null
    try {
      const { data, error } = await supabaseAdmin
        .from('shiprocket_settings')
        .select('api_token, token_expires_at')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()
      
      if (!error && data) {
        settings = data
        console.log('Token check:', { hasToken: !!settings.api_token, expiresAt: settings.token_expires_at })
      } else {
        console.log('No existing token found or table error:', error)
      }
    } catch (dbError) {
      console.log('Database error checking token (will get fresh token):', dbError)
    }

    // If no valid token, get a fresh one
    const needNewToken = !settings?.api_token || (settings.token_expires_at ? new Date(settings.token_expires_at) <= new Date() : true)
    
    if (needNewToken) {
      console.log('Getting fresh token from Shiprocket API...')
      
      const loginUrl = `${process.env.SHIPROCKET_BASE_URL}/auth/login`
      console.log('Login URL:', loginUrl)
      
      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: process.env.SHIPROCKET_API_EMAIL,
          password: process.env.SHIPROCKET_API_PASSWORD,
        }),
      })
      
      console.log('Login response status:', loginResponse.status)
      
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text()
        console.error('Login failed:', errorText)
        throw new Error(`Shiprocket authentication failed: ${loginResponse.status} - ${errorText}`)
      }
      
      const loginData = await loginResponse.json()
      console.log('Login response:', loginData)
      
      if (!loginData.token) {
        throw new Error('No token received from Shiprocket API')
      }

      // Try to store the new token (don't fail if this fails)
      try {
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 23)

        // Insert new token record
        await supabaseAdmin
          .from('shiprocket_settings')
          .insert({
            api_token: loginData.token,
            token_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString(),
            is_active: true
          })

        console.log('New token stored successfully')
      } catch (storeError) {
        console.error('Failed to store token (continuing anyway):', storeError)
      }

      console.log('Returning fresh token')
      return loginData.token
    }
    
    console.log('Using existing valid token')
    return settings?.api_token || ''
  } catch (error) {
    console.error('Failed to get Shiprocket token:', error)
    throw error
  }
}

function getShiprocketHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

function getStateFromCity(city: string): string {
  const cityLower = city.toLowerCase().trim()
  return stateMapping[cityLower] || 'Maharashtra' // Default to Maharashtra
}

export async function POST(request: Request) {
  let orderId: string = ''
  
  try {
    // Check if this is an internal call (from payment verification) or external call
    const isInternalCall = request.headers.get('X-Internal-Call') === 'payment-verification'
    const userId = await getUserIdFromRequest(request)
    const requestBody = await request.json()
    orderId = requestBody.orderId
    
    console.log('Create order request:', { 
      hasUserId: !!userId, 
      orderId, 
      isInternalCall 
    })
    
    // Allow internal calls without user authentication, external calls need user auth
    if (!isInternalCall && !userId) {
      return NextResponse.json({ error: 'Unauthorized - user authentication required' }, { status: 401 })
    }
    
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

    // Get pickup address from settings or use default
    let pickupAddress = {
      pickup_location: "Primary",
      name: "Elegance Boutique",
      email: "orders@eleganceboutique.com",
      phone: "9876543210",
      address: "123 Fashion Street",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pin_code: "400001"
    }

    try {
      const { data: settings } = await supabaseAdmin
        .from('shiprocket_settings')
        .select('pickup_address')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (settings?.pickup_address) {
        pickupAddress = settings.pickup_address
        console.log('Using pickup address from settings')
      }
    } catch (error) {
      console.log('Using default pickup address')
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

    console.log('=== Getting Shiprocket Token ===')
    let token
    try {
      token = await getValidShiprocketToken()
      console.log('Token acquired successfully:', !!token)
    } catch (tokenError: any) {
      console.error('Failed to get Shiprocket token:', tokenError)
      throw new Error(`Authentication failed: ${tokenError?.message || 'Unknown authentication error'}`)
    }

    const headers = getShiprocketHeaders(token)
    console.log('Request headers:', headers)
    
    const createOrderUrl = `${process.env.SHIPROCKET_BASE_URL}/orders/create/adhoc`
    console.log('Making request to:', createOrderUrl)
    
    const response = await fetch(createOrderUrl, {
      method: 'POST',
      headers,
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