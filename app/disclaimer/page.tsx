import React from 'react';

export const dynamic = 'force-dynamic';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#FBF8F6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E7DE] p-8">
          <h1 className="dancing text-4xl text-[#f4b7c7] mb-2">Disclaimer</h1>
          <p className="text-[#8A6F5C] text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">1. Website Content</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, Favee excludes all representations, warranties, conditions and terms relating to our website and the use of this website.</p>
                <p>Nothing in this disclaimer will:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Limit or exclude our or your liability for death or personal injury</li>
                  <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation</li>
                  <li>Limit any of our or your liabilities in any way that is not permitted under applicable law</li>
                  <li>Exclude any of our or your liabilities that may not be excluded under applicable law</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">2. Product Information</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>While we strive to provide accurate product information, we make no warranties about the completeness, reliability, and accuracy of this information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Product descriptions, images, and specifications are for informational purposes only</li>
                  <li>Colors may vary due to monitor settings and lighting conditions</li>
                  <li>Product availability is subject to change without notice</li>
                  <li>Prices are subject to change and may not be current</li>
                  <li>Size charts are approximate and may vary by manufacturer</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">3. Third-Party Links</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Our website may contain links to third-party websites that are not owned or controlled by Favee:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites</li>
                  <li>You acknowledge and agree that Favee shall not be responsible or liable for any damage or loss caused by or in connection with use of any third-party content</li>
                  <li>We strongly advise you to read the terms and conditions and privacy policy of any third-party website you visit</li>
                  <li>Links to third-party websites do not constitute an endorsement by Favee</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">4. Limitation of Liability</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>In no event shall Favee, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                  <li>Damages resulting from your use or inability to use the service</li>
                  <li>Damages resulting from any conduct or content of any third party on the service</li>
                  <li>Damages resulting from unauthorized access to or alteration of your transmissions or data</li>
                  <li>Any other matter relating to the service</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">5. Fashion and Style Advice</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Any fashion advice, styling tips, or recommendations provided on our website are for general informational purposes only:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Style advice is subjective and may not suit all individuals</li>
                  <li>Fashion trends and preferences vary by culture and personal taste</li>
                  <li>We do not guarantee that following our advice will achieve desired results</li>
                  <li>Individual results may vary based on body type, lifestyle, and preferences</li>
                  <li>Professional styling advice should be sought for specific occasions</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">6. User-Generated Content</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Our website may allow users to submit content such as reviews, comments, or photos:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>User-generated content represents the views of individual users, not Favee</li>
                  <li>We do not endorse or verify the accuracy of user-generated content</li>
                  <li>Users are responsible for the content they submit</li>
                  <li>We reserve the right to moderate, edit, or remove user content</li>
                  <li>We are not liable for any harm resulting from user-generated content</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">7. Technical Issues</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We strive to maintain website functionality, but we cannot guarantee uninterrupted access:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Website may be temporarily unavailable due to maintenance or technical issues</li>
                  <li>We are not responsible for any loss or inconvenience caused by website downtime</li>
                  <li>Some features may not work on all devices or browsers</li>
                  <li>We reserve the right to modify or discontinue any aspect of the website</li>
                  <li>Users are responsible for ensuring their devices meet minimum requirements</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">8. Health and Safety</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>While we prioritize product safety, customers should be aware of the following:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Allergic reactions to fabrics or materials are possible</li>
                  <li>Care instructions should be followed to maintain product integrity</li>
                  <li>Some products may contain small parts that could be a choking hazard</li>
                  <li>Proper sizing is important for comfort and safety</li>
                  <li>Customers with specific health concerns should consult healthcare providers</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">9. Intellectual Property</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>All content on this website is protected by intellectual property laws:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Unauthorized use of our content may violate copyright and trademark laws</li>
                  <li>We respect the intellectual property rights of others</li>
                  <li>Report any suspected copyright infringement to legal@favee.com</li>
                  <li>We reserve the right to remove content that infringes on third-party rights</li>
                  <li>Users are responsible for ensuring their content does not violate intellectual property laws</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">10. Governing Law</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>This disclaimer is governed by and construed in accordance with the laws of the jurisdiction in which Favee operates. Any disputes arising from this disclaimer will be subject to the exclusive jurisdiction of the courts in that jurisdiction.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">11. Severability</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If any provision of this disclaimer is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">12. Contact Information</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If you have any questions about this disclaimer, please contact us:</p>
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
