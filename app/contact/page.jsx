import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Us - Favee Fashion",
  description: "Get in touch with Favee for customer support, inquiries, or feedback. We're here to help with your fashion needs and shopping experience.",
  canonical: "/contact",
  keywords: ["contact favee", "customer support", "help", "inquiries", "feedback", "customer service"],
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


