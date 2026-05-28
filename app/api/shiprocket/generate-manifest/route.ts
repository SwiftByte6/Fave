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

// Generate manifest
export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await request.json()
    const { shipment_id } = requestBody

    if (!shipment_id) {
      return NextResponse.json({ 
        error: 'Missing required field: shipment_id' 
      }, { status: 400 })
    }

    const token = await getValidShiprocketToken()
    const headers = getShiprocketHeaders(token)

    const payload = {
      shipment_id: Array.isArray(shipment_id) ? shipment_id.map(id => parseInt(id)) : [parseInt(shipment_id)]
    }

    const generateManifestUrl = `${process.env.SHIPROCKET_BASE_URL}/manifests/generate`
    console.log('Generating manifest with payload:', payload)

    const response = await fetch(generateManifestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shiprocket manifest generation error:', errorText)
      throw new Error(`Shiprocket manifest generation error (${response.status}): ${errorText}`)
    }

    const manifestData = await response.json()
    console.log('Manifest generation response:', manifestData)

    return NextResponse.json({ 
      success: true, 
      data: manifestData,
      message: 'Manifest generated successfully'
    })

  } catch (error: any) {
    console.error('Shiprocket manifest generation error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to generate manifest' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to generate manifest',
    endpoint: '/manifests/generate',
    required_fields: ['shipment_id (array or single ID)']
  })
}