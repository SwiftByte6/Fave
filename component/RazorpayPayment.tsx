'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface RazorpayPaymentProps {
  amount: number
  orderId: string
  userDetails: {
    name: string
    email: string
    phone: string
  }
  onSuccess: (paymentData: any) => void
  onError: (error: any) => void
}

declare global {
  interface Window {
    Razorpay: any
  }
}

const RazorpayPayment = ({ amount, orderId, userDetails, onSuccess, onError }: RazorpayPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script')
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        name: 'Elegance Boutique',
        description: `Order #${orderId}`,
        image: '/favicon.ico',
        order_id: '', // Will be set after creating order
        handler: function (response: any) {
          console.log('Payment successful:', response)
          onSuccess(response)
        },
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        notes: {
          order_id: orderId,
        },
        theme: {
          color: '#F4DCDC',
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false)
            toast.error('Payment cancelled')
          }
        }
      }

      // Create Razorpay order first
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount, // Don't double convert - API will handle conversion
          currency: 'INR',
          receipt: orderId,
        }),
      })

      console.log('Order response status:', orderResponse.status);
      
      if (!orderResponse.ok) {
        const errorText = await orderResponse.text();
        console.error('Order creation failed:', errorText);
        throw new Error('Failed to create Razorpay order')
      }

      const orderData = await orderResponse.json()
      console.log('Order creation response:', orderData)
      
      if (!orderData.id) {
        throw new Error('Invalid order response')
      }
      
      options.order_id = orderData.id

      // Store Razorpay order ID in the database order
      try {
        await fetch('/api/orders/update-razorpay-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: orderId,
            razorpayOrderId: orderData.id
          }),
        })
      } catch (error) {
        console.error('Failed to update order with Razorpay order ID:', error)
        // Don't fail the payment process for this
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response)
        onError(response)
        setIsLoading(false)
      })

      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      onError(error)
      setIsLoading(false)
      toast.error('Payment failed. Please try again.')
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`w-full py-3 px-6 rounded-full font-semibold text-lg transition-all duration-200 ${
        isLoading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-[#F4DCDC] text-[#6f5a4d] hover:bg-[#F0E7DE] hover:scale-105 shadow-lg hover:shadow-xl'
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#6f5a4d] mr-2"></div>
          Processing...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Pay ₹{amount.toLocaleString()}
        </div>
      )}
    </button>
  )
}

export default RazorpayPayment

