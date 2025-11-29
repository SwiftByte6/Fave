import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/products';
import { generateMetadata as generateSEOMetadata, BreadcrumbItem } from '@/lib/seo';
import { BreadcrumbStructuredData } from '@/lib/structured-data';
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

  return generateSEOMetadata({
    title: `${categoryName} Collection | Favee`,
    description: `Discover our stunning collection of ${categoryName.toLowerCase()}. Premium quality, contemporary designs, and perfect for every occasion. Shop now at Favee.`,
    canonical: `/categories/${slug}`,
    keywords: [
      categoryName.toLowerCase(),
      'fashion',
      'women clothing',
      'premium quality',
      'contemporary design',
      'online shopping',
      'Favee'
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

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      
      <div className="min-h-screen bg-gradient-to-br from-[#F9F5F0] to-[#F0E7DE]">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-[#6f5a4d] mb-4">
              {categoryName} Collection
            </h1>
            <p className="text-lg text-[#8A6F5C] max-w-3xl mx-auto">
              Discover our stunning collection of {categoryName.toLowerCase()}. 
              Premium quality, contemporary designs, and perfect for every occasion.
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
                  currencySymbol="$"
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
            <p className="text-[#8A6F5C] leading-relaxed">
              Our {categoryName.toLowerCase()} collection is carefully curated to bring you the finest 
              pieces that blend traditional beauty with contemporary style by FAVEE. Each piece is crafted 
              with attention to detail, using premium materials to ensure comfort and durability. 
              Whether you're looking for everyday wear or special occasion outfits, our collection 
              has something perfect for every woman.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
