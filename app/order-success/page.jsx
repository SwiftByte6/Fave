'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function OrderSuccess() {
  const router = useRouter()

  // Auto redirect after 6 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 6000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7F5] p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center max-w-lg w-full border border-pink-100">
        
        {/* Success Icon */}
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
          Order Placed Successfully!
        </h1>
        
        <p className="text-gray-500 mb-6">
          Thank you for shopping with us. Your order has been confirmed and will be processed shortly.
        </p>

        {/* Order Details (optional) */}
        <div className="bg-pink-50 rounded-lg p-4 mb-6 text-left text-gray-600">
          <p><span className="font-semibold">Order ID:</span> #{Math.floor(100000 + Math.random() * 900000)}</p>
          <p><span className="font-semibold">Estimated Delivery:</span> 3-5 business days</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/')}
            className="bg-pink-200 hover:bg-pink-300 text-gray-700 font-semibold px-6 py-2 rounded transition shadow"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push('/orders')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded transition shadow"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  )
}
