'use client'

import React from 'react'
import Image from 'next/image'
import { CiHeart } from 'react-icons/ci'
import { FaHeart } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/Redux/store'
import { addToFavourites, removeFromFavourites } from '@/Redux/FavSlice'
import toast from 'react-hot-toast'

interface ProductData {
  id: string | number;
  title: string;
  images?: string[];
  category?: string;
  price: number;
  description?: string;
}

interface ProductCardProps {
  data: ProductData;
  addToCartItem?: (product: ProductData) => void;
  variant?: 'default' | 'search' | 'compact' | 'bestseller';
  showCategoryBadge?: boolean;
  showWishlist?: boolean;
  showAddToCart?: boolean;
  className?: string;
  currencySymbol?: string;
}

/**
 * Unified ProductCard Component
 * 
 * This component handles all product card displays throughout the website with configurable variants:
 * 
 * Variants:
 * - 'default': Standard product card (550px-700px height) - Used in HomePage, Favourites, New Arrivals
 * - 'search': Search results card (500px-650px height) - Used in SearchResult component
 * - 'compact': Compact card (400px-500px height) - For space-constrained layouts
 * 
 * Props:
 * - data: Product information object
 * - addToCartItem: Function to add product to cart (optional)
 * - variant: Card variant type
 * - showCategoryBadge: Show category badge overlay (default: false)
 * - showWishlist: Show wishlist heart icon (default: true)
 * - showAddToCart: Show add to cart button (default: true)
 * - className: Additional CSS classes
 * 
 * Usage Examples:
 * 
 * // Default product card (HomePage, Favourites)
 * <ProductCard 
 *   data={product} 
 *   variant="default"
 *   addToCartItem={addToCartItem}
 * />
 * 
 * // Search results card with category badge
 * <ProductCard 
 *   data={product} 
 *   variant="search"
 *   showCategoryBadge={true}
 *   addToCartItem={addToCartItem}
 * />
 * 
 * // Compact card without add to cart
 * <ProductCard 
 *   data={product} 
 *   variant="compact"
 *   showAddToCart={false}
 * />
 */
const ProductCard: React.FC<ProductCardProps> = ({ 
  data, 
  addToCartItem, 
  variant = 'default',
  showCategoryBadge = false,
  showWishlist = true,
  showAddToCart = true,
  className = '',
  currencySymbol = '₹'
}) => {
  const router = useRouter()
  const dispatch = useDispatch()

  // get favourites from store
  const favourites = useSelector((state: RootState) => state.favourites.favourites)

  // check if current product is already in favourites
  const isFavourite = favourites.some(item => item.id === data.id)

  const toggleFavourite = () => {
    if (isFavourite) {
      dispatch(removeFromFavourites(data.id.toString()))
      toast('Removed from wishlist!')
    } else {
      dispatch(addToFavourites({
        id: data.id.toString(),
        title: data.title,
        images: data.images || [],
        category: data.category,
        price: data.price,
        stock: 10
      }))
      toast.success('Added to wishlist!')
    }
  }

  // Determine card height based on variant
  const getCardHeight = () => {
    switch (variant) {
      case 'bestseller':
        return 'h-[420px] sm:h-[400px] lg:h-[400px]'
      case 'compact':
        return 'h-[400px] sm:h-[450px] lg:h-[500px]'
      case 'search':
        return 'h-[400px] sm:h-[400px] lg:h-[400px]'
      case 'default':
      default:
        return 'h-[550px] sm:h-[600px] lg:h-[700px]'
    }
  }

  // Determine image height based on variant
  const getImageHeight = () => {
    switch (variant) {
      case 'bestseller':
        return 'h-[62%]'
      case 'compact':
        return 'h-[70%]'
      case 'search':
        return 'h-[65%]'
      case 'default':
      default:
        return 'h-[75%]'
    }
  }

  // Determine content height based on variant
  const getContentHeight = () => {
    switch (variant) {
      case 'bestseller':
        return 'h-[25%]'
      case 'compact':
        return 'h-[30%]'
      case 'search':
        return 'h-[25%]'
      case 'default':
      default:
        return 'h-[20%]'
    }
  }

  return (
    <div
      className={`bg-white rounded-2xl lg:rounded-3xl border border-pink-100 shadow-[0_6px_30px_rgba(244,183,199,0.25)] overflow-hidden ${getCardHeight()} relative transition-all duration-300 hover:shadow-[0_8px_36px_rgba(244,183,199,0.35)] hover:-translate-y-0.5 ${className}`}
    >
      {/* Wishlist Icon */}
      {showWishlist && (
        <div className='absolute top-2 sm:top-3 right-2 sm:right-3 z-10'>
          {isFavourite ? (
            <FaHeart
              size={28}
              onClick={toggleFavourite}
              className="bg-white text-pink-500 p-1.5 sm:p-2 rounded-full shadow-sm cursor-pointer transition"
            />
          ) : (
            <CiHeart
              size={28}
              onClick={toggleFavourite}
              className="bg-white text-pink-300 hover:text-pink-500 p-1.5 sm:p-2 rounded-full shadow-sm cursor-pointer transition"
            />
          )}
        </div>
      )}

      {/* Category Badge */}
      {showCategoryBadge && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
          <span className="bg-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
            {data.category}
          </span>
        </div>
      )}

      {/* Image */}
      <div
        className={`${getImageHeight()} bg-pink-50 cursor-pointer overflow-hidden`}
        onClick={() => router.push(`/products/${data.id}`)}
      >
        {data?.images?.[0] ? (
          <Image
            src={data.images[0]}
            alt={data.title}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2"></div>
              <p>Image coming soon</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-3 sm:p-4 ${getContentHeight()} flex flex-col justify-between`}>
        <div>
          <h3 className={`text-[#6f5a4d] ${variant === 'bestseller' ? 'text-base sm:text-md' : 'text-base sm:text-md'} font-semibold mb-1 line-clamp-2`}>
            {data.title}
          </h3>
          <p className="text-xs text-pink-400 mb-2 sm:mb-3">
            {data.category || (variant === 'search' ? "Elegance Boutique" : "Pookie Style")}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className={`font-bold ${variant === 'bestseller' ? 'text-[#f9b8c3]' : 'text-gray-800'} text-base sm:text-lg lg:text-xl`}>
            {currencySymbol} {data.price?.toLocaleString()}
          </div>
          {showAddToCart && addToCartItem && (
            <button
              onClick={() => addToCartItem(data)}
              className={`font-medium text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition duration-300 ${variant === 'bestseller' ? 'bg-[#f9b8c3] text-white ' : 'bg-[#f9b8c3] text-white hover:bg-pink-200'}`}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
