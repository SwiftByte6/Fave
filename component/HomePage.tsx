"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { useDispatch } from "react-redux";
import { addToCart } from "@/Redux/cartSlice";
import ProductCard from "./ProductCarad";
import Slider from "@/component/SwiperMain/Slider";
import BestSellerSection from "@/component/SwiperMain/Slider";
import bridal from '@/public/bridal.png'
import kurta from '@/public/kurta.png'
import saree from '@/public/saree.png'
import western from '@/public/western.png'


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

  const sareeProducts = products
    .filter((p: any) => p.category?.toLowerCase().includes("saree"))
    .slice(0, 4);

  const lehengaProducts = products
    .filter((p: any) => p.category?.toLowerCase().includes("lehenga"))
    .slice(0, 4);

  const featuredProducts = products.slice(0, 8);

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
      <div className="">
        {/* HERO */}
        <section className="relative w-full h-[100vh] flex items-center p-20">
          {/* Background Image */}
          <Image
            src={"/HomePc.jpg"}
            alt="Hero Background"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Hero Content */}
          <div className="relative z-10 px-6">
            <h1 className="text-7xl playfair font-bold text-white leading-snug drop-shadow-lg">
              Discover Timeless <br /> Elegance
            </h1>
            <p className="mt-3 text-lg text-gray-200 max-w-3xl ">
              Embrace the beauty of traditional Indian fashion with our
              exquisite collection of handcrafted sarees, lehengas, and ethnic
              wear.
            </p>
            <button className="mt-6 px-6 py-3 bg-yellow-500 text-white font-medium rounded-xl shadow-lg hover:bg-yellow-600 transition">
              Explore Collection
            </button>
          </div>
        </section>
        {/* CATEGORY HIGHLIGHTS */}
        <div className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-16 ">
          <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
            <h2 className="text-3xl playfair sm:text-4xl lg:text-5xl font-bold text-[#220707] mb-3 sm:mb-4">
              Our New Collection
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Timeless elegance meets contemporary design in our curated wedding
              attire collections.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  px-12">
            {[
              {
                title: "Wedding Saree",
                image: "/c1.jpg",
                link: "/search/saree",
              },
              { title: "Desinger", image: "/c2.jpg", link: "/search/choli" },
              { title: "Casual Wear", image: "/c3.jpg", link: "/search/choli" },
            ].map((cat, idx) => (
              <div
                key={idx}
                onClick={() => router.push(cat.link)}
                className="relative h-[300px] sm:h-[400px] lg:h-[470px]  overflow-hidden group cursor-pointer"
              >
                {/* Background Image */}
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div> */}

                {/* Text at Bottom */}
                <h3 className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white text-lg sm:text-xl lg:text-2xl font-serif font-bold">
                  {cat.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE BANNER */}
        <div className="pl-16">
          <BestSellerSection />
        </div>
        {/* FEATURED PRODUCTS */}
        {featuredProducts.length > 0 && (
          <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-16 ">
            <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-rose-700 mb-3 sm:mb-4">
                Our Products
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                Handpicked designs for the discerning woman.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
              {featuredProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  data={product}
                  addToCartItem={addToCartItem}
                />
              ))}
            </div>
            <div className="w-full flex items-center justify-center mt-8 sm:mt-10">
              <button className="bg-pink-300/70 px-4 py-2 rounded-2xl text-white font-bold text-sm sm:text-base">
                View All Products
              </button>
            </div>
          </section>
        )}

        {/* OFFERS */}
 <div className="w-full  p-4 sm:p-8 md:p-14 mx-auto">
      <h1 className="text-6xl text-center playfair mb-5">Shop By category</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[150px] lg:auto-rows-[minmax(150px,auto)]">

        {/* Big Card */}
        <div className="relative col-span-1 sm:col-span-2 lg:col-span-2 row-span-2 lg:row-span-4 min-h-[300px] sm:min-h-[400px] lg:min-h-[616px] rounded-xl flex items-end p-6 text-blue-800  text-2xl">
          <Image
            src={bridal}
            alt="Placeholder image for grid item 1"
            fill
            className="object-cover rounded-xl "
          />
          <span className="text-white  z-100 font-bold ">Bridal Wear</span>
        </div>

        {/* Medium Card */}
        <div className="relative col-span-1 sm:col-span-2 lg:col-span-2 row-span-1 lg:row-span-2 min-h-[150px] lg:min-h-[300px]  rounded-xl flex items-center justify-center text-green-800 font-bold text-2xl">
          <Image
            src={kurta}
            alt="Placeholder image for grid item 2"
            fill
            className="object-cover rounded-xl "
          /><span className="text-white  z-100">Kurta</span>

        </div>

        {/* Small Card */}
        <div className="relative col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 lg:row-span-2 min-h-[150px] lg:min-h-[300px]  rounded-xl flex items-end p-6 justify-center text-yellow-800 font-bold text-2xl">
          <Image
            src={saree}
            alt="Placeholder image for grid item 3"
            fill
            className="object-cover rounded-xl "
          />
        <span className="text-white  z-100">Saree</span>
        </div>

        {/* Small Card */}
        <div className="relative col-span-1 sm:col-span-1 lg:col-span-1 row-span-1 lg:row-span-2 min-h-[150px] lg:min-h-[300px]  rounded-xl flex items-end p-8 justify-center text-pink-800 font-bold text-2xl">
          <Image
            src={western}
            alt="Placeholder image for grid item 4"
            fill
            className="object-cover rounded-xl "
          />
          <span className="text-white  z-100">Western Wear</span>
        </div>

      </div>
    </div>


        {/* NEWSLETTER */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-16 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-rose-700 mb-3 sm:mb-4">
              Stay Updated
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4">
              Subscribe for exclusive offers, early access to new collections,
              and special bridal packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm sm:text-base"
              />
              <button className="bg-rose-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-rose-700 transition font-semibold text-sm sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
