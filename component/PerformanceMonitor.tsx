'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Core Web Vitals monitoring
    if (typeof window !== 'undefined') {
      import('web-vitals').then((webVitals) => {
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = webVitals;
        
        if (onCLS) {
          onCLS((metric) => {
            console.log('CLS:', metric);
            // Send to analytics
            if (typeof window !== 'undefined' && 'gtag' in window) {
              (window as any).gtag('event', 'web_vitals', {
                name: 'CLS',
                value: Math.round(metric.value * 1000),
              });
            }
          });
        }
        
        if (onINP) {
          onINP((metric) => {
            console.log('INP:', metric);
            // Send to analytics
            if (typeof window !== 'undefined' && 'gtag' in window) {
              (window as any).gtag('event', 'web_vitals', {
                name: 'INP',
                value: Math.round(metric.value),
              });
            }
          });
        }
        
        if (onFCP) {
          onFCP((metric) => {
            console.log('FCP:', metric);
            if (typeof window !== 'undefined' && 'gtag' in window) {
              (window as any).gtag('event', 'web_vitals', {
                name: 'FCP',
                value: Math.round(metric.value),
              });
            }
          });
        }
        
        if (onLCP) {
          onLCP((metric) => {
            console.log('LCP:', metric);
            if (typeof window !== 'undefined' && 'gtag' in window) {
              (window as any).gtag('event', 'web_vitals', {
                name: 'LCP',
                value: Math.round(metric.value),
              });
            }
          });
        }
        
        if (onTTFB) {
          onTTFB((metric) => {
            console.log('TTFB:', metric);
            if (typeof window !== 'undefined' && 'gtag' in window) {
              (window as any).gtag('event', 'web_vitals', {
                name: 'TTFB',
                value: Math.round(metric.value),
              });
            }
          });
        }
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
