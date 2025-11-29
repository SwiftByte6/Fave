import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/collection`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/new-arrival`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/favourite`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/shipping-delivery-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/return-refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/payment-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  try {
    // Dynamic product pages
    const { data: products, error } = await supabase
      .from('product')
      .select('id, title, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products for sitemap:', error);
      return staticPages;
    }

    const productPages = products?.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(product.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || [];

    // Category pages with detailed subcategories
    const categories = [
      { slug: 'saree', name: 'Sarees', priority: 0.8 },
      { slug: 'kurta', name: 'Kurtas', priority: 0.8 },
      { slug: 'western', name: 'Western Wear', priority: 0.7 },
      { slug: 'bridal', name: 'Bridal Collection', priority: 0.9 }
    ];
    
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: category.priority,
    }));

    // Search pages for SEO
    const searchKeywords = [
      'sarees', 'kurtas', 'ethnic-wear', 'western-wear', 'bridal-wear',
      'designer-sarees', 'silk-sarees', 'cotton-kurtas', 'party-wear',
      'festive-wear', 'casual-wear', 'formal-wear'
    ];
    
    const searchPages = searchKeywords.map((keyword) => ({
      url: `${baseUrl}/search/${keyword}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    return [...staticPages, ...productPages, ...categoryPages, ...searchPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least static pages and category pages even if product fetch fails
    const categories = [
      { slug: 'saree', name: 'Sarees', priority: 0.8 },
      { slug: 'kurta', name: 'Kurtas', priority: 0.8 },
      { slug: 'western', name: 'Western Wear', priority: 0.7 },
      { slug: 'bridal', name: 'Bridal Collection', priority: 0.9 }
    ];
    
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: category.priority,
    }));
    
    return [...staticPages, ...categoryPages];
  }
}
