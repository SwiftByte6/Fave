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
  const [isLoading, setIsLoading] = useState(false);
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
  }, []);

	const featuredProducts = products.slice(0, 8);

	const newArrivals = [...products]
		.map((p: any) => ({ ...p, _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0 }))
		.sort((a: any, b: any) => b._createdAt - a._createdAt)
		.slice(0, 6);

	const youWillLove = [...products].slice(6, 12);
	// Robust bestseller selection: always show items even if dataset is small
	const bestSellers = [...products]
		.map((p: any) => ({ ...p, _popularity: 0, _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0 }))
		.sort((a: any, b: any) => (b._createdAt - a._createdAt))
		.slice(0, 4);

  const addToCartItem = (product: any) => {
    dispatch(addToCart({ ...product, cartQuantity: 1 }));
  };

  // We don't block initial paint; sections that rely on data will render progressively

	return (
		<>
			<main>
					  <Hero
					  titleTop={homeConfig?.hero?.titleTop ?? "Favee"}
					  titleAccent={homeConfig?.hero?.titleAccent ?? "Fashion"}
					  subtitle={homeConfig?.hero?.subtitle ?? "Discover your unique style with our curated collection of timeless pieces"}
					  bgImage={homeConfig?.hero?.bgImage ?? "/banner.png"}
					  features={homeConfig?.hero?.features ?? ["Free Shipping","Easy Returns","24/7 Support"]}
					  primaryCta={homeConfig?.hero?.primaryCta ?? { label: "Shop Collection", href: "/collection" }}
					  secondaryCta={homeConfig?.hero?.secondaryCta ?? { label: "Learn More", href: "/about" }}
					/>
            {/* New Arrivals section above Things You'll Love */}
            <section aria-labelledby="new-arrivals-heading">
              <NewArrivalsGrid
                addToCartItem={addToCartItem}
                products={products}
                title={homeConfig?.newArrivals?.title ?? "New Arrival"}
                ctaLabel={homeConfig?.newArrivals?.ctaLabel ?? "View All Products"}
                ctaHref={homeConfig?.newArrivals?.ctaHref ?? "/collection"}
                limit={homeConfig?.newArrivals?.limit ?? 6}
              />
            </section>
            <section aria-labelledby="things-youll-love-heading">
              <ThingsULike
                title={homeConfig?.slider?.title ?? "Things You'll Love"}
                description={homeConfig?.slider?.description ?? 'Handpicked just for you based on your style preferences'}
                products={products}
              />
            </section>
          {/* Best Seller */}
          <section className="py-12 flex flex-col items-center gap-6" aria-labelledby="bestsellers-heading">
            <div className="px-6 py-2 rounded-full bg-[#F4DCDC] shadow-sm">
              <h2 id="bestsellers-heading" className="dancing text-[2rem] md:text-[3.4rem] text-[#6f5a4d] font-bold">Bestsellers</h2>
            </div>
            <p className="text-center text-[#8A6F5C] max-w-3xl">
              The pieces our community can't stop talking about. These favorites are loved for a reason.
            </p>
            <div className="w-full max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" role="list">
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
                Loved by <span className="dancing text-[#] text-xl">10,000+</span> happy customers
              </p>
            </div>
          </section>
        <Story/>
			</main>
		</>
	);
};

export default HomePage;
