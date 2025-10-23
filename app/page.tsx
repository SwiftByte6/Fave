import HomePage from "@/component/HomePage";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Favee - Premium Fashion & Style for Women",
  description: "Discover the finest collection of contemporary fashion and style. Favee brings you premium clothing and accessories for every occasion. Shop sarees, kurtas, western wear, and bridal collections.",
  keywords: [
    "women fashion",
    "premium clothing",
    "sarees",
    "kurtas", 
    "western wear",
    "bridal collection",
    "fashion accessories",
    "online shopping",
    "contemporary style"
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

