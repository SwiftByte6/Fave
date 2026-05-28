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

// Print manifest
export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await request.json()
    const { order_ids } = requestBody

    if (!order_ids || !Array.isArray(order_ids) || order_ids.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required field: order_ids (array)' 
      }, { status: 400 })
    }

    const token = await getValidShiprocketToken()
    const headers = getShiprocketHeaders(token)

    const payload = {
      order_ids: order_ids.map(id => parseInt(id))
    }

    const printManifestUrl = `${process.env.SHIPROCKET_BASE_URL}/manifests/print`
    console.log('Printing manifest with payload:', payload)

    const response = await fetch(printManifestUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shiprocket print manifest error:', errorText)
      throw new Error(`Shiprocket print manifest error (${response.status}): ${errorText}`)
    }

    const manifestData = await response.json()
    console.log('Print manifest response:', manifestData)

    return NextResponse.json({ 
      success: true, 
      data: manifestData,
      message: 'Manifest print URL generated successfully'
    })

  } catch (error: any) {
    console.error('Shiprocket print manifest error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to generate manifest print URL' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to print manifest',
    endpoint: '/manifests/print',
    required_fields: ['order_ids (array of order IDs)']
  })
}