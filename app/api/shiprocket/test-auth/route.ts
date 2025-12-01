import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('=== Testing Shiprocket Authentication ===')
    console.log('SHIPROCKET_API_EMAIL:', process.env.SHIPROCKET_API_EMAIL)
    console.log('SHIPROCKET_API_PASSWORD exists:', !!process.env.SHIPROCKET_API_PASSWORD)
    console.log('SHIPROCKET_BASE_URL:', process.env.SHIPROCKET_BASE_URL)
    
    if (!process.env.SHIPROCKET_API_EMAIL || !process.env.SHIPROCKET_API_PASSWORD) {
      return NextResponse.json({ 
        error: 'Shiprocket credentials not configured',
        email: process.env.SHIPROCKET_API_EMAIL,
        hasPassword: !!process.env.SHIPROCKET_API_PASSWORD,
        baseUrl: process.env.SHIPROCKET_BASE_URL
      }, { status: 400 })
    }

    const loginUrl = `${process.env.SHIPROCKET_BASE_URL}/auth/login`
    console.log('Testing login at:', loginUrl)

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

    console.log('Response status:', response.status)
    const responseText = await response.text()
    console.log('Response text:', responseText)

    if (!response.ok) {
      return NextResponse.json({ 
        error: `Login failed: ${response.status}`,
        details: responseText,
        url: loginUrl,
        credentials: {
          email: process.env.SHIPROCKET_API_EMAIL,
          hasPassword: !!process.env.SHIPROCKET_API_PASSWORD
        }
      }, { status: response.status })
    }

    const data = JSON.parse(responseText)
    console.log('Login successful:', data)

    return NextResponse.json({ 
      success: true,
      hasToken: !!data.token,
      tokenLength: data.token?.length || 0,
      message: 'Authentication successful'
    })

  } catch (error: any) {
    console.error('Test authentication error:', error)
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}