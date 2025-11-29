import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    console.log('=== Shiprocket Login Started ===')
    console.log('Email:', process.env.SHIPROCKET_EMAIL)
    console.log('Password exists:', !!process.env.SHIPROCKET_PASSWORD)
    
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    })

    console.log('Shiprocket API response status:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Shiprocket authentication failed: ${errorData}`)
    }

    const data = await response.json()
    
    if (!data.token) {
      throw new Error('No token received from Shiprocket')
    }
    
    // Store token in database with expiry
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 23) // Token valid for 24 hours

    const { error } = await supabaseAdmin
      .from('shiprocket_settings')
      .upsert({
        api_token: data.token,
        token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Failed to store Shiprocket token:', error)
    }

    return NextResponse.json({ success: true, token: data.token })
  } catch (error: any) {
    console.error('Shiprocket login error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data: settings } = await supabaseAdmin
      .from('shiprocket_settings')
      .select('api_token, token_expires_at')
      .single()

    if (!settings?.api_token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const isExpired = new Date(settings.token_expires_at) <= new Date()
    
    return NextResponse.json({ 
      authenticated: !isExpired, 
      expires_at: settings.token_expires_at 
    })
  } catch (error: any) {
    console.error('Token check error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}