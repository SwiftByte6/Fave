"use client";
import React from "react";
import ProductCard from "@/component/ProductCarad";

type Props = { addToCartItem: (p: any) => void; products: any[] };

const NewArrivalsGrid: React.FC<Props> = ({ addToCartItem, products }) => {
  const source = Array.isArray(products) ? products : [];

  const newArrivals = [...source]
    .map((p: any) => ({
      ...p,
      _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0,
    }))
    .sort((a: any, b: any) => b._createdAt - a._createdAt)
    .slice(0, 6);

  return (
    <section className="pb-8 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {newArrivals.map((p: any) => (
            <ProductCard
              key={p.id}
              data={p}
              variant="bestseller"
              showCategoryBadge={false}
              showAddToCart={true}
              addToCartItem={addToCartItem}
              currencySymbol="$"
            />
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button className="px-6 py-2 rounded-full bg-[#F4DCDC] text-[#6f5a4d] hover:opacity-90">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsGrid;


