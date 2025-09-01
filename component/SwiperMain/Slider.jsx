"use client";

import React, { useState, useEffect, useCallback } from "react";

// --- Dummy Product Data (replace with API later) ---
const products = [
  {
    id: 1,
    title: "Women Green Sweater",
    price: "₹1,299",
    img: "https://placehold.co/300x400/f87171/ffffff?text=Product+1",
  },
  {
    id: 2,
    title: "Red Winter Jacket",
    price: "₹2,499",
    img: "https://placehold.co/300x400/60a5fa/ffffff?text=Product+2",
  },
  {
    id: 3,
    title: "Printed Kurti",
    price: "₹899",
    img: "https://placehold.co/300x400/34d399/ffffff?text=Product+3",
  },
  {
    id: 4,
    title: "Ethnic Saree",
    price: "₹1,999",
    img: "https://placehold.co/300x400/fbbf24/ffffff?text=Product+4",
  },
  {
    id: 5,
    title: "Casual T-Shirt",
    price: "₹699",
    img: "https://placehold.co/300x400/a78bfa/ffffff?text=Product+5",
  },
];

// --- Arrow SVG Component ---
const ArrowIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

// --- Hook for responsive slides ---
const useSlidesPerView = () => {
  const getSlidesPerView = () => (window.innerWidth < 768 ? 1 : 3);
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    setSlidesPerView(getSlidesPerView());
    const handleResize = () => setSlidesPerView(getSlidesPerView());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return slidesPerView;
};

// --- Slider Component ---
const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slidesPerView = useSlidesPerView();

  const maxIndex = Math.max(0, products.length - slidesPerView);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goToSlide = (idx) => setCurrentIndex(idx);

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(goToNext, 3000);
    return () => clearTimeout(timer);
  }, [currentIndex, goToNext, isPaused]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Viewport */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform ease-in-out duration-500"
          style={{ transform: `translateX(-${(currentIndex * 100) / slidesPerView}%)` }}
        >
          {products.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 ml-10 bg-gray-100"
              style={{ flexBasis: `${100 / slidesPerView}%` }}
            >
              <div className=" rounded-lg  p-3 ">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-[370px] object-cover rounded-md"
                />
        
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 
                   bg-white/20 hover:bg-white/40 text-white p-2 rounded-full z-10"
      >
        <ArrowIcon className="h-6 w-6 transform rotate-180" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 
                   bg-white/20 hover:bg-white/40 text-white p-2 rounded-full z-10"
      >
        <ArrowIcon className="h-6 w-6" />
      </button>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${
              currentIndex === idx ? "bg-rose-500" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// --- Whole Section with text + slider ---
const BestSellerSection = () => {
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-between bg-[#531c22] rounded-l-3xl text-white w-full min-h-[50vh] p-6 md:p-12">
      <div className="md:w-1/3 space-y-6">
        <h1 className="text-3xl md:text-6xl font-bold">Best Seller Products</h1>
        <p className="text-gray-300 text-lg md:text-xl">
          Discover our most popular picks loved by our customers. Trendy, stylish, and perfect for every occasion.
        </p>
        <ul className="list-disc pl-5 text-gray-200 text-base md:text-lg space-y-2">
          <li>Handpicked styles for every season</li>
          <li>Premium quality at affordable prices</li>
          <li>Fast shipping & easy returns</li>
          <li>Thousands of happy customers</li>
        </ul>
        <div className="mt-6">
          <button className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition">
            Shop Now
          </button>
        </div>
        <div className="mt-8">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">4.8</span>
              <span className="text-yellow-400">★★★★★</span>
              <span className="text-xs text-gray-300">Customer Rating</span>
            </div>
            <div className="border-l border-gray-500 h-10"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">10K+</span>
              <span className="text-xs text-gray-300">Products Sold</span>
            </div>
          </div>
        </div>
      </div>
      {/* Right Slider */}
      <div className="md:w-2/3 mt-8 md:mt-0">
        <Slider />
      </div>
    </div>
  );
};

export default BestSellerSection;
