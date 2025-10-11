'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase/products'
import { removeEveryThing } from '@/Redux/cartSlice'

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

  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.price * (item.cartQuantity || 1), 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    // Validation
    if (!form.name || !form.email || !form.phone || !form.address) {
      alert('Please fill in all required fields')
      return
    }

    if (!supabaseUrl || !supabaseAnon) {
      alert('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
      return
    }

    if (!isLoaded || !userId) {
      alert('Please login to place an order')
      router.push('/signin')
      return
    }

    if (!cart.length) {
      alert('Your cart is empty')
      return
    }

    setIsProcessing(true)

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            total_amount: calculateSubtotal(),
            status: 'success',
            ...form,
          },
        ])
        .select()
        .single()

      if (orderError || !order) {
        console.error('Order insert error:', orderError)
        alert(orderError?.message || 'Failed to create order. Please try again.')
        setIsProcessing(false)
        return
      }

      // Create order items
      const itemsPayload = cart.map((item) => ({
        order_id: order.id,
        title: item.title,
        price: item.price,
        quantity: item.cartQuantity || 1,
        images: Array.isArray(item.images)
          ? item.images
          : (item.image ? [item.image] : (item.thumbnail ? [item.thumbnail] : [])),
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsPayload)

      if (itemsError) {
        console.error('Order items insert error:', itemsError)
        alert(itemsError?.message || 'Failed to create order items. Please try again.')
        setIsProcessing(false)
        return
      }

      dispatch(removeEveryThing())
      alert('Order placed successfully!')
      router.push('/order-success')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-[#FBF8F6] min-h-screen">
      {/* Header */}
      <div className="py-8 flex flex-col justify-center items-center">
        <div className="px-6 py-2 rounded-full bg-[#F4DCDC] shadow-sm mb-2">
          <h1 className="dancing text-[1.8rem] sm:text-[2.2rem] md:text-[2.6rem] text-[#6f5a4d]">Checkout</h1>
        </div>
        <h2 className="text-xs sm:text-sm text-[#8A6F5C]">Home / Checkout</h2>
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pb-10 gap-6">
        {/* Billing Form */}
        <div className="w-full md:w-[65%] bg-white p-6 rounded-xl shadow-sm border border-[#F0E7DE]">
          <h2 className="text-xl font-semibold mb-4 text-[#6f5a4d]">Billing & Shipping Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name', 'email', 'phone', 'city'].map((field) => (
              <input
                key={field}
                type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (['name', 'email', 'phone'].includes(field) ? '*' : '')}
                value={form[field]}
                onChange={handleChange}
                className="border border-[#F0E7DE] p-3 rounded focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            ))}
          </div>

          <textarea
            name="address"
            placeholder="Full Address*"
            value={form.address}
            onChange={handleChange}
            rows={3}
            className="border border-[#F0E7DE] p-3 rounded w-full mt-4 focus:outline-none focus:ring-2 focus:ring-rose-200"
          ></textarea>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="border border-[#F0E7DE] p-3 rounded focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="border border-[#F0E7DE] p-3 rounded focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-[35%] bg-white border border-[#F0E7DE] p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-[#6f5a4d]">Order Summary</h2>
          <div className="space-y-3">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-[#FBF1F4] p-3 rounded">
                  <span className="text-[#6f5a4d]">{item.title} x {item.cartQuantity}</span>
                  <span className="text-[#6f5a4d] font-semibold">INR {(item.price * (item.cartQuantity || 1)).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-[#8A6F5C]">Your cart is empty</p>
            )}
          </div>
          <hr className="my-4 border-[#F0E7DE]" />
          <div className="flex justify-between text-lg font-bold text-[#6f5a4d]">
            <span>Total</span>
            <span>INR {calculateSubtotal().toFixed(2)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={isProcessing || cart.length === 0}
            className={`mt-4 w-full py-3 rounded-full font-semibold shadow-sm transition ${
              isProcessing || cart.length === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-[#F4DCDC] text-[#6f5a4d] hover:opacity-90'
            }`}
          >
            {isProcessing ? 'Processing Order...' : 'Place Order'}
          </button>

          {cart.length > 0 && (
            <p className="text-xs text-[#8A6F5C] mt-2 text-center">
              Your order will automatically appear in your order history
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
