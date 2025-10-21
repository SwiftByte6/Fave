"use client";
import React from 'react'
import dynamic from 'next/dynamic'
import ProductCard from '@/component/ProductCarad'
const Slider = dynamic(() => import('@/component/SwiperMain/Slider').then(m => m.Slider), { ssr: false })

interface ThingsULikeProps {
  title?: string;
  description?: string;
  products?: any[];
}

const ThingsULike: React.FC<ThingsULikeProps> = ({
  title = "Things You'll Love",
  description = 'Handpicked just for you based on your style preferences',
  products = [],
}) => {
  // Normalize images so ProductCard can render
  const items = Array.isArray(products)
    ? products.map((p) => ({
        ...p,
        images: Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : (p.image ? [p.image] : (p.thumbnail ? [p.thumbnail] : [])),
      }))
    : []

  if (!items.length) {
    return null
  }

  return (
    <section className='py-12 md:py-16'>
      <div className='text-center mb-6 md:mb-8'>
        <h2 className='dancing text-[2rem] md:text-[3.4rem] text-[#f9b8c3]'>{title}</h2>
        {description && <p className='text-[#8A6F5C]'>{description}</p>}
      </div>
      <Slider
        items={items}
        showPagination={true}
        showArrows={true}
        paginationActiveClassName="bg-pink-500"
        paginationInactiveClassName="bg-gray-300"
        renderItem={(item: any) => (
          <ProductCard
            data={item}
            variant='bestseller'
            showCategoryBadge={false}
            showAddToCart={false}
            className='bg-white'
            currencySymbol='₹'
          />
        )}
      />
    </section>
  )
}

export default ThingsULike
