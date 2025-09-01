"use client";
import { useSupabase } from "@/hooks/useSupabase";
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "@/component/ProductCarad";
import { useDispatch } from "react-redux";
import { addToCart } from "@/Redux/cartSlice";

export default function NewArrivalPage() {
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

  const sorted = useMemo(() => {
    const withDates = products.map((p) => ({
      ...p,
      _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0,
    }));
    return withDates.sort((a, b) => b._createdAt - a._createdAt).slice(0, 16);
  }, [products]);

  const addToCartItem = (product) => dispatch(addToCart(product));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-16 py-8">
      <h1 className="text-2xl font-semibold mb-6 text-pink-600">New Arrival</h1>
      {isLoading ? (
        <div className="bg-white shadow rounded p-6">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map((p) => (
            <ProductCard 
              key={p.id} 
              data={p} 
              variant="default"
              showCategoryBadge={false}
              showWishlist={true}
              showAddToCart={true}
              addToCartItem={addToCartItem} 
            />
          ))}
        </div>
      )}
    </div>
  );
}


