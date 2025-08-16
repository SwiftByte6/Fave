'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/Redux/cartSlice'
import Image from 'next/image';
import { CiHeart } from "react-icons/ci";

const SearchResult = ({ filterData }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const addToCartItem = (item) => {
    console.log('Add to cart:', item);
    dispatch(addToCart(item))
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full  md:w-[20vw] hidden md:flex min-h-screen  p-4 ">
          <div className='shadow-sm border-2 border-pink-100 rounded-xl w-full p-5 bg-white'>
            <h1 className='mb-4 text-xl font-semibold text-pink-500'>Filters</h1>

            {/* Categories */}
            <div className='mb-6'>
              <h2 className='text-black/80 mb-2 font-medium'>Categories</h2>
              {["Sarees", "Lehengas", "Bridal Collection", "Party Wear", "Casual Wear", "Accessories"].map((item, index) => (
                <label key={index} className='flex items-center gap-2 mb-1 cursor-pointer text-[#4b5563] hover:text-pink-500'>
                  <input
                    type="checkbox"
                    className="w-4 h-4 appearance-none border-2 border-pink-300 rounded-md checked:bg-pink-400 checked:border-pink-500 focus:ring-2 focus:ring-pink-300 cursor-pointer transition"
                  />
                  {item}
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className='mb-6'>
              <h2 className='text-black/80 mb-2 font-medium'>Price Range</h2>
              <input
                type="range"
                min="0"
                max="50000"
                className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-400 hover:accent-pink-500 transition"
              />
              <div className='flex justify-between mt-2 text-sm text-gray-500'>
                <span>₹0</span>
                <span>₹50,000</span>
              </div>
            </div>

            {/* Fabric Type */}
            <div className='mb-6'>
              <h2 className='text-black/80 mb-2 font-medium'>Fabric</h2>
              {["Silk", "Cotton", "Georgette", "Chiffon", "Crepe", "Velvet"].map((item, index) => (
                <label key={index} className='flex items-center gap-2 mb-1 cursor-pointer text-[#4b5563] hover:text-pink-500'>
                  <input
                    type="checkbox"
                    className='accent-pink-400 w-4 h-4'
                  />
                  {item}
                </label>
              ))}
            </div>

            {/* Size */}
            <div className='mb-6'>
              <h2 className='text-black/80 mb-2 font-medium'>Size</h2>
              <div className='flex gap-3 flex-wrap'>
                {["XS", "S", "M", "L", "XL", "XXL"].map((item, index) => (
                  <div
                    key={index}
                    className='bg-pink-100 text-pink-500 py-2 px-5 rounded-2xl text-sm font-medium cursor-pointer hover:bg-pink-200 transition'
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className='mb-6'>
              <h2 className='text-black/80 mb-2 font-medium'>Occasion</h2>
              {["Wedding", "Party", "Casual", "Office", "Festival", "Bridal"].map((item, index) => (
                <label key={index} className='flex items-center gap-2 mb-1 cursor-pointer text-[#4b5563] hover:text-pink-500'>
                  <input
                    type="checkbox"
                    className='accent-pink-400 w-4 h-4'
                  />
                  {item}
                </label>
              ))}
            </div>

            {/* Clear Button */}
            <button className='w-full bg-pink-50 text-pink-500 py-2 rounded-md hover:bg-pink-100 transition'>
              Clear All
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="w-full md:w-[80vw] min-h-screen p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-pink-600 mb-2">Search Results</h1>
            <p className="text-gray-600">Found {filterData.length} products</p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filterData.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-pink-100 shadow-lg overflow-hidden h-[650px] relative transition-all duration-300 hover:shadow-pink-200 hover:scale-105"
              >
                {/* Wishlist Icon */}
                <div className='absolute top-3 right-3 z-10'>
                  <CiHeart
                    size={34}
                    className='bg-white text-pink-300 hover:text-pink-500 p-2 rounded-full shadow-sm cursor-pointer transition'
                  />
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>
                </div>

                {/* Image */}
                <div
                  className="h-[70%] bg-pink-50 cursor-pointer overflow-hidden"
                  onClick={() => router.push(`/products/${item.id}`)}
                >
                  {item?.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">👗</div>
                        <p>Image coming soon</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 h-[30%] flex flex-col justify-between">
                  <div>
                    <h3 className="text-pink-600 text-lg font-semibold mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-pink-400 mb-2">{item.category || "Elegance Boutique"}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xl text-gray-800 font-bold">₹ {item.price?.toLocaleString()}</div>
                    <button
                      onClick={() => addToCartItem(item)}
                      className="bg-pink-100 text-pink-600 font-medium text-sm px-4 py-2 rounded-xl hover:bg-pink-200 transition duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filterData.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👗</div>
              <h2 className="text-2xl font-bold text-pink-600 mb-2">No products found</h2>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse our collections</p>
              <button 
                onClick={() => router.push('/')}
                className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
              >
                Browse Collections
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResult;
