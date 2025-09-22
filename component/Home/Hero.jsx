"use client";
import React from 'react';

const Hero = () => {
  return (
    <section className="w-full bg-[#FBF8F6] py-8 flex flex-col items-center">
      <div className="px-6 py-2 rounded-full bg-[#F4DCDC] shadow-sm mb-2">
        <h1 className="dancing text-[2rem] md:text-[2.6rem] text-[#6f5a4d]">New Arrivals</h1>
      </div>
      <p className="text-[#8A6F5C] text-center max-w-2xl">
        Fresh styles that speak to your heart. Discover pieces that make you feel confident and beautiful.
      </p>
    </section>
  );
};

export default Hero;


