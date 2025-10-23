import React from 'react';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import CollectionPageClient from './CollectionPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: "Shop All Products - Favee Fashion Collection",
  description: "Browse our complete collection of premium women's fashion. Discover sarees, kurtas, western wear, and bridal collections. Quality clothing for every occasion.",
  canonical: "/collection",
  keywords: ["women fashion", "clothing collection", "sarees", "kurtas", "western wear", "bridal", "premium fashion", "online shopping"],
  ogType: "website",
});

export default function CollectionPage() {
  return <CollectionPageClient />;
}
