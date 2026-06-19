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
  title: 'Favee - Premium Indian Fashion & Designer Wear for Women',
  description: 'Discover premium Indian fashion at Favee. Shop designer sarees, elegant kurtas, trendy western wear, and exquisite bridal collections. Free shipping across India. Quality guaranteed.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  locale: 'en_IN',
  keywords: [
    'indian fashion', 'women clothing india', 'designer sarees', 'kurta sets', 'ethnic wear',
    'western wear', 'bridal collection', 'festive wear', 'traditional clothing', 'contemporary fashion',
    'online shopping india', 'premium fashion', 'designer wear', 'indo western', 'party wear',
    'casual wear', 'formal wear', 'fashion accessories', 'trendy clothes', 'stylish outfits'
  ],
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.shop';
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.shop';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  
  const resolveImageUrl = (path: string | undefined | null): string => {
    if (!path) return `${siteUrl}/og-image.jpg`;
    if (/^https?:\/\//i.test(path)) return path;
    const clean = path.replace(/^\/+/, '');
    if (clean.startsWith('storage/v1/object/public/')) {
      return supabaseUrl ? `${supabaseUrl}/${clean}` : `${siteUrl}/${clean}`;
    }
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/${clean}`;
    }
    return `${siteUrl}/${clean}`;
  };

  return generateMetadata({
    title: product.title,
    description: product.description,
    canonical: `/products/${product.slug || product.id}`,
    ogImage: product.images?.[0] ? resolveImageUrl(product.images[0]) : '/og-image.jpg',
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.shop';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const productUrl = `${siteUrl}/products/${product.slug || product.id}`;
  
  const resolveImageUrl = (path: string | undefined | null): string => {
    if (!path) return `${siteUrl}/og-image.jpg`;
    if (/^https?:\/\//i.test(path)) return path;
    const clean = path.replace(/^\/+/, '');
    if (clean.startsWith('storage/v1/object/public/')) {
      return supabaseUrl ? `${supabaseUrl}/${clean}` : `${siteUrl}/${clean}`;
    }
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/${clean}`;
    }
    return `${siteUrl}/${clean}`;
  };

  const productImage = resolveImageUrl(product.images?.[0]);
  const images = product.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images.map(resolveImageUrl)
    : [productImage];

  // Determine availability
  let schemaAvailability = 'InStock';
  if ('quantity' in product) {
    const qty = (product as any).quantity;
    if (qty !== undefined && qty !== null && Number(qty) <= 0) {
      schemaAvailability = 'OutOfStock';
    }
  } else if (product.availability) {
    if (product.availability === 'out_of_stock') {
      schemaAvailability = 'OutOfStock';
    } else if (product.availability === 'preorder') {
      schemaAvailability = 'PreOrder';
    }
  }

  // Price validation date (end of next year)
  const priceValidUntil = new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: images,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Favee',
    },
    category: product.category,
    sku: product.sku || product.id.toString(),
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'INR',
      availability: `https://schema.org/${schemaAvailability}`,
      url: productUrl,
      priceValidUntil,
      seller: {
        '@type': 'Organization',
        name: 'Favee',
        url: siteUrl,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN'
        }
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 7,
            unitCode: 'DAY'
          }
        }
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnPeriod',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      }
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.shop';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Favee',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 300,
      height: 100
    },
    description: 'Premium Indian fashion and designer wear for women. Discover curated collections of sarees, kurtas, western wear, and bridal collections with free shipping across India.',
    foundingDate: '2024',
    areaServed: {
      '@type': 'Country',
      name: 'India'
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN'
    },
    sameAs: [
      'https://www.facebook.com/favee',
      'https://www.instagram.com/favee',
      'https://www.twitter.com/favee',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-98765-43210',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
      areaServed: 'IN',
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '18:00'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '2500'
    }
  };
}

export function generateWebsiteStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.shop';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Favee - Premium Indian Fashion',
    alternateName: 'Favee Fashion',
    url: siteUrl,
    description: 'Premium Indian fashion and designer wear for women. Shop sarees, kurtas, western wear, and bridal collections online with free shipping across India.',
    inLanguage: 'en-IN',
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: {
      '@id': `${siteUrl}/#organization`
    },
    publisher: {
      '@id': `${siteUrl}/#organization`
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search/{search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      }
    ],
    mainEntity: {
      '@type': 'ItemList',
      name: 'Product Categories',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Sarees',
          url: `${siteUrl}/categories/saree`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Kurta Sets',
          url: `${siteUrl}/categories/kurta`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Western Wear',
          url: `${siteUrl}/categories/western`
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Bridal Collection',
          url: `${siteUrl}/categories/bridal`
        }
      ]
    }
  };
}

export function generateCollectionPageStructuredData(categoryName: string, products: any[]) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.shop';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Collection - Favee`,
    description: `Browse our premium ${categoryName.toLowerCase()} collection. Discover stylish and trendy ${categoryName.toLowerCase()} for every occasion.`,
    url: `${siteUrl}/categories/${categoryName.toLowerCase()}`,
    mainEntity: {
      '@type': 'ItemList',
      name: `${categoryName} Products`,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          url: `${siteUrl}/products/${product.id}`,
          image: product.images?.[0] ? `${siteUrl}${product.images[0]}` : undefined,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR'
          }
        }
      }))
    }
  };
}

export function generateFAQStructuredData(faqs: Array<{question: string, answer: string}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function generateLocalBusinessStructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.shop';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${siteUrl}/#store`,
    name: 'Favee Fashion Store',
    description: 'Premium Indian fashion online store specializing in designer wear for women',
    url: siteUrl,
    image: `${siteUrl}/og-image.jpg`,
    telephone: '+91-98765-43210',
    email: 'info@favee.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '28.6139',
      longitude: '77.2090'
    },
    currenciesAccepted: 'INR',
    paymentAccepted: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Razorpay'],
    priceRange: '₹500-₹50000',
    areaServed: {
      '@type': 'Country',
      name: 'India'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Fashion Collection',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Designer Sarees',
            category: 'Sarees'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Kurta Sets',
            category: 'Ethnic Wear'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Western Wear',
            category: 'Western'
          }
        }
      ]
    }
  };
}
