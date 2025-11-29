import React from 'react';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import CollectionPageClient from './CollectionPageClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = generateSEOMetadata({
  title: "Shop All Products - Premium Indian Fashion Collection | Favee",
  description: "Browse our complete collection of premium Indian fashion for women. Discover designer sarees, elegant kurta sets, trendy western wear, and stunning bridal collections. Free shipping across India. Quality guaranteed.",
  canonical: "/collection",
  keywords: [
    "indian fashion collection",
    "women clothing online india", 
    "designer sarees online",
    "kurta sets collection",
    "western wear women",
    "bridal collection india",
    "ethnic wear online",
    "premium fashion india",
    "contemporary clothing",
    "traditional wear online",
    "festive wear women",
    "party wear collection",
    "casual wear online",
    "formal wear women",
    "quality clothing india",
    "free shipping fashion",
    "cod available",
    "online shopping india"
  ],
  ogType: "website",
});

export default function CollectionPage() {
  return <CollectionPageClient />;
}
