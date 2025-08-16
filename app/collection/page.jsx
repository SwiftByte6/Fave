'use client';
import { useSupabase } from '@/hooks/useSupabase';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/Redux/cartSlice';
import Image from 'next/image';
import { CiHeart } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";

const CollectionPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, getDataFromSupabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [priceRange, setPriceRange] = useState(50000);
  const [sortBy, setSortBy] = useState('newest');

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-pink-600">Loading our beautiful collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-100 to-pink-200 py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-4">Our Collection</h1>
          <p className="text-xl text-gray-700 mb-8">
            Discover our complete range of exquisite sarees and lehengas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pl-12 border-2 border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <IoSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-16">
        {/* Sidebar Filters */}
        <div className="lg:w-80 w-full">
          <div className="bg-white rounded-3xl p-6 shadow-lg sticky top-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pink-600">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                Clear All
              </button>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Categories</h3>
              {['All', 'Saree', 'Lehenga', 'Bridal Collection', 'Party Wear', 'Casual Wear'].map((category) => (
                <label key={category} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={selectedCategory === category}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-gray-700 hover:text-pink-600 transition">{category}</span>
                </label>
              ))}
            </div>

            {/* Fabric Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Fabric</h3>
              {['All', 'Silk', 'Cotton', 'Georgette', 'Chiffon', 'Crepe', 'Velvet'].map((fabric) => (
                <label key={fabric} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fabric"
                    value={fabric}
                    checked={selectedFabric === fabric}
                    onChange={(e) => setSelectedFabric(e.target.value)}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-gray-700 hover:text-pink-600 transition">{fabric}</span>
                </label>
              ))}
            </div>

            {/* Occasion */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Occasion</h3>
              {['All', 'Wedding', 'Party', 'Casual', 'Office', 'Festival', 'Bridal'].map((occasion) => (
                <label key={occasion} className="flex items-center gap-3 mb-2 cursor-pointer">
                  <input
                    type="radio"
                    name="occasion"
                    value={occasion}
                    checked={selectedOccasion === occasion}
                    onChange={(e) => setSelectedOccasion(e.target.value)}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-gray-700 hover:text-pink-600 transition">{occasion}</span>
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Price Range</h3>
              <input
                type="range"
                min="0"
                max="50000"
                value={priceRange}
                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
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
                <h2 className="text-2xl font-bold text-pink-600 mb-2">
                  {filteredProducts.length} Products Found
                </h2>
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
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
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-pink-100 shadow-lg overflow-hidden h-[650px] relative transition-all duration-300 hover:shadow-pink-200 hover:scale-105"
                >
                  {/* Wishlist Icon */}
                  <div className="absolute top-3 right-3 z-10">
                    <CiHeart
                      size={34}
                      className="bg-white text-pink-300 hover:text-pink-500 p-2 rounded-full shadow-sm cursor-pointer transition"
                    />
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {product.category || 'Elegance Boutique'}
                    </span>
                  </div>

                  {/* Image */}
                  <div
                    className="h-[70%] bg-pink-50 cursor-pointer overflow-hidden"
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    {product?.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
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
                        {product.title}
                      </h3>
                      <p className="text-xs text-pink-400 mb-2">{product.category || 'Elegance Boutique'}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xl text-gray-800 font-bold">₹ {product.price?.toLocaleString()}</div>
                      <button
                        onClick={() => addToCartItem(product)}
                        className="bg-pink-100 text-pink-600 font-medium text-sm px-4 py-2 rounded-xl hover:bg-pink-200 transition duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👗</div>
              <h2 className="text-2xl font-bold text-pink-600 mb-2">No products found</h2>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
              <button 
                onClick={clearFilters}
                className="bg-pink-600 text-white px-6 py-3 rounded-full hover:bg-pink-700 transition"
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

export default CollectionPage;
