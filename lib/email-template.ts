// lib/email-template.ts

export interface OrderItem {
  title: string;
  quantity: number;
  price: number;
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
}

export function orderConfirmationTemplate({
  customerName,
  orderId,
  orderNumber,
  items,
  totalAmount,
  address,
}: OrderConfirmationTemplateProps): string {
  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Thank you for your order, ${customerName}!</h2>
      <p>Your order <b>#${orderNumber ?? orderId}</b> has been received.</p>

      <h3>Order Details:</h3>
      <ul>
        ${items
          .map(
            (item) =>
              `<li>${item.title} × ${item.quantity} — ₹${item.price}</li>`
          )
          .join("")}
      </ul>

      <p><b>Total:</b> ₹${totalAmount}</p>

      <h3>Shipping Address:</h3>
      <p>
        ${address.name}<br/>
        ${address.address}<br/>
        ${address.city}, ${address.pincode}, ${address.country}<br/>
        Phone: ${address.phone}
      </p>

      <p>We will notify you when your order ships.</p>
      <p>Thank you for shopping with <b>Favee</b>!</p>
    </div>
  `;
}
