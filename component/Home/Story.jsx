import Image from 'next/image';
import React from 'react';

const Story = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center md:px-20 px-6 py-20 bg-[#F5F2EF] gap-10 md:gap-20">
      {/* Left: Copy */}
      <div className="flex-1 space-y-6">
        <h1 className="text-[#f9b8c3] dancing text-[2.5rem] md:text-[4rem] leading-tight md:leading-none">
          Your Story, Your Style
        </h1>
        <p className="text-black max-w-xl leading-relaxed">
          Fashion is more than clothing—it's about expressing who you are and how you want to feel. Every piece in our collection is chosen to help you write your own beautiful story.
        </p>
        <p className="text-[#8a6f5c] font-semibold max-w-xl leading-relaxed">
          From morning coffee runs to evening dinners, from casual weekends to special celebrations, we believe every moment deserves to feel special. Our pieces are designed to make you feel confident, comfortable, and authentically you.
        </p>
        <ul className="space-y-3">
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#f9b8c3] rounded-full" />
            Ethically sourced materials
          </li>
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 bg-[#D9CCEB] rounded-full" />
            Size-inclusive designs
          </li>
          <li className="flex items-center gap-3">
            <span className="w-3 h-3 bg-amber-300 rounded-full" />
            Sustainable fashion practices
          </li>
        </ul>
        <button className="rounded-3xl px-6 py-3 text-white bg-[#f9b8c3] hover:opacity-90 transition">
          Read Our Story
        </button>
      </div>

      {/* Right: Visuals */}
      <div className="flex-1 flex justify-center items-start">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-5 items-center">
            <div className="relative w-full max-w-[300px] h-[250px] overflow-hidden rounded-2xl">
              <Image
                src="/s1.jpg"
                alt="Happy friends shopping"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-[#f0ecf4] text-[#f9b8c3] p-6 text-center w-full max-w-[300px] rounded-2xl h-[130px] flex items-center justify-center">
              <div>
                <p className="dancing text-2xl">"Fashion fades, but style is</p>
                <p className="dancing text-2xl">eternal"</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 items-center">
            <div className="mt-10 sm:mt-0 bg-[#eedad3] flex justify-center items-center flex-col w-full max-w-[300px] rounded-2xl h-[130px] text-center">
              <h1 className="text-[2.5rem] text-black">50k+</h1>
              <p className="text-sm">Happy customers worldwide</p>
            </div>
            <div className="relative w-full max-w-[300px] h-[250px] overflow-hidden rounded-2xl">
              <Image
                src="/s2.jpg"
                alt="Happy friends shopping"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
