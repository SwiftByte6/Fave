"use client";

import React, { memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import ImageFallback from "./ImageFallback";

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
  variant?: "default" | "search" | "compact" | "bestseller";
  showCategoryBadge?: boolean;
  showWishlist?: boolean;
  showAddToCart?: boolean;
  className?: string;
  currencySymbol?: string;
}

const ProductCard: React.FC<ProductCardProps> = memo(({
  data,
  addToCartItem,
  variant = "default",
  showCategoryBadge = false,
  showWishlist = true,
  showAddToCart = true,
  className = "",
  currencySymbol = "₹",
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (addToCartItem) {
      const result = await addToCartItem(data);
      if (result !== false) {
        toast.success("Added to cart!");
      }
    }
  }, [addToCartItem, data]);

  const handleProductClick = useCallback(() => {
    router.push(`/products/${data.id}`);
  }, [router, data.id]);

  // Design-specific mock data
  const originalPrice = data.price * 1.2;
  const isSale = true;
  const isNew = true;
  const isPopular = variant === "bestseller";

  return (
    <div 
      className={`group flex flex-col cursor-pointer ${className}`}
      onClick={handleProductClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] bg-[#f2f2f2] overflow-hidden mb-4">
        {data?.images?.[0] ? (
          <ImageFallback
            src={data.images[0]}
            alt={data.title}
            width={600}
            height={800}
            className="w-full h-full [&>img]:w-full [&>img]:h-full [&>img]:object-cover [&>img]:object-top [&>img]:transition-transform [&>img]:duration-700 group-hover:[&>img]:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-sm text-gray-500">
            Image coming soon
          </div>
        )}


        {/* Add to Cart Button (Circular) */}
        {showAddToCart && addToCartItem && (
          <button
            onClick={handleAddToCart}
            className="absolute hidden group-hover:flex bottom-3 right-3 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-110 z-10"
            aria-label="Add to Cart"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </button>
        )}
      </div>

      {/* Details Container */}
      <div className="flex flex-col gap-1.5 px-0.5">
        {/* Title */}
        <h3 className="text-[13px] sm:text-sm font-bold text-gray-900 truncate tracking-tight">
          {data.title}
        </h3>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] sm:text-sm text-[#] font-bold">{currencySymbol}{data.price.toLocaleString()}</span>
          {isSale && (
            <span className="text-xs text-gray-400 line-through">{currencySymbol}{Math.round(originalPrice).toLocaleString()}</span>
          )}
        </div>

      

        {/* Sizes (Mock) */}
       
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
