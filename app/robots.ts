import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.com';
  
  return {
    rules: [
      // Main crawlers
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/test-*',
          '/*.json$',
          '/checkout',
          '/cart',
          '/account',
          '/orders',
          '/signin'
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/test-*',
          '/checkout',
          '/cart',
          '/account'
        ],
        crawlDelay: 1,
      },
      // General bots
      {
        userAgent: '*',
        allow: [
          '/',
          '/products/',
          '/categories/',
          '/collection',
          '/about',
          '/contact',
          '/new-arrival',
          '/search/',
          '/*-policy',
          '/terms-of-service',
          '/disclaimer'
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/private/',
          '/test-*',
          '/*.json$',
          '/checkout*',
          '/cart*',
          '/account*',
          '/orders*',
          '/signin*',
          '/*?*sort=',
          '/*?*filter=',
          '/*?*page=',
        ],
      },
      // AI Training Bots - Block them
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
      {
        userAgent: 'Meta-ExternalAgent',
        disallow: '/',
      },
      {
        userAgent: 'FacebookBot',
        disallow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
