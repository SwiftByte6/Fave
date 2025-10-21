'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/Redux/store';
import { addToFavourites, removeFromFavourites } from '@/Redux/FavSlice';
import { addToCart } from '@/Redux/cartSlice';
import { CiHeart } from 'react-icons/ci';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface RelatedProductCardProps {
  product: {
    id: string | number;
    title: string;
    images?: string[];
    category?: string;
    price: number;
    description?: string;
  };
}

const RelatedProductCard: React.FC<RelatedProductCardProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const favourites = useSelector((state: RootState) => state.favourites.favourites);
  
  const isFavourite = favourites.some((f) => f.id === String(product.id));
  
  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavourite) {
      dispatch(removeFromFavourites(String(product.id)));
      toast('Removed from wishlist!');
    } else {
      dispatch(addToFavourites({
        id: String(product.id),
        title: product.title,
        images: product.images || [],
        category: product.category,
        price: product.price,
        stock: 10
      }));
      toast.success('Added to wishlist!');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productWithQuantity = {
      ...product,
      cartQuantity: 1
    };
    dispatch(addToCart(productWithQuantity));
    toast.success('Added to cart!');
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-[#F0E7DE] overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-[#FBF1F4]">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-4xl">👗</div>
          </div>
        )}
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold text-[#8A6F5C]">
            {product.category}
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleFavourite}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
        >
          {isFavourite ? (
            <FaHeart className="w-4 h-4 text-red-500" />
          ) : (
            <CiHeart className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-[#6f5a4d] text-sm sm:text-base mb-1 line-clamp-2">
          {product.title}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg sm:text-xl font-bold text-[#6f5a4d]">
            ₹ {product.price?.toLocaleString()}
          </span>
          
          <button
            onClick={handleAddToCart}
            className="bg-[#F4DCDC] text-[#6f5a4d] px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductCard;
