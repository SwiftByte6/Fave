'use client'

import { useState } from 'react'

export default function EmailConfigTestPage() {
  const [isTesting, setIsTesting] = useState(false)
  const [result, setResult] = useState(null)

  const testEmailConfig = async () => {
    setIsTesting(true)
    setResult(null)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: 'config-test-123',
          customerName: 'Config Test User',
          customerEmail: 'test@example.com',
          totalAmount: 1000,
          items: [
            {
              title: 'Test Product',
              price: 1000,
              quantity: 1,
              images: ['/favicon.ico']
            }
          ],
          paymentId: 'pay_config_test',
          orderNumber: 'CONFIG-123',
          address: {
            name: 'Test User',
            address: '123 Test Street',
            city: 'Test City',
            pincode: '123456',
            country: 'India',
            phone: '9876543210'
          }
        }),
      })

      const emailResult = await response.json()
      setResult(emailResult)
    } catch (error: any) {
      setResult({
        success: false,
        error: error?.message || 'Unknown error occurred'
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF8F6] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#6f5a4d] mb-6 text-center">
            🔧 Email Configuration Test
          </h1>

          <div className="space-y-6">
            {/* Configuration Status */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-700 mb-2">📋 Current Configuration</h3>
              <div className="text-sm text-blue-600 space-y-1">
                <p><strong>Priority 1:</strong> Gmail SMTP (if GMAIL_USER and GMAIL_APP_PASSWORD are set)</p>
                <p><strong>Priority 2:</strong> Ethereal Email (fake SMTP for testing)</p>
                <p><strong>Priority 3:</strong> Custom SMTP (if SMTP_HOST is set)</p>
                <p className="text-xs text-gray-500 mt-2">
                  Check console logs to see which service is being used
                </p>
              </div>
            </div>

            {/* Test Button */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-700 mb-2">🧪 Test Email Configuration</h3>
              <p className="text-sm text-green-600 mb-3">
                This will test the email service and show which configuration is being used.
              </p>
              <button
                onClick={testEmailConfig}
                disabled={isTesting}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  isTesting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isTesting ? 'Testing...' : 'Test Email Configuration'}
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className={`p-4 rounded-lg border ${
                result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.success ? '✅ Configuration Test Successful!' : '❌ Configuration Test Failed'}
                </h3>
                <div className="text-sm">
                  {result.success ? (
                    <div className="text-green-600">
                      <p>Email ID: {result.emailId}</p>
                      {result.message && <p>{result.message}</p>}
                      <p className="mt-2 text-xs">
                        Check the console logs to see which email service was used.
                      </p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <p>Error: {result.error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Setup Instructions */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-700 mb-2">⚙️ Setup Instructions</h3>
              <div className="text-sm text-yellow-600 space-y-2">
                <p><strong>For Real Email Sending (Gmail):</strong></p>
                <div className="bg-yellow-100 p-2 rounded text-xs font-mono ml-4">
                  GMAIL_USER=your-email@gmail.com<br/>
                  GMAIL_APP_PASSWORD=your-16-char-app-password
                </div>
                <p className="mt-2"><strong>For Testing (Ethereal Email):</strong></p>
                <p className="text-xs ml-4">No setup required - works automatically for testing</p>
                <p className="mt-2"><strong>For Production (Custom SMTP):</strong></p>
                <div className="bg-yellow-100 p-2 rounded text-xs font-mono ml-4">
                  SMTP_HOST=smtp.yourprovider.com<br/>
                  SMTP_PORT=587<br/>
                  SMTP_USER=your-email<br/>
                  SMTP_PASS=your-password
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
