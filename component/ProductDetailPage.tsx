'use client'
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

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['800'] });

interface ProductDetailPageProps {
    product: {
        id: number | string;
        title: string;
        price: number;
        images: string[];
        category: string;
        description?: string;
        sku?: string;
        // ...add other fields as needed...
    };
}

const ProductDetailPage = ({ product }: ProductDetailPageProps) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);
    const favourites = useSelector((state: RootState) => state.favourites.favourites);
    const { user } = useUser();

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
        dispatch(addToCart({ ...product, cartQuantity: quantity, selectedSize }));
        toast.success(`Added to cart! Size: ${selectedSize}`);
    };

    const toggleFavourite = () => {
        const isFav = favourites.some(fav => fav.id === product.id);
        if (isFav) {
            dispatch(removeFromFavourites(String(product.id)));
            toast.success('Removed from favourites');
        } else {
            // Ensure 'stock' is present for FavouriteItem
            const favouriteProduct = {
                ...product,
                id: String(product.id),
                stock: 'stock' in product && typeof (product as any).stock === 'number' ? (product as any).stock : 1 // Default to 1 if not present
            };
            dispatch(addToFavourites(favouriteProduct));
            toast.success('Added to favourites');
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
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
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

    return (
        <div className='w-full min-h-screen p-4 sm:p-6 bg-gradient-to-br from-fav-off-white via-fav-beige/20 to-fav-blush/10'>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col lg:flex-row gap-8 sm:gap-12 rounded-3xl overflow-hidden bg-fav-off-white/95 backdrop-blur-sm shadow-[0_20px_60px_rgba(122,31,42,0.15)] border border-fav-blush/30'>
                    {/* Product Image Section */}
                    <div className="lg:w-1/2 w-full p-6 sm:p-8">
                        <div className='w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center bg-gradient-to-br from-fav-beige/50 to-fav-blush/30 rounded-2xl lg:rounded-3xl overflow-hidden cursor-zoom-in relative group shadow-lg'>
                            {(product.images && product.images.length > 0) ? (
                                <Image
                                    src={product.images[currentImageIndex]}
                                    alt={product.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    style={{ objectFit: 'cover' }}
                                    onClick={() => openModal(currentImageIndex)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-fav-warm-gray">
                                    No image available
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 mt-4">
                            {product.images && product.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${currentImageIndex === idx ? 'border-fav-gold' : 'border-fav-beige'}`}
                                    onClick={() => setCurrentImageIndex(idx)}
                                >
                                    <Image src={img} alt={`Thumbnail ${idx + 1}`} width={64} height={64} style={{ objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Product Details Section */}
                    <div className="lg:w-1/2 w-full p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                        <div className="space-y-6 sm:space-y-8">
                            {/* Premium Header */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="bg-fav-gold-gradient text-fav-charcoal px-4 py-2 rounded-xl text-sm font-bold shadow-md">
                                        {product.category}
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
                                    {product.title}
                                </h1>
                                {product.sku && (
                                    <div className="text-fav-warm-gray text-sm">SKU: {product.sku}</div>
                                )}
                            </div>

                            {/* Premium Price Section */}
                            <div className="bg-gradient-to-r from-fav-beige/50 to-fav-blush/30 p-6 rounded-2xl border border-fav-blush/50">
                                <div className="flex flex-wrap items-center gap-3 sm:gap-5 mb-3">
                                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-fav-maroon">
                                        ₹{product.price}
                                    </span>
                                    {/* <span className="text-fav-warm-gray font-medium line-through text-xl sm:text-2xl">
                                        {/* TODO: Render product price with markup from server props */}
                                    {/* </span> */}
                                </div>
                                {/* <div className="flex items-center gap-3">
                                    <span className="bg-fav-rust text-fav-off-white px-4 py-2 rounded-xl text-sm font-bold">
                                        20% OFF
                                    </span>
                                    <span className="text-fav-charcoal font-semibold">Limited Time Offer!</span>
                                </div> */}
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
                                        Add To Cart - ₹{product.price}
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                                </button>
                                
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <button 
                                        onClick={toggleFavourite} 
                                        className="bg-fav-off-white hover:bg-fav-blush border-2 px-6 py-3 rounded-2xl font-semibold text-base transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-3"
                                    >
                                        <CiHeart size={24} />
                                        {favourites.some(fav => fav.id === product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                    </button>
                                    
                                    <div className='flex items-center'>
                                        <ShareButton product={product} />
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
                                    {product.description}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="bg-fav-beige/50 p-4 rounded-xl">
                                        <span className='font-bold text-fav-maroon text-sm uppercase tracking-wider'>Category</span>
                                        <p className="text-fav-charcoal font-semibold text-lg">{product.category}</p>
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
                <ProductComments productId={typeof product.id === 'number' ? product.id : Number(product.id)} />

                {/* Premium Related Products Section */}
                {/* TODO: Render related products from server props */}
            </div>

            {/* Image Zoom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={closeModal}>
                    <div className="relative w-full max-w-3xl h-[80vh] flex items-center justify-center">
                        <Image
                            src={product.images[modalImageIndex]}
                            alt={product.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            style={{ objectFit: 'contain' }}
                        />
                        <button className="absolute top-4 right-4 text-white text-2xl" onClick={closeModal}>×</button>
                        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-2xl" onClick={(e) => { e.stopPropagation(); prevImage(); }}>‹</button>
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-2xl" onClick={(e) => { e.stopPropagation(); nextImage(); }}>›</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetailPage