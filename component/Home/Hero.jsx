"use client";
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

const Hero = ({
  titleTop = 'Favee',
  titleAccent = 'Fashion',
  subtitle = 'Discover your unique style with our curated collection of timeless pieces',
  bgImage = '/banner.png',
  features = ['Free Shipping', 'Easy Returns', '24/7 Support'],
  primaryCta = { label: 'Shop Collection', href: '/collection' },
  secondaryCta = { label: 'Learn More', href: '/about' },
}) => {
  const router = useRouter();
  return (
    <div className='w-full'>
      <section className="w-full min-h-screen relative bg-[#FBF8F6] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            fill
            priority
            sizes="100vw"
            src={bgImage}
            alt="Fashion Banner"
            className='object-cover opacity-60'
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Main Title */}
          <h1 className="playfair text-3xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-[#6f5a4d] mb-3 sm:mb-5 leading-tight">
            Favee
            <span className="block text-[#f9b8c3]">{titleAccent}</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[#8A6F5C] mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button
              className="bg-[#f9b8c3] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-[#f7a8b8] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => router.push(primaryCta?.href || '/collection')}
            >
              {primaryCta?.label || 'Shop Collection'}
            </button>
            <button
              className="border-2 border-[#f9b8c3] text-[#f9b8c3] px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-[#f9b8c3] hover:text-white transition-all duration-300"
              onClick={() => router.push(secondaryCta?.href || '/about')}
            >
              {secondaryCta?.label || 'Learn More'}
            </button>
          </div>
          
          {/* Features */}
          <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center text-[#8A6F5C]">
            {features?.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#f9b8c3] rounded-full"></span>
                <span className="text-sm sm:text-base">{feat}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#f9b8c3] rounded-full opacity-20 animate-pulse hidden lg:block"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#D9CCEB] rounded-full opacity-20 animate-pulse hidden lg:block"></div>
      </section>
    </div>
  );
};

export default Hero;