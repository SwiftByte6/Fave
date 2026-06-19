'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/products'

export const dynamic = 'force-dynamic';
import { removeEveryThing } from '@/Redux/cartSlice'
import SavedAddressesSection from '@/component/SavedAddressesSection'
import { useSavedAddresses } from '@/hooks/useSavedAddresses'
import { useRazorpayCheckout } from '@/hooks/useRazorpayCheckout'
import toast from 'react-hot-toast'
import { openAuthPopup } from '@/lib/auth-popup'

const CheckoutPage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart.cart)

  const [userId, setUserId] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUserId(data?.user?.id ?? null)
      setIsLoaded(true)
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null)
      setIsLoaded(true)
    })
    return () => { mounted = false; sub?.subscription.unsubscribe() }
  }, [])
  const { saveAddress, getDefaultAddress, getRecentAddress } = useSavedAddresses()

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
  const [razorpayOrder, setRazorpayOrder] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [saveCurrentAddress, setSaveCurrentAddress] = useState(false)

  // Initialize Razorpay hook with callbacks
  const { openCheckout } = useRazorpayCheckout({
    onSuccess: (response) => {
      console.log('Razorpay payment successful:', response)
      handlePaymentSuccess(response)
    },
    onError: (error) => {
      console.error('Razorpay payment error:', error)
      handlePaymentError(error)
    },
    onDismiss: () => {
      console.log('Payment dismissed by user')
      toast.info('Payment cancelled. You can retry anytime.')
      setIsProcessing(false)
    },
  })

  // Load default address on mount
  useEffect(() => {
    const defaultAddr = getDefaultAddress()
    const recentAddr = getRecentAddress()
    const addrToUse = defaultAddr || recentAddr

    if (addrToUse) {
      setForm({
        name: addrToUse.name,
        email: addrToUse.email,
        phone: addrToUse.phone,
        address: addrToUse.address,
        city: addrToUse.city,
        pincode: addrToUse.pincode,
        country: addrToUse.country,
      })
    }
  }, [])

  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.price * (item.cartQuantity || 1), 0)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSelectSavedAddress = (address) => {
    setForm({
      name: address.name,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      pincode: address.pincode,
      country: address.country,
    })
    toast.success('Address loaded!')
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
      openAuthPopup('/checkout')
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
        size: item.selectedSize || item.size || '', // Use selectedSize first, fallback to size
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

      // Save address if user opted to save it
      if (saveCurrentAddress) {
        saveAddress({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
          country: form.country,
          isDefault: false,
        })
      }

      console.log('Order created successfully:', order)
      console.log('Order items:', order.items)
      console.log('Items count:', order.items?.length || 0)

      // Create Razorpay order
      const razorpayResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: calculateSubtotal(),
          currency: 'INR',
          receipt: order.id,
        }),
      })

      if (!razorpayResponse.ok) {
        const errorData = await razorpayResponse.json()
        throw new Error(errorData.error || 'Failed to create Razorpay order')
      }

      const razorpayOrderData = await razorpayResponse.json()

      // Update order with Razorpay order ID
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          razorpay_order_id: razorpayOrderData.id,
        })
        .eq('id', order.id)

      if (updateError) {
        console.error('Failed to update order with Razorpay ID:', updateError)
        throw new Error('Failed to save Razorpay order ID')
      }
      
      setOrderId(order.id)
      setRazorpayOrder({
        id: razorpayOrderData.id,
        amount: calculateSubtotal() * 100, // Convert to paise
        currency: 'INR',
        appOrderId: order.id,
      })
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
      
      // Update order status to paid in database
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'success',
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('Failed to update order status:', updateError)
        throw new Error('Failed to update order status')
      }

      // Store order details for success page
      localStorage.setItem('lastOrder', JSON.stringify({
        orderNumber: orderId,
        paymentId: paymentData.razorpay_payment_id
      }))

      dispatch(removeEveryThing())
      toast.success('Payment successful! Order confirmed.')
      router.push(`/order-success?order=${orderId}&payment=${paymentData.razorpay_payment_id}`)
    } catch (error) {
      console.error('Payment success handling error:', error)
      toast.error('There was an issue updating your order. Please contact support.')
    }
  }

  const handlePaymentError = (error) => {
    console.error('Payment error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    toast.error(errorMessage)
    setIsProcessing(false)
  }

  const handleProceedToPayment = async () => {
    if (!orderId || !razorpayOrder) {
      toast.error('Order not ready. Please try again.')
      return
    }

    setIsProcessing(true)
    await openCheckout(razorpayOrder)
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
        <div className="w-full md:w-[65%]">
          {/* Saved Addresses Section */}
          <SavedAddressesSection onSelectAddress={handleSelectSavedAddress} />

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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

          {/* Save Address Checkbox */}
          <div className="mt-5 flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <input
              type="checkbox"
              id="saveAddress"
              checked={saveCurrentAddress}
              onChange={(e) => setSaveCurrentAddress(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="saveAddress" className="text-sm text-gray-700 cursor-pointer">
              Save this address for future orders
            </label>
          </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-[35%] bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h2>
          <div className="space-y-3">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-gray-900 font-medium">{item.title}</span>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                      )}
                      <span className="text-sm text-gray-600"> x {item.cartQuantity}</span>
                    </div>
                    <span className="text-orange-600 font-semibold">₹ {(item.price * (item.cartQuantity || 1)).toFixed(0)}</span>
                  </div>
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
                  : 'bg-red-800 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-linear-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-500 hover:before:left-full'
              }`}
            >
              {isProcessing ? 'Creating Order...' : 'Proceed to Payment'}
            </button>
          ) : (
            <div className="mt-4 space-y-3">
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing || !razorpayOrder}
                className={`w-full py-3 rounded-md font-semibold transition-all duration-300 ${
                  isProcessing || !razorpayOrder
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Pay Now with Razorpay'}
              </button>
              <button
                onClick={() => {
                  setShowPayment(false)
                  setOrderId(null)
                  setRazorpayOrder(null)
                }}
                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition"
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
