"use client";
import React from 'react'
import { useSupabase } from '@/hooks/useSupabase'
import ProductCard from '@/component/ProductCarad'
import { Slider } from '@/component/SwiperMain/Slider'

const ThingsULike = () => {
  const { products } = useSupabase()

  // Prefer newer/popular items for this carousel
  const items = [...products]
    .map((p) => ({ ...p, _createdAt: p.created_at ? new Date(p.created_at).getTime() : 0 }))
    .sort((a, b) => b._createdAt - a._createdAt)
    .slice(0, 8)

  return (
    <section className='py-12 md:py-16'>
      <div className='text-center mb-6 md:mb-8'>
        <h2 className='dancing text-[2rem] md:text-[2.4rem] text-[#6f5a4d]'>Things You'll Love</h2>
        <p className='text-[#8A6F5C]'>Handpicked just for you based on your style preferences</p>
      </div>
      <Slider
        items={items}
        renderItem={(item) => (
          <ProductCard
            data={item}
            variant='bestseller'
            showCategoryBadge={false}
            showAddToCart={false}
            className='bg-white'
            currencySymbol='$'
          />
        )}
      />
    </section>
  )
}

export default ThingsULike
