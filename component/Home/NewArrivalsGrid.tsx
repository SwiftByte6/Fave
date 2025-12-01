"use client";
import React from "react";
import ProductCard from "@/component/ProductCarad";
import { useRouter } from "next/navigation";

type Props = {
  addToCartItem: (p: any) => void;
  products: any[];
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  limit?: number;
};

const NewArrivalsGrid: React.FC<Props> = ({ addToCartItem, products, title = "New Arrival", ctaLabel = "View All Products", ctaHref = "/collection", limit = 6 }) => {
  const router = useRouter();
  const source = Array.isArray(products) ? products : [];

  const newArrivals = [...source]
    .map((p: any) => ({
      ...p,
      _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0,
    }))
    .sort((a: any, b: any) => b._createdAt - a._createdAt)
    .slice(0, limit);

  return (
    <section className="pb-8 md:pb-12 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 md:px-6 space-y-6">
        <div>
           <h1 className="text-[#CB9134] mt-10 md:mt-15 text-center dancing mb-5 text-[2.5rem] md:text-[4rem] leading-tight md:leading-none">
          {title}
        </h1>
          <p className="text-center">Fresh styles that speak to your heart. Discover pieces that make you feel confident and beautiful.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          
          {newArrivals.map((p: any) => (
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
        <div className="flex justify-center mt-6">
          <button className="px-6 py-2 rounded-full bg-[#F4DCDC] text-[#6f5a4d] hover:opacity-90" onClick={() => router.push(ctaHref)}>
            {ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsGrid;


