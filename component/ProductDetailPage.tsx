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
    const [selectedSize, setSelectedSize] = useState(''); // Size state
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
        // Validate size selection
        if (!selectedSize) {
            toast.error('Please select a size before adding to cart');
            return;
        }

        if (productData) {
            const productWithQuantity = {
                ...productData,
                cartQuantity: quantity,
                selectedSize: selectedSize
            };
            dispatch(addToCart(productWithQuantity));
            toast.success(`Added to cart! Size: ${selectedSize}`);
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
            <div className='w-full min-h-screen flex items-center justify-center bg-fav-off-white'>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-fav-beige border-t-fav-gold mx-auto mb-6"></div>
                    <span className='text-xl font-semibold text-fav-maroon'>Discovering FAVEE collection...</span>
                    <p className='text-fav-warm-gray mt-2'>Please wait while we load the product details</p>
                </div>
            </div>
        );
    }

    if (!productData) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center bg-fav-off-white'>
                <div className="text-center max-w-md mx-auto px-6">
                    <h2 className='text-2xl font-bold text-fav-maroon mb-4'>Product Not Found</h2>
                    <p className='text-fav-warm-gray mb-6'>The ethnic treasure you're looking for seems to have been moved or is no longer available.</p>
                    <button 
                        onClick={() => router.push('/')}
                        className="bg-fav-primary hover:bg-fav-maroon text-fav-off-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Explore Collection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full min-h-screen p-4 sm:p-6 bg-gradient-to-br from-fav-off-white via-fav-beige/20 to-fav-blush/10'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col lg:flex-row gap-8 sm:gap-12 rounded-3xl overflow-hidden bg-fav-off-white/95 backdrop-blur-sm shadow-[0_20px_60px_rgba(122,31,42,0.15)] border border-fav-blush/30'>
                    {/* Product Image Section */}
                    <div className="lg:w-1/2 w-full p-6 sm:p-8">
                        <div className='w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center bg-gradient-to-br from-fav-beige/50 to-fav-blush/30 rounded-2xl lg:rounded-3xl overflow-hidden cursor-zoom-in relative group shadow-lg'>
                            {productData?.images?.[currentImageIndex] ? (
                                <>
                                    <Image
                                        src={productData.images[currentImageIndex]}
                                        alt={productData.title}
                                        width={600}
                                        height={600}
                                        className='w-full h-full object-cover transition-all duration-500 group-hover:scale-110'
                                        onClick={() => openModal(currentImageIndex)}
                                    />
                                    {/* Premium Zoom overlay hint */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-fav-maroon/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                                        <div className="bg-fav-off-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                            <svg className="w-6 h-6 text-fav-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-fav-warm-gray">
                                    <p className="text-lg font-semibold">Image Coming Soon</p>
                                    <p className="text-sm mt-2">Premium ethnic collection</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Premium Image Gallery */}
                        {Array.isArray(productData?.images) && productData.images.length > 1 && (
                            <div className='flex gap-3 sm:gap-4 mt-6 sm:mt-8 overflow-x-auto pb-3'>
                                {productData.images.map((url: string, index: number) => (
                                    <div
                                        key={index}
                                        className={`relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden border-3 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                                            currentImageIndex === index 
                                                ? 'border-fav-gold shadow-[0_4px_20px_rgba(199,138,43,0.3)]' 
                                                : 'border-fav-blush hover:border-fav-gold'
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
                                        {currentImageIndex === index && (
                                            <div className="absolute inset-0 bg-fav-gold/20 flex items-center justify-center">
                                                <div className="w-3 h-3 bg-fav-gold rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Details Section */}
                    <div className="lg:w-1/2 w-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                        <div className="space-y-6 sm:space-y-8">
                            {/* Premium Header */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-fav-gold-gradient text-fav-charcoal px-4 py-2 rounded-xl text-sm font-bold shadow-md">
                                        {productData.category || 'FAVEE Collection'}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-4 h-4 text-fav-gold fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                        <span className="text-fav-warm-gray text-sm ml-2">(4.8)</span>
                                    </div>
                                </div>
                                <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-fav-charcoal ${playfair.className} leading-tight mb-3`}>
                                    {productData.title}
                                </h1>
                                <p className="text-fav-warm-gray text-sm font-medium">SKU: FAVEE-{productData.id}</p>
                            </div>

                            {/* Premium Price Section */}
                            <div className="bg-gradient-to-r from-fav-beige/50 to-fav-blush/30 p-6 rounded-2xl border border-fav-blush/50">
                                <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-3">
                                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fav-maroon">
                                        ₹ {productData.price?.toLocaleString()}
                                    </span>
                                    <span className="text-fav-warm-gray font-medium line-through text-xl sm:text-2xl">
                                        ₹ {((productData.price || 0) * 1.2).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-fav-rust text-fav-off-white px-4 py-2 rounded-xl text-sm font-bold">
                                        20% OFF
                                    </span>
                                    <span className="text-fav-charcoal font-semibold">Limited Time Offer!</span>
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                                <p className='text-green-600 font-medium text-sm sm:text-base'>In stock - Ready to ship</p>
                            </div>

                            {/* Size Selector Dropdown */}
                            <div className="space-y-4">
                                <label className='text-xl font-bold text-fav-charcoal'>Select Size <span className='text-fav-maroon'>*</span></label>
                                <select 
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className='w-full px-4 py-3 border-2 border-fav-beige rounded-2xl text-fav-charcoal font-semibold bg-fav-off-white focus:outline-none focus:border-fav-maroon transition-all duration-300 hover:border-fav-gold'
                                >
                                    <option value="">-- Choose Size --</option>
                                    <option value="XS (Free Size - Saree)">XS (Free Size - Saree)</option>
                                    <option value="S (Free Size - Saree)">S (Free Size - Saree)</option>
                                    <option value="M (Free Size - Saree)">M (Free Size - Saree)</option>
                                    <option value="L (Free Size - Saree)">L (Free Size - Saree)</option>
                                    <option value="XL (Free Size - Saree)">XL (Free Size - Saree)</option>
                                    <option value="XXL (Free Size - Saree)">XXL (Free Size - Saree)</option>
                                    <option value="Free Size - Saree">Free Size - Saree</option>
                                </select>
                                {selectedSize && (
                                    <p className='text-sm text-green-600 font-medium'>✓ Size selected: {selectedSize}</p>
                                )}
                            </div>

                            {/* Premium Quantity Selector */}
                            <div className="space-y-4">
                                <label className='text-xl font-bold text-fav-charcoal'>Select Quantity</label>
                                <div className='flex items-center gap-5'>
                                    <button 
                                        onClick={() => handleQuantityChange('decrease')}
                                        className='w-12 h-12 bg-fav-beige hover:bg-fav-gold text-fav-maroon hover:text-fav-off-white rounded-2xl text-2xl font-bold flex items-center justify-center transition-all duration-300 hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:hover:scale-100'
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <div className='bg-fav-off-white border-2 border-fav-gold px-6 py-3 rounded-2xl'>
                                        <span className='text-2xl font-bold text-fav-charcoal min-w-[48px] text-center block'>{quantity}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleQuantityChange('increase')}
                                        className='w-12 h-12 bg-fav-beige hover:bg-fav-gold text-fav-maroon hover:text-fav-off-white rounded-2xl text-2xl font-bold flex items-center justify-center transition-all duration-300 hover:shadow-md hover:scale-105'
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Premium Action Buttons */}
                            <div className='space-y-4 pt-4'>
                                <button 
                                    onClick={handleAddToCart}
                                    className='w-full bg-fav-primary hover:bg-fav-maroon text-fav-off-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative overflow-hidden group'
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        Add To Cart - ₹ {((productData.price || 0) * quantity).toLocaleString()}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                </button>
                                
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <button 
                                        onClick={toggleFavourite} 
                                        className={`bg-fav-off-white hover:bg-fav-blush border-2 px-6 py-3 rounded-2xl font-semibold text-base transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-3 ${
                                            favourites.some((f) => f.id === String(productData.id)) 
                                                ? 'border-fav-maroon text-fav-maroon bg-fav-blush/50' 
                                                : 'border-fav-beige text-fav-charcoal'
                                        }`}
                                    >
                                        <CiHeart size={24} />
                                        {favourites.some((f) => f.id === String(productData.id)) ? 'In Wishlist' : 'Add to Wishlist'}
                                    </button>
                                    
                                    <div className='flex items-center'>
                                        <ShareButton product={productData} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Premium Product Details */}
                        <div className='pt-6 border-t-2 border-fav-gold/30 mt-6'>
                            <div className="flex items-center gap-3 mb-5">
                                <h2 className={`text-2xl font-bold text-fav-charcoal ${playfair.className}`}>Product Details</h2>
                            </div>
                            <div className="space-y-5">
                                <p className='text-fav-charcoal text-lg leading-relaxed font-medium'>
                                    {productData.description || 'Exquisite traditional Indian ethnic wear, meticulously crafted with premium materials and timeless design elements that celebrate the rich heritage of Indian fashion.'}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="bg-fav-beige/50 p-4 rounded-xl">
                                        <span className='font-bold text-fav-maroon text-sm uppercase tracking-wider'>Category</span>
                                        <p className="text-fav-charcoal font-semibold text-lg">{productData.category || 'Premium Ethnic Wear'}</p>
                                    </div>
                                    <div className="bg-fav-beige/50 p-4 rounded-xl">
                                        <span className='font-bold text-fav-maroon text-sm uppercase tracking-wider'>Material</span>
                                        <p className="text-fav-charcoal font-semibold text-lg">Premium Handwoven Fabric</p>
                                    </div>
                                    <div className="bg-fav-beige/50 p-4 rounded-xl">
                                        <span className='font-bold text-fav-maroon text-sm uppercase tracking-wider'>Care Instructions</span>
                                        <p className="text-fav-charcoal font-semibold text-lg">Dry Clean Only</p>
                                    </div>
                                    <div className="bg-fav-beige/50 p-4 rounded-xl">
                                        <span className='font-bold text-fav-maroon text-sm uppercase tracking-wider'>Origin</span>
                                        <p className="text-fav-charcoal font-semibold text-lg">Made in India</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

          

                {/* Customer Review Section */}
                {filterId && <ProductComments productId={filterId} />}

                {/* Premium Related Products Section */}
                <div className='mt-12 sm:mt-16 p-8 sm:p-10 bg-gradient-to-br from-fav-off-white via-fav-beige/30 to-fav-blush/20 rounded-3xl shadow-xl border border-fav-blush/50'>
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 bg-fav-gold-gradient px-6 py-3 rounded-2xl shadow-lg mb-4">
                            <h2 className={`text-2xl sm:text-3xl font-bold text-fav-off-white ${playfair.className}`}>You May Also Love</h2>
                        </div>
                        <p className="text-fav-charcoal text-lg font-medium">Handpicked ethnic treasures that complement your style</p>
                    </div>
                    {relatedProducts && relatedProducts.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8'>
                            {relatedProducts.map((product: any) => (
                                <RelatedProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-fav-warm-gray py-12">
                            <p className="text-lg font-semibold">Curating similar ethnic pieces for you...</p>
                            <p className="text-sm mt-2">Premium collections loading</p>
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