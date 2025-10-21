import React from 'react'

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-gradient-to-r from-pink-100 to-pink-200 flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-pink-700 mb-4">About Us</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Crafting elegance through tradition and contemporary design.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto text-center md:text-left">
          <h2 className="text-4xl font-bold text-pink-600 mb-6 text-center">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Elegance Boutique was born from a passion for ok preserving the timeless beauty of Indian ethnic wear while embracing modern sensibilities. 
              Every saree and lehenga we curate tells a story of tradition, culture, and grace.
            </p>
            <p>
              Our vision is to make premium ethnic wear accessible to women who value artistry and craftsmanship. Each collection reflects a perfect blend of 
              traditional techniques and contemporary design aesthetics.
            </p>
            <p>
              From bridal collections that make your special day unforgettable to everyday sarees that add sophistication to your lifestyle, 
              our creations are designed to celebrate you in every moment.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
<div className="py-20 px-6 md:px-16 bg-gradient-to-b from-pink-50 to-white">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-bold text-pink-600 text-center mb-16">
      Our Values
    </h2>
    <div className="grid md:grid-cols-3 gap-10">
      {/* Card 1 */}
      <div className="bg-white rounded-3xl p-10 text-center shadow-md hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-pink-100 p-6 rounded-full shadow-inner">
            <img src="/icons/craft.svg" alt="Craftsmanship" className="w-12 h-12" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-pink-700 mb-4">Craftsmanship</h3>
        <p className="text-gray-600 leading-relaxed">
          We collaborate with skilled artisans whose expertise brings soul, story, 
          and elegance into every creation.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-3xl p-10 text-center shadow-md hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-pink-100 p-6 rounded-full shadow-inner">
            <img src="/icons/quality.svg" alt="Quality" className="w-12 h-12" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-pink-700 mb-4">Quality</h3>
        <p className="text-gray-600 leading-relaxed">
          From luxurious fabrics to intricate detailing, we uphold uncompromising 
          standards to ensure lasting beauty.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white rounded-3xl p-10 text-center shadow-md hover:shadow-2xl transition-all duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-pink-100 p-6 rounded-full shadow-inner">
            <img src="/icons/care.svg" alt="Customer Care" className="w-12 h-12" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-pink-700 mb-4">Customer Care</h3>
        <p className="text-gray-600 leading-relaxed">
          Your journey matters to us. We guide you personally, helping you find 
          the ensemble that feels uniquely yours.
        </p>
      </div>
    </div>
  </div>
</div>


      {/* Collections Section (Text Only) */}
      <div className="py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-pink-600 mb-12">Our Collections</h2>
          <div className="grid md:grid-cols-2 gap-12 text-left">
            <div className="bg-gradient-to-r from-pink-50 to-white rounded-3xl p-10 shadow-lg hover:shadow-xl transition">
              <h3 className="text-3xl font-bold text-pink-600 mb-4">Saree Collection</h3>
              <p className="text-lg text-gray-700 mb-6">
                Timeless elegance in every drape. Our sarees celebrate traditional weaving while embracing modern styling, 
                perfect for both special occasions and daily grace.
              </p>
              <button className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition">
                Explore Sarees
              </button>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-white rounded-3xl p-10 shadow-lg hover:shadow-xl transition">
              <h3 className="text-3xl font-bold text-pink-600 mb-4">Lehenga Collection</h3>
              <p className="text-lg text-gray-700 mb-6">
                Graceful ensembles designed for celebrations. Our lehengas blend tradition with modern aesthetics, 
                making you shine at every festivity.
              </p>
              <button className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition">
                Explore Lehengas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="py-20 px-6 md:px-16 bg-gradient-to-r from-pink-100 to-pink-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-pink-700 mb-6">Ready to Find Your Perfect Ensemble?</h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Our team is here to guide you in discovering the saree or lehenga that reflects your unique style and occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-pink-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-700 transition">
              Browse Collections
            </button>
            <button className="bg-white text-pink-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-pink-50 transition border-2 border-pink-600">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
