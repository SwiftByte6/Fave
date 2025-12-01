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
    <div className="min-h-screen bg-[#FBF8F6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E7DE] p-8">
          <h1 className="dancing text-4xl text-[#f4b7c7] mb-2">Contact Us</h1>
          <p className="text-[#8A6F5C] text-sm mb-8">We're here to help with all your fashion needs</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">Get in Touch</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#FBF8F6] p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-4">Customer Support</h3>
                  <div className="space-y-3 text-[#8A6F5C]">
                    <p><strong>Email:</strong> <a href="mailto:favestore06@gmail.com" className="text-[#f4b7c7] hover:underline">favestore06@gmail.com</a></p>
                    <p><strong>Phone:</strong> <a href="tel:+917977262706" className="text-[#f4b7c7] hover:underline">+91-79772-62706</a></p>
                    <p><strong>WhatsApp:</strong> <a href="https://wa.me/917977262706" className="text-[#f4b7c7] hover:underline">+91-79772-62706</a></p>
                    <p><strong>Response Time:</strong> Within 24 hours</p>
                  </div>
                </div>

                <div className="bg-[#FBF8F6] p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-4">Business Hours</h3>
                  <div className="space-y-2 text-[#8A6F5C]">
                    <p><strong>Monday - Friday:</strong> 10:00 AM - 7:00 PM IST</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 6:00 PM IST</p>
                    <p><strong>Sunday:</strong> 11:00 AM - 5:00 PM IST</p>
                    <p><strong>Holidays:</strong> Closed on major Indian holidays</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">Our Address</h2>
              <div className="bg-[#FBF8F6] p-6 rounded-lg text-[#8A6F5C]">
                <p><strong>Favee Fashion Private Limited</strong></p>
                <p>123 Fashion Street, Bandra West</p>
                <p>Mumbai, Maharashtra 400050</p>
                <p>India</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">How We Can Help</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-[#FBF8F6] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#6f5a4d] mb-2">Order Support</h3>
                  <ul className="text-sm text-[#8A6F5C] space-y-1">
                    <li>• Order tracking</li>
                    <li>• Delivery updates</li>
                    <li>• Payment issues</li>
                    <li>• Order modifications</li>
                  </ul>
                </div>

                <div className="bg-[#FBF8F6] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#6f5a4d] mb-2">Product Help</h3>
                  <ul className="text-sm text-[#8A6F5C] space-y-1">
                    <li>• Size guidance</li>
                    <li>• Product details</li>
                    <li>• Care instructions</li>
                    <li>• Style advice</li>
                  </ul>
                </div>

                <div className="bg-[#FBF8F6] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#6f5a4d] mb-2">Returns & Exchanges</h3>
                  <ul className="text-sm text-[#8A6F5C] space-y-1">
                    <li>• Return requests</li>
                    <li>• Exchange process</li>
                    <li>• Refund status</li>
                    <li>• Sizing issues</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">Quick Links</h2>
              <div className="bg-[#FBF8F6] p-6 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 text-[#8A6F5C]">
                  <div>
                    <p><strong>For Returns:</strong> <a href="/return-refund-policy" className="text-[#f4b7c7] hover:underline">Return Policy</a></p>
                    <p><strong>For Shipping:</strong> <a href="/shipping-delivery-policy" className="text-[#f4b7c7] hover:underline">Shipping Policy</a></p>
                    <p><strong>For Privacy:</strong> <a href="/privacy-policy" className="text-[#f4b7c7] hover:underline">Privacy Policy</a></p>
                  </div>
                  <div>
                    <p><strong>Terms:</strong> <a href="/terms-of-service" className="text-[#f4b7c7] hover:underline">Terms of Service</a></p>
                    <p><strong>Track Order:</strong> <a href="/track-order" className="text-[#f4b7c7] hover:underline">Track Your Order</a></p>
                    <p><strong>Size Guide:</strong> <a href="/collection" className="text-[#f4b7c7] hover:underline">Size Guide</a></p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">Follow Us</h2>
              <div className="bg-[#FBF8F6] p-6 rounded-lg text-[#8A6F5C]">
                <p className="mb-4">Stay connected for the latest fashion trends and exclusive offers:</p>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/favee" className="text-[#f4b7c7] hover:underline">Instagram</a>
                  <a href="https://www.facebook.com/favee" className="text-[#f4b7c7] hover:underline">Facebook</a>
                  <a href="https://twitter.com/favee" className="text-[#f4b7c7] hover:underline">Twitter</a>
                  <a href="https://www.pinterest.com/favee" className="text-[#f4b7c7] hover:underline">Pinterest</a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}


