'use client'

import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/Redux/store'
import Image from 'next/image'
import { removeCart, updateCartQuantity } from '@/Redux/cartSlice'
import { useRouter } from 'next/navigation'

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

    return (
        <div className="bg-[#FBF8F6] min-h-screen">
            {/* Header */}
            <div className='py-8 flex flex-col justify-center items-center'>
                <div className='px-6 py-2 rounded-full bg-[#F4DCDC] shadow-sm mb-2'>
                    <h1 className='dancing text-[1.8rem] sm:text-[2.2rem] md:text-[2.6rem] text-[#6f5a4d]'>Shopping Cart</h1>
                </div>
                <h2 className='text-xs sm:text-sm text-[#8A6F5C]'>Home / cart</h2>
            </div>

            {/* Cart Layout */}
            <div className='w-full flex flex-col lg:flex-row max-w-6xl mx-auto px-3 sm:px-4 md:px-6'>
                {/* Left Side - Product List */}
                <div className="w-full lg:w-[70%] p-0 sm:p-0">
                    <div className='w-full lg:w-[95%] mx-auto'>
                        {/* Table Header */}
                        <div className='bg-white/90 border border-[#F0E7DE] p-2 sm:p-3 flex justify-between font-semibold text-xs sm:text-sm md:text-base rounded-xl'>
                            <div className='w-[50%] text-[#6f5a4d]'>Products</div>
                            <div className='w-[50%] flex justify-between'>
                                <div className="text-[#6f5a4d]">Price</div>
                                <div className="text-[#6f5a4d]">Qty</div>
                                <div className="text-[#6f5a4d]">Subtotal</div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        {cart.length > 0 ? (
                            cart.map((item, index) => (
                                <div 
                                onClick={() => router.push(`/products/${item.id}`)}
                                key={index} className='flex flex-col lg:flex-row border-b border-pink-100 p-2 sm:p-3 bg-white hover:bg-[#FBF1F4] transition'>
                                    {/* Left: Image and Info */}
                                    <div className='w-full lg:w-[50%] flex items-start gap-2 sm:gap-3'>
                                        <button onClick={(e) => { e.stopPropagation(); RemoveProduct(item.id) }} className='text-pink-400 text-lg cursor-pointer hover:bg-pink-50 rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transition'>×</button>
                                        <div className='w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] flex-shrink-0 rounded-lg bg-[#FFF7F5] border border-[#F0E7DE] flex items-center justify-center'>
                                            <Image src={item.images?.[0]} width={100} height={100} alt="product" className="object-contain w-full h-full" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className='font-semibold text-base sm:text-lg text-[#6f5a4d] line-clamp-2'>{item.title}</h2>
                                            <p className='text-xs sm:text-sm text-[#8A6F5C] line-clamp-2'>
                                                {item.description && item.description.length > 100
                                                    ? item.description.slice(0, 100) + '...'
                                                    : item.description || ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Price, Qty, Subtotal */}
                                    <div className='w-full lg:w-[50%] flex justify-between items-center mt-3 lg:mt-0'>
                                        <span className="text-[#6f5a4d] text-sm sm:text-base">INR {typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</span>
                                        <span>
                                            <div className="bg-[#FBF1F4] text-[#6f5a4d] px-1 sm:px-2 py-1 rounded-full text-sm sm:text-base">
                                                <span className='p-1 sm:p-3 cursor-pointer' onClick={(e) => { e.stopPropagation(); dispatch(updateCartQuantity({ id: item.id, quantity: item.cartQuantity + 1 })) }}
                                                >+</span>
                                                <span className='p-1 sm:p-3'>{item.cartQuantity}</span>
                                                <span className='p-1 sm:p-3 cursor-pointer' onClick={(e) => { e.stopPropagation(); dispatch(updateCartQuantity({ id: item.id, quantity: item.cartQuantity - 1 })) }}
                                                >-</span>
                                            </div>
                                        </span>
                                        <span className="text-[#6f5a4d] font-semibold text-sm sm:text-base">INR {typeof item.price === 'number' ? (item.price * (item.cartQuantity || 1)).toFixed(2) : '0.00'}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className='text-5xl mb-2'>🛍️</div>
                                <h2 className="text-lg sm:text-xl font-bold text-[#8A6F5C]">Your cart is feeling light</h2>
                                <p className='text-sm text-[#8A6F5C] mb-4'>Add some favorites from New Arrivals!</p>
                                <button onClick={()=>router.push('/')} className='px-6 py-2 rounded-full bg-[#F4DCDC] text-[#6f5a4d] hover:opacity-90'>Browse Collections</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Summary */}
                <div className='w-full lg:w-[30%] p-0 sm:p-0'>
                    <div className='border border-[#F0E7DE] p-3 sm:p-4 rounded-xl shadow-sm lg:sticky lg:top-20 bg-white/95'>
                        <h2 className='text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#6f5a4d]'>Cart Summary</h2>
                        <div className='flex justify-between mb-2 text-sm sm:text-base'>
                            <span className="text-[#6f5a4d]">Subtotal</span>
                            <span className="text-[#6f5a4d]">INR {calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className='flex justify-between mb-2 text-sm sm:text-base'>
                            <span className="text-[#6f5a4d]">Shipping</span>
                            <span className="text-pink-400">Free</span>
                        </div>
                        <hr className='my-2 border-[#F0E7DE]' />
                        <div className='flex justify-between font-bold text-base sm:text-lg'>
                            <span className="text-[#6f5a4d]">Total</span>
                            <span className="text-[#6f5a4d]">INR {calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <button 
                        onClick={()=>router.push('/checkout')}
                        className='mt-3 sm:mt-4 w-full bg-[#F4DCDC] text-[#6f5a4d] py-2 rounded-full hover:opacity-90 transition duration-200 font-semibold shadow-sm text-sm sm:text-base'>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartSection
