"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addToCart } from "@/Redux/cartSlice";
import { supabase } from '@/lib/products';
import ProductCard from "./ProductCarad";
import Story from "@/component/Home/Story"
import NewArrivalsGrid from "@/component/Home/NewArrivalsGrid"
import ThingsULike from '@/component/Home/ThingsULike'
import Hero from '@/component/Home/Hero'
import dynamic from 'next/dynamic'

const DeferredProductsGrid = dynamic(() => import('@/component/DeferredProductsGrid'), {
  ssr: false,
});




interface HomePageProps {
  products: any[];
}

const HomePage: React.FC<HomePageProps> = ({ products }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [homeConfig, setHomeConfig] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
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

  // TODO: featuredProducts, newArrivals, youWillLove, bestSellers should be computed from products passed as props
  // Example:
  // const featuredProducts = products.slice(0, 8);
  // ...

  const addToCartItem = async (product: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    dispatch(addToCart({ ...product, cartQuantity: 1 }));
    if (session) {
      router.push('/checkout');
      return true;
    }

    router.push('/signin');
    return false;
  };

  // We don't block initial paint; sections that rely on data will render progressively

	return (
		<>
			<main>
					  <Hero
					  titleTop={homeConfig?.hero?.titleTop ?? "Favee"}
					  titleAccent={homeConfig?.hero?.titleAccent ?? "Fashion"}
					  subtitle={homeConfig?.hero?.subtitle ?? "Discover your unique style with our curated collection of timeless pieces"}
					  bgImage={homeConfig?.hero?.bgImage ?? "/HomeBack.png"}
					  features={homeConfig?.hero?.features ?? ["Free Shipping","Easy Returns","24/7 Support"]}
					  primaryCta={homeConfig?.hero?.primaryCta ?? { label: "Shop Collection", href: "/collection" }}
					  secondaryCta={homeConfig?.hero?.secondaryCta ?? { label: "Learn More", href: "/about" }}
					/>

            {/* Shop by Category */}
            <section className="w-full bg-white py-16 md:py-24 border-b border-gray-100">
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-black text-[#2A2A2A] tracking-wider uppercase mb-4 text-center">
                    Shop by Category
                  </h2>
                  <div className="w-24 h-1 bg-[#7A1F2A]"></div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {/* Saree */}
                  <div onClick={() => router.push('/collection?category=saree')} className="group relative aspect-[2/3] overflow-hidden cursor-pointer bg-[#f6efe5]">
                    <Image src="/category/saree.jpg" alt="Saree" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5 bg-white/95 backdrop-blur-md py-4 text-center transition-all duration-500 shadow-xl group-hover:-translate-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-[#2A2A2A] tracking-[0.2em] uppercase">Saree</h3>
                    </div>
                  </div>
                  
                  {/* Kurti */}
                  <div onClick={() => router.push('/collection?category=kurti')} className="group relative aspect-[2/3] overflow-hidden cursor-pointer bg-[#f6efe5]">
                    <Image src="/category/kurti.jpg" alt="Kurti" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5 bg-white/95 backdrop-blur-md py-4 text-center transition-all duration-500 shadow-xl group-hover:-translate-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-[#2A2A2A] tracking-[0.2em] uppercase">Kurti</h3>
                    </div>
                  </div>
                  
                  {/* Lehenga */}
                  <div onClick={() => router.push('/collection?category=lehenga')} className="group relative aspect-[2/3] overflow-hidden cursor-pointer bg-[#f6efe5]">
                    <Image src="/category/lengha.jpg" alt="Lehenga" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5 bg-white/95 backdrop-blur-md py-4 text-center transition-all duration-500 shadow-xl group-hover:-translate-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-[#2A2A2A] tracking-[0.2em] uppercase">Lehenga</h3>
                    </div>
                  </div>
                  
                  {/* Nighty */}
                  <div onClick={() => router.push('/collection?category=nighty')} className="group relative aspect-[2/3] overflow-hidden cursor-pointer bg-[#f6efe5]">
                    <Image src="/category/Nigty.jpeg" alt="Nighty" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" className="object-cover object-top transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500"></div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-4/5 bg-white/95 backdrop-blur-md py-4 text-center transition-all duration-500 shadow-xl group-hover:-translate-y-2">
                      <h3 className="text-lg md:text-xl font-bold text-[#2A2A2A] tracking-[0.2em] uppercase">Nighty</h3>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* All Products Grid (deferred) */}
            <DeferredProductsGrid products={products} addToCartItem={addToCartItem} />

            {/* Commented Sections
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

            <section className="py-16 flex flex-col items-center gap-8 bg-gradient-to-br from-fav-off-white via-fav-beige/30 to-fav-blush/20" aria-labelledby="bestsellers-heading">
              <div className="relative">
                <div className="px-8 py-4 rounded-2xl bg-fav-gold-gradient shadow-xl">
                  <h2 id="bestsellers-heading" className="dancing text-[2.5rem] md:text-[4rem] text-fav-off-white font-bold">Bestsellers</h2>
                </div>
                <div className="absolute inset-0 bg-fav-gold-gradient rounded-2xl blur-xl opacity-30 -z-10"></div>
              </div>
              <p className="text-center text-fav-charcoal max-w-4xl text-lg font-medium leading-relaxed px-4">
                The pieces our community can't stop talking about. These ethnic treasures are loved for their timeless beauty and premium craftsmanship by FAVEE.
              </p>
              <div className="w-full max-w-[1300px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 px-4" role="list">
                {bestSellers.map((p: any) => (
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
              <div className="mt-6 bg-fav-off-white/90 backdrop-blur-sm py-4 px-8 rounded-2xl shadow-lg border border-fav-blush text-fav-charcoal">
                <p className="text-center font-medium">
                  Loved by <span className="dancing text-fav-gold text-2xl font-bold">10,000+</span> happy customers across India
                </p>
              </div>
            </section>

            <Story/>
            */}
			</main>
		</>
	);
};

export default HomePage;
