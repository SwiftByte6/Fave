import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
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
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const requestBody = await request.json()
    const { shipment_id, courier_id } = requestBody

    if (!shipment_id || !courier_id) {
      return NextResponse.json({ 
        error: 'Missing required fields: shipment_id, courier_id' 
      }, { status: 400 })
    }

    const token = await getValidShiprocketToken()
    const headers = getShiprocketHeaders(token)

    const payload = {
      shipment_id: parseInt(shipment_id),
      courier_id: parseInt(courier_id)
    }

    const assignAwbUrl = `${process.env.SHIPROCKET_BASE_URL}/courier/assign/awb`
    console.log('Assigning AWB with payload:', payload)

    const response = await fetch(assignAwbUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Shiprocket AWB assignment error:', errorText)
      throw new Error(`Shiprocket AWB assignment error (${response.status}): ${errorText}`)
    }

    const awbData = await response.json()
    console.log('AWB assignment response:', awbData)

    // Update order with AWB details if successful
    if (awbData.awb_code) {
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          awb_code: awbData.awb_code,
          courier_id: courier_id,
          shipping_status: 'awb_assigned',
          updated_at: new Date().toISOString()
        })
        .eq('shipment_id', shipment_id.toString())

      if (updateError) {
        console.error('Failed to update order with AWB:', updateError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: awbData,
      message: 'AWB assigned successfully'
    })

  } catch (error: any) {
    console.error('Shiprocket AWB assignment error:', error)
    return NextResponse.json({ 
      error: error.message || 'Failed to assign AWB' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST method to assign AWB',
    endpoint: '/courier/assign/awb',
    required_fields: ['shipment_id', 'courier_id']
  })
}