"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IoSearch, IoMenu } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";

import { supabase } from '@/lib/products'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [isActive, setIsActive] = useState<number>(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const cart = useSelector((state: RootState) => state.cart.cart);

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (!mounted) return
      setUser(data?.user ?? null)
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => { mounted = false; sub?.subscription.unsubscribe() }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    window.location.href = '/'
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Account'
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
  const userFirstName = userName.split(' ')[0]

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
        <div className="grid md:p-2 grid-cols-2 md:grid-cols-3 items-center gap-4 md:gap-8">
          {/* Logo */}
          <div className="flex items-center">
            <button
              className="transition-transform duration-300 focus:outline-none focus:ring-0 border-0 outline-none !outline-none !border-none active:outline-none active:border-none"
              style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
              onClick={() => router.push("/")}
            >
              <Image
              src={'/logo.png'}
                height={50}
                width={50}
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
                className="no-focus p-1 w-full text-fav-charcoal bg-transparent outline-none focus:outline-none placeholder:text-fav-warm-gray font-medium"
                placeholder="Search FAVEE collection..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 md:gap-5">
            {/* Authentication */}
            <div>
              <div className="hidden md:flex items-center space-x-2">
                <button
                  className="text-sm font-semibold px-3 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all duration-300"
                  onClick={() => router.push("/track-order")}
                >
                  📦 Track Order
                </button>
                {!user ? (
                  <>
                    <button onClick={() => router.push('/signin')} className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-fav-beige text-fav-maroon hover:bg-fav-blush transition-all duration-300 hover:shadow-md">Sign In</button>
                    <button onClick={() => router.push('/signup')} className="text-sm font-semibold px-4 py-2.5 rounded-xl bg-fav-primary text-fav-off-white hover:bg-fav-maroon transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">Join FAVEE</button>
                  </>
                ) : (
                  <div ref={dropdownRef} className="relative">
                    {/* User Avatar Button */}
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl border border-fav-blush/60 bg-white hover:border-fav-gold hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="relative w-8 h-8 rounded-xl overflow-hidden border-2 border-fav-blush group-hover:border-fav-gold transition-colors flex-shrink-0">
                        {userAvatar ? (
                          <Image src={userAvatar} alt={userName} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-fav-primary flex items-center justify-center">
                            <span className="text-fav-off-white text-xs font-bold">{userFirstName.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-fav-charcoal max-w-[90px] truncate">{userFirstName}</span>
                      <svg className={`w-3.5 h-3.5 text-fav-warm-gray transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl border border-fav-blush/40 shadow-[0_20px_50px_rgba(122,31,42,0.1)] z-50 overflow-hidden animate-fadeIn">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-fav-beige/60 flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-fav-blush flex-shrink-0">
                            {userAvatar ? (
                              <Image src={userAvatar} alt={userName} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-fav-primary flex items-center justify-center">
                                <span className="text-fav-off-white text-sm font-bold">{userFirstName.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-fav-charcoal truncate">{userName}</p>
                            <p className="text-xs text-fav-warm-gray truncate">{user?.email}</p>
                          </div>
                        </div>
                        {/* Menu Items */}
                        <div className="p-2">
                          <button onClick={() => { setDropdownOpen(false); router.push('/orders'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fav-charcoal hover:bg-fav-beige hover:text-fav-maroon transition-all duration-200 text-left">
                            <span>📦</span> My Orders
                          </button>
                          <button onClick={() => { setDropdownOpen(false); router.push('/account'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fav-charcoal hover:bg-fav-beige hover:text-fav-maroon transition-all duration-200 text-left">
                            <span>👤</span> My Account
                          </button>
                          
                          <div className="border-t border-fav-beige/60 my-1" />
                          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-fav-rust hover:bg-red-50 transition-all duration-200 text-left">
                            <span>🚪</span> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
            <div>
              <button
                className="w-full py-3 rounded-xl bg-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-200 transition-colors duration-300"
                onClick={() => { setIsOpen(false); router.push("/track-order"); }}
              >
                📦 Track Order
              </button>
              {!user ? (
                <div className="flex gap-3 mt-3">
                  <button onClick={() => { setIsOpen(false); router.push('/signin') }} className="flex-1 py-3 rounded-xl bg-fav-beige text-fav-maroon text-sm font-semibold hover:bg-fav-blush transition-colors duration-300">Sign In</button>
                  <button onClick={() => { setIsOpen(false); router.push('/signup') }} className="flex-1 py-3 rounded-xl bg-fav-primary text-fav-off-white text-sm font-semibold hover:bg-fav-maroon transition-colors duration-300">Join FAVEE</button>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {/* Mobile User Info Card */}
                  <div className="flex items-center gap-3 p-3 bg-fav-beige/50 rounded-xl border border-fav-blush/40">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-fav-blush flex-shrink-0">
                      {userAvatar ? (
                        <Image src={userAvatar} alt={userName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-fav-primary flex items-center justify-center">
                          <span className="text-fav-off-white text-sm font-bold">{userFirstName.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fav-charcoal truncate">{userName}</p>
                      <p className="text-xs text-fav-warm-gray truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button className="w-full py-3 rounded-xl bg-fav-gold text-fav-charcoal text-sm font-semibold hover:bg-fav-soft-gold transition-colors duration-300" onClick={() => { setIsOpen(false); router.push('/orders') }}>📦 My Orders</button>
                  <button className="w-full py-3 rounded-xl bg-fav-beige text-fav-charcoal text-sm font-semibold hover:bg-fav-blush transition-colors duration-300" onClick={() => { setIsOpen(false); router.push('/account') }}>👤 My Account</button>
                  <button className="w-full py-3 rounded-xl bg-red-50 text-fav-rust text-sm font-semibold hover:bg-red-100 transition-colors duration-300" onClick={() => { setIsOpen(false); handleSignOut() }}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
