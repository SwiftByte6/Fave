import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata = generateSEOMetadata({
  title: "Contact Us - Favee Customer Support | Get Help & Support",
  description: "Contact Favee for customer support, product inquiries, size guidance, shipping information, or any fashion-related questions. We're here to help with your premium Indian fashion shopping experience.",
  canonical: "/contact",
  keywords: [
    "contact favee",
    "customer support india",
    "fashion help desk",
    "size guidance",
    "shipping inquiries",
    "product support",
    "returns help",
    "exchange support",
    "fashion consultation",
    "customer service",
    "shopping assistance",
    "order support",
    "payment help",
    "delivery queries"
  ],
  ogType: "website",
})

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-2xl font-semibold mb-4">Contact</h1>
      <div className="bg-white shadow rounded p-6 space-y-3">
        <p>For support, email us at support@example.com.</p>
        <p>We usually respond within 24-48 hours.</p>
      </div>
    </div>
  );
}


