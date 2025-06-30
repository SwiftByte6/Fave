'use client'
import { useSupabase } from '@/hooks/useSupabase'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Playfair_Display } from 'next/font/google';
import { addToCart } from '@/Redux/cartSlice';
import { useDispatch } from 'react-redux';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['800'] });

interface ProductDetailPageProps {
    filterId: number | null;
}


const ProductDetailPage = ({ filterId }: ProductDetailPageProps) => {
    const { getProductById, filterId: productData } = useSupabase();
    const dispatch = useDispatch();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (filterId) {
            getProductById(filterId);
        }
    }, [filterId]);

    useEffect(() => {
        console.log('Product data received:', productData);
    }, [productData]);

    if (!productData) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center'>
                <span className='text-lg font-semibold'>Loading...</span>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen p-4'>
            <div className=' md:w-[90%] mx-auto flex flex-col md:flex-row gap-6  rounded-lg overflow-hidden'>

                {/* Product Image */}
                <div className="md:w-1/2 w-full  md:p-4 flex flex-col items-center justify-center">
                    <div className='w-full h-[500px] md:h-screen  flex items-center justify-center'>
                    
                        {productData?.images?.[currentImageIndex] && (
                            <Image
                                src={productData.images[currentImageIndex]}
                                alt="Product"
                                width={500}
                                height={500}
                                className='w-full h-full rounded-2xl'
                            />
                        )}
                    </div>
                    <div className='w-[100%]  text-center p-2 mt-4 rounded flex gap-6'>
                        {Array.isArray(productData?.images) && productData.images.map((url: string, index: number) => (
                            <div className="flex" key={index}>
                                <div
                                    className="relative h-44 md:w-[9vw] w-[20vw] cursor-pointer"
                                    style={{ minWidth: '80px', minHeight: '80px' }}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <Image
                                        src={url}
                                        alt={`Product image ${index + 1}`}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                            </div>
                        ))}


                    </div>
                </div>

                {/* Product Details */}
                <div className="md:w-[60%] w-full p-10 flex flex-col gap-8 bg-white/90 rounded-2xl shadow-lg border border-pink-100">
                    <div className="flex flex-col gap-3">
                        <h1 className={`text-4xl font-extrabold text-gray-800 ${playfair.className} leading-tight`}>{productData.title}</h1>
                        <p className="text-gray-400 mt-1 text-base">Sku:PL-Kt-2025-089</p>
                        <div className="flex items-center gap-6 mt-2">
                            <span className="text-4xl font-bold text-pink-500">₹ {productData.price}</span>
                            <span className="text-gray-400 font-light line-through text-2xl">
                                ₹{(productData.price) * 20 / 100 + (productData.price)}
                            </span>
                            <span className="text-red-500 bg-red-500/20 px-4 py-1 rounded-2xl text-lg font-semibold">
                                20% OFF
                            </span>
                        </div>
                        <p className='text-green-600 font-medium text-lg'>In stock - Ready to ship</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className='text-lg font-semibold mb-1 block'>Quantity</label>
                        <div className='flex items-center gap-6'>
                            <button className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-xl font-bold'>-</button>
                            <span className='text-2xl font-semibold'>{productData.cartQuantity}</span>
                            <button className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-xl font-bold'>+</button>
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-6 mt-2'>
                        <button 
                        onClick={()=>dispatch(addToCart(productData))}
                        className='bg-[#ffd1dc] w-[48%] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#fcc1cf] transition-colors shadow'>
                            Add To Cart
                        </button>
                        <button className='text-white w-[48%] bg-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-black/70 shadow'>
                            Add To Wishlist
                        </button>
                    </div>

                    <div className='pt-6 border-t border-pink-100 mt-4'>
                        <h2 className={`text-2xl font-bold mb-3 ${playfair.className}`}>Product Details</h2>
                        <p className='text-gray-700 mb-3 text-lg'>{productData.description}</p>
                        <p className='text-gray-800 text-lg'><span className='font-semibold'>Category:</span> {productData.category}</p>
                    </div>
                </div>
            </div>

            {/* Customer Review Section */}
            <div className='max-w-6xl mx-auto mt-12 p-6 bg-white rounded-lg shadow'>
                <h2 className={`text-2xl font-bold mb-4 text-gray-800 ${playfair.className}`}>Customer Reviews</h2>
                <input
                    type='text'
                    placeholder='Write your review...'
                    className='w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400'
                />
                <div className='space-y-4'>
                    {/* Reviews will be added here later */}
                </div>
            </div>

            {/* Related Products Section */}
            <div className='max-w-6xl mx-auto mt-12 p-6 bg-white rounded-lg shadow'>
                <h2 className={`text-2xl font-bold mb-4 text-gray-800 ${playfair.className}`}>Related Products</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {/* Add product cards here later */}
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage
