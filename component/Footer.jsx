import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="bg-white text-gray-700 pt-10 px-6 border-t border-pink-100">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">

    {/* Brand & About */}
    <div>
      <h2 className="text-2xl font-bold text-pink-500 mb-3">Pookie Lane</h2>
      <p className="text-sm text-gray-600">
        Your destination for cute but confident fashion. We believe in creating clothes that make you feel as good as you look.
      </p>
    </div>

    {/* Shop Links */}
    <div>
      <h3 className="text-pink-400 font-semibold mb-3">Shop</h3>
      <ul className="space-y-1 text-sm">
        <li>New Arrivals</li>
        <li>Bestsellers</li>
        <li>Kurti Collection</li>
        <li>Lengha Collection</li>
        <li>Saree Collection</li>
        <li className="text-pink-500 font-medium">Sale</li>
      </ul>
    </div>

    {/* Help Links */}
    <div>
      <h3 className="text-pink-400 font-semibold mb-3">Help</h3>
      <ul className="space-y-1 text-sm">
        <li>Customer Service</li>
        <li>Track Your Order</li>
        <li>Returns & Exchanges</li>
        <li>Shipping Information</li>
        <li>Size Guide</li>
        <li>FAQ</li>
      </ul>
    </div>

    {/* Newsletter */}
    <div>
      <h3 className="text-pink-400 font-semibold mb-3">Stay Connected</h3>
      <p className="text-sm text-gray-600 mb-2">
        Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
      </p>
      <input
        type="email"
        placeholder="Your email address"
        className="w-full p-2 border border-pink-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-pink-300 mb-2"
      />
      <button className="w-full bg-pink-100 text-pink-600 py-2 rounded-md hover:bg-pink-200 transition text-sm font-medium">
        Subscribe
      </button>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-pink-100 text-center text-sm text-gray-500 py-4">
    © 2025 Pookie Lane. All rights reserved. <br className="md:hidden" />
    <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
      <a href="#">Shipping Policy</a>
      <a href="#">Refund Policy</a>
    </div>
  </div>
</footer>

    </div>
  )
}

export default Footer
