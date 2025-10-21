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
      <nav className="sticky top-0 left-0 z-[999] bg-[#FBF8F6]/80 backdrop-blur supports-[backdrop-filter]:bg-[#FBF8F6]/70 border-b border-[rgba(0,0,0,0.04)] md:px-10 px-4 py-3">
        {/* Row 1: Logo • Search • Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-4 md:gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <button
              className="dancing text-[1.4rem] md:text-[1.8rem] text-[#f4b7c7]"
              onClick={() => router.push("/")}
            >
              Favee Fashion
            </button>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-center w-full max-w-2xl rounded-3xl border border-[#EADFCC] bg-white/70 shadow-sm px-3 py-2">
              <IoSearch
                size={20}
                onClick={handleSearch}
                className="cursor-pointer text-[#8A6F5C]"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="no-focus p-1.5 w-full text-[#5b4a3f] bg-transparent outline-none focus:outline-none focus:outline-transparent focus:outline-offset-0 placeholder:text-[#b79f92]"
                placeholder="Search for your perfect look..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 md:gap-6">
            {/* Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="hidden md:block text-sm px-3 py-1.5 rounded-full bg-[#F4DCDC] text-[#6f5a4d] hover:opacity-90">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="hidden md:block text-sm px-3 py-1.5 rounded-full bg-black text-white hover:opacity-90">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              <button
                className="hidden md:block text-sm px-3 py-1.5 rounded-full bg-[#F4DCDC] text-[#6f5a4d] hover:opacity-90"
                onClick={() => router.push("/orders")}
              >
                Orders
              </button>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
            
            <CiHeart
              size={26}
              onClick={() => router.push("/favourite")}
              className="text-[#8A6F5C] cursor-pointer"
            />
            <div
              className="relative cursor-pointer text-[#8A6F5C]"
              onClick={() => router.push("/cart")}
            >
              <FaShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-300 text-white text-[10px] rounded-full px-1.5 py-[1px]">
                  {cart.length}
                </span>
              )}
            </div>
            {/* Mobile menu */}
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <IoMenu size={28} className="text-[#8A6F5C]" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <div className="flex items-center rounded-3xl border border-[#EADFCC] bg-white px-3 py-2">
            <IoSearch
              size={20}
              onClick={handleSearch}
              className="cursor-pointer text-[#8A6F5C]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="no-focus p-1.5 w-full text-[#5b4a3f] bg-transparent outline-none focus:outline-none focus:outline-transparent focus:outline-offset-0 placeholder:text-[#b79f92]"
              placeholder="Search for your perfect look..."
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex items-center justify-center">
          <div className="hidden md:flex rounded-full bg-white shadow-sm border border-[#F0E7DE] px-2 py-1">
            {categories.map((c, idx) => (
              <button
                key={c}
                className={`px-4 py-2 rounded-full text-sm md:text-base ${
                  idx === 0 ? "bg-[#FDE6ED] text-[#8A6F5C]" : "text-[#8A6F5C] hover:bg-[#FBF1E9]"
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
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="bg-white w-full flex flex-col p-4 space-y-4 md:hidden shadow-md">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((c, idx) => (
              <button
                key={`m-${c}`}
                className={`px-4 py-2 rounded-full text-sm ${
                  idx === 0 ? "bg-[#FDE6ED] text-[#8A6F5C]" : "bg-[#FBF1E9] text-[#8A6F5C]"
                }`}
                onClick={() => {
                  setIsOpen(false);
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
          <div className="flex gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-full bg-[#F4DCDC] text-[#6f5a4d] text-sm">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 rounded-full bg-black text-white text-sm">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            
            <SignedIn>
              <button
                className="px-4 py-2 rounded-full bg-[#F4DCDC] text-[#6f5a4d] text-sm"
                onClick={() => { setIsOpen(false); router.push("/orders"); }}
              >
                View Orders
              </button>
            </SignedIn>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
