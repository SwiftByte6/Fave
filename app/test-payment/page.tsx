'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import RazorpayPayment from '@/component/RazorpayPayment'
import toast from 'react-hot-toast'

export default function TestPaymentPage() {
  const { userId, isLoaded } = useAuth()
  const [testOrderId, setTestOrderId] = useState(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)

  const createTestOrder = async () => {
    if (!isLoaded || !userId) {
      toast.error('Please login first')
      return
    }

    setIsCreatingOrder(true)

    try {
      // Create a test order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: {
            name: 'Test User',
            email: 'test@example.com',
            phone: '9876543210',
            address: 'Test Address, Test City',
            city: 'Test City',
            pincode: '123456',
            country: 'India'
          },
          items: [
            {
              id: 'test-item-1',
              title: 'Test Product',
              price: 100,
              quantity: 1,
              images: ['/favicon.ico']
            }
          ],
          total: 100,
          status: 'pending'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create test order')
      }

      const result = await response.json()
      setTestOrderId(result.orderId)
      toast.success('Test order created!')
    } catch (error) {
      console.error('Error creating test order:', error)
      toast.error('Failed to create test order')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  const handlePaymentSuccess = async (paymentData) => {
    try {
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          order_id: testOrderId,
        }),
      })

      if (!response.ok) {
        throw new Error('Payment verification failed')
      }

      const result = await response.json()
      toast.success('Payment successful! Check your email.')
      console.log('Payment result:', result)
    } catch (error) {
      console.error('Payment verification error:', error)
      toast.error('Payment verification failed')
    }
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
    toast.error('Payment failed')
  }

  return (
    <div className="min-h-screen bg-[#FBF8F6] p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#6f5a4d] mb-6 text-center">
            Test Payment Flow
          </h1>

          <div className="space-y-6">
            {/* Environment Check */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Environment Check</h3>
              <div className="space-y-1 text-sm">
                <p>Razorpay Key ID: {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing'}</p>
                <p>Resend API Key: {process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing'}</p>
                <p>User Status: {isLoaded ? (userId ? '✅ Logged In' : '❌ Not Logged In') : '⏳ Loading...'}</p>
              </div>
            </div>

            {/* Test Order Creation */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">Step 1: Create Test Order</h3>
              <p className="text-sm text-blue-600 mb-3">
                This creates a test order with sample data for payment testing.
              </p>
              <button
                onClick={createTestOrder}
                disabled={isCreatingOrder || !userId}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  isCreatingOrder || !userId
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isCreatingOrder ? 'Creating...' : 'Create Test Order'}
              </button>
              {testOrderId && (
                <p className="text-sm text-green-600 mt-2">
                  ✅ Order Created: {testOrderId}
                </p>
              )}
            </div>

            {/* Payment Test */}
            {testOrderId && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">Step 2: Test Payment</h3>
                <p className="text-sm text-green-600 mb-3">
                  Use Razorpay test card: 4111 1111 1111 1111 (any CVV, future expiry)
                </p>
                <RazorpayPayment
                  amount={100}
                  orderId={testOrderId}
                  userDetails={{
                    name: 'Test User',
                    email: 'test@example.com',
                    phone: '9876543210'
                  }}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            )}

            {/* Instructions */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-700 mb-2">Test Instructions</h3>
              <ul className="text-sm text-yellow-600 space-y-1">
                <li>• Make sure you're logged in</li>
                <li>• Create a test order first</li>
                <li>• Use Razorpay test card: 4111 1111 1111 1111</li>
                <li>• Check your email for confirmation</li>
                <li>• Check browser console for logs</li>
              </ul>
            </div>

            {/* Reset */}
            <div className="text-center">
              <button
                onClick={() => {
                  setTestOrderId(null)
                  toast.success('Test reset')
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Reset Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}