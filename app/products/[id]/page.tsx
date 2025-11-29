import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/products';
import { generateProductMetadata, ProductSEOData } from '@/lib/seo';
import { ProductStructuredData, BreadcrumbStructuredData } from '@/lib/structured-data';
import ProductDetailPage from '@/component/ProductDetailPage';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string): Promise<ProductSEOData | null> {
  try {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    const { data, error } = await supabase
      .from('product')
      .select('id, title, price, images, category, description, created_at, rating, quantity, sizes')
      .eq('id', numericId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      price: data.price,
      currency: 'INR',
      images: data.images || [],
      category: data.category || '',
      brand: 'Favee',
      availability: data.quantity > 0 ? 'in_stock' : 'out_of_stock',
      condition: 'new',
      rating: data.rating || 0,
      reviewCount: Math.floor(Math.random() * 100) + 1, // Mock review count
      sku: data.id.toString(),
      slug: id,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    return {
      title: 'Product Not Found | Favee',
      description: 'The requested product could not be found.',
    };
  }

  return generateProductMetadata(product);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/collection' },
    { name: product.category, url: `/categories/${product.category.toLowerCase()}` },
    { name: product.title, url: `/products/${id}` },
  ];

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ProductStructuredData product={product} />
      <ProductDetailPage filterId={product.id} />
    </>
  );
}