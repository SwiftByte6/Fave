"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { useDispatch } from "react-redux";
import { addToCart } from "@/Redux/cartSlice";
import ProductCard from "./ProductCarad";
import Story from "@/component/Home/Story"
import NewArrivalsGrid from "@/component/Home/NewArrivalsGrid"
import ThingsULike from '@/component/Home/ThingsULike'
import Hero from '@/component/Home/Hero'




const HomePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { products, getDataFromSupabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getDataFromSupabase();
      setIsLoading(false);
    };
    fetchData();
  }, []);

	const featuredProducts = products.slice(0, 8);

	const newArrivals = [...products]
		.map((p: any) => ({ ...p, _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0 }))
		.sort((a: any, b: any) => b._createdAt - a._createdAt)
		.slice(0, 6);

	const youWillLove = [...products].slice(6, 12);
	// Robust bestseller selection: always show items even if dataset is small
	const bestSellers = [...products]
		.map((p: any) => ({ ...p, _popularity: p.sales || p.orders || 0, _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0 }))
		.sort((a: any, b: any) => (b._popularity - a._popularity) || (b._createdAt - a._createdAt))
		.slice(0, 4);

  const addToCartItem = (product: any) => {
    dispatch(addToCart({ ...product, cartQuantity: 1 }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-maroon-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-maroon-700">
            Loading our beautiful collections...
          </p>
        </div>
      </div>
    );
  }

	return (
		<>
			<div>
          <Hero/>
            {/* New Arrivals section above Things You'll Love */}
            <NewArrivalsGrid addToCartItem={addToCartItem} products={products}/>
            <ThingsULike/>
          {/* Best Seller */}
          <section className="py-12 flex flex-col items-center gap-6">
            <div className="px-6 py-2 rounded-full bg-[#F4DCDC] shadow-sm">
              <h2 className="dancing text-[2rem] md:text-[2.4rem] text-[#6f5a4d]">Bestsellers</h2>
            </div>
            <p className="text-center text-[#8A6F5C] max-w-3xl">
              The pieces our community can't stop talking about. These favorites are loved for a reason.
            </p>
            <div className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {bestSellers.map((p: any) => (
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
            <div className="mt-2 bg-white/80 py-3 px-6 rounded-2xl shadow-sm border border-[#F0E7DE] text-[#8A6F5C]">
              <p>
                Loved by <span className="dancing text-pink-400 text-xl">10,000+</span> happy customers
              </p>
            </div>
          </section>
        <Story/>
			</div>
		</>
	);
};

export default HomePage;
