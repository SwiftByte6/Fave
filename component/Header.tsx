"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoSearch, IoMenu } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { CiHeart, CiUser } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [isActive, setIsActive] = useState<number>(0);

  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.cart);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search/${query}`);
      setQuery("");
    }
  };

  // Clerk manages auth UI; no local Supabase auth here

  const categories = ["New Arrivals", "Dresses", "Accessories", "Sale"];

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 left-0 z-[999] bg-fav-off-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-fav-off-white/85  shadow-[0_4px_20px_rgba(122,31,42,0.08)] md:px-10 px-4 ">
        {/* Row 1: Logo • Search • Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-4 md:gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <button
              className="transition-transform duration-300 focus:outline-none focus:ring-0 border-0 outline-none !outline-none !border-none active:outline-none active:border-none"
              style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              onClick={() => router.push("/")}
            >
              <Image
              src={'/logo.png'}
                height={100}
                width={100}
                alt="logo"
/>
            </button>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center w-full max-w-2xl rounded-2xl border-2 border-fav-beige bg-fav-off-white shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-3 hover:border-fav-gold group">
              <IoSearch
                size={22}
                onClick={handleSearch}
                className="cursor-pointer text-fav-warm-gray group-hover:text-fav-gold transition-colors duration-300"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="no-focus p-1.5 w-full text-fav-charcoal bg-transparent outline-none focus:outline-none placeholder:text-fav-warm-gray font-medium"
                placeholder="Search FAVEE collection..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 md:gap-5">
            {/* Authentication */}
            <SignedOut>
              <div className="hidden md:flex items-center space-x-2">
                <button
                  className="text-sm font-semibold px-3 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-300"
                  onClick={() => router.push("/track-order")}
                >
                  📦 Track Order
                </button>
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-fav-beige text-fav-maroon hover:bg-fav-blush transition-all duration-300 hover:shadow-md">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-fav-primary text-fav-off-white hover:bg-fav-maroon transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                    Join FAVEE
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              <div className="hidden md:flex space-x-2">
                <button
                  className="text-sm font-semibold px-3 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-300"
                  onClick={() => router.push("/track-order")}
                >
                  📦 Track Order
                </button>
                <button
                  className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-fav-gold text-fav-charcoal hover:bg-fav-soft-gold transition-all duration-300 hover:shadow-md"
                  onClick={() => router.push("/orders")}
                >
                  My Orders
                </button>
              </div>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 rounded-xl border-2 border-fav-gold"
                  }
                }}
              />
            </SignedIn>
            
            <div className="relative group">
              <CiHeart
                size={38}
                onClick={() => router.push("/favourite")}
                className="text-fav-warm-gray hover:text-fav-maroon cursor-pointer transition-all duration-300 hover:scale-110 p-1 rounded-lg hover:bg-fav-blush/50"
              />
            </div>
            <div
              className="relative cursor-pointer group"
              onClick={() => router.push("/cart")}
            >
              <FaShoppingCart 
                size={34} 
                className="text-fav-warm-gray hover:text-fav-maroon transition-all duration-300 hover:scale-110 p-1 rounded-lg hover:bg-fav-blush/50"
              />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-fav-primary text-fav-off-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-md">
                  {cart.length}
                </span>
              )}
            </div>
            {/* Mobile menu */}
            <button className="md:hidden p-1 rounded-lg hover:bg-fav-blush/50 transition-colors duration-300" onClick={() => setIsOpen(!isOpen)}>
              <IoMenu size={28} className="text-fav-warm-gray hover:text-fav-maroon transition-colors duration-300" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="flex items-center rounded-2xl border-2 border-fav-beige bg-fav-off-white shadow-md px-4 py-3">
            <IoSearch
              size={20}
              onClick={handleSearch}
              className="cursor-pointer text-fav-warm-gray"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="no-focus p-1.5 w-full text-fav-charcoal bg-transparent outline-none focus:outline-none placeholder:text-fav-warm-gray font-medium"
              placeholder="Search FAVEE collection..."
            />
          </div>
        </div>

        {/* Category Pills */}
        {/* <div className="mt-5 flex items-center justify-center">
          <div className="hidden md:flex rounded-2xl bg-fav-off-white shadow-lg border border-fav-blush/50 px-3 py-2 backdrop-blur-sm">
            {categories.map((c, idx) => (
              <button
                key={c}
                className={`px-5 py-2.5 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 ${
                  idx === isActive 
                    ? "bg-fav-primary text-fav-off-white shadow-md" 
                    : "text-fav-charcoal hover:bg-fav-blush/70 hover:text-fav-maroon"
                }`}
                onClick={() => {
                  setIsActive(idx);
                  if (c === "New Arrivals") router.push("/new-arrival");
                  if (c === "Dresses") router.push("/collection");
                  if (c === "Accessories") router.push("/collection");
                  if (c === "Sale") router.push("/collection");
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div> */}
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="bg-fav-off-white/95 backdrop-blur-lg w-full flex flex-col p-5 space-y-5 md:hidden shadow-xl border-t border-fav-blush/30">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {categories.map((c, idx) => (
              <button
                key={`m-${c}`}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  idx === isActive 
                    ? "bg-fav-primary text-fav-off-white shadow-md" 
                    : "bg-fav-beige text-fav-charcoal hover:bg-fav-blush"
                }`}
                onClick={() => {
                  setIsOpen(false);
                  setIsActive(idx);
                  if (c === "New Arrivals") router.push("/new-arrival");
                  if (c === "Dresses") router.push("/collection");
                  if (c === "Accessories") router.push("/collection");
                  if (c === "Sale") router.push("/collection");
                }}
              >
                {c}
              </button>
            ))}
          </div>
          
          {/* Mobile Authentication */}
          <div className="space-y-3">
            <SignedOut>
              <button
                className="w-full py-3 rounded-xl bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200 transition-colors duration-300"
                onClick={() => { setIsOpen(false); router.push("/track-order"); }}
              >
                📦 Track Order
              </button>
              <div className="flex gap-3">
                <SignInButton mode="modal">
                  <button className="flex-1 py-3 rounded-xl bg-fav-beige text-fav-maroon text-sm font-semibold hover:bg-fav-blush transition-colors duration-300">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex-1 py-3 rounded-xl bg-fav-primary text-fav-off-white text-sm font-semibold hover:bg-fav-maroon transition-colors duration-300">
                    Join FAVEE
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            
            <SignedIn>
              <div className="space-y-2">
                <button
                  className="w-full py-3 rounded-xl bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200 transition-colors duration-300"
                  onClick={() => { setIsOpen(false); router.push("/track-order"); }}
                >
                  📦 Track Order
                </button>
                <button
                  className="w-full py-3 rounded-xl bg-fav-gold text-fav-charcoal text-sm font-semibold hover:bg-fav-soft-gold transition-colors duration-300"
                  onClick={() => { setIsOpen(false); router.push("/orders"); }}
                >
                  View My Orders
                </button>
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
