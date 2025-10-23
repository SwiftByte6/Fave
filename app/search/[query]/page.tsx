import React from 'react';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/products';
import { generateMetadata as generateSEOMetadata, BreadcrumbItem } from '@/lib/seo';
import { BreadcrumbStructuredData } from '@/lib/structured-data';
import SearchResult from '@/component/SearchResult';
import type { Metadata } from 'next';

interface SearchPageProps {
  params: Promise<{
    query: string;
  }>;
}

async function getSearchResults(query: string) {
  try {
    const { data, error } = await supabase
      .from('product')
      .select('id, title, price, images, category, description, created_at, rating, quantity, sizes')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching search results:', error);
      return null;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching search results:', error);
    return null;
  }
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);
  
  return generateSEOMetadata({
    title: `Search Results for "${decodedQuery}" | Favee`,
    description: `Find the perfect fashion pieces with our search results for "${decodedQuery}". Discover premium clothing, accessories, and style inspiration at Favee.`,
    canonical: `/search/${query}`,
    keywords: [
      decodedQuery,
      'fashion search',
      'women clothing',
      'style search',
      'premium fashion',
      'online shopping'
    ],
    ogType: 'website',
    noindex: true, // Search results pages typically shouldn't be indexed
  });
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { query } = await params;
  const decodedQuery = decodeURIComponent(query);
  const products = await getSearchResults(decodedQuery);
  
  if (!products) {
    notFound();
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: '/' },
    { name: 'Search', url: '/search' },
    { name: `"${decodedQuery}"`, url: `/search/${query}` },
  ];

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <SearchResult filterData={products}/>
    </>
  );
}
