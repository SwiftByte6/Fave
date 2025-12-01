import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getValidShiprocketToken() {
  try {
    // Check if we have a valid stored token
    const { data: settings } = await supabaseAdmin
      .from('shiprocket_settings')
      .select('api_token, token_expires_at')
      .eq('id', 1)
      .single()

    // If no token or token expired, get a fresh one
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

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const awbCode = searchParams.get('awb')

    if (!awbCode) {
      return NextResponse.json({ 
        error: 'AWB code is required for tracking' 
      }, { status: 400 })
    }

    const token = await getValidShiprocketToken()
    const headers = getShiprocketHeaders(token)

    const trackingUrl = `${process.env.SHIPROCKET_BASE_URL}/courier/track/awb/${awbCode}`
    console.log('Tracking AWB:', awbCode, 'URL:', trackingUrl)

    const response = await fetch(trackingUrl, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shiprocket tracking API error:', errorText)
      throw new Error(`Shiprocket tracking API error (${response.status}): ${errorText}`)
    }

    const trackingData = await response.json()
    console.log('Tracking data received:', trackingData)

    return NextResponse.json({ 
      success: true, 
      data: trackingData.data || trackingData,
      message: 'Tracking information fetched successfully'
    })

  } catch (error: any) {
    console.error('Shiprocket tracking error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch tracking information' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await request.json()
    const { awb_code } = requestBody

    if (!awb_code) {
      return NextResponse.json({ 
        error: 'AWB code is required for tracking' 
      }, { status: 400 })
    }

    const token = await getValidShiprocketToken()
    const headers = getShiprocketHeaders(token)

    const trackingUrl = `${process.env.SHIPROCKET_BASE_URL}/courier/track/awb/${awb_code}`
    console.log('Tracking AWB:', awb_code, 'URL:', trackingUrl)

    const response = await fetch(trackingUrl, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shiprocket tracking API error:', errorText)
      throw new Error(`Shiprocket tracking API error (${response.status}): ${errorText}`)
    }

    const trackingData = await response.json()
    console.log('Tracking data received:', trackingData)

    return NextResponse.json({ 
      success: true, 
      data: trackingData.data || trackingData,
      message: 'Tracking information fetched successfully'
    })

  } catch (error: any) {
    console.error('Shiprocket tracking error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to fetch tracking information' 
    }, { status: 500 })
  }
}