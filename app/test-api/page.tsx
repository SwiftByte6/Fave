'use client'

import { useState } from 'react'

export default function TestAPIRoute() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const testPaymentVerification = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: 'order_test123',
          razorpay_payment_id: 'pay_test123',
          razorpay_signature: 'test_signature',
          order_id: 'test_order_id'
        }),
      })

      const data = await response.json()
      setResult({
        status: response.status,
        data: data
      })
    } catch (error) {
      setResult({
        status: 'error',
        data: { error: error.message }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testCreateOrder = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 100,
          currency: 'INR',
          receipt: 'test_receipt'
        }),
      })

      const data = await response.json()
      setResult({
        status: response.status,
        data: data
      })
    } catch (error) {
      setResult({
        status: 'error',
        data: { error: error.message }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FBF8F6] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#6f5a4d] mb-6 text-center">
            Test API Routes
          </h1>

          <div className="space-y-6">
            {/* Test Create Order */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Test Create Order API</h3>
              <p className="text-sm text-blue-600 mb-3">
                Test the Razorpay order creation endpoint
              </p>
              <button
                onClick={testCreateOrder}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isLoading ? 'Testing...' : 'Test Create Order'}
              </button>
            </div>

            {/* Test Payment Verification */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Test Payment Verification API</h3>
              <p className="text-sm text-green-600 mb-3">
                Test the payment verification endpoint (this should return an error due to invalid signature)
              </p>
              <button
                onClick={testPaymentVerification}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isLoading ? 'Testing...' : 'Test Payment Verification'}
              </button>
            </div>

            {/* Result */}
            {result && (
              <div className={`p-4 rounded-lg ${
                result.status === 200 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  result.status === 200 ? 'text-green-700' : 'text-red-700'
                }`}>
                  API Response
                </h3>
                <div className="text-sm">
                  <p><strong>Status:</strong> {result.status}</p>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-700 mb-2">What to Expect</h3>
              <ul className="text-sm text-yellow-600 space-y-1">
                <li>• <strong>Create Order:</strong> Should return 200 with order details</li>
                <li>• <strong>Payment Verification:</strong> Should return 400 (invalid signature) - this is expected</li>
                <li>• <strong>404 Error:</strong> Means the route isn't found - check file structure</li>
                <li>• <strong>500 Error:</strong> Means server error - check environment variables</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
