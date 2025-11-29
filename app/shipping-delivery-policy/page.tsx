import React from 'react';

export default function ShippingDeliveryPolicy() {
  return (
    <div className="min-h-screen bg-[#FBF8F6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E7DE] p-8">
          <h1 className="dancing text-4xl text-[#f4b7c7] mb-2">Shipping & Delivery Policy</h1>
          <p className="text-[#8A6F5C] text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">1. Shipping Options</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We offer several shipping options to meet your needs:</p>
                
                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Standard Shipping</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Delivery Time:</strong> 5-7 business days</li>
                    <li><strong>Cost:</strong> ₹299 (Free on orders over ₹3999)</li>
                    <li><strong>Tracking:</strong> Included</li>
                    <li><strong>Signature Required:</strong> No</li>
                  </ul>
                </div>

                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Express Shipping</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Delivery Time:</strong> 2-3 business days</li>
                    <li><strong>Cost:</strong> ₹649</li>
                    <li><strong>Tracking:</strong> Included</li>
                    <li><strong>Signature Required:</strong> No</li>
                  </ul>
                </div>

                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Overnight Shipping</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Delivery Time:</strong> Next business day</li>
                    <li><strong>Cost:</strong> ₹1249</li>
                    <li><strong>Tracking:</strong> Included</li>
                    <li><strong>Signature Required:</strong> Yes</li>
                    <li><strong>Cut-off Time:</strong> 2 PM EST</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">2. Processing Time</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>All orders are processed within 1-2 business days (Monday-Friday, excluding holidays):</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Orders placed before 2 PM EST are processed the same day</li>
                  <li>Orders placed after 2 PM EST are processed the next business day</li>
                  <li>Weekend orders are processed on the following Monday</li>
                  <li>Holiday orders may experience delays</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">3. Shipping Destinations</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We currently ship to the following locations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>United States:</strong> All 50 states and territories</li>
                  <li><strong>Canada:</strong> All provinces and territories</li>
                  <li><strong>International:</strong> Select countries (see checkout for availability)</li>
                </ul>
                <p className="mt-4"><strong>Note:</strong> International shipping rates and delivery times vary by destination.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">4. Order Tracking</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Once your order ships, you'll receive tracking information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email confirmation with tracking number</li>
                  <li>Real-time tracking updates</li>
                  <li>Estimated delivery date</li>
                  <li>Delivery confirmation</li>
                </ul>
                <p className="mt-4">You can also track your order by logging into your account or using the tracking number on the carrier's website.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">5. Delivery Attempts</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Our carriers will make delivery attempts as follows:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Standard/Express:</strong> 3 delivery attempts</li>
                  <li><strong>Overnight:</strong> 1 delivery attempt (signature required)</li>
                  <li>After failed attempts, packages are held at the local carrier facility</li>
                  <li>You'll receive notification to pick up or reschedule delivery</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">6. Address Requirements</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>To ensure successful delivery, please provide:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Complete street address (no P.O. Boxes for overnight delivery)</li>
                  <li>Apartment/unit number if applicable</li>
                  <li>City, state, and ZIP code</li>
                  <li>Valid phone number for delivery coordination</li>
                  <li>Special delivery instructions if needed</li>
                </ul>
                <p className="mt-4"><strong>Important:</strong> Incorrect addresses may result in delivery delays or returns.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">7. International Shipping</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>For international orders:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery times: 7-21 business days</li>
                  <li>Customs duties and taxes are the customer's responsibility</li>
                  <li>Some items may be restricted in certain countries</li>
                  <li>Additional documentation may be required</li>
                  <li>International returns are subject to different policies</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">8. Shipping Restrictions</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Certain items have shipping restrictions:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fragile items require special handling</li>
                  <li>High-value items may require signature confirmation</li>
                  <li>Some items cannot be shipped internationally</li>
                  <li>Hazardous materials are prohibited</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">9. Weather and Holiday Delays</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Delivery may be delayed due to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Severe weather conditions</li>
                  <li>Natural disasters</li>
                  <li>Holiday shipping volume</li>
                  <li>Carrier service disruptions</li>
                </ul>
                <p className="mt-4">We'll notify you of any significant delays and work to minimize the impact on your delivery.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">10. Lost or Stolen Packages</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If your package is lost or stolen:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact us immediately at shipping@favee.com</li>
                  <li>We'll file a claim with the carrier</li>
                  <li>Replacement or refund will be provided</li>
                  <li>Investigation may take 5-10 business days</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">11. Free Shipping</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Enjoy free standard shipping on orders over ₹3999:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Automatically applied at checkout</li>
                  <li>Valid for standard shipping only</li>
                  <li>Not applicable to express or overnight shipping</li>
                  <li>Valid for domestic orders only</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">12. Contact Us</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>For shipping questions or concerns:</p>
                <div className="bg-[#FBF8F6] p-4 rounded-lg">
                  <p><strong>Email:</strong> shipping@favee.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Live Chat:</strong> Available on our website</p>
                  <p><strong>Address:</strong> Favee Fashion House, 123 Fashion Street, Style City, SC 12345</p>
                </div>
                <p className="mt-4"><strong>Business Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
