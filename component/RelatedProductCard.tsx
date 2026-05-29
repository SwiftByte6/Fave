'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { RootState } from '@/Redux/store';
import { addToCart } from '@/Redux/cartSlice';
// favourites UI removed
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
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-50">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="font-medium text-sm">Image coming soon</p>
            </div>
          </div>
        )}
        
        
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-gray-900 text-sm font-medium mb-1 line-clamp-2 leading-tight">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 font-normal">
            {product.category || "Kurtis"}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-orange-600 font-semibold text-lg">
              ₹ {product.price?.toLocaleString()}
            </div>
            <span className="text-xs text-gray-500">Bestseller</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="group/btn relative overflow-hidden bg-red-800 hover:bg-red-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-500 hover:before:left-[100%]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProductCard;
