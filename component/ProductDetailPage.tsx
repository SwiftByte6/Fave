'use client'
import { useSupabase } from '@/hooks/useSupabase'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Playfair_Display } from 'next/font/google';
import { supabase } from '@/lib/supabase/products'
import { useUser } from '@clerk/nextjs'
import { addToCart } from '@/Redux/cartSlice';
import { useDispatch } from 'react-redux';
import { CiHeart } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { addToFavourites, removeFromFavourites } from '@/Redux/FavSlice';
import toast from 'react-hot-toast';

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
    const favourites = useSelector((state: RootState) => state.favourites.favourites);
    const { user } = useUser();

    // Comments state
    type ProductComment = {
        id: string;
        product_id: number;
        user_id: string;
        content: string;
        user_name?: string | null;
        created_at?: string;
    }
    const [comments, setComments] = useState<ProductComment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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

    // Fetch comments for this product
    useEffect(() => {
        const loadComments = async () => {
            if (!filterId) return;
            setIsLoadingComments(true);
            const { data, error } = await supabase
                .from('product_comments')
                .select('id, product_id, user_id, content, user_name, created_at')
                .eq('product_id', filterId)
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Load comments error:', error);
            }
            setComments(data || []);
            setIsLoadingComments(false);
        };
        loadComments();
    }, [filterId]);

    const handleSubmitComment = async () => {
        if (!filterId) return;
        if (!user?.id) {
            toast.error('Please sign in to comment');
            return;
        }
        if (!commentText.trim()) {
            toast('Write something first');
            return;
        }
        setIsSubmittingComment(true);
        const payload = {
            product_id: filterId,
            user_id: user.id,
            content: commentText.trim(),
            user_name: user.fullName || user.username || user.primaryEmailAddress?.emailAddress || null,
        } as const;
        const { data, error } = await supabase
            .from('product_comments')
            .insert([payload])
            .select()
            .single();
        if (error) {
            console.error('Add comment error:', error);
            toast.error(error.message || 'Failed to add comment');
            setIsSubmittingComment(false);
            return;
        }
        setComments((prev) => [data as ProductComment, ...prev]);
        setCommentText('');
        setIsSubmittingComment(false);
        toast.success('Comment added');
    };

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
                        <div className='w-full h-[350px] sm:h-[400px] lg:h-[560px] flex items-center justify-center bg-[#FBF1F4] rounded-xl lg:rounded-2xl overflow-hidden'>
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
                                        className={`relative h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                            currentImageIndex === index 
                                                ? 'border-rose-300' 
                                                : 'border-[#F0E7DE] hover:border-rose-200'
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

                {/* Customer Review Section */
                // Uses Supabase anon client + Clerk identity. Requires table public.product_comments
                // with columns: id uuid default gen_random_uuid(), product_id int, user_id text,
                // content text, user_name text null, created_at timestamptz default now().
                }
                <div className='mt-8 sm:mt-12 p-4 sm:p-6 bg-white/95 rounded-xl lg:rounded-2xl shadow-sm border border-[#F0E7DE]'>
                    <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#6f5a4d] ${playfair.className}`}>Customer Reviews</h2>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <input
                            type='text'
                            placeholder={user?.id ? 'Write your review...' : 'Sign in to write a review'}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={!user?.id || isSubmittingComment}
                            className='flex-1 border border-[#F0E7DE] rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-rose-200 text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400'
                        />
                        <button
                            onClick={handleSubmitComment}
                            disabled={!user?.id || isSubmittingComment}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full transition text-sm sm:text-base ${(!user?.id || isSubmittingComment) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#F4DCDC] text-[#6f5a4d] hover:opacity-90'}`}
                        >
                            {isSubmittingComment ? 'Posting...' : 'Submit'}
                        </button>
                    </div>

                    <div className='space-y-4'>
                        {isLoadingComments ? (
                            <div className="text-center text-[#8A6F5C] py-6 sm:py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
                                <p className="text-sm sm:text-base">Loading comments...</p>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center text-[#8A6F5C] py-6 sm:py-8">
                                <div className="text-3xl sm:text-4xl mb-2">💬</div>
                                <p className="text-sm sm:text-base">Be the first to review this product!</p>
                            </div>
                        ) : (
                            comments.map((c) => (
                                <div key={c.id} className='border border-[#F0E7DE] rounded-xl p-3 sm:p-4'>
                                    <div className='flex items-center justify-between mb-1'>
                                        <span className='text-[#6f5a4d] font-semibold text-sm sm:text-base'>
                                            {c.user_name || 'Customer'}
                                        </span>
                                        <span className='text-xs text-[#8A6F5C]'>
                                            {c.created_at ? new Date(c.created_at).toLocaleString() : ''}
                                        </span>
                                    </div>
                                    <p className='text-sm sm:text-base text-[#6f5a4d]'>{c.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                <div className='mt-8 sm:mt-12 p-4 sm:p-6 bg-white/95 rounded-xl lg:rounded-2xl shadow-sm border border-[#F0E7DE]'>
                    <h2 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-[#6f5a4d] ${playfair.className}`}>You May Also Like</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'>
                        <div className="text-center text-[#8A6F5C] py-6 sm:py-8">
                            <div className="text-3xl sm:text-4xl mb-2">👗</div>
                            <p className="text-sm sm:text-base">More products coming soon!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage
