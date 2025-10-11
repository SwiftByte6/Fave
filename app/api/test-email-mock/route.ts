import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const emailData = await request.json()
    
    // Simulate email processing
    console.log('📧 Mock Email Service - Processing email:', {
      to: emailData.customerEmail,
      subject: `Order Confirmation - #${emailData.orderNumber || emailData.orderId}`,
      orderId: emailData.orderId,
      customerName: emailData.customerName,
      totalAmount: emailData.totalAmount
    })

    // Simulate successful email sending
    const mockEmailId = `mock-email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully (Mock Mode)',
      emailId: mockEmailId,
      details: {
        to: emailData.customerEmail,
        subject: `Order Confirmation - #${emailData.orderNumber || emailData.orderId}`,
        template: 'Order Confirmation Template',
        status: 'Delivered (Simulated)'
      }
    })
  } catch (error: any) {
    console.error('Mock Email API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to process mock email' 
    }, { status: 500 })
  }
}
