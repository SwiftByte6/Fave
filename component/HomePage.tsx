import Image from 'next/image'
import React from 'react'
import BannerHome from '@/public/BannerEcomm1.png'


const HomePage = () => {

 
  return (
    <>
    <div className="relative w-full h-[20vh] sm:h-[30vh] md:h-[50vh] lg:h-[60vh]">
  <Image
    src={BannerHome}
    alt="banner"
    fill
    className="object-contain md:object-fit"
    priority
  />
</div>

    <div className=''>
           <div className='flex justify-between items-center p-6'>
           <h1>Kurti Collection</h1>
           <h2>View All</h2>
           </div>
           <div className='bg-yellow-200'>
                
           </div>
    </div>
  
  </>
  
  )
}

export default HomePage
