'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/useSupabase'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/Redux/cartSlice'
import ProductCard from './ProductCarad'

const HomePage = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { products, getDataFromSupabase } = useSupabase()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await getDataFromSupabase()
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const sareeProducts = products.filter((p: any) =>
    p.category?.toLowerCase().includes('saree')
  ).slice(0, 4)

  const lehengaProducts = products.filter((p: any) =>
    p.category?.toLowerCase().includes('lehenga')
  ).slice(0, 4)

  const featuredProducts = products.slice(0, 8)

  const addToCartItem = (product: any) => {
    dispatch(addToCart(product))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-maroon-500 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-maroon-700">
            Loading our beautiful collections...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* HERO */}
      <div className="relative w-full md:w-[92vw] mx-auto  h-[19vh] md:h-[55vh] lg:h-[70vh]">
        <Image
          src="/BannerEcomm1.png"
          alt="Luxury Bridal Collection"
          fill
          priority
          className="object-contain object-center"
        />
        
        {/* <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <div className="max-w-3xl text-white space-y-6">
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => router.push('/search/saree')}
                  className="bg-rose-600 hover:bg-rose-700 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition"
                >
                  Explore Sarees
                </button>
                <button
                  onClick={() => router.push('/search/lehenga')}
                  className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition"
                >
                  Discover Lehengas
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* CATEGORY HIGHLIGHTS */}
      <div className="py-20 px-6 lg:px-16 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-rose-700 mb-4">Shop By Category</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Timeless elegance meets contemporary design in our curated wedding attire collections.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { title: 'Wedding Saree', image: '/c1.jpg', link: '/search/saree' },
            { title: 'Desinger', image: '/c2.jpg', link: '/search/choli' },
            { title: 'Casual Wear', image: '/c3.jpg', link: '/search/choli' },
            { title: 'Festive Collection', image: '/c4.jpg', link: '/search/lehenga' },
          ].map((cat, idx) => (
           <div
  key={idx}
  onClick={() => router.push(cat.link)}
  className="relative h-[470px] rounded-3xl overflow-hidden group cursor-pointer"
>
  {/* Background Image */}
  <Image
    src={cat.image}
    alt={cat.title}
    fill
    className="object-cover transition-transform duration-500 group-hover:scale-110"
  />

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

  {/* Text at Bottom */}
  <h3 className="absolute bottom-6 left-6 right-6 text-white text-2xl font-serif font-bold">
    {cat.title}
  </h3>
</div>
                
          
          ))}
        </div>
      </div>
          <div className="relative w-[100vw]  h-[19vh] md:h-[55vh] lg:h-[70vh]">
        <Image
          src="/BannerEcomm1.png"
          alt="Luxury Bridal Collection"
          fill
          priority
          className="object-contain object-center"
        />
        
        {/* <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <div className="max-w-3xl text-white space-y-6">
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => router.push('/search/saree')}
                  className="bg-rose-600 hover:bg-rose-700 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition"
                >
                  Explore Sarees
                </button>
                <button
                  onClick={() => router.push('/search/lehenga')}
                  className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-full text-lg font-semibold shadow-lg transition"
                >
                  Discover Lehengas
                </button>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {/* FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-20 px-6 lg:px-16 bg-white">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-rose-700">Featured Products</h2>
            <p className="text-lg text-gray-600">Handpicked designs for the discerning woman.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} data={product} addToCartItem={addToCartItem} />
            ))}
          </div>
          <div className='w-full flex items-center justify-center mt-10'>
            <button className='bg-pink-300/70 px-4 py-2 rounded-2xl text-white font-bold'>View All Products</button>
          </div>
        </section>
      )}


 


      {/* OFFERS */}
      <section className="py-20 px-6 lg:px-16 bg-gradient-to-r from-rose-100 via-rose-200 to-rose-100">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-rose-700">Special Offers</h2>
          <p className="text-lg text-gray-700">Exclusive deals on our finest collections.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'New Arrivals', desc: 'Get 20% off on latest designs' },
            { title: 'Bridal Collection', desc: 'Special pricing for bridal sets' },
            { title: 'Party Wear', desc: 'Perfect ensembles for celebrations' },
          ].map((offer, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow text-center"
            >
              <h3 className="text-2xl font-bold text-rose-700 mb-3">{offer.title}</h3>
              <p className="text-gray-600 mb-6">{offer.desc}</p>
              <button className="bg-rose-600 text-white px-6 py-3 rounded-full hover:bg-rose-700 transition">
                Shop Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 px-6 lg:px-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-rose-700 mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe for exclusive offers, early access to new collections, and special bridal packages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 border border-rose-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
            <button className="bg-rose-600 text-white px-8 py-4 rounded-full hover:bg-rose-700 transition font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
