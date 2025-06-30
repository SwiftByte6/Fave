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
        <div className="bg-[#FFF7F5] min-h-screen">
            {/* Header */}
            <div className='h-[10vh] md:h-[15vh] bg-[#F8E9F1] flex flex-col justify-center items-center shadow-md'>
                <h1 className='text-3xl font-bold md:text-4xl text-gray-700 drop-shadow'>Shopping Cart</h1>
                <h2 className='text-sm text-gray-400'>Home / cart</h2>
            </div>

            {/* Cart Layout */}
            <div className='w-full flex flex-col md:flex-row'>
                {/* Left Side - Product List */}
                <div className="w-full md:w-[70%] p-4">
                    <div className='w-full md:w-[95%] mx-auto'>
                        {/* Table Header */}
                        <div className='bg-[#F6D6E1] p-3 flex justify-between font-semibold text-sm md:text-base rounded-t-lg'>
                            <div className='w-[50%] text-gray-700'>Products</div>
                            <div className='w-[50%] flex justify-between'>
                                <div className="text-gray-700">Price</div>
                                <div className="text-gray-700">Qty</div>
                                <div className="text-gray-700">Subtotal</div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        {cart.length > 0 ? (
                            cart.map((item, index) => (
                                <div 
                                onClick={() => router.push(`products/${item.id}`)}
                                key={index} className='flex flex-col md:flex-row border-b border-pink-100 p-3 bg-white/80 hover:bg-[#F9F4F7] transition'>
                                    {/* Left: Image and Info */}
                                    <div className='w-full md:w-[50%] flex items-start gap-3'>
                                        <button onClick={() => RemoveProduct(item.id)} className='text-pink-400 text-lg cursor-pointer hover:bg-pink-50 rounded-full w-8 h-8 flex items-center justify-center transition'>×</button>
                                        <div className='w-[100px] h-[100px] flex-shrink-0 rounded-lg bg-[#FFF7F5] border border-pink-50 flex items-center justify-center'>
                                            <Image src={item.images?.[0]} width={100} height={100} alt="product" className="object-contain w-full h-full" />
                                        </div>
                                        <div>
                                            <h2 className='font-semibold text-lg text-gray-700'>{item.title}</h2>
                                            <p className='text-sm text-gray-400'>
                                                {item.description && item.description.length > 100
                                                    ? item.description.slice(0, 100) + '...'
                                                    : item.description || ''}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Price, Qty, Subtotal */}
                                    <div className='w-full md:w-[50%] flex justify-between items-center mt-4 md:mt-0'>
                                        <span className="text-gray-700">INR {typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</span>
                                        <span>
                                            <div className="bg-pink-50 text-gray-700 px-2 py-1 rounded">
                                                <span className='p-3' onClick={() => dispatch(updateCartQuantity({ id: item.id, quantity: item.cartQuantity + 1 }))}
                                                >+</span>
                                                <span className='p-3'>{item.cartQuantity}</span>
                                                <span className='p-3' onClick={() => dispatch(updateCartQuantity({ id: item.id, quantity: item.cartQuantity - 1 }))}
                                                >-</span>
                                            </div>
                                        </span>
                                        <span className="text-gray-700 font-semibold">INR {typeof item.price === 'number' ? (item.price * (item.cartQuantity || 1)).toFixed(2) : '0.00'}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <h2 className="text-xl font-bold text-gray-400">No products Added</h2>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Summary */}
                <div className='w-full md:w-[30%] p-4 bg-[#F8E9F1]'>
                    <div className='border border-pink-100 p-4 rounded-lg shadow-md sticky top-20 bg-white/80'>
                        <h2 className='text-xl font-bold mb-4 text-gray-700'>Cart Summary</h2>
                        <div className='flex justify-between mb-2'>
                            <span className="text-gray-700">Subtotal</span>
                            <span className="text-gray-700">INR {calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <span className="text-gray-700">Shipping</span>
                            <span className="text-pink-400">Free</span>
                        </div>
                        <hr className='my-2 border-pink-100' />
                        <div className='flex justify-between font-bold text-lg'>
                            <span className="text-gray-700">Total</span>
                            <span className="text-gray-700">INR {calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <button className='mt-4 w-full bg-pink-200 text-gray-700 py-2 rounded hover:bg-pink-300 transition duration-200 font-semibold shadow'>Checkout</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartSection
