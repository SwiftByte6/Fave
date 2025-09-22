import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-[#FBF8F6] text-[#6f5a4d] pt-10 px-4 sm:px-6 border-t border-[#F0E7DE]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-10">

          {/* Brand & About */}
          <div>
            <h2 className="dancing text-[1.5rem] text-[#f4b7c7] mb-3">Lovable Fashion</h2>
            <p className="text-xs sm:text-sm text-[#8A6F5C]">
              Creating beautiful, sustainable fashion that makes you feel confident and loved.
            </p>
            <p className="text-xs sm:text-sm text-[#8A6F5C] mt-2 flex items-center gap-1">Made with <span className='text-rose-400'>♥</span> for you</p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-[#8A6F5C] font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Shop</h3>
            <ul className="space-y-1 text-xs sm:text-sm">
              <li>New Arrivals</li>
              <li>Dresses</li>
              <li>Accessories</li>
              <li className="text-rose-400 font-medium">Sale</li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="text-[#8A6F5C] font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Support</h3>
            <ul className="space-y-1 text-xs sm:text-sm">
              <li>About Us</li>
              <li>Contact</li>
              <li>Returns & Exchanges</li>
              <li>Size Guide</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-[#8A6F5C] font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Connect</h3>
            <div className='flex items-center gap-3 mb-3'>
              <span className='h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center'>
                <span className='text-rose-400 text-sm'>ig</span>
              </span>
              <span className='h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center'>
                <span className='text-rose-400 text-sm'>fb</span>
              </span>
              <span className='h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center'>
                <span className='text-rose-400 text-sm'>t</span>
              </span>
              <span className='h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center'>
                <span className='text-rose-400 text-sm'>@</span>
              </span>
            </div>
            <p className='text-xs sm:text-sm text-[#8A6F5C]'>Follow us for style inspiration and exclusive offers</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#F0E7DE] text-center text-xs sm:text-sm text-[#8A6F5C] py-4">
          © 2024 Lovable Fashion. All rights reserved.
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2 text-xs">
            <a href="#" className="hover:text-[#6f5a4d] transition">Privacy Policy</a>
            <a href="#" className="hover:text-[#6f5a4d] transition">Terms of Service</a>
            <a href="#" className="hover:text-[#6f5a4d] transition">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer
