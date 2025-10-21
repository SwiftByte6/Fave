'use client'
import { useSupabase } from '@/hooks/useSupabase'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Playfair_Display } from 'next/font/google';
import { useUser } from '@clerk/nextjs'
import { addToCart } from '@/Redux/cartSlice';
import { useDispatch } from 'react-redux';
import { CiHeart } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import ShareButton from './ShareButton';
import { RootState } from '@/Redux/store';
import { addToFavourites, removeFromFavourites } from '@/Redux/FavSlice';
import toast from 'react-hot-toast';
import ProductComments from './ProductComments';
import RelatedProductCard from './RelatedProductCard';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['800'] });

interface ProductDetailPageProps {
    filterId: number | null;
}

const ProductDetailPage = ({ filterId }: ProductDetailPageProps) => {
    const { getProductById, filterId: productData, getRelatedProducts, relatedProducts } = useSupabase();
    const dispatch = useDispatch();
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);
    const favourites = useSelector((state: RootState) => state.favourites.favourites);
    const { user } = useUser();

    useEffect(() => {
        if (filterId) {
            setIsLoading(true);
            getProductById(filterId);
        }
    }, [filterId]);

    useEffect(() => {
        if (productData) {
            setIsLoading(false);
            // Fetch related products when product data is loaded
            getRelatedProducts(productData, 4);
        }
    }, [productData, getRelatedProducts]);

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

    const toggleFavourite = () => {
        if (!productData) return;
        const isFav = favourites.some((f) => f.id === String(productData.id));
        if (isFav) {
            dispatch(removeFromFavourites(String(productData.id)));
            toast('Removed from wishlist!');
        } else {
            dispatch(addToFavourites({
                id: String(productData.id),
                title: productData.title,
                images: productData.images || [],
                category: productData.category,
                price: productData.price,
                stock: 10
            }));
            toast.success('Added to wishlist!');
        }
    }

    // Modal handlers for image zoom
    const openModal = (imageIndex: number = currentImageIndex) => {
        setModalImageIndex(imageIndex);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'unset'; // Restore scrolling
    };

    const nextImage = () => {
        if (productData?.images && productData.images.length > 1) {
            setModalImageIndex((prev) => (prev + 1) % productData.images.length);
        }
    };

    const prevImage = () => {
        if (productData?.images && productData.images.length > 1) {
            setModalImageIndex((prev) => (prev - 1 + productData.images.length) % productData.images.length);
        }
    };

    // Handle keyboard navigation for modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isModalOpen) {
                if (e.key === 'Escape') closeModal();
                if (e.key === 'ArrowRight') nextImage();
                if (e.key === 'ArrowLeft') prevImage();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

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
        <div className='w-full min-h-screen p-3 sm:p-4 bg-[#FBF8F6]'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex flex-col lg:flex-row gap-6 sm:gap-8 rounded-2xl overflow-hidden bg-white/95 shadow-sm border border-[#F0E7DE]'>
                    {/* Product Image Section */}
                    <div className="lg:w-1/2 w-full p-4 sm:p-6">
                        <div className='w-full h-[350px] sm:h-[400px] lg:h-[560px] flex items-center justify-center bg-[#FBF1F4] rounded-xl lg:rounded-2xl overflow-hidden cursor-zoom-in relative group'>
                            {productData?.images?.[currentImageIndex] ? (
                                <>
                                    <Image
                                        src={productData.images[currentImageIndex]}
                                        alt={productData.title}
                                        width={600}
                                        height={600}
                                        className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
                                        onClick={() => openModal(currentImageIndex)}
                                    />
                                    {/* Zoom overlay hint */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="bg-white bg-opacity-90 rounded-full p-2 sm:p-3">
                                            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">👗</div>
                                    <p className="text-sm sm:text-base">Image not available</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Image Gallery */}
                        {Array.isArray(productData?.images) && productData.images.length > 1 && (
                            <div className='flex gap-2 sm:gap-4 mt-4 sm:mt-6 overflow-x-auto pb-2'>
                                {productData.images.map((url: string, index: number) => (
                                    <div
                                        key={index}
                                        className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                                            currentImageIndex === index 
                                                ? 'border-rose-300' 
                                                : 'border-[#F0E7DE] hover:border-rose-200'
                                        }`}
                                        onClick={() => {
                                            setCurrentImageIndex(index);
                                            openModal(index);
                                        }}
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
                    <div className="lg:w-1/2 w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
                        <div className="space-y-4 sm:space-y-6">
                            {/* Header */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-[#FBF1F4] text-[#8A6F5C] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                        {productData.category || 'Elegance Boutique'}
                                    </span>
                                </div>
                                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6f5a4d] ${playfair.className} leading-tight mb-2`}>
                                    {productData.title}
                                </h1>
                                <p className="text-[#8A6F5C] text-xs sm:text-sm">SKU: {productData.id}</p>
                            </div>

                            {/* Price Section */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#6f5a4d]">
                                    ₹ {productData.price?.toLocaleString()}
                                </span>
                                <span className="text-[#b79f92] font-light line-through text-lg sm:text-xl">
                                    ₹ {((productData.price || 0) * 1.2).toLocaleString()}
                                </span>
                                <span className="bg-[#FDE6ED] text-[#8A6F5C] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                    20% OFF
                                </span>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                                <p className='text-green-600 font-medium text-sm sm:text-base'>In stock - Ready to ship</p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="space-y-2">
                                <label className='text-base sm:text-lg font-semibold text-[#6f5a4d]'>Quantity</label>
                                <div className='flex items-center gap-3 sm:gap-4'>
                                    <button 
                                        onClick={() => handleQuantityChange('decrease')}
                                        className='w-8 h-8 sm:w-10 sm:h-10 bg-[#FBF1F4] text-[#6f5a4d] rounded-full hover:bg-[#FDE6ED] text-lg sm:text-xl font-bold flex items-center justify-center transition-colors'
                                    >
                                        -
                                    </button>
                                    <span className='text-xl sm:text-2xl font-semibold min-w-[32px] sm:min-w-[40px] text-center'>{quantity}</span>
                                    <button 
                                        onClick={() => handleQuantityChange('increase')}
                                        className='w-8 h-8 sm:w-10 sm:h-10 bg-[#FBF1F4] text-[#6f5a4d] rounded-full hover:bg-[#FDE6ED] text-lg sm:text-xl font-bold flex items-center justify-center transition-colors'
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4'>
                                <button 
                                    onClick={handleAddToCart}
                                    className='flex-1 bg-[#F4DCDC] text-[#6f5a4d] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:opacity-90 transition-colors shadow-sm'
                                >
                                    Add To Cart
                                </button>
                                <button onClick={toggleFavourite} className='flex-1 bg-white text-[#6f5a4d] border border-[#F0E7DE] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-[#FBF1F4] transition-colors shadow-sm flex items-center justify-center gap-2'>
                                    <CiHeart size={20} className="sm:w-6 sm:h-6" />
                                    Add To Wishlist
                                </button>
                                
                            </div>
                            <div className='pt-2 '>
                                <ShareButton product={productData} />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className='pt-4 sm:pt-6 border-t border-[#F0E7DE] mt-4 sm:mt-6'>
                            <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-[#6f5a4d] ${playfair.className}`}>Product Details</h2>
                            <div className="space-y-2 sm:space-y-3">
                                <p className='text-[#6f5a4d] text-base sm:text-lg leading-relaxed'>
                                    {productData.description || 'Beautiful traditional Indian ethnic wear crafted with premium materials and exquisite design.'}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                                    <div>
                                        <span className='font-semibold text-[#8A6F5C]'>Category:</span>
                                        <p className="text-[#6f5a4d]">{productData.category || 'Ethnic Wear'}</p>
                                    </div>
                                    <div>
                                        <span className='font-semibold text-[#8A6F5C]'>Material:</span>
                                        <p className="text-[#6f5a4d]">Premium Fabric</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Test Input Section */}
                <div className='mt-8 sm:mt-12 p-4 sm:p-6 bg-white/95 rounded-xl lg:rounded-2xl shadow-sm border border-[#F0E7DE]'>
                    <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#6f5a4d] ${playfair.className}`}>Test Input</h2>
                
                   
                </div>

                {/* Customer Review Section */}
                {filterId && <ProductComments productId={filterId} />}

                {/* Related Products Section */}
                <div className='mt-8 sm:mt-12 p-4 sm:p-6 bg-white/95 rounded-xl lg:rounded-2xl shadow-sm border border-[#F0E7DE]'>
                    <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#6f5a4d] ${playfair.className}`}>You May Also Like</h2>
                    {relatedProducts && relatedProducts.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
                            {relatedProducts.map((product: any) => (
                                <RelatedProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-[#8A6F5C] py-6 sm:py-8">
                            <div className="text-3xl sm:text-4xl mb-2">👗</div>
                            <p className="text-sm sm:text-base">Loading similar products...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Zoom Modal */}
            {isModalOpen && productData?.images && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
                    {/* Close button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-60"
                        aria-label="Close modal"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Previous button */}
                    {productData.images.length > 1 && (
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-60 bg-black bg-opacity-50 rounded-full p-2"
                            aria-label="Previous image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Next button */}
                    {productData.images.length > 1 && (
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-60 bg-black bg-opacity-50 rounded-full p-2"
                            aria-label="Next image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Modal content */}
                    <div className="max-w-4xl max-h-full w-full h-full flex items-center justify-center">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={productData.images[modalImageIndex]}
                                alt={`${productData.title} - Full view`}
                                width={1200}
                                height={1200}
                                className="max-w-full max-h-full object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Image counter */}
                    {productData.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                            {modalImageIndex + 1} / {productData.images.length}
                        </div>
                    )}

                    {/* Thumbnail navigation for larger screens */}
                    {productData.images.length > 1 && (
                        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 hidden sm:flex gap-2 max-w-sm overflow-x-auto">
                            {productData.images.map((url: string, index: number) => (
                                <div
                                    key={index}
                                    className={`relative h-12 w-12 flex-shrink-0 cursor-pointer rounded overflow-hidden border-2 transition-all ${
                                        modalImageIndex === index 
                                            ? 'border-white' 
                                            : 'border-transparent hover:border-gray-300'
                                    }`}
                                    onClick={() => setModalImageIndex(index)}
                                >
                                    <Image
                                        src={url}
                                        alt={`Thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Click outside to close */}
                    <div 
                        className="absolute inset-0 -z-10" 
                        onClick={closeModal}
                        aria-label="Click to close"
                    />
                </div>
            )}
        </div>
    )
}

export default ProductDetailPage