'use client'

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/Redux/store'
import Image from 'next/image'
import { removeCart, updateCartQuantity } from '@/Redux/cartSlice'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/products'

const CartSection = () => {
    const router=useRouter();
    const cart = useSelector((state: RootState) => state.cart.cart)
    const dispatch = useDispatch()
    console.log(cart)

    const RemoveProduct = (itemId: any) => {
        dispatch(removeCart(itemId))
    }

    const calculateSubtotal = () => {
        return cart.reduce((total, item) => total + item.price * (item.cartQuantity || 1), 0)
    }

    const handleCheckout = async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
            router.push('/checkout')
            return
        }

        router.push('/signin')
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className='py-8 flex flex-col justify-center items-center'>
                <div className='px-6 py-2 rounded-full bg-white shadow-sm mb-2 border border-gray-200'>
                    <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900'>Shopping Cart</h1>
                </div>
                <h2 className='text-xs sm:text-sm text-gray-500'>Home / cart</h2>
            </div>

            {/* Cart Layout */}
            <div className='w-full flex flex-col lg:flex-row max-w-6xl mx-auto px-3 sm:px-4 md:px-6'>
                {/* Left Side - Product List */}
                <div className="w-full lg:w-[70%] p-0 sm:p-0">
                    <div className='w-full lg:w-[95%] mx-auto'>
                        {/* Table Header */}
                        <div className='bg-white border border-gray-200 p-2 sm:p-3 flex justify-between font-semibold text-xs sm:text-sm md:text-base rounded-xl'>
                            <div className='w-[50%] text-gray-900'>Products</div>
                            <div className='w-[50%] flex justify-between'>
                                <div className="text-gray-900">Price</div>
                                <div className="text-gray-900">Qty</div>
                                <div className="text-gray-900">Subtotal</div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        {cart.length > 0 ? (
                            cart.map((item, index) => (
                                <div 
                                onClick={() => router.push(`/products/${item.id}`)}
                                key={index} className='flex flex-col lg:flex-row border-b border-gray-100 p-2 sm:p-3 bg-white hover:bg-gray-50 transition'>
                                    {/* Left: Image and Info */}
                                    <div className='w-full lg:w-[50%] flex items-start gap-2 sm:gap-3'>
                                        <button onClick={(e) => { e.stopPropagation(); RemoveProduct(item.id) }} className='text-gray-400 hover:text-red-500 text-lg cursor-pointer hover:bg-red-50 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transition'>×</button>
                                        <div className='w-20 h-20 sm:w-25 sm:h-25 shrink-0 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center'>
                                            <Image src={item.images?.[0]} width={100} height={100} alt="product" className="object-contain w-full h-full" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className='font-semibold text-base sm:text-lg text-gray-900 line-clamp-2'>{item.title}</h2>
                                            <p className='text-xs sm:text-sm text-gray-500 line-clamp-2'>
                                                {item.description && item.description.length > 100
                                                    ? item.description.slice(0, 100) + '...'
                                                    : item.description || ''}
                                            </p>
                                            {item.selectedSize && (
                                                <p className='text-xs sm:text-sm text-fav-maroon font-semibold mt-1'>Size: {item.selectedSize}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Price, Qty, Subtotal */}
                                    <div className='w-full lg:w-[50%] flex justify-between items-center mt-3 lg:mt-0'>
                                        <span className="text-black font-semibold text-sm sm:text-base">₹ {typeof item.price === 'number' ? item.price.toFixed(0) : '0'}</span>
                                        <span>
                                            <div className="bg-gray-100 text-gray-900 px-1 sm:px-2 py-1 rounded-full text-sm sm:text-base">
                                                <span className='p-1 sm:p-3 cursor-pointer' onClick={(e) => { e.stopPropagation(); dispatch(updateCartQuantity({ id: item.id, quantity: item.cartQuantity + 1 })) }}
                                                >+</span>
                                                <span className='p-1 sm:p-3'>{item.cartQuantity}</span>
                                                <span className='p-1 sm:p-3 cursor-pointer' onClick={(e) => { e.stopPropagation(); dispatch(updateCartQuantity({ id: item.id, quantity: item.cartQuantity - 1 })) }}
                                                >-</span>
                                            </div>
                                        </span>
                                        <span className="text-black font-semibold text-sm sm:text-base">₹ {typeof item.price === 'number' ? (item.price * (item.cartQuantity || 1)).toFixed(0) : '0'}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className='text-5xl mb-2'>🛍️</div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-600">Your cart is feeling light</h2>
                                <p className='text-sm text-gray-500 mb-4'>Add some favorites from New Arrivals!</p>
                                <button onClick={()=>router.push('/')} className='group/btn relative overflow-hidden px-6 py-2 rounded-md bg-red-800 text-white hover:bg-red-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-linear-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-500 hover:before:left-full'>Browse Collections</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Summary */}
                <div className='w-full lg:w-[30%] p-0 sm:p-0'>
                    <div className='border border-gray-200 p-3 sm:p-4 rounded-xl shadow-sm lg:sticky lg:top-20 bg-white'>
                        <h2 className='text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900'>Cart Summary</h2>
                        <div className='flex justify-between mb-2 text-sm sm:text-base'>
                            <span className="text-gray-900">Subtotal</span>
                            <span className="text-black font-semibold">₹ {calculateSubtotal().toFixed(0)}</span>
                        </div>
                        <div className='flex justify-between mb-2 text-sm sm:text-base'>
                            <span className="text-gray-900">Shipping</span>
                            <span className="text-green-500">Free</span>
                        </div>
                        <hr className='my-2 border-gray-200' />
                        <div className='flex justify-between font-bold text-base sm:text-lg'>
                            <span className="text-gray-900">Total</span>
                            <span className="text-black font-semibold">₹ {calculateSubtotal().toFixed(0)}</span>
                        </div>
                        <button 
                        onClick={handleCheckout}
                        className='group/btn relative overflow-hidden mt-3 sm:mt-4 w-full bg-red-800 text-white py-2 rounded-md hover:bg-red-700 transition-all duration-300 font-semibold shadow-sm text-sm sm:text-base hover:shadow-lg hover:-translate-y-0.5 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-linear-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-500 hover:before:left-full'>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartSection
