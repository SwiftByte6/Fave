'use client'

import { useState } from 'react'

interface EmailResult {
  success: boolean
  error?: string
  emailId?: string
  message?: string
  previewUrl?: string
  details?: any
}

export default function SimpleEmailTestPage() {
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<EmailResult | null>(null)

  const testEmailData = {
    orderId: 'test-order-123',
    customerName: 'Test User',
    customerEmail: 'test@example.com', // Default test email
    totalAmount: 1500,
    items: [
      {
        title: 'Test Product 1',
        price: 500,
        quantity: 1,
        images: ['/favicon.ico']
      },
      {
        title: 'Test Product 2',
        price: 1000,
        quantity: 1,
        images: ['/favicon.ico']
      }
    ],
    paymentId: 'pay_test123',
    orderNumber: 'ORD-123456',
    address: {
      name: 'Test User',
      address: '123 Test Street, Test Area',
      city: 'Test City',
      pincode: '123456',
      country: 'India',
      phone: '9876543210'
    }
  }

  const sendTestEmail = async () => {
    setIsSending(true)
    setResult(null)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEmailData),
      })

      const emailResult = await response.json()
      setResult(emailResult)
    } catch (error: any) {
      setResult({
        success: false,
        error: error?.message || 'Unknown error occurred'
      })
    } finally {
      setIsSending(false)
    }
  }

  const simulateEmailSending = () => {
    setIsSending(true)
    setResult(null)

    // Simulate email sending process
    setTimeout(() => {
      setResult({
        success: true,
        message: 'Email simulation successful! (No actual email sent - API key not configured)',
        emailId: 'simulated-email-id-123'
      })
      setIsSending(false)
    }, 2000)
  }

  const sendMockEmail = async () => {
    setIsSending(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-email-mock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testEmailData),
      })

      const emailResult = await response.json()
      setResult(emailResult)
    } catch (error: any) {
      setResult({
        success: false,
        error: error?.message || 'Unknown error occurred'
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF8F6] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#6f5a4d] mb-6 text-center">
            📧 Email Service Test
          </h1>

          <div className="space-y-6">
            {/* Status Check */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2">📋 Email Service Status</h3>
              <div className="text-sm text-blue-600 space-y-1">
                <p>✅ Email service is configured and ready</p>
                <p>✅ HTML template is generated</p>
                <p>✅ Using Nodemailer with Gmail SMTP</p>
                <p>⚠️ Gmail credentials needed for real email sending</p>
                <p>✅ Sends to actual email addresses</p>
              </div>
            </div>

            {/* Test Email Data */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2">📦 Test Email Data</h3>
              <div className="text-sm text-green-600 space-y-1">
                <p><strong>Customer:</strong> {testEmailData.customerName}</p>
                <p><strong>Email:</strong> {testEmailData.customerEmail}</p>
                <p><strong>Order Number:</strong> {testEmailData.orderNumber}</p>
                <p><strong>Total Amount:</strong> ₹{testEmailData.totalAmount}</p>
                <p><strong>Items:</strong> {testEmailData.items.length} items</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Real Email Test */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-700 mb-2">🚀 Real Email Test</h3>
                <p className="text-sm text-purple-600 mb-3">
                  Send actual email (requires RESEND_API_KEY)
                </p>
                <button
                  onClick={sendTestEmail}
                  disabled={isSending}
                  className={`w-full px-4 py-2 rounded-lg font-semibold ${
                    isSending
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  {isSending ? 'Sending...' : 'Send Real Email'}
                </button>
              </div>

              {/* Mock API Test */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-700 mb-2">🔧 Mock API Test</h3>
                <p className="text-sm text-blue-600 mb-3">
                  Test API route with mock response
                </p>
                <button
                  onClick={sendMockEmail}
                  disabled={isSending}
                  className={`w-full px-4 py-2 rounded-lg font-semibold ${
                    isSending
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isSending ? 'Testing...' : 'Test Mock API'}
                </button>
              </div>

              {/* Simulation Test */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-700 mb-2">🎭 Simulation Test</h3>
                <p className="text-sm text-orange-600 mb-3">
                  Simulate email sending (no API key needed)
                </p>
                <button
                  onClick={simulateEmailSending}
                  disabled={isSending}
                  className={`w-full px-4 py-2 rounded-lg font-semibold ${
                    isSending
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {isSending ? 'Simulating...' : 'Simulate Email'}
                </button>
              </div>
            </div>

            {/* Result */}
            {result && (
              <div className={`p-4 rounded-lg border ${
                result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.success ? '✅ Success!' : '❌ Failed'}
                </h3>
                <div className="text-sm">
                  {result.success ? (
                    <div className="text-green-600">
                      {result.emailId && <p>Email ID: {result.emailId}</p>}
                      {result.previewUrl && (
                        <p>
                          <strong>Preview URL:</strong>{' '}
                          <a href={result.previewUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
                            View Email Preview
                          </a>
                        </p>
                      )}
                      {result.message && <p>{result.message}</p>}
                      {!result.message && <p>Email sent successfully! Check the preview URL above or your inbox.</p>}
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <p>Error: {result.error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Email Template Preview */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">📧 Email Template Preview</h3>
              <p className="text-sm text-gray-600 mb-2">
                The email will include a beautiful HTML template with:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Elegant header with brand colors (#f4dcdc, #6f5a4d)</li>
                <li>• Order confirmation message with emoji</li>
                <li>• Order details (number, payment ID)</li>
                <li>• Itemized list with product images</li>
                <li>• Total amount breakdown</li>
                <li>• Shipping address section</li>
                <li>• Next steps and delivery information</li>
                <li>• Contact information footer</li>
              </ul>
            </div>

            {/* Setup Instructions */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-700 mb-2">⚙️ Setup Instructions</h3>
              <div className="text-sm text-yellow-600 space-y-2">
                <p><strong>Current Configuration (Gmail SMTP):</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>✅ <strong>Nodemailer</strong> with Gmail SMTP</li>
                  <li>⚠️ <strong>Gmail credentials required</strong> - see setup below</li>
                  <li>✅ <strong>Real email delivery</strong> to actual addresses</li>
                  <li>✅ <strong>Works with checkout flow</strong> automatically</li>
                </ul>
                <p className="mt-2"><strong>Gmail Setup (Required):</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Enable 2-Factor Authentication on your Gmail</li>
                  <li>Generate App Password (Security → App passwords)</li>
                  <li>Add to .env.local:</li>
                </ol>
                <div className="bg-yellow-100 p-2 rounded text-xs font-mono ml-4 mt-1">
                  GMAIL_USER=your-email@gmail.com<br/>
                  GMAIL_APP_PASSWORD=your-16-char-app-password<br/>
                  SMTP_FROM_EMAIL=noreply@yourdomain.com<br/>
                  SMTP_FROM_NAME=Fave Store
                </div>
                <p className="mt-2"><strong>Note:</strong> The email template is already fully configured and ready to use!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
