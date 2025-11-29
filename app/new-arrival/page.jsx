import React from 'react';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import NewArrivalClient from './NewArrivalClient';

export const metadata = generateSEOMetadata({
  title: "New Arrivals - Latest Indian Fashion Collection | Favee",
  description: "Discover the latest arrivals in premium Indian fashion at Favee. Shop new designer sarees, kurta sets, western wear, and ethnic collections. Fresh styles added weekly.",
  canonical: "/new-arrival",
  keywords: [
    "new arrivals fashion",
    "latest indian fashion",
    "new collection 2024",
    "designer sarees new",
    "latest kurta sets",
    "new western wear",
    "fresh fashion styles",
    "trending outfits",
    "latest ethnic wear",
    "new designer wear",
    "contemporary fashion",
    "modern indian wear",
    "seasonal collection",
    "fashion trends 2024"
  ],
  ogType: "website",
});

export default function NewArrivalPage() {
  return <NewArrivalClient />;
}


