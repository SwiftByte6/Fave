import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noindex?: boolean;
  nofollow?: boolean;
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: string[];
}

export interface ProductSEOData {
  id: number;
  title: string;
  description: string;
  price: number;
  currency?: string;
  images: string[];
  category: string;
  brand?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'preorder';
  condition?: 'new' | 'used' | 'refurbished';
  rating?: number;
  reviewCount?: number;
  sku?: string;
  slug?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const defaultSEO: SEOConfig = {
  title: 'Favee - Premium Fashion & Style',
  description: 'Discover the finest collection of contemporary fashion and style. Favee brings you premium clothing and accessories for every occasion.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  locale: 'en_US',
  keywords: ['fashion', 'clothing', 'style', 'women', 'premium', 'ecommerce'],
  author: 'Favee',
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    canonical,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noindex = false,
    nofollow = false,
    keywords = [],
    author,
    publishedTime,
    modifiedTime,
    section,
    tags = [],
    locale = 'en_US',
    alternateLocales = [],
  } = config;

  const fullTitle = title.includes('Favee') ? title : `${title} | Favee`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/og-image.jpg`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    creator: author,
    publisher: 'Favee',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullCanonical,
      languages: alternateLocales.reduce((acc, locale) => {
        acc[locale] = `${siteUrl}/${locale}`;
        return acc;
      }, {} as Record<string, string>),
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: ogType,
      locale,
      url: fullCanonical,
      title: fullTitle,
      description,
      siteName: 'Favee',
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      ...(ogType === 'article' && publishedTime ? { publishedTime } : {}),
      ...(ogType === 'article' && modifiedTime ? { modifiedTime } : {}),
      ...(ogType === 'article' && section ? { section } : {}),
      ...(ogType === 'article' && tags.length > 0 ? { tags } : {}),
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [fullOgImage],
      creator: '@favee',
      site: '@favee',
    },
  };

  return metadata;
}

export function generateProductMetadata(product: ProductSEOData): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.com';
  const productUrl = `${siteUrl}/products/${product.slug || product.id}`;
  const productImage = product.images?.[0] ? `${siteUrl}${product.images[0]}` : `${siteUrl}/og-image.jpg`;

  return generateMetadata({
    title: product.title,
    description: product.description,
    canonical: `/products/${product.slug || product.id}`,
    ogImage: product.images?.[0] || '/og-image.jpg',
    ogType: 'website', // Changed from 'product' to 'website'
    twitterCard: 'summary_large_image',
    keywords: [
      product.title,
      product.category,
      'fashion',
      'clothing',
      'women',
      product.brand || 'Favee',
    ],
    author: 'Favee',
  });
}

export function generateBreadcrumbStructuredData(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateProductStructuredData(product: ProductSEOData) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.com';
  const productUrl = `${siteUrl}/products/${product.slug || product.id}`;
  const productImage = product.images?.[0] ? `${siteUrl}${product.images[0]}` : `${siteUrl}/og-image.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images?.map(img => `${siteUrl}${img}`) || [productImage],
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Favee',
    },
    category: product.category,
    sku: product.sku || product.id.toString(),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: 'Favee',
      },
    },
    aggregateRating: product.rating && product.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
    condition: `https://schema.org/${product.condition || 'NewCondition'}`,
    url: productUrl,
  };
}

export function generateOrganizationStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Favee',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Premium fashion and style for women. Discover curated collections of contemporary clothing and accessories.',
    sameAs: [
      'https://www.facebook.com/favee',
      'https://www.instagram.com/favee',
      'https://www.twitter.com/favee',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  };
}

export function generateWebsiteStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Favee',
    url: siteUrl,
    description: 'Premium fashion and style for women',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
