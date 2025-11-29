import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/products';
import { generateMetadata as generateSEOMetadata, BreadcrumbItem } from '@/lib/seo';
import { BreadcrumbStructuredData, CollectionPageStructuredData, FAQStructuredData } from '@/lib/structured-data';
import ProductCard from '@/component/ProductCarad';
import Link from 'next/link';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const categoryMap: Record<string, string> = {
  'saree': 'Sarees',
  'kurta': 'Kurtas',
  'western': 'Western Wear',
  'bridal': 'Bridal Collection',
};

async function getCategoryProducts(slug: string) {
  try {
    const categoryName = categoryMap[slug];
    if (!categoryName) return null;

    const { data, error } = await supabase
      .from('product')
      .select('id, title, price, images, category, description, created_at, rating, quantity, sizes')
      .eq('category', categoryName)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching category products:', error);
      return null;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching category products:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = categoryMap[slug];
  
  if (!categoryName) {
    return {
      title: 'Category Not Found | Favee',
      description: 'The requested category could not be found.',
    };
  }

  const categoryKeywords: Record<string, string[]> = {
    'Sarees': ['designer sarees online', 'silk sarees', 'cotton sarees', 'party wear sarees', 'traditional sarees', 'wedding sarees', 'festive sarees'],
    'Kurtas': ['kurta sets for women', 'ethnic kurtas', 'cotton kurtas', 'silk kurtas', 'casual kurtas', 'party wear kurtas', 'designer kurtas'],
    'Western Wear': ['western wear women', 'dresses online', 'tops and bottoms', 'western outfits', 'casual western wear', 'formal wear'],
    'Bridal Collection': ['bridal wear online', 'wedding dresses', 'bridal sarees', 'bridal lehengas', 'wedding collection', 'bridal outfits']
  };

  const specificKeywords = categoryKeywords[categoryName] || [];

  return generateSEOMetadata({
    title: `${categoryName} Collection - Premium Indian Fashion | Favee`,
    description: `Shop premium ${categoryName.toLowerCase()} at Favee. Discover designer ${categoryName.toLowerCase()} with free shipping across India. Quality guaranteed. COD available. Perfect for every occasion.`,
    canonical: `/categories/${slug}`,
    keywords: [
      ...specificKeywords,
      `${categoryName.toLowerCase()} online india`,
      'indian fashion online',
      'women clothing india',
      'premium quality fashion',
      'designer wear women',
      'ethnic wear online',
      'contemporary fashion',
      'online shopping india',
      'free shipping fashion',
      'cod available',
      'quality guaranteed',
      'Favee collection'
    ],
    ogType: 'website',
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const products = await getCategoryProducts(slug);
  const categoryName = categoryMap[slug];
  
  if (!products || !categoryName) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/collection' },
    { name: categoryName, url: `/categories/${slug}` },
  ];

  const faqs = [
    {
      question: `How do I choose the right size for ${categoryName.toLowerCase()}?`,
      answer: `We provide detailed size charts for all our ${categoryName.toLowerCase()}. You can refer to our size guide or contact our customer support for personalized assistance.`
    },
    {
      question: `What is the shipping time for ${categoryName.toLowerCase()}?`,
      answer: 'We offer free shipping across India with delivery in 3-7 business days. Express delivery options are also available for faster delivery.'
    },
    {
      question: `Can I return or exchange ${categoryName.toLowerCase()} if they don't fit?`,
      answer: 'Yes! We offer easy returns and exchanges within 30 days of purchase. The items should be in original condition with tags intact.'
    }
  ];

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <CollectionPageStructuredData categoryName={categoryName} products={products} />
      <FAQStructuredData faqs={faqs} />
      
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F0] to-[#F0E7DE]">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-[#6f5a4d] mb-4">
              {categoryName} Collection
            </h1>
            <p className="text-lg text-[#8A6F5C] max-w-3xl mx-auto mb-4">
              Discover our stunning collection of premium {categoryName.toLowerCase()}. 
              Contemporary designs, quality fabrics, and perfect for every occasion.
            </p>
            <p className="text-sm text-[#A68B7A] font-medium">
              {products.length} Products Available | Free Shipping Across India | COD Available
            </p>
          </div>

          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-[#8A6F5C]">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.name} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-[#6f5a4d]">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.url} className="hover:text-[#6f5a4d] transition-colors">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  data={product}
                  variant="default"
                  showCategoryBadge={false}
                  showAddToCart={true}
                  currencySymbol="₹"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">
                No products found in this category
              </h2>
              <p className="text-[#8A6F5C] mb-6">
                We're working on adding more {categoryName.toLowerCase()} to this collection.
              </p>
              <Link 
                href="/collection" 
                className="inline-block bg-[#6f5a4d] text-white px-6 py-3 rounded-lg hover:bg-[#5a4a3d] transition-colors"
              >
                View All Products
              </Link>
            </div>
          )}

          {/* Category Description */}
          <div className="mt-16 bg-white/80 rounded-2xl p-8 shadow-sm border border-[#F0E7DE]">
            <h2 className="text-2xl font-bold text-[#6f5a4d] mb-4">
              About Our {categoryName} Collection
            </h2>
            <div className="text-[#8A6F5C] leading-relaxed space-y-4">
              <p>
                Our {categoryName.toLowerCase()} collection at Favee represents the perfect fusion of traditional 
                Indian craftsmanship and contemporary fashion. Each piece is carefully curated and designed 
                to celebrate the modern Indian woman's style preferences.
              </p>
              <p>
                <strong>Why Choose Favee {categoryName}?</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Premium quality fabrics and materials</li>
                <li>Contemporary designs with traditional touch</li>
                <li>Perfect fit and comfortable wear</li>
                <li>Free shipping across India</li>
                <li>Cash on Delivery (COD) available</li>
                <li>Easy returns and exchanges</li>
                <li>Affordable pricing without compromising quality</li>
              </ul>
              <p>
                Whether you're shopping for everyday wear, special occasions, festivals, or office wear, 
                our {categoryName.toLowerCase()} collection has something perfect for every Indian woman. 
                Experience the joy of premium fashion with Favee.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12 bg-white/80 rounded-2xl p-8 shadow-sm border border-[#F0E7DE]">
            <h2 className="text-2xl font-bold text-[#6f5a4d] mb-6">
              Frequently Asked Questions - {categoryName}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#6f5a4d] mb-2">
                  How do I choose the right size for {categoryName.toLowerCase()}?
                </h3>
                <p className="text-[#8A6F5C]">
                  We provide detailed size charts for all our {categoryName.toLowerCase()}. You can refer to our size guide 
                  or contact our customer support for personalized assistance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6f5a4d] mb-2">
                  What is the shipping time for {categoryName.toLowerCase()}?
                </h3>
                <p className="text-[#8A6F5C]">
                  We offer free shipping across India with delivery in 3-7 business days. Express delivery 
                  options are also available for faster delivery.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#6f5a4d] mb-2">
                  Can I return or exchange {categoryName.toLowerCase()} if they don't fit?
                </h3>
                <p className="text-[#8A6F5C]">
                  Yes! We offer easy returns and exchanges within 30 days of purchase. The items should be 
                  in original condition with tags intact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
