"use client";

import React, { useState, useEffect, useCallback } from "react";

// --- Dummy Product Data (fallback) ---
const fallbackProducts = [
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
export const Slider = ({ items, renderItem, autoplayMs = 3500 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slidesPerView = useSlidesPerView();

  const data = items && items.length ? items : fallbackProducts;
  const maxIndex = Math.max(0, data.length - slidesPerView);

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
    const timer = setTimeout(goToNext, autoplayMs);
    return () => clearTimeout(timer);
  }, [currentIndex, goToNext, isPaused, autoplayMs]);

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
          {data.map((item, idx) => (
            <div
              key={item.id ?? idx}
              className="flex-shrink-0 px-3 w-[300px]"
              style={{ flexBasis: `${100 / slidesPerView}%` }}
            >
              {renderItem ? (
                renderItem(item)
              ) : (
                <div className="rounded-xl overflow-hidden bg-white shadow">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-[300px] h-[360px] object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white text-[#8A6F5C] hover:bg-rose-50 shadow p-2 rounded-full z-10"
      >
        <ArrowIcon className="h-6 w-6 transform rotate-180" />
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white text-[#8A6F5C] hover:bg-rose-50 shadow p-2 rounded-full z-10"
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
              currentIndex === idx ? "bg-rose-400" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

