"use client";

import { useEffect } from 'react';

export const ResourcePreloader = () => {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      '/banner.png',
      '/BannerHome.jpg',
      '/FaveeBanner.png'
    ];

    criticalImages.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Preload critical fonts
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
    ];

    criticalFonts.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });

    // Preload critical API endpoints
    const criticalAPIs = [
      '/api/products',
      '/home.json'
    ];

    // Prefetch critical routes
    const criticalRoutes = [
      '/collection',
      '/about',
      '/contact'
    ];

    // Use requestIdleCallback for non-critical preloading
    const preloadNonCritical = () => {
      criticalRoutes.forEach((route) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadNonCritical);
    } else {
      setTimeout(preloadNonCritical, 2000);
    }

  }, []);

  return null;
};
