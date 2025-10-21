import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#FBF8F6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E7DE] p-8">
          <h1 className="dancing text-4xl text-[#f4b7c7] mb-2">Cookie Policy</h1>
          <p className="text-[#8A6F5C] text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">1. What Are Cookies?</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.</p>
                <p>Cookies contain information that is transferred to your computer's hard drive. They help us to improve our site and to deliver a better and more personalized service.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">2. Types of Cookies We Use</h2>
              <div className="text-[#8A6F5C] space-y-4">
                
                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Essential Cookies</h3>
                  <p className="mb-3">These cookies are necessary for the website to function properly and cannot be disabled.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Session management and security</li>
                    <li>Shopping cart functionality</li>
                    <li>User authentication</li>
                    <li>Form submissions</li>
                    <li>Load balancing</li>
                  </ul>
                </div>

                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Analytics Cookies</h3>
                  <p className="mb-3">These cookies help us understand how visitors interact with our website.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Google Analytics tracking</li>
                    <li>Page views and user behavior</li>
                    <li>Traffic sources and referrals</li>
                    <li>Performance monitoring</li>
                    <li>Error tracking</li>
                  </ul>
                </div>

                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Marketing Cookies</h3>
                  <p className="mb-3">These cookies are used to deliver relevant advertisements and track marketing campaigns.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Social media integration</li>
                    <li>Advertising networks</li>
                    <li>Retargeting campaigns</li>
                    <li>Email marketing tracking</li>
                    <li>Conversion tracking</li>
                  </ul>
                </div>

                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Preference Cookies</h3>
                  <p className="mb-3">These cookies remember your preferences and settings.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Language preferences</li>
                    <li>Currency settings</li>
                    <li>Display preferences</li>
                    <li>Location settings</li>
                    <li>Accessibility options</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">3. How We Use Cookies</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We use cookies for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Website Functionality:</strong> To ensure our website works properly and securely</li>
                  <li><strong>User Experience:</strong> To remember your preferences and provide personalized content</li>
                  <li><strong>Analytics:</strong> To understand how our website is used and improve performance</li>
                  <li><strong>Marketing:</strong> To deliver relevant advertisements and measure campaign effectiveness</li>
                  <li><strong>Security:</strong> To protect against fraud and unauthorized access</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">4. Third-Party Cookies</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We may use third-party services that set cookies on our website:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Analytics:</strong> Website traffic and user behavior analysis</li>
                  <li><strong>Social Media:</strong> Facebook, Instagram, Twitter integration</li>
                  <li><strong>Payment Processors:</strong> Razorpay for secure payment processing</li>
                  <li><strong>Email Marketing:</strong> Mailchimp for newsletter and promotional emails</li>
                  <li><strong>Customer Support:</strong> Live chat and help desk services</li>
                </ul>
                <p className="mt-4">These third parties have their own privacy policies and cookie practices.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">5. Cookie Duration</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Cookies have different lifespans:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                  <li><strong>Persistent Cookies:</strong> Remain on your device for a set period</li>
                  <li><strong>First-Party Cookies:</strong> Set by Favee and typically last 1-2 years</li>
                  <li><strong>Third-Party Cookies:</strong> Duration varies by provider</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">6. Managing Cookies</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>You can control cookies through your browser settings:</p>
                
                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Browser Settings</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Block all cookies</li>
                    <li>Allow only first-party cookies</li>
                    <li>Delete existing cookies</li>
                    <li>Set cookie preferences</li>
                    <li>Receive notifications before cookies are set</li>
                  </ul>
                </div>

                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Cookie Consent</h3>
                  <p>When you first visit our website, you'll see a cookie consent banner where you can:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Accept all cookies</li>
                    <li>Reject non-essential cookies</li>
                    <li>Customize your cookie preferences</li>
                    <li>Learn more about each cookie category</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">7. Impact of Disabling Cookies</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If you disable cookies, some features of our website may not work properly:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Shopping cart may not function correctly</li>
                  <li>User login and account features may be affected</li>
                  <li>Personalized content and recommendations may not be available</li>
                  <li>Website performance may be slower</li>
                  <li>Some third-party integrations may not work</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">8. Mobile Devices</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Cookies work similarly on mobile devices:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Mobile browsers support cookie management</li>
                  <li>App stores may have additional privacy controls</li>
                  <li>Location-based cookies may be used for local content</li>
                  <li>Push notification preferences may be stored</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">9. Updates to This Policy</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.</p>
                <p>We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">10. Contact Us</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If you have any questions about our use of cookies, please contact us:</p>
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
