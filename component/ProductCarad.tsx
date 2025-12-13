"use client";

import React, { memo, useCallback } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { addToFavourites, removeFromFavourites } from "@/Redux/FavSlice";
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

  // get favourites from store
  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites
  );

  // check if current product is already in favourites
  const isFavourite = favourites.some((item) => item.id === data.id);

  const toggleFavourite = useCallback(() => {
    if (isFavourite) {
      dispatch(removeFromFavourites(data.id.toString()));
      toast("Removed from wishlist!");
    } else {
      dispatch(
        addToFavourites({
          id: data.id.toString(),
          title: data.title,
          images: data.images || [],
          category: data.category,
          price: data.price,
          stock: 10,
        })
      );
      toast.success("Added to wishlist!");
    }
  }, [isFavourite, dispatch, data.id, data.title, data.images, data.category, data.price]);

  const handleAddToCart = useCallback(() => {
    if (addToCartItem) {
      addToCartItem(data);
      toast.success("Added to cart!");
    }
  }, [addToCartItem, data]);

  const handleProductClick = useCallback(() => {
    router.push(`/products/${data.id}`);
  }, [router, data.id]);

  // Determine card height based on variant
  const getCardHeight = () => {
    switch (variant) {
      case "bestseller":
        return "h-[400px] sm:h-[400px] lg:h-[400px]";
      case "compact":
        return "h-[400px] sm:h-[450px] lg:h-[500px]";
      case "search":
        return "h-[400px] sm:h-[400px] lg:h-[400px]";
      case "default":
      default:
        return "h-[550px] sm:h-[600px] lg:h-[700px]";
    }
  };

  // Determine image height based on variant
  const getImageHeight = () => {
    switch (variant) {
      case "bestseller":
        return "h-[62%]";
      case "compact":
        return "h-[70%]";
      case "search":
        return "h-[65%]";
      case "default":
      default:
        return "h-[75%]";
    }
  };

  // Determine content height based on variant
  const getContentHeight = () => {
    switch (variant) {
      case "bestseller":
        return "h-[25%]";
      case "compact":
        return "h-[30%]";
      case "search":
        return "h-[25%]";
      case "default":
      default:
        return "h-[20%]";
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${getCardHeight()} relative transition-all duration-300 hover:shadow-md group ${className}`}
    >
      {/* Wishlist Icon */}
      {showWishlist && (
        <div className="absolute top-3 right-3 z-20">
          {isFavourite ? (
            <FaHeart
              size={20}
              onClick={toggleFavourite}
              className="text-red-500 cursor-pointer transition-all duration-200 hover:scale-110"
            />
          ) : (
            <CiHeart
              size={20}
              onClick={toggleFavourite}
              className="text-gray-400 hover:text-red-500 cursor-pointer transition-all duration-200 hover:scale-110"
            />
          )}
        </div>
      )}

      {/* Image */}
      <div
        className={`${getImageHeight()} bg-gray-50 cursor-pointer overflow-hidden relative`}
        onClick={handleProductClick}
      >
        {data?.images?.[0] ? (
          <ImageFallback
            src={data.images[0]}
            alt={data.title}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onClick={handleProductClick}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-500">
            <div className="text-center">
              <p className="font-medium">Image coming soon</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col justify-between bg-white">
        <div className="mb-3">
          <h3 className="text-gray-900 text-sm font-medium mb-1 line-clamp-2 leading-tight">
            {data.title}
          </h3>
          <p className="text-xs text-gray-500 font-normal">
            {data.category || "Kurtis"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-orange-600 font-semibold text-lg">
              ₹ {data.price?.toLocaleString()}
            </div>
            <span className="text-xs text-gray-500">Bestseller</span>
          </div>
          {showAddToCart && addToCartItem && (
            <button
              onClick={handleAddToCart}
              className="group/btn relative overflow-hidden bg-red-800 hover:bg-red-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:transition-all before:duration-500 hover:before:left-[100%]"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
