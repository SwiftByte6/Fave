'use client'
import { useSupabase } from '@/hooks/useSupabase'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Playfair_Display } from 'next/font/google';
import { addToCart } from '@/Redux/cartSlice';
import { useDispatch } from 'react-redux';
import { CiHeart } from 'react-icons/ci';
import { useRouter } from 'next/navigation';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['800'] });

interface ProductDetailPageProps {
    filterId: number | null;
}

const ProductDetailPage = ({ filterId }: ProductDetailPageProps) => {
    const { getProductById, filterId: productData } = useSupabase();
    const dispatch = useDispatch();
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (filterId) {
            setIsLoading(true);
            getProductById(filterId);
        }
    }, [filterId]);

    useEffect(() => {
        if (productData) {
            setIsLoading(false);
        }
    }, [productData]);

    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else if (type === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (productData) {
            const productWithQuantity = {
                ...productData,
                cartQuantity: quantity
            };
            dispatch(addToCart(productWithQuantity));
        }
    };

    if (isLoading) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <span className='text-lg font-semibold text-pink-600'>Loading product details...</span>
                </div>
            </div>
        );
    }

    if (!productData) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center'>
                <div className="text-center">
                    <div className="text-6xl mb-4">👗</div>
                    <span className='text-lg font-semibold text-pink-600'>Product not found</span>
                    <button 
                        onClick={() => router.push('/')}
                        className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen p-4 bg-pink-50'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col lg:flex-row gap-8 rounded-2xl overflow-hidden bg-white shadow-lg'>
                    {/* Product Image Section */}
                    <div className="lg:w-1/2 w-full p-6">
                        <div className='w-full h-[500px] lg:h-[600px] flex items-center justify-center bg-pink-50 rounded-2xl overflow-hidden'>
                            {productData?.images?.[currentImageIndex] ? (
                                <Image
                                    src={productData.images[currentImageIndex]}
                                    alt={productData.title}
                                    width={600}
                                    height={600}
                                    className='w-full h-full object-cover'
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <div className="text-6xl mb-4">👗</div>
                                    <p>Image not available</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Image Gallery */}
                        {Array.isArray(productData?.images) && productData.images.length > 1 && (
                            <div className='flex gap-4 mt-6 overflow-x-auto pb-2'>
                                {productData.images.map((url: string, index: number) => (
                                    <div
                                        key={index}
                                        className={`relative h-20 w-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                            currentImageIndex === index 
                                                ? 'border-pink-500' 
                                                : 'border-gray-200 hover:border-pink-300'
                                        }`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <Image
                                            src={url}
                                            alt={`${productData.title} - Image ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details Section */}
                    <div className="lg:w-1/2 w-full p-6 lg:p-8 flex flex-col justify-between">
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold">
                                        {productData.category || 'Elegance Boutique'}
                                    </span>
                                </div>
                                <h1 className={`text-3xl lg:text-4xl font-bold text-gray-800 ${playfair.className} leading-tight mb-2`}>
                                    {productData.title}
                                </h1>
                                <p className="text-gray-500 text-sm">SKU: {productData.id}</p>
                            </div>

                            {/* Price Section */}
                            <div className="flex items-center gap-4">
                                <span className="text-3xl lg:text-4xl font-bold text-pink-600">
                                    ₹ {productData.price?.toLocaleString()}
                                </span>
                                <span className="text-gray-400 font-light line-through text-xl">
                                    ₹ {((productData.price || 0) * 1.2).toLocaleString()}
                                </span>
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                                    20% OFF
                                </span>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <p className='text-green-600 font-medium'>In stock - Ready to ship</p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="space-y-2">
                                <label className='text-lg font-semibold text-gray-700'>Quantity</label>
                                <div className='flex items-center gap-4'>
                                    <button 
                                        onClick={() => handleQuantityChange('decrease')}
                                        className='w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300 text-xl font-bold flex items-center justify-center transition-colors'
                                    >
                                        -
                                    </button>
                                    <span className='text-2xl font-semibold min-w-[40px] text-center'>{quantity}</span>
                                    <button 
                                        onClick={() => handleQuantityChange('increase')}
                                        className='w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300 text-xl font-bold flex items-center justify-center transition-colors'
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                                <button 
                                    onClick={handleAddToCart}
                                    className='flex-1 bg-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-pink-700 transition-colors shadow-lg'
                                >
                                    Add To Cart
                                </button>
                                <button className='flex-1 bg-white text-pink-600 border-2 border-pink-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-pink-50 transition-colors shadow-lg flex items-center justify-center gap-2'>
                                    <CiHeart size={24} />
                                    Add To Wishlist
                                </button>
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className='pt-6 border-t border-pink-100 mt-6'>
                            <h2 className={`text-2xl font-bold mb-4 text-gray-800 ${playfair.className}`}>Product Details</h2>
                            <div className="space-y-3">
                                <p className='text-gray-700 text-lg leading-relaxed'>
                                    {productData.description || 'Beautiful traditional Indian ethnic wear crafted with premium materials and exquisite design.'}
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className='font-semibold text-gray-600'>Category:</span>
                                        <p className="text-gray-800">{productData.category || 'Ethnic Wear'}</p>
                                    </div>
                                    <div>
                                        <span className='font-semibold text-gray-600'>Material:</span>
                                        <p className="text-gray-800">Premium Fabric</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Customer Review Section */}
                <div className='mt-12 p-6 bg-white rounded-2xl shadow-lg'>
                    <h2 className={`text-2xl font-bold mb-6 text-gray-800 ${playfair.className}`}>Customer Reviews</h2>
                    <div className="flex gap-4 mb-6">
                        <input
                            type='text'
                            placeholder='Write your review...'
                            className='flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400'
                        />
                        <button className="bg-pink-600 text-white px-6 py-3 rounded-xl hover:bg-pink-700 transition">
                            Submit
                        </button>
                    </div>
                    <div className='space-y-4'>
                        <div className="text-center text-gray-500 py-8">
                            <div className="text-4xl mb-2">💬</div>
                            <p>Be the first to review this product!</p>
                        </div>
                    </div>
                </div>

                {/* Related Products Section */}
                <div className='mt-12 p-6 bg-white rounded-2xl shadow-lg'>
                    <h2 className={`text-2xl font-bold mb-6 text-gray-800 ${playfair.className}`}>You May Also Like</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                        <div className="text-center text-gray-500 py-8">
                            <div className="text-4xl mb-2">👗</div>
                            <p>More products coming soon!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage
