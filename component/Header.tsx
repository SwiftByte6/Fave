"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IoSearch, IoMenu } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { supabase } from "@/lib/supabase/products";

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
  const [user, setUser] = useState<any>(null);
  const [isActive, setIsActive] = useState<number>(0);


  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.cart);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search/${query}`);
      setQuery("");
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      const { data: user } = await supabase.auth.getUser();
      setUser(user);
    };
    getUserData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/signin");
  };

  const subNavbar = [
    "Sarees",
    "Lehengas",
    "Bridal Collection",
    "Party Wear",
    "Casual Wear",
    "Accessories",
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="flex justify-between items-center shadow-md md:px-16 px-4 py-3">
        {/* Left: Logo */}
        <div
          className="cursor-pointer text-2xl font-bold text-pink-600"
          onClick={() => router.push("/")}
        >
          Favee
        </div>

        {/* Center: Navigation */}
        <ul className="hidden md:flex gap-8 items-center text-base font-medium">
          <li
            className="cursor-pointer hover:text-pink-600 transition"
            onClick={() => router.push("/")}
          >
            Home
          </li>
          <li
            className="cursor-pointer hover:text-pink-600 transition"
            onClick={() => router.push("/about")}
          >
            About
          </li>
          <li
            className="cursor-pointer hover:text-pink-600 transition"
            onClick={() => router.push("/contact")}
          >
            Contact
          </li>
          <li
            className="cursor-pointer hover:text-pink-600 transition"
            onClick={() => router.push("/new-arrival")}
          >
            New Arrival
          </li>
          <li
            className="cursor-pointer hover:text-pink-600 transition"
            onClick={() => router.push("/collection")}
          >
            Collection
          </li>
        </ul>

        {/* Right: Search + Icons */}
        <div className="flex items-center gap-5">
          {/* Search Box */}
          <div className="hidden md:flex items-center border border-pink-200 rounded-2xl px-3 w-[220px]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-2 w-full text-black bg-transparent outline-none placeholder:text-gray-500"
              placeholder="Search sarees & lehengas"
            />
            <IoSearch
              size={22}
              onClick={handleSearch}
              className="cursor-pointer text-gray-500 hover:text-pink-600 transition"
            />
          </div>

          {/* Wishlist */}
          <CiHeart
            size={32}
            onClick={()=>router.push('/favourite')}
            className="cursor-pointer bg-pink-100 p-1 rounded-full text-pink-400 hover:text-pink-600 hover:bg-pink-200 transition shadow-sm"
          />

          {/* Auth / Profile */}
          <div>
            <SignedOut>
              <SignInButton>
                <button className="text-sm font-medium px-4 py-2 rounded-full bg-pink-600 text-white hover:bg-pink-700 transition">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton>
                <button className="ml-2 text-sm font-medium px-4 py-2 rounded-full bg-[#6c47ff] text-white hover:bg-[#5635cc] transition">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Cart */}
          <div
            className="relative cursor-pointer bg-pink-100 p-1 rounded-full text-pink-400 hover:text-pink-600 hover:bg-pink-200 transition shadow-sm"
            onClick={() => router.push("/cart")}
          >
            <FaShoppingCart size={26} />
            {cart.length > 0 && (
              <sup className="absolute text-xs top-0 right-0 transform translate-x-1 -translate-y-2 bg-pink-600 text-white rounded-full px-1">
                {cart.length}
              </sup>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <IoMenu size={30} className="text-gray-700 hover:text-pink-600" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="bg-white w-full flex flex-col p-4 space-y-4 md:hidden shadow-md">
          <div className="flex bg-gray-100 items-center p-2 rounded-2xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-2 w-full text-black outline-none"
              placeholder="Search sarees & lehengas"
            />
            <IoSearch
              size={26}
              onClick={handleSearch}
              className="ml-2 cursor-pointer text-gray-600"
            />
          </div>
          <ul className="flex flex-col gap-4 text-center text-lg font-medium">
            <li onClick={() => router.push("/")} className="hover:text-pink-600 cursor-pointer">Home</li>
            <li onClick={() => router.push("/about")} className="hover:text-pink-600 cursor-pointer">About</li>
            <li onClick={() => router.push("/contact")} className="hover:text-pink-600 cursor-pointer">Contact</li>
            <li onClick={() => router.push("/new-arrival")} className="hover:text-pink-600 cursor-pointer">New Arrival</li>
            <li onClick={() => router.push("/collection")} className="hover:text-pink-600 cursor-pointer">Collection</li>
          </ul>
        </div>
      )}

      {/* Subnavbar */}
      <div className="bg-[#FFF7F5] border-2 border-gray-200 p-3 hidden md:flex justify-center items-center">
        <ul className="flex gap-9 justify-center items-center w-full">
          {subNavbar.map((heading, index) => (
            <li key={index} className="relative group cursor-pointer px-4 py-2 rounded transition-all duration-200">
              <span className="block font-medium text-base text-center">{heading}</span>
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white shadow-lg rounded hidden group-hover:block z-10">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">New Arrival</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Best Seller</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Trending</a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">Sale</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Header;
