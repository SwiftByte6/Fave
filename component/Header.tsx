"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import fave from "../public/F.png";
import { IoSearch, IoMenu } from "react-icons/io5";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { supabase } from "@/lib/supabase/products";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [user, setUser] = useState<any>(null);
  const [isActive,setIsActive]=useState<Number>(0);

  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.cart);

  const handleSearch = () => {
    router.push(`/search/${query}`);
  };

  useEffect(() => {
    const getUserData = async () => {
      const { data: user } = await supabase.auth.getUser();
      setUser(user);
      console.log(user)
    };
    getUserData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/signin");
  };

  const subNavbar = ["Kurtis", "Lehengas", "Sarees", "Western Wear", "Co-ords", "Accessories"];

  return (
    <>
      {/* Main Navbar */}
      <nav className="flex justify-between items-center  shadow-2xl md:px-16 py-2">
        {/* Left: Logo */}
        <div className="flex items-center">
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            {/* <Image src={fave} width={70} height={100} alt="Logo" /> */}
          </div>
        </div>

        {/* Center: Main Navigation */}
        <ul className="hidden md:flex gap-8 items-center text-base font-medium">
          <li className="cursor-pointer hover:text-pink-600 transition" onClick={() => router.push("/")}>Home</li>
          <li className="cursor-pointer hover:text-pink-600 transition" onClick={() => router.push("/about")}>About</li>
          <li className="cursor-pointer hover:text-pink-600 transition" onClick={() => router.push("/contact")}>Contact</li>
          <li className="cursor-pointer hover:text-pink-600 transition" onClick={() => router.push("/new-arrival")}>New Arrival</li>
          <li className="cursor-pointer hover:text-pink-600 transition" onClick={() => router.push("/collection")}>Collection</li>
        </ul>

        {/* Right: Search and Icons */}
        <div className="flex items-center gap-6">
          {/* Search Box */}
          <div className="hidden md:flex items-center border-2 border-[#ffe6ee] rounded-2xl px-3 w-[200px]">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-2 w-full text-black bg-transparent outline-none placeholder:text-gray-700"
              placeholder="Search items"
            />
            <IoSearch
              size={26}
              onClick={handleSearch}
              className="cursor-pointer  transition"
            />
          </div>
          <div>

          </div>
          <CiHeart
            size={38}
            className="cursor-pointer bg-pink-100 p-1 rounded-full text-pink-300 hover:text-pink-500 hover:bg-pink-200 transition duration-200 shadow-sm"
          />


          {/* Profile/User Icon */}
          <FaUser
            size={34}
            className="cursor-pointer bg-pink-100 p-1 rounded-full text-pink-300 hover:text-pink-500 hover:bg-pink-200 transition duration-200 shadow-sm"
          />

          {/* Cart Icon */}
          <div
            className="relative cursor-pointer bg-pink-100 p-1 rounded-full text-pink-300 hover:text-pink-500 hover:bg-pink-200 transition duration-200 shadow-sm"
            onClick={() => router.push("/cart")}
          >
            <FaShoppingCart size={28} />
            <sup className="absolute text-xs top-0 right-0 transform translate-x-1 -translate-y-2 bg-[#fad3dc] text-pink-800 rounded-full px-1">
              {cart.length}
            </sup>
          </div>

        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <IoMenu size={30} className="hover:text-pink-600 transition" />
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="bg-white w-full flex flex-col p-4 space-y-4 md:hidden">
          <div className="flex bg-gray-200 items-center p-2 rounded-2xl w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="p-2 w-full text-black outline-none"
              placeholder="Search items"
            />
            <IoSearch size={30} onClick={handleSearch} className="mr-2 cursor-pointer" />
          </div>
          <ul className="flex flex-col gap-4 text-center">
            <li className="hover:text-pink-500 cursor-pointer" onClick={() => router.push("/")}>Home</li>
            <li className="hover:text-pink-500 cursor-pointer" onClick={() => router.push("/about")}>About</li>
            <li className="hover:text-pink-500 cursor-pointer" onClick={() => router.push("/contact")}>Contact</li>
            <li className="hover:text-pink-500 cursor-pointer" onClick={() => router.push("/new-arrival")}>New Arrival</li>
            <li className="hover:text-pink-500 cursor-pointer" onClick={() => router.push("/collection")}>Collection</li>
          </ul>
          <div className="flex justify-center gap-6 items-center">
            <CiHeart size={28} />
            <FaUser
              size={26}
              className="cursor-pointer"
              onClick={() => user ? handleSignOut() : router.push("/signin")}
            />
            <div className="relative cursor-pointer" onClick={() => router.push("/cart")}>
              <FaShoppingCart size={28} />
              <sup className="absolute text-xs top-0 right-0 transform translate-x-1 translate-y-[-0.5rem]">{cart.length}</sup>
            </div>
          </div>
        </div>
      )}

      {/* Subnavbar */}
      <div className="bg-[#FFF7F5]  p-3 hidden md:flex justify-center items-center">
        <ul className="flex gap-9 ">
          {subNavbar.map((heading, index) => (
            <li key={index} className="relative group cursor-pointer  ">
              <h1 className={`font-bold p-3 relative rounded-2xl ${index===isActive?"bg-[#ffd4d4] text-white":"bg-gray-200 "} `}  onClick={()=>setIsActive(index)}>
                {isActive===index?<span className="absolute top-0 right-0">✨</span>:<></>}
                {heading} 
              </h1>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded hidden group-hover:block z-10">
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