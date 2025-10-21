import React from 'react';

export default function PaymentPolicy() {
  return (
    <div className="min-h-screen bg-[#FBF8F6] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-[#F0E7DE] p-8">
          <h1 className="dancing text-4xl text-[#f4b7c7] mb-2">Payment Policy</h1>
          <p className="text-[#8A6F5C] text-sm mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">1. Accepted Payment Methods</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We accept the following payment methods for your convenience:</p>
                
                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Credit & Debit Cards</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Visa</li>
                    <li>Mastercard</li>
                    <li>American Express</li>
                    <li>Discover</li>
                    <li>Diners Club</li>
                  </ul>
                </div>

                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Digital Wallets</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>PayPal</li>
                    <li>Apple Pay</li>
                    <li>Google Pay</li>
                    <li>Samsung Pay</li>
                  </ul>
                </div>

                <div className="bg-[#FBF8F6] p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-[#6f5a4d] mb-3">Bank Transfers</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>ACH Direct Debit</li>
                    <li>Wire Transfer (for large orders)</li>
                    <li>Bank Transfer (international)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">2. Payment Security</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Your payment information is protected with industry-standard security measures:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>SSL Encryption:</strong> All payment data is encrypted during transmission</li>
                  <li><strong>PCI DSS Compliance:</strong> We meet the highest security standards</li>
                  <li><strong>Tokenization:</strong> Sensitive payment data is tokenized for storage</li>
                  <li><strong>Fraud Detection:</strong> Advanced algorithms monitor for suspicious activity</li>
                  <li><strong>Secure Processing:</strong> Payments are processed through Razorpay, a trusted payment gateway</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">3. Payment Processing</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>When you make a payment:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your payment is processed immediately upon order confirmation</li>
                  <li>You'll receive an email confirmation with payment details</li>
                  <li>Funds are held until your order ships</li>
                  <li>For pre-orders, payment is processed when items become available</li>
                  <li>Failed payments will result in order cancellation</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">4. Currency and Pricing</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>All prices are displayed in USD unless otherwise specified:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Prices include applicable taxes where required</li>
                  <li>International customers may see prices in local currency</li>
                  <li>Exchange rates are updated regularly</li>
                  <li>Final charges may vary due to currency fluctuations</li>
                  <li>Customs duties and taxes are additional for international orders</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">5. Payment Authorization</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>By providing payment information, you authorize us to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Charge the full amount of your order</li>
                  <li>Process any applicable taxes and fees</li>
                  <li>Handle any payment disputes or chargebacks</li>
                  <li>Update payment methods for future orders (with your consent)</li>
                  <li>Process refunds to the original payment method</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">6. Failed Payments</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If your payment fails, we will:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Notify you immediately via email</li>
                  <li>Hold your order for 24 hours to allow payment retry</li>
                  <li>Provide alternative payment options</li>
                  <li>Cancel the order if payment cannot be processed</li>
                  <li>Release reserved inventory back to stock</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">7. Refunds and Chargebacks</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>Refund processing:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Refunds are processed to the original payment method</li>
                  <li>Processing time: 5-10 business days</li>
                  <li>Bank processing may take additional time</li>
                  <li>Partial refunds are available for partial returns</li>
                  <li>Store credit options are available for faster processing</li>
                </ul>
                <p className="mt-4"><strong>Chargebacks:</strong> We work with customers to resolve disputes before chargebacks occur. Contact us immediately if you have concerns about your order.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">8. Installment Options</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We offer flexible payment options for larger purchases:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Buy Now, Pay Later:</strong> Available through select providers</li>
                  <li><strong>Split Payments:</strong> Divide your purchase into multiple payments</li>
                  <li><strong>Layaway Program:</strong> Reserve items with a deposit</li>
                  <li><strong>Financing Options:</strong> 0% APR available for qualified customers</li>
                </ul>
                <p className="mt-4"><strong>Eligibility:</strong> Subject to credit approval and minimum purchase requirements.</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">9. International Payments</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>For international customers:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Multiple currency support</li>
                  <li>Local payment methods where available</li>
                  <li>Secure international processing</li>
                  <li>Currency conversion handled automatically</li>
                  <li>Additional fees may apply for certain payment methods</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">10. Payment Disputes</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>If you have a payment dispute:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact us immediately at payments@favee.com</li>
                  <li>Provide order number and payment details</li>
                  <li>We'll investigate and resolve within 5 business days</li>
                  <li>Documentation may be required for verification</li>
                  <li>We work with payment processors to resolve issues</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">11. Data Protection</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>We protect your payment information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Payment data is never stored on our servers</li>
                  <li>All transactions are processed through secure gateways</li>
                  <li>Regular security audits and compliance checks</li>
                  <li>Encryption of all sensitive data</li>
                  <li>Compliance with international data protection laws</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-[#6f5a4d] mb-4">12. Contact Us</h2>
              <div className="text-[#8A6F5C] space-y-4">
                <p>For payment-related questions or issues:</p>
                <div className="bg-[#FBF8F6] p-4 rounded-lg">
                  <p><strong>Email:</strong> payments@favee.com</p>
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
