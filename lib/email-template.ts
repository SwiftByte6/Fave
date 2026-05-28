// lib/email-template.ts

export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  images?: string[];
}

export interface Address {
  name: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
  phone: string;
}

export interface OrderConfirmationTemplateProps {
  customerName: string;
  orderId?: string;
  orderNumber?: string;
  items: OrderItem[];
  totalAmount: number;
  address: Address;
  paymentId?: string;
}

export function orderConfirmationTemplate({
  customerName,
  orderId,
  orderNumber,
  items,
  totalAmount,
  address,
  paymentId,
}: OrderConfirmationTemplateProps): string {
  const formattedTotal = formatCurrency(totalAmount);
  const orderLabel = orderNumber ?? orderId ?? 'N/A';

  return `
    <div style="margin:0;padding:0;background:#f6f1ea;">
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;font-family:Arial,sans-serif;color:#2f2a27;">
        <div style="background:#ffffff;border:1px solid #eadfd5;border-radius:24px;overflow:hidden;box-shadow:0 16px 48px rgba(74,52,41,0.08);">
          <div style="padding:32px;background:linear-gradient(135deg,#6f5a4d 0%,#8a6f5f 100%);color:#ffffff;">
            <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.85;">Payment confirmed</p>
            <h1 style="margin:0;font-size:30px;line-height:1.2;">Thank you for your order, ${customerName}.</h1>
            <p style="margin:12px 0 0;font-size:16px;line-height:1.6;max-width:520px;opacity:0.95;">Your payment was successful and your order is now being prepared. We have sent this confirmation to your registered email address.</p>
          </div>

          <div style="padding:28px;">
            <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:24px;">
              <div style="flex:1;min-width:180px;background:#fbf8f5;border:1px solid #efe3d8;border-radius:18px;padding:16px;">
                <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#8b6f5d;">Order number</div>
                <div style="margin-top:8px;font-size:18px;font-weight:700;">#${orderLabel}</div>
              </div>
              <div style="flex:1;min-width:180px;background:#fbf8f5;border:1px solid #efe3d8;border-radius:18px;padding:16px;">
                <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#8b6f5d;">Payment reference</div>
                <div style="margin-top:8px;font-size:18px;font-weight:700;word-break:break-all;">${paymentId ?? 'Processing'}</div>
              </div>
            </div>

            <h2 style="margin:0 0 16px;font-size:20px;">Items in your order</h2>
            <div style="display:grid;gap:14px;">
              ${items
                .map((item) => {
                  const image = item.images?.[0];
                  return `
                    <div style="display:flex;gap:14px;align-items:flex-start;padding:14px;border:1px solid #efe3d8;border-radius:18px;background:#fffdfb;">
                      ${image ? `<img src="${image}" alt="${item.title}" style="width:84px;height:84px;object-fit:cover;border-radius:14px;border:1px solid #eadfd5;" />` : `<div style="width:84px;height:84px;border-radius:14px;background:#f2e7de;border:1px solid #eadfd5;"></div>`}
                      <div style="flex:1;min-width:0;">
                        <div style="font-size:16px;font-weight:700;line-height:1.4;">${item.title}</div>
                        <div style="margin-top:6px;color:#6b5a4e;font-size:14px;">Qty ${item.quantity}</div>
                      </div>
                      <div style="font-size:16px;font-weight:700;white-space:nowrap;">${formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  `;
                })
                .join('')}
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:22px;padding-top:18px;border-top:1px solid #eadfd5;">
              <span style="font-size:16px;color:#6b5a4e;">Total paid</span>
              <span style="font-size:24px;font-weight:800;">${formattedTotal}</span>
            </div>

            <div style="display:grid;gap:10px;margin-top:28px;">
              <h2 style="margin:0 0 6px;font-size:20px;">Shipping address</h2>
              <div style="line-height:1.7;color:#4a403a;">
                ${address.name}<br/>
                ${address.address}<br/>
                ${address.city}, ${address.pincode}, ${address.country}<br/>
                Phone: ${address.phone}
              </div>
            </div>

            <p style="margin:28px 0 0;color:#6b5a4e;line-height:1.7;">We will notify you again when your order ships. If you need to resend this email, our support team can use your order number to send another copy.</p>
          </div>

          <div style="padding:18px 28px 28px;background:#f9f4ee;color:#8b6f5d;font-size:12px;line-height:1.6;text-align:center;">
            © ${new Date().getFullYear()} Favee. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  `;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}
