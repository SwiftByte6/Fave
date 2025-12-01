"use client";
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

const Hero = ({
  titleTop = 'Favee',
  titleAccent = 'Fashion',
  subtitle = 'Discover your unique style with our curated collection of timeless pieces',
  bgImage = '/HeroBack.png',
  features = ['Free Shipping', 'Easy Returns', '24/7 Support'],
  primaryCta = { label: 'Shop Collection', href: '/collection' },
  secondaryCta = { label: 'Learn More', href: '/about' },
}) => {
  const router = useRouter();
  
  const handleHeroClick = () => {
    router.push('/collection');
  };

  return (
    <div className='w-full bg-[#FBF8F6] py-4 sm:py-6 lg:py-8'>
      {/* Hero Banner Container */}
      <div className="w-[95vw] mx-auto">
        {/* Hero Banner with 16:9 Aspect Ratio */}
        <div className="relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg cursor-pointer group" onClick={handleHeroClick}>
          {/* 1440x640 Aspect Ratio Container */}
          <div className="w-full aspect-[1440/640] relative">
            {/* Background Image */}
            <Image
              fill
              priority
              
              src={'/HeroBack.png'}
              alt="Fashion Banner - Click to explore collection"
              className='object-cover transition-transform duration-300 '
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />

            {/* Gradient Overlay for better interactivity indication */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Click Indicator */}
            {/* <div className="absolute bottom-4 right-4 z-30 bg-black/30 backdrop-blur-sm rounded-full p-2 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;