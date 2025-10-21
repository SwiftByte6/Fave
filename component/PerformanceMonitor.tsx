"use client";

import { useEffect } from 'react';

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Web Vitals monitoring
    const reportWebVitals = (metric: any) => {
      // Send to analytics service
      console.log('Web Vital:', metric);
      
      // You can send to Google Analytics, Mixpanel, etc.
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          event_category: 'Web Vitals',
          event_label: metric.id,
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }
    };

    // Load web vitals library dynamically
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals);
      onFID(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    });

    // Performance observer for custom metrics
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            console.log('Navigation timing:', {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              totalTime: navEntry.loadEventEnd - navEntry.fetchStart,
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation', 'paint'] });
    }

    // Resource timing
    const logResourceTiming = () => {
      const resources = performance.getEntriesByType('resource');
      const slowResources = resources.filter((resource: any) => resource.duration > 1000);
      
      if (slowResources.length > 0) {
        console.warn('Slow resources detected:', slowResources);
      }
    };

    // Log after page load
    window.addEventListener('load', () => {
      setTimeout(logResourceTiming, 1000);
    });

  }, []);

  return null;
};
