"use client";
import Image from "next/image";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useOptimizedSupabase } from "@/hooks/useOptimizedSupabase";
import { useDispatch } from "react-redux";
import { addToCart } from "@/Redux/cartSlice";
import { LazyLoadWrapper, MemoizedProductGrid } from "./LazyComponents";
import Story from "@/component/Home/Story"
import Hero from '@/component/Home/Hero'
import NewArrivalsGrid from "@/component/Home/NewArrivalsGrid"
import ThingsULike from '@/component/Home/ThingsULike'




const HomePage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { 
    featuredProducts, 
    newArrivals, 
    bestSellers, 
    youWillLove,
    isLoading,
    getDataFromSupabase 
  } = useOptimizedSupabase();
  const [homeConfig, setHomeConfig] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Start Supabase fetch without blocking initial paint
      getDataFromSupabase().finally(() => {
        // no-op
      });
      try {
        const res = await fetch('/home.json', { cache: 'force-cache' });
        if (res.ok) {
          const json = await res.json();
          setHomeConfig(json);
        }
      } catch (_) {}
    };
    fetchData();
  }, [getDataFromSupabase]);

  const addToCartItem = (product: any) => {
    dispatch(addToCart({ ...product, cartQuantity: 1 }));
  };

  // We don't block initial paint; sections that rely on data will render progressively

	return (
		<>
			<div>
				<Hero
					titleTop={homeConfig?.hero?.titleTop ?? "Favee"}
					titleAccent={homeConfig?.hero?.titleAccent ?? "Fashion"}
					subtitle={homeConfig?.hero?.subtitle ?? "Discover your unique style with our curated collection of timeless pieces"}
					bgImage={homeConfig?.hero?.bgImage ?? "/banner.png"}
					features={homeConfig?.hero?.features ?? ["Free Shipping","Easy Returns","24/7 Support"]}
					primaryCta={homeConfig?.hero?.primaryCta ?? { label: "Shop Collection", href: "/collection" }}
					secondaryCta={homeConfig?.hero?.secondaryCta ?? { label: "Learn More", href: "/about" }}
				/>
				
				{/* New Arrivals section with lazy loading */}
				<LazyLoadWrapper>
					<Suspense fallback={
						<section className="pb-8 md:pb-12 min-h-screen">
							<div className="mx-auto max-w-6xl px-4 md:px-6 space-y-6">
								<div className="text-center">
									<div className="h-16 bg-gray-200 rounded w-64 mx-auto mb-5 animate-pulse"></div>
									<div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
									{Array.from({ length: 6 }).map((_, i) => (
										<div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-pink-100 shadow-sm overflow-hidden h-[420px] animate-pulse">
											<div className="h-[62%] bg-pink-50"></div>
											<div className="p-4 h-[25%] flex flex-col justify-between">
												<div className="space-y-2">
													<div className="h-4 bg-gray-200 rounded w-3/4"></div>
													<div className="h-3 bg-gray-200 rounded w-1/2"></div>
												</div>
												<div className="flex justify-between items-center">
													<div className="h-6 bg-gray-200 rounded w-20"></div>
													<div className="h-8 bg-gray-200 rounded w-24"></div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</section>
					}>
						<NewArrivalsGrid
							addToCartItem={addToCartItem}
							products={newArrivals || []}
							title={homeConfig?.newArrivals?.title ?? "New Arrival"}
							ctaLabel={homeConfig?.newArrivals?.ctaLabel ?? "View All Products"}
							ctaHref={homeConfig?.newArrivals?.ctaHref ?? "/collection"}
							limit={homeConfig?.newArrivals?.limit ?? 6}
						/>
					</Suspense>
				</LazyLoadWrapper>

				{/* Things You'll Love with lazy loading */}
				<LazyLoadWrapper>
					<Suspense fallback={
						<section className="py-12 md:py-16">
							<div className="text-center mb-6 md:mb-8">
								<div className="h-16 bg-gray-200 rounded w-80 mx-auto mb-4 animate-pulse"></div>
								<div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
							</div>
							<div className="relative w-full max-w-6xl mx-auto py-10">
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
									{Array.from({ length: 3 }).map((_, i) => (
										<div key={i} className="bg-white rounded-2xl lg:rounded-3xl border border-pink-100 shadow-sm overflow-hidden h-[420px] animate-pulse">
											<div className="h-[62%] bg-pink-50"></div>
											<div className="p-4 h-[25%] flex flex-col justify-between">
												<div className="space-y-2">
													<div className="h-4 bg-gray-200 rounded w-3/4"></div>
													<div className="h-3 bg-gray-200 rounded w-1/2"></div>
												</div>
												<div className="flex justify-between items-center">
													<div className="h-6 bg-gray-200 rounded w-20"></div>
													<div className="h-8 bg-gray-200 rounded w-24"></div>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</section>
					}>
						<ThingsULike
							title={homeConfig?.slider?.title ?? "Things You'll Love"}
							description={homeConfig?.slider?.description ?? 'Handpicked just for you based on your style preferences'}
							products={youWillLove || []}
						/>
					</Suspense>
				</LazyLoadWrapper>

				{/* Best Sellers with optimized rendering */}
				<LazyLoadWrapper>
					<section className="py-12 flex flex-col items-center gap-6">
						<div className="px-6 py-2 rounded-full bg-[#F4DCDC] shadow-sm">
							<h2 className="dancing text-[2rem] md:text-[3.4rem] text-[#6f5a4d] font-bold">Bestsellers</h2>
						</div>
						<p className="text-center text-[#8A6F5C] max-w-3xl">
							The pieces our community can't stop talking about. These favorites are loved for a reason.
						</p>
						<div className="w-full max-w-[1200px]">
							<MemoizedProductGrid
								products={bestSellers}
								addToCartItem={addToCartItem}
								variant="bestseller"
								showCategoryBadge={false}
								showAddToCart={true}
								currencySymbol="₹"
							/>
						</div>
						<div className="mt-2 bg-white/80 py-3 px-6 rounded-2xl shadow-sm border border-[#F0E7DE] text-[#8A6F5C]">
							<p>
								Loved by <span className="dancing text-[#] text-xl">10,000+</span> happy customers
							</p>
						</div>
					</section>
				</LazyLoadWrapper>

				<LazyLoadWrapper>
					<Story/>
				</LazyLoadWrapper>
			</div>
		</>
	);
};

export default HomePage;
