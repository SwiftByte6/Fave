'use client'

import { useState } from 'react'
import RazorpayPayment from './RazorpayPayment'
import toast from 'react-hot-toast'

const PaymentTest = () => {
  const [testOrderId] = useState('test-order-' + Math.random().toString(36).substr(2, 9))

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData)
    toast.success('Payment test successful!')
  }

  const handlePaymentError = (error: any) => {
    console.error('Payment test failed:', error)
    toast.error('Payment test failed')
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Razorpay Payment Test</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-gray-600 mb-2">Test Amount: ₹100</p>
          <p className="text-sm text-gray-500">Order ID: {testOrderId}</p>
        </div>

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

        <div className="text-xs text-gray-500 text-center">
          <p>Use test card: 4111 1111 1111 1111</p>
          <p>CVV: Any 3 digits | Expiry: Any future date</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentTest

