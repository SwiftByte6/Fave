import React from 'react';

export const dynamic = 'force-dynamic';

export default function ReturnRefundPolicy() {
  return (
    <div className="min-h-screen bg-[#FBF8F6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E7DE] p-8">
          <h1 className="dancing text-4xl text-[#f4b7c7] mb-2">Return & Refund Policy</h1>
          <p className="text-[#8A6F5C] text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">1. Return Eligibility</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We want you to love your Favee purchase! You may return most items within 30 days of delivery for a full refund or exchange, provided they meet the following conditions:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Items must be in original, unworn condition</li>
                  <li>All original tags and labels must be attached</li>
                  <li>Items must not be damaged, altered, or washed</li>
                  <li>Items must be in original packaging</li>
                  <li>Proof of purchase (order number or receipt) is required</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">2. Items Not Eligible for Return</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>The following items cannot be returned:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Underwear, intimate apparel, and swimwear (for hygiene reasons)</li>
                  <li>Customized or personalized items</li>
                  <li>Items marked as "Final Sale" or "No Returns"</li>
                  <li>Items damaged by misuse or normal wear</li>
                  <li>Items returned after 30 days from delivery</li>
                  <li>Gift cards and digital products</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">3. How to Initiate a Return</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>To start a return, please follow these steps:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Log into your account and go to "Order History"</li>
                  <li>Find the order containing the item(s) you want to return</li>
                  <li>Click "Return Items" and select the items to return</li>
                  <li>Choose your reason for return</li>
                  <li>Select whether you want a refund or exchange</li>
                  <li>Print the prepaid return label</li>
                  <li>Package the items securely with the return label</li>
                  <li>Drop off at any authorized shipping location</li>
                </ol>
                <p className="mt-4"><strong>Alternative:</strong> Contact our customer service team at returns@favee.com or call +1 (555) 123-4567</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">4. Return Shipping</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We provide free return shipping for eligible returns within the United States. For international returns, return shipping costs are the customer's responsibility unless the return is due to our error.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Return labels are valid for 14 days from generation</li>
                  <li>Use the provided packaging when possible</li>
                  <li>Ensure items are properly secured to prevent damage</li>
                  <li>Keep your return tracking number for reference</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">5. Processing Returns</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Once we receive your return:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We'll inspect the items within 3-5 business days</li>
                  <li>You'll receive an email confirmation once processed</li>
                  <li>Refunds are processed within 5-7 business days</li>
                  <li>Exchanges are shipped within 2-3 business days</li>
                </ul>
                <p className="mt-4"><strong>Processing Time:</strong> Please allow 7-10 business days for the entire return process.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">6. Refund Methods</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Refunds will be issued to the original payment method used for the purchase:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Credit/Debit Cards:</strong> 5-7 business days</li>
                  <li><strong>PayPal:</strong> 3-5 business days</li>
                  <li><strong>Bank Transfer:</strong> 7-10 business days</li>
                  <li><strong>Store Credit:</strong> Immediate (if requested)</li>
                </ul>
                <p className="mt-4"><strong>Note:</strong> Shipping charges are non-refundable unless the return is due to our error.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">7. Exchanges</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We offer free exchanges for size or color changes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Exchanges are subject to availability</li>
                  <li>Price differences will be charged or refunded accordingly</li>
                  <li>If the desired item is out of stock, we'll process a refund</li>
                  <li>Exchange shipping is free for domestic orders</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">8. Damaged or Defective Items</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If you receive a damaged or defective item, please contact us immediately:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Take photos of the damage or defect</li>
                  <li>Contact us within 48 hours of delivery</li>
                  <li>We'll provide a prepaid return label</li>
                  <li>Full refund or replacement will be provided</li>
                  <li>No return shipping charges apply</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">9. International Returns</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>For international customers:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Return shipping costs are the customer's responsibility</li>
                  <li>Customs duties and taxes are non-refundable</li>
                  <li>Returns must be sent to our designated international return center</li>
                  <li>Processing time may be extended due to customs</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">10. Size Guide and Fit</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>To help you choose the right size:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refer to our detailed size guide on each product page</li>
                  <li>Check the model's measurements and what size they're wearing</li>
                  <li>Contact our customer service for personalized sizing advice</li>
                  <li>Consider ordering multiple sizes if unsure</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">11. Contact Us</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If you have any questions about returns or refunds, please contact us:</p>
                <div className="bg-[#FBF8F6] p-4 rounded-lg">
                  <p><strong>Email:</strong> returns@favee.com</p>
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
