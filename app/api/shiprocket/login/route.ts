import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  try {
    console.log('=== Shiprocket API User Login Started ===')
    console.log('API Email:', process.env.SHIPROCKET_API_EMAIL)
    console.log('API Password exists:', !!process.env.SHIPROCKET_API_PASSWORD)
    
    if (!process.env.SHIPROCKET_API_EMAIL || !process.env.SHIPROCKET_API_PASSWORD) {
      throw new Error('Shiprocket API credentials not configured')
    }

    const loginUrl = `${process.env.SHIPROCKET_BASE_URL}/auth/login`
    console.log('Login URL:', loginUrl)
    
    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_API_EMAIL,
        password: process.env.SHIPROCKET_API_PASSWORD,
      }),
    })

    console.log('Shiprocket API response status:', response.status)
    const responseText = await response.text()
    console.log('Shiprocket API response:', responseText)

    if (!response.ok) {
      throw new Error(`Shiprocket authentication failed (${response.status}): ${responseText}`)
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`)
    }
    
    if (!data.token) {
      throw new Error('No token received from Shiprocket API')
    }
    
    // Store token in database with expiry (Shiprocket tokens typically last 24 hours)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 23) // Token valid for 23 hours to be safe

    const { error } = await supabaseAdmin
      .from('shiprocket_settings')
      .insert({
        api_token: data.token,
        token_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      })

    if (error) {
      console.error('Failed to store Shiprocket token:', error)
      // Don't fail the login if we can't store the token
    }

    console.log('Shiprocket login successful, token stored')
    return NextResponse.json({ 
      success: true, 
      token: data.token,
      expires_at: expiresAt.toISOString()
    })
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
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (!settings?.api_token) {
      return NextResponse.json({ 
        authenticated: false,
        message: 'No token found'
      })
    }

    const isExpired = new Date(settings.token_expires_at) <= new Date()
    
    return NextResponse.json({ 
      authenticated: !isExpired, 
      expires_at: settings.token_expires_at,
      message: isExpired ? 'Token expired' : 'Token valid'
    })
  } catch (error: any) {
    console.error('Token check error:', error)
    return NextResponse.json({ 
      authenticated: false,
      error: error.message 
    })
  }
}