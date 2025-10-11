'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OrderSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState(null)

  // Get order details from URL params or localStorage
  useEffect(() => {
    const orderNumber = searchParams.get('order')
    const paymentId = searchParams.get('payment')
    
    if (orderNumber && paymentId) {
      setOrderDetails({
        orderNumber,
        paymentId
      })
    } else {
      // Try to get from localStorage as fallback
      const storedOrder = localStorage.getItem('lastOrder')
      if (storedOrder) {
        try {
          setOrderDetails(JSON.parse(storedOrder))
        } catch (error) {
          console.error('Error parsing stored order:', error)
        }
      }
    }

    // Auto redirect after 10 seconds (optional)
    const timer = setTimeout(() => {
      router.push('/')
    }, 10000)
    return () => clearTimeout(timer)
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7F5] p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center max-w-lg w-full border border-pink-100">
        
        {/* Success Icon */}
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-gray-500 mb-6">
          Thank you for your purchase! Your payment has been processed successfully and your order is confirmed.
        </p>

        {/* Order Details */}
        {orderDetails && (
          <div className="bg-pink-50 rounded-lg p-4 mb-6 text-left text-gray-600">
            <p><span className="font-semibold">Order Number:</span> {orderDetails.orderNumber}</p>
            <p><span className="font-semibold">Payment ID:</span> {orderDetails.paymentId}</p>
            <p><span className="font-semibold">Estimated Delivery:</span> 3-5 business days</p>
            <p className="text-sm text-gray-500 mt-2">
              ✅ A confirmation email has been sent to your registered email address.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Check your inbox (and spam folder) for the order confirmation email.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/')}
            className="bg-[#F4DCDC] hover:bg-[#F0E7DE] text-[#6f5a4d] font-semibold px-6 py-2 rounded-full transition shadow hover:scale-105"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push('/orders')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded-full transition shadow hover:scale-105"
          >
            View My Orders
          </button>
        </div>

        {/* Auto redirect notice */}
        <p className="text-xs text-gray-400 mt-4">
          You will be automatically redirected to the homepage in 10 seconds
        </p>
      </div>
    </div>
  )
}
