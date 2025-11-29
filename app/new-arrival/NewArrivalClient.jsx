"use client";
import { useSupabase } from "@/hooks/useSupabase";
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "@/component/ProductCarad";
import { useDispatch } from "react-redux";
import { addToCart } from "@/Redux/cartSlice";

export default function NewArrivalClient() {
  const dispatch = useDispatch();
  const { products, getDataFromSupabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await getDataFromSupabase();
      setIsLoading(false);
    };
    load();
  }, []);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [products]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F5F0] to-[#F0E7DE] py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#6f5a4d] mb-4">
            New Arrivals
          </h1>
          <p className="text-lg text-[#8A6F5C] max-w-3xl mx-auto mb-4">
            Discover the latest in premium Indian fashion. Fresh styles and contemporary designs added weekly.
          </p>
          <p className="text-sm text-[#A68B7A] font-medium">
            {sortedProducts.length} New Products | Free Shipping Across India | COD Available
          </p>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                data={product}
                variant="default"
                showCategoryBadge={true}
                showAddToCart={true}
                currencySymbol="₹"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">
              No new arrivals found
            </h2>
            <p className="text-[#8A6F5C] mb-6">
              Check back soon for the latest fashion updates.
            </p>
          </div>
        )}

        {/* SEO Content Section */}
        <div className="mt-16 bg-white/80 rounded-2xl p-8 shadow-sm border border-[#F0E7DE]">
          <h2 className="text-2xl font-bold text-[#6f5a4d] mb-4">
            Latest Fashion Trends at Favee
          </h2>
          <div className="text-[#8A6F5C] leading-relaxed space-y-4">
            <p>
              Stay ahead of the fashion curve with Favee's new arrivals collection. We constantly update our inventory 
              with the latest designs in Indian ethnic wear, contemporary fashion, and fusion styles.
            </p>
            <p>
              <strong>What's New This Week:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Designer sarees with contemporary prints and patterns</li>
              <li>Elegant kurta sets perfect for office and casual wear</li>
              <li>Trendy western wear for the modern Indian woman</li>
              <li>Festive collection for upcoming celebrations</li>
              <li>Fusion wear that blends traditional and modern styles</li>
            </ul>
            <p>
              All our new arrivals come with free shipping across India, easy returns, and our quality guarantee. 
              Be the first to wear the latest fashion trends with Favee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}