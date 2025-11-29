'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase/products'

export const dynamic = 'force-dynamic';
import { removeEveryThing } from '@/Redux/cartSlice'
import RazorpayPayment from '@/component/RazorpayPayment'
import toast from 'react-hot-toast'

const CheckoutPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.cart)

  const { userId, isLoaded } = useAuth() // ✅ safe in client component

  // Quick runtime sanity checks for Supabase client config (anon key usage)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    country: 'India'
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [showPayment, setShowPayment] = useState(false)

  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.price * (item.cartQuantity || 1), 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleCreateOrder = async () => {
    // Validation
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!supabaseUrl || !supabaseAnon) {
      toast.error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      return
    }

    if (!isLoaded || !userId) {
      toast.error('Please login to place an order')
      router.push('/signin')
      return
    }

    if (!cart.length) {
      toast.error('Your cart is empty')
      return
    }

    setIsProcessing(true)

    try {
      // Generate order number
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`

      // Prepare cart items for database insertion
      const cartItems = cart.map((item) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        title: item.title || item.name || 'Unknown Product',
        price: parseFloat(item.price) || 0,
        quantity: parseInt(item.cartQuantity) || 1,
        images: Array.isArray(item.images)
          ? item.images
          : (item.image ? [item.image] : (item.thumbnail ? [item.thumbnail] : [])),
        description: item.description || '',
        category: item.category || '',
        size: item.size || '',
        color: item.color || '',
        sku: item.sku || '',
        total_price: parseFloat(item.price) * (parseInt(item.cartQuantity) || 1)
      }))

      console.log('Cart items being inserted:', cartItems)
      console.log('Total cart items:', cartItems.length)

      // Create order with items as JSON
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            total_amount: calculateSubtotal(),
            status: 'pending',
            payment_status: 'pending',
            payment_method: 'razorpay',
            order_number: orderNumber,
            items: cartItems,
            ...form,
          },
        ])
        .select()
        .single()

      if (orderError || !order) {
        console.error('Order insert error:', orderError)
        toast.error(orderError?.message || 'Failed to create order. Please try again.')
        setIsProcessing(false)
        return
      }

      console.log('Order created successfully:', order)
      console.log('Order items:', order.items)
      console.log('Items count:', order.items?.length || 0)
      
      setOrderId(order.id)
      setShowPayment(true)
      setIsProcessing(false)
      toast.success('Order created! Please complete payment.')
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('An unexpected error occurred. Please try again.')
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async (paymentData) => {
    try {
      console.log('Payment success data:', paymentData);
      console.log('Order ID:', orderId);
      
      // Verify payment with backend
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          order_id: orderId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment verification response:', response.status, errorText);
        throw new Error(`Payment verification failed: ${response.status}`)
      }

      const result = await response.json()
      
      // Store order details for success page
      localStorage.setItem('lastOrder', JSON.stringify({
        orderNumber: result.order_number,
        paymentId: paymentData.razorpay_payment_id
      }))

      dispatch(removeEveryThing())
      toast.success('Payment successful! Order confirmed.')
      router.push(`/order-success?order=${result.order_number}&payment=${paymentData.razorpay_payment_id}`)
    } catch (error) {
      console.error('Payment verification error:', error)
      toast.error('Payment verification failed. Please contact support.')
    }
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
    toast.error('Payment failed. Please try again.')
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="py-8 flex flex-col justify-center items-center">
        <div className="px-6 py-2 rounded-full bg-white shadow-sm mb-2 border border-gray-200">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
        </div>
        <h2 className="text-xs sm:text-sm text-gray-500">Home / Checkout</h2>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pb-10 gap-6">
        {/* Billing Form */}
        <div className="w-full md:w-[65%] bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Billing & Shipping Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name', 'email', 'phone', 'city'].map((field) => (
              <input
                key={field}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (['name', 'email', 'phone'].includes(field) ? '*' : '')}
                value={form[field]}
                onChange={handleChange}
                className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            ))}
          </div>

          <textarea
            name="address"
            placeholder="Full Address*"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className="border border-gray-200 p-3 rounded-md w-full mt-4 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
          ></textarea>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="border border-gray-200 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-[35%] bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h2>
          <div className="space-y-3">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                  <span className="text-gray-900">{item.title} x {item.cartQuantity}</span>
                  <span className="text-orange-600 font-semibold">₹ {(item.price * (item.cartQuantity || 1)).toFixed(0)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Your cart is empty</p>
            )}
          </div>
          <hr className="my-4 border-gray-200" />
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span className="text-orange-600">₹ {calculateSubtotal().toFixed(0)}</span>
          </div>
          {!showPayment ? (
            <button
              onClick={handleCreateOrder}
              disabled={isProcessing || cart.length === 0}
              className={`group/btn relative overflow-hidden mt-4 w-full py-3 rounded-md font-semibold transition-all duration-300 ${
                isProcessing || cart.length === 0
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-red-800 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-500 hover:before:left-[100%]'
              }`}
            >
              {isProcessing ? 'Creating Order...' : 'Proceed to Payment'}
            </button>
          ) : (
            <div className="mt-4">
              <RazorpayPayment
                amount={calculateSubtotal()}
                orderId={orderId}
                userDetails={{
                  name: form.name,
                  email: form.email,
                  phone: form.phone,
                }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
              <button
                onClick={() => setShowPayment(false)}
                className="mt-2 w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition"
              >
                ← Back to Order Details
              </button>
            </div>
          )}

          {cart.length > 0 && (
            <p className="text-xs text-gray-500 mt-2 text-center">
              Your order will automatically appear in your order history
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
