
import { fetchProducts } from '@/lib/products';
import CollectionPageClient from './CollectionPageClient';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export const metadata: Metadata = generateSEOMetadata({
  title: 'Shop All Products - Premium Indian Fashion Collection | Favee',
  description: 'Browse our complete collection of premium Indian fashion for women. Discover designer sarees, elegant kurta sets, trendy western wear, and stunning bridal collections. Free shipping across India. Quality guaranteed.',
  canonical: '/collection',
  keywords: [
    'indian fashion collection',
    'women clothing online india',
    'designer sarees online',
    'kurta sets collection',
    'western wear women',
    'bridal collection india',
    'ethnic wear online',
    'premium fashion india',
    'contemporary clothing',
    'traditional wear online',
    'festive wear women',
    'party wear collection',
    'casual wear online',
    'formal wear women',
    'quality clothing india',
    'free shipping fashion',
    'cod available',
    'online shopping india',
  ],
  ogType: 'website',
});

interface CollectionPageProps {
  searchParams?: { page?: string };
}

export default async function CollectionPage({ searchParams }: CollectionPageProps) {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 20;
  const { products, total } = await fetchProducts({ page, pageSize });
  return <CollectionPageClient products={products} total={total} page={page} pageSize={pageSize} />;
}
