import HomePage from "@/component/HomePage";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Favee - Premium Indian Fashion & Designer Wear for Women Online",
  description: "Shop premium Indian fashion at Favee. Discover designer sarees, elegant kurta sets, trendy western wear, and stunning bridal collections. Free shipping across India. Quality guaranteed. COD available.",
  canonical: "/",
  keywords: [
    "indian fashion online",
    "women clothing india",
    "designer sarees online",
    "kurta sets for women", 
    "ethnic wear online",
    "western wear women",
    "bridal collection india",
    "festive wear women",
    "traditional clothing",
    "contemporary fashion india",
    "online shopping india",
    "premium fashion",
    "designer wear women",
    "indo western dresses",
    "party wear women",
    "casual wear online",
    "formal wear women",
    "fashion accessories india",
    "trendy clothes women",
    "stylish outfits india",
    "free shipping fashion",
    "cod fashion india",
    "quality clothing online"
  ],
  ogType: "website",
});

export default function Home() {
  return (
    <>
      <HomePage/>
    </>
  );
}

