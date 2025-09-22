'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/Redux/cartSlice'
import Image from 'next/image';
import { IoFilter } from "react-icons/io5";
import ProductCard from './ProductCarad';

const SearchResult = ({ filterData }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const addToCartItem = (item) => {
    console.log('Add to cart:', item);
    dispatch(addToCart({ ...item, cartQuantity: 1 }))
  };

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row bg-[#FBF8F6]">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden p-4 border-b border-[#F0E7DE]">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 bg-[#FBF1F4] text-[#6f5a4d] px-4 py-2 rounded-full hover:bg-[#FDE6ED] transition w-full justify-center"
          >
            <IoFilter size={20} />
            <span className="font-medium">Filters & Categories</span>
          </button>
        </div>

        {/* Sidebar - Mobile Overlay / Desktop Sidebar */}
        <div className={`
          ${isFilterOpen ? 'fixed inset-0 z-50 lg:relative lg:z-auto' : 'hidden lg:block'}
          ${isFilterOpen ? 'bg-black/50 lg:bg-transparent' : ''}
        `}>
          <div className={`
            ${isFilterOpen ? 'absolute right-0 top-0 h-full w-[85vw] sm:w-[70vw] lg:w-[20vw] lg:relative' : ''}
            bg-white/95 shadow-sm lg:shadow-none border border-[#F0E7DE] rounded-xl lg:rounded-none lg:border-r lg:border-b-0 lg:border-t-0 lg:border-l-0
            p-4 lg:p-5 overflow-y-auto
          `}>
            {/* Mobile Close Button */}
            {isFilterOpen && (
              <div className="lg:hidden flex justify-between items-center mb-4 pb-3 border-b border-[#F0E7DE]">
                <h1 className='text-xl font-semibold text-[#6f5a4d]'>Filters</h1>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-[#6f5a4d] hover:opacity-80 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* Desktop Title */}
            <h1 className='mb-4 text-xl font-semibold text-[#6f5a4d] hidden lg:block'>Filters</h1>

            {/* Categories */}
            <div className='mb-6'>
              <h2 className='text-[#6f5a4d] mb-2 font-medium text-sm lg:text-base'>Categories</h2>
              {["Sarees", "Lehengas", "Bridal Collection", "Party Wear", "Casual Wear", "Accessories"].map((item, index) => (
                <label key={index} className='flex items-center gap-2 mb-2 lg:mb-1 cursor-pointer text-[#8A6F5C] hover:text-[#6f5a4d] text-sm lg:text-base'>
                  <input
                    type="checkbox"
                    className="w-4 h-4 appearance-none border-2 border-[#F0E7DE] rounded-md checked:bg-rose-300 checked:border-rose-400 focus:ring-2 focus:ring-rose-200 cursor-pointer transition"
                  />
                  {item}
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className='mb-6'>
              <h2 className='text-[#6f5a4d] mb-2 font-medium text-sm lg:text-base'>Price Range</h2>
              <input
                type="range"
                min="0"
                max="50000"
                className="w-full h-2 bg-[#FBF1F4] rounded-lg appearance-none cursor-pointer accent-rose-300 hover:accent-rose-400 transition"
              />
              <div className='flex justify-between mt-2 text-xs lg:text-sm text-[#8A6F5C]'>
                <span>₹0</span>
                <span>₹50,000</span>
              </div>
            </div>

            {/* Fabric Type */}
            <div className='mb-6'>
              <h2 className='text-[#6f5a4d] mb-2 font-medium text-sm lg:text-base'>Fabric</h2>
              {["Silk", "Cotton", "Georgette", "Chiffon", "Crepe", "Velvet"].map((item, index) => (
                <label key={index} className='flex items-center gap-2 mb-2 lg:mb-1 cursor-pointer text-[#8A6F5C] hover:text-[#6f5a4d] text-sm lg:text-base'>
                  <input type='checkbox' className='accent-rose-300 w-4 h-4' />
                  {item}
                </label>
              ))}
            </div>

            {/* Size */}
            <div className='mb-6'>
              <h2 className='text-[#6f5a4d] mb-2 font-medium text-sm lg:text-base'>Size</h2>
              <div className='flex gap-2 lg:gap-3 flex-wrap'>
                {["XS", "S", "M", "L", "XL", "XXL"].map((item, index) => (
                  <div
                    key={index}
                    className='bg-[#FBF1F4] text-[#6f5a4d] py-1.5 lg:py-2 px-3 lg:px-5 rounded-full text-xs lg:text-sm font-medium cursor-pointer hover:bg-[#FDE6ED] transition'
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div className='mb-6'>
              <h2 className='text-[#6f5a4d] mb-2 font-medium text-sm lg:text-base'>Occasion</h2>
              {["Wedding", "Party", "Casual", "Office", "Festival", "Bridal"].map((item, index) => (
                <label key={index} className='flex items-center gap-2 mb-2 lg:mb-1 cursor-pointer text-[#8A6F5C] hover:text-[#6f5a4d] text-sm lg:text-base'>
                  <input type='checkbox' className='accent-rose-300 w-4 h-4' />
                  {item}
                </label>
              ))}
            </div>

            {/* Clear Button */}
            <button className='w-full bg-[#FBF1F4] text-[#6f5a4d] py-2 rounded-full hover:bg-[#FDE6ED] transition text-sm lg:text-base'>
              Clear All
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="w-full lg:w-[80vw] min-h-screen p-3 sm:p-4 lg:p-6">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="dancing text-[1.8rem] sm:text-[2.2rem] text-[#6f5a4d] mb-1">Search Results</h1>
            <p className="text-sm lg:text-base text-[#8A6F5C]">Found {filterData.length} products</p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filterData.map((item, index) => (
              <ProductCard
                key={index}
                data={item}
                variant="search"
                showCategoryBadge={true}
                showWishlist={true}
                showAddToCart={true}
                addToCartItem={addToCartItem}
              />
            ))}
          </div>

          {/* No Results */}
          {filterData.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="text-5xl sm:text-6xl mb-4">👗</div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#6f5a4d] mb-2">No products found</h2>
              <p className="text-sm sm:text-base text-[#8A6F5C] mb-6 px-4">Try adjusting your search criteria or browse our collections</p>
              <button 
                onClick={() => router.push('/')}
                className="bg-[#F4DCDC] text-[#6f5a4d] px-6 py-3 rounded-full hover:opacity-90 transition"
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
