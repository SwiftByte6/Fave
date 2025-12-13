'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/products'
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import OrderTracking from '@/component/OrderTracking'

export const dynamic = 'force-dynamic'

interface TrackingResult {
  id: string
  status: string
  shipping_status?: string
  awb_code?: string
  courier_name?: string
  tracking_url?: string
  expected_delivery_date?: string
  actual_delivery_date?: string
  created_at: string
  total_amount: number
  name?: string
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID')
      return
    }

    setLoading(true)
    setError('')
    setTrackingResult(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('orders')
        .select('id, status, shipping_status, awb_code, courier_name, tracking_url, expected_delivery_date, actual_delivery_date, created_at, total_amount, name')
        .eq('id', orderId.trim())
        .single()

      if (supabaseError || !data) {
        setError('Order not found. Please check your Order ID and try again.')
        return
      }

      setTrackingResult(data)
    } catch (err) {
      setError('Failed to fetch order details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F0] to-[#F0E7DE] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#6f5a4d] mb-4">
            Track Your Order
          </h1>
          <p className="text-lg text-[#8A6F5C] max-w-2xl mx-auto">
            Enter your Order ID to get real-time tracking information for your Favee purchase
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#F0E7DE] p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="orderId" className="block text-sm font-medium text-[#6f5a4d] mb-2">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your Order ID (e.g., 12345)"
                className="w-full px-4 py-3 border border-[#F0E7DE] rounded-lg focus:ring-2 focus:ring-[#F4DCDC] focus:border-transparent text-[#6f5a4d]"
                onKeyDown={(e) => e.key === 'Enter' && handleTrackOrder()}
              />
            </div>
            <div className="md:w-auto">
              <label className="block text-sm font-medium text-transparent mb-2">Track</label>
              <button
                onClick={handleTrackOrder}
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-[#F4DCDC] text-[#6f5a4d] rounded-lg hover:bg-[#F0E7DE] transition font-medium disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6f5a4d] mr-2"></div>
                    Tracking...
                  </span>
                ) : (
                  '🔍 Track Order'
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#F0E7DE] p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#6f5a4d]">Order #{trackingResult.id}</h2>
                  <p className="text-sm text-[#8A6F5C]">
                    Placed on {new Date(trackingResult.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(trackingResult.status)}`}>
                    {trackingResult.status}
                  </div>
                  <p className="text-lg font-bold text-[#6f5a4d] mt-1">₹ {trackingResult.total_amount?.toLocaleString()}</p>
                </div>
              </div>

              {trackingResult.name && (
                <div className="border-t pt-4">
                  <p className="text-sm text-[#8A6F5C]">
                    <strong>Customer:</strong> {trackingResult.name}
                  </p>
                </div>
              )}
            </div>

            {/* Shiprocket Tracking */}
            {trackingResult.shipping_status && trackingResult.shipping_status !== 'pending' ? (
              <OrderTracking order={{
                id: trackingResult.id,
                shipping_status: trackingResult.shipping_status,
                awb_code: trackingResult.awb_code,
                courier_name: trackingResult.courier_name,
                tracking_url: trackingResult.tracking_url,
                expected_delivery_date: trackingResult.expected_delivery_date,
                actual_delivery_date: trackingResult.actual_delivery_date
              }} />
            ) : (
              /* Order Status Display */
              <div className="bg-white rounded-2xl shadow-sm border border-[#F0E7DE] p-6">
                <h3 className="text-lg font-semibold text-[#6f5a4d] mb-4">Order Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#F7F2EE] rounded-lg">
                    <div>
                      <p className="font-medium text-[#6f5a4d]">Current Status</p>
                      <p className="text-sm text-[#8A6F5C] capitalize">{trackingResult.status}</p>
                    </div>
                    <div className="text-3xl">
                      {trackingResult.status === 'pending' && '⏳'}
                      {trackingResult.status === 'processing' && '📦'}
                      {trackingResult.status === 'shipped' && '🚚'}
                      {trackingResult.status === 'delivered' && '✅'}
                    </div>
                  </div>
                  
                  <div className="text-sm text-[#8A6F5C]">
                    {trackingResult.status === 'pending' && (
                      <p>📋 Your order has been received and is being prepared for processing.</p>
                    )}
                    {trackingResult.status === 'processing' && (
                      <p>🔄 Your order is being processed and will be shipped soon. You will receive tracking details once shipped.</p>
                    )}
                    {trackingResult.status === 'shipped' && (
                      <p>🚀 Your order has been shipped! Detailed tracking information will be available shortly.</p>
                    )}
                    {trackingResult.status === 'delivered' && (
                      <p>🎉 Your order has been successfully delivered! Thank you for shopping with Favee.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Support */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-700 mb-4">
                If you have any questions about your order or need additional tracking information, our support team is here to help.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`mailto:support@favee.com?subject=Order Inquiry - ${trackingResult.id}&body=Hi, I have a question about my order ${trackingResult.id}.`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  📧 Email Support
                </a>
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                >
                  📞 Call Support
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Instructions for signed-out users */}
        <SignedOut>
          <div className="bg-white rounded-2xl shadow-sm border border-[#F0E7DE] p-8 text-center">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-xl font-semibold text-[#6f5a4d] mb-3">
              Sign in for Complete Order History
            </h2>
            <p className="text-[#8A6F5C] mb-6">
              Sign in to access your complete order history, detailed tracking, and account management features.
            </p>
            <SignInButton mode="redirect" redirectUrl="/signin" forceRedirectUrl="/" fallbackRedirectUrl="/">
              <button className="px-6 py-3 bg-[#F4DCDC] text-[#6f5a4d] rounded-lg hover:bg-[#F0E7DE] transition font-medium">
                Sign In to View All Orders
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        {/* How to find Order ID */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-[#F0E7DE] p-6">
          <h3 className="text-lg font-semibold text-[#6f5a4d] mb-4">Where to Find Your Order ID?</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-[#8A6F5C]">
            <div>
              <h4 className="font-medium text-[#6f5a4d] mb-2">📧 Confirmation Email</h4>
              <p>Check your email for the order confirmation. The Order ID is prominently displayed at the top.</p>
            </div>
            <div>
              <h4 className="font-medium text-[#6f5a4d] mb-2">👤 My Account</h4>
              <p>Sign in and visit the "My Orders" section to see all your Order IDs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}