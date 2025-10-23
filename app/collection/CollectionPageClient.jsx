'use client';
import { useSupabase } from '@/hooks/useSupabase';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '@/Redux/cartSlice';
import ProductCard from '@/component/ProductCarad';
import { addToFavourites, removeFromFavourites } from '@/Redux/FavSlice';
import { IoSearch, IoClose } from "react-icons/io5";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const CollectionPageClient = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.favourites.favourites);
  const { products, getDataFromSupabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [priceRange, setPriceRange] = useState(50000);
  const [sortBy, setSortBy] = useState('random');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getDataFromSupabase();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product =>
        product.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Fabric filter
    if (selectedFabric !== 'All') {
      filtered = filtered.filter(product =>
        product.description?.toLowerCase().includes(selectedFabric.toLowerCase())
      );
    }

    // Occasion filter
    if (selectedOccasion !== 'All') {
      filtered = filtered.filter(product =>
        product.description?.toLowerCase().includes(selectedOccasion.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(product => product.price <= priceRange);

    // Sorting
    switch (sortBy) {
      case 'random':
        // Fisher-Yates shuffle
        for (let i = filtered.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
        }
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedFabric, selectedOccasion, priceRange, sortBy]);

  const addToCartItem = (product) => {
    dispatch(addToCart(product));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedFabric('All');
    setSelectedOccasion('All');
    setPriceRange(50000);
    setSortBy('newest');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF8F6]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#f9b8c3] mx-auto mb-4"></div>
          <p className="playfair text-lg font-semibold text-[#6f5a4d]">Loading our beautiful collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF8F6]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#F4DCDC] to-[#F0E7DE] py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="playfair text-4xl md:text-6xl font-bold text-[#6f5a4d] mb-4">Our Collection</h1>
          <p className="text-xl text-[#8A6F5C] mb-8">
            Discover our complete range of exquisite sarees and lehengas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            {/* <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-12 border-2 border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
            </div> */}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-16">
        {/* Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="bg-[#f9b8c3] text-white p-4 rounded-full shadow-xl hover:bg-[#f7a8b8] transition-all duration-300 flex items-center gap-2"
          >
            <HiOutlineAdjustmentsHorizontal size={24} />
            <span className="font-semibold">Filters</span>
          </button>
        </div>

        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-[60] animate-fadeIn" onClick={() => setShowMobileFilters(false)}>
            <div 
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl overflow-y-auto animate-slideInRight"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-10 p-6 border-b border-[#F0E7DE] flex justify-between items-center">
                <h2 className="playfair text-2xl font-bold text-[#6f5a4d]">Filters</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-[#8A6F5C] hover:text-[#6f5a4d] transition"
                >
                  <IoClose size={32} />
                </button>
              </div>
              <div className="p-6">
                {/* Clear All Button */}
                <button
                  onClick={() => {
                    clearFilters();
                    setShowMobileFilters(false);
                  }}
                  className="w-full mb-6 py-3 bg-[#F4DCDC] text-[#6f5a4d] rounded-xl font-semibold hover:bg-[#F0E7DE] transition"
                >
                  Clear All Filters
                </button>

                {/* Sort By */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Sort By</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-3 border border-[#F0E7DE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9b8c3]"
                  >
                    <option value="random">Random</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Categories</h3>
                  {['All', 'Saree', 'Lehenga', 'Bridal Collection', 'Party Wear', 'Casual Wear'].map((category) => (
                    <label key={category} className="flex items-center gap-3 mb-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-[#f9b8c3] focus:ring-[#f9b8c3]"
                      />
                      <span className="text-[#8A6F5C] hover:text-[#6f5a4d] transition">{category}</span>
                    </label>
                  ))}
                </div>

                {/* Fabric Type */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Fabric</h3>
                  {['All', 'Silk', 'Cotton', 'Georgette', 'Chiffon', 'Crepe', 'Velvet'].map((fabric) => (
                    <label key={fabric} className="flex items-center gap-3 mb-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-fabric"
                        value={fabric}
                        checked={selectedFabric === fabric}
                        onChange={(e) => setSelectedFabric(e.target.value)}
                        className="w-4 h-4 text-[#f9b8c3] focus:ring-[#f9b8c3]"
                      />
                      <span className="text-[#8A6F5C] hover:text-[#6f5a4d] transition">{fabric}</span>
                    </label>
                  ))}
                </div>

                {/* Occasion */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Occasion</h3>
                  {['All', 'Wedding', 'Party', 'Casual', 'Office', 'Festival', 'Bridal'].map((occasion) => (
                    <label key={occasion} className="flex items-center gap-3 mb-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-occasion"
                        value={occasion}
                        checked={selectedOccasion === occasion}
                        onChange={(e) => setSelectedOccasion(e.target.value)}
                        className="w-4 h-4 text-[#f9b8c3] focus:ring-[#f9b8c3]"
                      />
                      <span className="text-[#8A6F5C] hover:text-[#6f5a4d] transition">{occasion}</span>
                    </label>
                  ))}
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Price Range</h3>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#F4DCDC] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-sm text-[#8A6F5C]">
                    <span>₹0</span>
                    <span>₹{priceRange.toLocaleString()}</span>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-[#f9b8c3] text-white rounded-xl font-semibold hover:bg-[#f7a8b8] transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Filters */}
        <div className="hidden lg:block lg:w-80 w-full">
          <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="playfair text-2xl font-bold text-[#6f5a4d]">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-[#6f5a4d] hover:text-[#8A6F5C] text-sm font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-[#F0E7DE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f9b8c3]"
              >
                <option value="random">Random</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Categories</h3>
              {['All', 'Saree', 'Lehenga', 'Bridal Collection', 'Party Wear', 'Casual Wear'].map((category) => (
                <label key={category} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-[#f9b8c3] focus:ring-[#f9b8c3]"
                  />
                  <span className="text-[#8A6F5C] hover:text-[#6f5a4d] transition">{category}</span>
                </label>
              ))}
            </div>

            {/* Fabric Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Fabric</h3>
              {['All', 'Silk', 'Cotton', 'Georgette', 'Chiffon', 'Crepe', 'Velvet'].map((fabric) => (
                <label key={fabric} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fabric"
                    value={fabric}
                    checked={selectedFabric === fabric}
                    onChange={(e) => setSelectedFabric(e.target.value)}
                    className="w-4 h-4 text-[#f9b8c3] focus:ring-[#f9b8c3]"
                  />
                  <span className="text-[#8A6F5C] hover:text-[#6f5a4d] transition">{fabric}</span>
                </label>
              ))}
            </div>

            {/* Occasion */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Occasion</h3>
              {['All', 'Wedding', 'Party', 'Casual', 'Office', 'Festival', 'Bridal'].map((occasion) => (
                <label key={occasion} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="occasion"
                    value={occasion}
                    checked={selectedOccasion === occasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                    className="w-4 h-4 text-[#f9b8c3] focus:ring-[#f9b8c3]"
                  />
                  <span className="text-[#8A6F5C] hover:text-[#6f5a4d] transition">{occasion}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Price Range</h3>
              <input
                type="range"
                min="0"
                max="50000"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-2 bg-[#F4DCDC] rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-sm text-[#8A6F5C]">
                <span>₹0</span>
                <span>₹{priceRange.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="playfair text-2xl font-bold text-[#6f5a4d] mb-2">
                  {filteredProducts.length} Products Found
                </h2>
                <p className="text-[#8A6F5C]">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#8A6F5C]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-[#F0E7DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f9b8c3]"
                >
                  <option value="random">Random</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  data={p}
                  variant="bestseller"
                  showCategoryBadge={false}
                  showAddToCart={true}
                  addToCartItem={addToCartItem}
                  currencySymbol="₹"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👗</div>
              <h2 className="playfair text-2xl font-bold text-[#6f5a4d] mb-2">No products found</h2>
              <p className="text-[#8A6F5C] mb-6">Try adjusting your filters or search criteria</p>
              <button 
                onClick={clearFilters}
                className="bg-[#f9b8c3] text-white px-6 py-3 rounded-full hover:bg-[#f7a8b8] transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPageClient;
