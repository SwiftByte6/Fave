"use client";

import React, { useState, useEffect, useCallback } from "react";

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

export const Slider = ({
  items,
  renderItem,
  autoplayMs = 3500,
  showPagination = false,
  showArrows = true,
  paginationDotClassName = "h-2 w-2 sm:h-3 sm:w-3 rounded-full p-0",
  paginationActiveClassName = "bg-rose-500",
  paginationInactiveClassName = "bg-gray-300",
}) => {
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

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(goToNext, autoplayMs);
    return () => clearTimeout(timer);
  }, [currentIndex, goToNext, isPaused, autoplayMs]);

  return (
    <div
      className="relative w-full max-w-6xl mx-auto py-10"
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
              className="flex-shrink-0 px-4"
              style={{ flexBasis: `${100 / slidesPerView}%` }}
            >
              {renderItem ? (
                renderItem(item)
              ) : (
                <div className="rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-[360px] object-cover"
                  />
                  <div className="p-4 text-center">
                    <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-rose-500 font-medium">{item.price}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white text-rose-400 hover:bg-rose-50 shadow p-2 rounded-full z-10"
          >
            <ArrowIcon className="h-6 w-6 transform rotate-180" />
          </button>
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white text-rose-400 hover:bg-rose-50 shadow p-2 rounded-full z-10"
          >
            <ArrowIcon className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Pagination Dots (optional) */}
      {showPagination && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goToSlide(idx)}
              className={`slider-dot ${paginationDotClassName} transition-colors inline-flex items-center justify-center ${
                currentIndex === idx ? paginationActiveClassName : paginationInactiveClassName
              }`}
            />
          ))}
        </div>
      )}




    </div>
  );
};
