'use client'

import React from 'react'
import Image from 'next/image'
import { CiHeart } from 'react-icons/ci'
import { useRouter } from 'next/navigation'

interface ProductData {
  id: string | number;
  title: string;
  images?: string[];
  category?: string;
  price: number;
}

interface ProductCardProps {
  data: ProductData;
  addToCartItem: (product: ProductData) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ data, addToCartItem }) => {
  const router = useRouter()

  return (
    <div
      className="bg-white rounded-3xl border border-pink-100 shadow-lg overflow-hidden h-[700px] relative transition-all duration-300 hover:shadow-pink-200"
    >
      {/* Wishlist Icon */}
      <div className="absolute top-3 right-3 z-10">
        <CiHeart
          size={34}
          className="bg-white text-pink-300 hover:text-pink-500 p-2 rounded-full shadow-sm cursor-pointer transition"
        />
      </div>

      {/* Image */}
      <div
        className="h-[75%] bg-pink-50 cursor-pointer overflow-hidden"
        onClick={() => router.push(`/products/${data.id}`)}
      >
        {data?.images?.[0] ? (
          <Image
            src={data.images[0]}
            alt={data.title}
            width={500}
            height={500}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-gray-400">
            No image available
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 h-[25%] flex flex-col justify-between">
        <h3 className="text-pink-600 text-lg font-semibold mb-1 line-clamp-2">
          {data.title}
        </h3>
        <p className="text-xs text-pink-400 mb-3">{data.category || "Pookie Style"}</p>
        <div className="text-lg text-gray-800 font-medium mb-4">₹ {data.price}</div>
        <button
          onClick={() => addToCartItem(data)}
          className="w-full py-2 rounded-xl bg-pink-100 text-pink-600 font-medium text-sm hover:bg-pink-200 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
