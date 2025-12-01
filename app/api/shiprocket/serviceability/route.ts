import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getValidShiprocketToken() {
  console.log('=== Getting Valid Shiprocket Bearer Token ===')
  
  try {
    // Check if we have a valid stored token
    const { data: settings } = await supabaseAdmin
      .from('shiprocket_settings')
      .select('api_token, token_expires_at')
      .eq('id', 1)
      .single()

    // If no token or token expired, get a fresh one
    if (!settings?.api_token || new Date(settings.token_expires_at) <= new Date()) {
      console.log('Token expired or missing, authenticating...')
      
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

      // Store the new token
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
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await request.json()
    const { pickup_postcode, delivery_postcode, weight, length, breadth, height, cod } = requestBody

    if (!pickup_postcode || !delivery_postcode || !weight) {
      return NextResponse.json({ 
        error: 'Missing required fields: pickup_postcode, delivery_postcode, weight' 
      }, { status: 400 })
    }

    const token = await getValidShiprocketToken()
    const headers = getShiprocketHeaders(token)

    const params = new URLSearchParams({
      pickup_postcode: pickup_postcode.toString(),
      delivery_postcode: delivery_postcode.toString(),
      weight: weight.toString(),
      length: (length || 10).toString(),
      breadth: (breadth || 10).toString(),
      height: (height || 5).toString(),
      cod: (cod || 0).toString()
    })

    const serviceabilityUrl = `${process.env.SHIPROCKET_BASE_URL}/courier/serviceability/?${params.toString()}`
    console.log('Fetching serviceability from:', serviceabilityUrl)

    const response = await fetch(serviceabilityUrl, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shiprocket serviceability API error:', errorText)
      throw new Error(`Shiprocket serviceability API error (${response.status}): ${errorText}`)
    }

    const serviceabilityData = await response.json()
    console.log('Serviceability data received:', serviceabilityData)

    return NextResponse.json({ 
      success: true, 
      data: serviceabilityData.data || serviceabilityData,
      message: 'Courier serviceability fetched successfully'
    })

  } catch (error: any) {
    console.error('Shiprocket serviceability error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch courier serviceability' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to check courier serviceability',
    endpoint: '/courier/serviceability',
    required_fields: ['pickup_postcode', 'delivery_postcode', 'weight'],
    optional_fields: ['length', 'breadth', 'height', 'cod']
  })
}