import { NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/supabase/auth'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getValidShiprocketToken() {
  try {
    const { data: settings } = await supabaseAdmin
      .from('shiprocket_settings')
      .select('api_token, token_expires_at')
      .eq('id', 1)
      .single()

    if (!settings?.api_token || new Date(settings.token_expires_at) <= new Date()) {
      if (!process.env.SHIPROCKET_API_EMAIL || !process.env.SHIPROCKET_API_PASSWORD) {
        throw new Error('Shiprocket API credentials not configured')
      }

      const loginUrl = `${process.env.SHIPROCKET_BASE_URL}/auth/login`
      const loginResponse = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: process.env.SHIPROCKET_API_EMAIL,
          password: process.env.SHIPROCKET_API_PASSWORD,
        }),
      })
      
      if (!loginResponse.ok) {
        const errorText = await loginResponse.text()
        throw new Error(`Shiprocket authentication failed: ${loginResponse.status} - ${errorText}`)
      }
      
      const loginData = await loginResponse.json()
      if (!loginData.token) {
        throw new Error('No token received from Shiprocket')
      }

      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 23)

      await supabaseAdmin
        .from('shiprocket_settings')
        .upsert({
          id: 1,
          api_token: loginData.token,
          token_expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        })

      return loginData.token
    }
    
    return settings.api_token
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

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await request.json()
    const { shipment_id, pickup_date } = requestBody

    if (!shipment_id) {
      return NextResponse.json({ 
        error: 'Missing required field: shipment_id' 
      }, { status: 400 })
    }

    const token = await getValidShiprocketToken()
    const headers = getShiprocketHeaders(token)

    // Use provided pickup_date or default to next business day
    const defaultPickupDate = new Date()
    defaultPickupDate.setDate(defaultPickupDate.getDate() + 1)
    
    const payload = {
      shipment_id: Array.isArray(shipment_id) ? shipment_id.map(id => parseInt(id)) : [parseInt(shipment_id)],
      pickup_date: pickup_date || defaultPickupDate.toISOString().split('T')[0]
    }

    const generatePickupUrl = `${process.env.SHIPROCKET_BASE_URL}/courier/generate/pickup`
    console.log('Generating pickup with payload:', payload)

    const response = await fetch(generatePickupUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shiprocket pickup generation error:', errorText)
      throw new Error(`Shiprocket pickup generation error (${response.status}): ${errorText}`)
    }

    const pickupData = await response.json()
    console.log('Pickup generation response:', pickupData)

    // Update order status to pickup_scheduled
    const shipmentIds = Array.isArray(shipment_id) ? shipment_id : [shipment_id]
    
    for (const id of shipmentIds) {
      await supabaseAdmin
        .from('orders')
        .update({
          shipping_status: 'pickup_scheduled',
          pickup_date: payload.pickup_date,
          updated_at: new Date().toISOString()
        })
        .eq('shipment_id', id.toString())
    }

    return NextResponse.json({ 
      success: true, 
      data: pickupData,
      message: 'Pickup scheduled successfully'
    })

  } catch (error: any) {
    console.error('Shiprocket pickup generation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to generate pickup' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to generate pickup',
    endpoint: '/courier/generate/pickup',
    required_fields: ['shipment_id'],
    optional_fields: ['pickup_date (YYYY-MM-DD format)']
  })
}