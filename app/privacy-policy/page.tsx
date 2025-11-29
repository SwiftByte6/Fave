import React from 'react';

export const dynamic = 'force-dynamic';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FBF8F6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E7DE] p-8">
          <h1 className="dancing text-4xl text-[#f4b7c7] mb-2">Privacy Policy</h1>
          <p className="text-[#8A6F5C] text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">1. Information We Collect</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>At Favee, we collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
                
                <h3 className="text-lg font-medium text-[#6f5a4d] mt-6 mb-3">Personal Information:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely through Razorpay)</li>
                  <li>Account credentials and preferences</li>
                  <li>Communication history with our support team</li>
                </ul>

                <h3 className="text-lg font-medium text-[#6f5a4d] mt-6 mb-3">Automatically Collected Information:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information and IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website information</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">2. How We Use Your Information</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send order confirmations, shipping updates, and delivery notifications</li>
                  <li>Improve our website functionality and user experience</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">3. Information Sharing</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> With trusted third parties who assist in operating our website, processing payments, or delivering products</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> When you have given explicit consent for specific sharing</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">4. Data Security</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We implement appropriate security measures to protect your personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing through Razorpay</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                  <li>Secure data storage and backup procedures</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">5. Cookies and Tracking</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We use cookies and similar technologies to enhance your browsing experience:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand website usage and improve performance</li>
                  <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with your consent)</li>
                </ul>
                <p>You can control cookie preferences through your browser settings.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">6. Your Rights</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate data</li>
                  <li>Deletion of your personal information</li>
                  <li>Data portability</li>
                  <li>Objection to processing</li>
                  <li>Withdrawal of consent</li>
                </ul>
                <p>To exercise these rights, please contact us at privacy@favee.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">7. International Transfers</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">8. Children's Privacy</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete the information.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">9. Changes to This Policy</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">10. Contact Us</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <div className="bg-[#FBF8F6] p-4 rounded-lg">
                  <p><strong>Email:</strong> privacy@favee.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong> Favee Fashion House, 123 Fashion Street, Style City, SC 12345</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
