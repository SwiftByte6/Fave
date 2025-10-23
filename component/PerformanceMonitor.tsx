'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Core Web Vitals monitoring
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => {
          console.log('CLS:', metric);
          // Send to analytics
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              name: 'CLS',
              value: Math.round(metric.value * 1000),
            });
          }
        });
        
        getFID((metric) => {
          console.log('FID:', metric);
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              name: 'FID',
              value: Math.round(metric.value),
            });
          }
        });
        
        getFCP((metric) => {
          console.log('FCP:', metric);
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              name: 'FCP',
              value: Math.round(metric.value),
            });
          }
        });
        
        getLCP((metric) => {
          console.log('LCP:', metric);
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              name: 'LCP',
              value: Math.round(metric.value),
            });
          }
        });
        
        getTTFB((metric) => {
          console.log('TTFB:', metric);
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              name: 'TTFB',
              value: Math.round(metric.value),
            });
          }
        });
      });
    }

    // Performance observer for additional metrics
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            console.log('Navigation timing:', entry);
          }
          if (entry.entryType === 'paint') {
            console.log('Paint timing:', entry);
          }
        }
      });

      observer.observe({ entryTypes: ['navigation', 'paint'] });
    }
  }, []);

  return null;
}
