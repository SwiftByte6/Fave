'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState(null)

  const testEmailData = {
    orderId: 'test-order-123',
    customerName: 'Test User',
    customerEmail: 'rohitsoneji6@gmail.com', // Change this to your email for testing
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
    } catch (error) {
      setResult({
        success: false,
        error: error.message
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
            Test Email Service
          </h1>

          <div className="space-y-6">
             {/* Environment Check */}
             <div className="bg-gray-50 p-4 rounded-lg">
               <h3 className="font-semibold text-gray-700 mb-2">Environment Check</h3>
               <div className="space-y-1 text-sm">
                 <p>Email API Route: ✅ Available</p>
                 <p className="text-xs text-gray-500">
                   Note: RESEND_API_KEY is checked server-side in the API route
                 </p>
               </div>
             </div>

            {/* Test Email Data */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Test Email Data</h3>
              <div className="text-sm text-blue-600 space-y-1">
                <p><strong>Customer:</strong> {testEmailData.customerName}</p>
                <p><strong>Email:</strong> {testEmailData.customerEmail}</p>
                <p><strong>Order Number:</strong> {testEmailData.orderNumber}</p>
                <p><strong>Total Amount:</strong> ₹{testEmailData.totalAmount}</p>
                <p><strong>Items:</strong> {testEmailData.items.length} items</p>
              </div>
              <p className="text-xs text-blue-500 mt-2">
                💡 Change the email address in the code to test with your email
              </p>
            </div>

            {/* Send Test Email */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Send Test Email</h3>
              <p className="text-sm text-green-600 mb-3">
                This will send a test order confirmation email using the Resend service.
              </p>
              <button
                onClick={sendTestEmail}
                disabled={isSending}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  isSending
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isSending ? 'Sending...' : 'Send Test Email'}
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className={`p-4 rounded-lg ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.success ? '✅ Email Sent Successfully!' : '❌ Email Failed'}
                </h3>
                <div className="text-sm">
                  {result.success ? (
                    <div className="text-green-600">
                      <p>Email ID: {result.emailId}</p>
                      <p>Check your inbox for the order confirmation email!</p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <p>Error: {result.error}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

             {/* Instructions */}
             <div className="bg-yellow-50 p-4 rounded-lg">
               <h3 className="font-semibold text-yellow-700 mb-2">Instructions</h3>
               <ul className="text-sm text-yellow-600 space-y-1">
                 <li>• Make sure RESEND_API_KEY is set in your .env.local</li>
                 <li>• The email will be sent to: {testEmailData.customerEmail}</li>
                 <li>• Check your email inbox (and spam folder)</li>
                 <li>• The email will have a beautiful HTML template</li>
                 <li>• Verify all order details are correct</li>
                 <li>• If you get an error, check the server logs for details</li>
               </ul>
             </div>

            {/* Email Preview */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-2">Email Preview</h3>
              <p className="text-sm text-purple-600 mb-2">
                The email will include:
              </p>
              <ul className="text-sm text-purple-600 space-y-1 ml-4">
                <li>• Elegant header with your brand colors</li>
                <li>• Order confirmation message</li>
                <li>• Order details (number, payment ID)</li>
                <li>• Itemized list with product images</li>
                <li>• Total amount breakdown</li>
                <li>• Shipping address</li>
                <li>• Next steps and delivery info</li>
                <li>• Contact information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
