import { NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '../../lib/email-service'

export async function POST(request: Request) {
  try {
    const emailData = await request.json()
    
    const result = await sendOrderConfirmationEmail(emailData)
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Email API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to send email' 
    }, { status: 500 })
  }
}
