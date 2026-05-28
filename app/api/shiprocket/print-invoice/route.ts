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

// Print invoice
export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await request.json()
    const { ids } = requestBody

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required field: ids (array of order IDs)' 
      }, { status: 400 })
    }

    const token = await getValidShiprocketToken()
    const headers = getShiprocketHeaders(token)

    const payload = {
      ids: ids.map(id => parseInt(id))
    }

    const printInvoiceUrl = `${process.env.SHIPROCKET_BASE_URL}/orders/print/invoice`
    console.log('Printing invoice with payload:', payload)

    const response = await fetch(printInvoiceUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shiprocket print invoice error:', errorText)
      throw new Error(`Shiprocket print invoice error (${response.status}): ${errorText}`)
    }

    const invoiceData = await response.json()
    console.log('Print invoice response:', invoiceData)

    return NextResponse.json({ 
      success: true, 
      data: invoiceData,
      message: 'Invoice print URL generated successfully'
    })

  } catch (error: any) {
    console.error('Shiprocket print invoice error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to generate invoice print URL' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to print invoice',
    endpoint: '/orders/print/invoice',
    required_fields: ['ids (array of order IDs)']
  })
}