import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#FBF8F6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E7DE] p-8">
          <h1 className="dancing text-4xl text-[#f4b7c7] mb-2">Terms of Service</h1>
          <p className="text-[#8A6F5C] text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">1. Acceptance of Terms</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>By accessing and using Favee's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">2. Use License</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Permission is granted to temporarily download one copy of the materials on Favee's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">3. User Accounts</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Safeguarding the password and all activities under your account</li>
                  <li>Notifying us immediately of any unauthorized use of your account</li>
                  <li>Ensuring your account information remains accurate and up-to-date</li>
                  <li>Maintaining the confidentiality of your account credentials</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">4. Prohibited Uses</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>You may not use our service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">5. Product Information and Availability</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free. Product availability is subject to change without notice.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Colors may vary due to monitor settings and lighting conditions</li>
                  <li>Product images are for illustrative purposes only</li>
                  <li>We reserve the right to limit quantities and refuse orders</li>
                  <li>Prices are subject to change without notice</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">6. Payment Terms</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Payment for all orders must be made at the time of purchase. We accept various payment methods through our secure payment processor, Razorpay. By providing payment information, you represent and warrant that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You have the legal right to use the payment method</li>
                  <li>The payment information is accurate and complete</li>
                  <li>You authorize us to charge the payment method for the total amount</li>
                  <li>You will notify us of any changes to your payment information</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">7. Intellectual Property Rights</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>All content, trademarks, service marks, trade names, logos, and other intellectual property on this website are the property of Favee or its licensors. You may not use, reproduce, distribute, or create derivative works without our express written permission.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">8. Limitation of Liability</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>In no event shall Favee, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">9. Disclaimer</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, Favee excludes all representations, warranties, conditions and terms relating to our website and the use of this website.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">10. Governing Law</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Favee operates and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">11. Changes to Terms</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">12. Contact Information</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className="bg-[#FBF8F6] p-4 rounded-lg">
                  <p><strong>Email:</strong> legal@favee.com</p>
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
