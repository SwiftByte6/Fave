'use client'

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/products'
import { useAuth } from '@clerk/nextjs'  // ✅ client-safe
import {removeEveryThing} from '@/Redux/cartSlice.ts'
import { removeCart, updateCartQuantity } from '@/Redux/cartSlice'

const CheckoutPage = () => {
  const router = useRouter()
  const dispatch=useDispatch();
  const cart = useSelector((state) => state.cart.cart)

  const { userId, isLoaded } = useAuth() // ✅ works in client component

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    country: 'India'
  })

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * (item.cartQuantity || 1), 0)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      alert('Please fill in all required fields')
      return
    }

    if (!isLoaded || !userId) {
      alert('Please login to place an order')
      router.push('/sign-in')
      return
    }

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId, 
          ...form,
          total_amount: calculateSubtotal()
        }
      ])
      .select()
      .single()

    if (orderError) {
      console.error(orderError)
      alert('Error placing order')
      return
    }

    const orderItems = cart.map(item => ({
  order_id: orderData.id,
  title: item.title,
  price: item.price,
  quantity: item.cartQuantity || 1
}))

const { error: itemsError } = await supabase
  .from('order_items')
  .insert(orderItems)

if (itemsError) {
  console.error('Error inserting order items:', itemsError)
  alert('Error saving order items')
  return
}


    alert('Order placed successfully!')
    dispatch(removeEveryThing())
    router.push('/order-success')
  }

  return (
   
        <div className="bg-[#FFF7F5] min-h-screen">
      {/* Header */}
      <div className="h-[10vh] md:h-[15vh] bg-[#F8E9F1] flex flex-col justify-center items-center shadow-md">
        <h1 className="text-3xl font-bold md:text-4xl text-gray-700">Checkout</h1>
        <h2 className="text-sm text-gray-400">Home / Checkout</h2>
      </div>

      <div className="flex flex-col md:flex-row w-full p-4 md:p-8 gap-6">
        {/* Billing Form */}
        <div className="w-full md:w-[65%] bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Billing & Shipping Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Full Name*" value={form.name} onChange={handleChange} className="border p-3 rounded" />
            <input type="email" name="email" placeholder="Email*" value={form.email} onChange={handleChange} className="border p-3 rounded" />
            <input type="tel" name="phone" placeholder="Phone*" value={form.phone} onChange={handleChange} className="border p-3 rounded" />
            <input type="text" name="city" placeholder="City" value={form.city} onChange={handleChange} className="border p-3 rounded" />
          </div>
          <textarea name="address" placeholder="Full Address*" value={form.address} onChange={handleChange} className="border p-3 rounded w-full mt-4"></textarea>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <input type="text" name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} className="border p-3 rounded" />
            <input type="text" name="country" placeholder="Country" value={form.country} onChange={handleChange} className="border p-3 rounded" />
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-[35%] bg-[#F8E9F1] p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Order Summary</h2>
          <div className="space-y-3">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center bg-white p-3 rounded">
                  <span className="text-gray-700">{item.title} x {item.cartQuantity}</span>
                  <span className="text-gray-700 font-semibold">INR {(item.price * (item.cartQuantity || 1)).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Your cart is empty</p>
            )}
          </div>
          <hr className="my-4 border-pink-100" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>INR {calculateSubtotal().toFixed(2)}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="mt-4 w-full bg-pink-200 text-gray-700 py-2 rounded hover:bg-pink-300 transition font-semibold shadow"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
  
}

export default CheckoutPage
