'use client';

import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = '917977262706'; // WhatsApp format: country code + number
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=Hello%20Favee%2C%20I%20want%20to%20shop%20on%20WhatsApp`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* WhatsApp Button */}
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group flex items-center justify-center"
      >
        {/* Tooltip text */}
        <div
          className={`absolute right-16 bg-fav-maroon text-white px-4 py-2 rounded-lg whitespace-nowrap font-semibold transition-all duration-300 pointer-events-none ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}
        >
          Shop on WhatsApp
          <div className="absolute right-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-fav-maroon border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
        </div>

        {/* WhatsApp Icon Button */}
        <button
          className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
            isHovered
              ? 'bg-green-500 shadow-2xl -translate-x-1'
              : 'bg-green-500 hover:bg-green-600'
          }`}
          aria-label="Chat with us on WhatsApp"
        >
          <FaWhatsapp className="text-white text-2xl sm:text-3xl" />
        </button>

        {/* Pulse animation */}
        <div className="absolute inset-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500 animate-ping opacity-75"></div>
      </a>

      {/* Mobile tooltip - shows below on small screens */}
      <div className="sm:hidden mt-2 text-center">
        <p className="text-xs text-fav-maroon font-semibold bg-white px-3 py-1 rounded-lg shadow">
          Chat with us!
        </p>
      </div>
    </div>
  );
};

export default FloatingWhatsApp;
