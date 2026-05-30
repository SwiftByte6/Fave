import { Resend } from "resend";
import { orderConfirmationTemplate } from "./email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

function extractErrorDetails(err: any) {
  try {
    if (!err) return null;
    if (err.response) return err.response;
    if (err.body) return err.body;
    if (err.message) return { message: err.message };
    return String(err);
  } catch (e) {
    return String(err);
  }
}

/* ----------------------------------
   TYPES
----------------------------------- */

interface OrderItem {
  title: string;
  price: number;
  quantity: number;
  images?: string[];
}

interface Address {
  name: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
  phone: string;
}

interface OrderRecordLike {
  id: string;
  name?: string;
  email?: string;
  customer_email?: string;
  registered_email?: string;
  total_amount?: number | string;
  items?: OrderItem[] | any[];
  address?: string;
  city?: string;
  pincode?: string;
  country?: string;
  phone?: string;
  order_number?: string;
}

export interface OrderEmailData {
  orderId: string;
  orderNumber?: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: OrderItem[];
  paymentId: string;
  address: Address;
}

export function mapOrderToEmailData(
  order: OrderRecordLike,
  paymentId: string,
  fallbackOrderNumber?: string
): OrderEmailData {
  const customerEmail = order.email || order.customer_email || order.registered_email;

  if (!customerEmail) {
    throw new Error('Order email address is missing');
  }

  return {
    orderId: order.id,
    orderNumber: order.order_number || fallbackOrderNumber,
    customerName: order.name || 'Customer',
    customerEmail,
    totalAmount: Number(order.total_amount) || 0,
    items: Array.isArray(order.items) ? (order.items as OrderItem[]) : [],
    paymentId,
    address: {
      name: order.name || 'Customer',
      address: order.address || '',
      city: order.city || '',
      pincode: order.pincode || '',
      country: order.country || 'India',
      phone: order.phone || '',
    },
  };
}

export type ShippingStatus =
  | "picked_up"
  | "out_for_delivery"
  | "delivered";

export interface ShippingUpdateEmailData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingStatus: ShippingStatus;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

/* ----------------------------------
   ORDER CONFIRMATION EMAIL
----------------------------------- */

export async function sendOrderConfirmationEmail(
  data: OrderEmailData
) {
  try {
    const html = orderConfirmationTemplate(data);

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? "noreply@favee.com";
    const fromName =
      process.env.RESEND_FROM_NAME ?? "Fave Store";

    const internalNotify = 'info@favee.shop';

    // 1) Send to customer
    const customerResponse = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: data.customerEmail,
      subject: `Order Confirmation - #${data.orderNumber ?? data.orderId}`,
      html,
    });

    // 2) Send a separate internal notification so the subject/body can differ
    let internalResponse: any = null;
    try {
      const internalSubject = `New order has appeared - #${data.orderNumber ?? data.orderId}`;
      // reuse the same HTML for now; subject clarifies this is an internal notification
      internalResponse = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: internalNotify,
        subject: internalSubject,
        html,
      });
    } catch (err) {
      const details = extractErrorDetails(err);
      console.error('❌ Internal order notification error:', err, 'details:', details);
    }

    return {
      success: true,
      emailId: customerResponse.data?.id ?? null,
      internalEmailId: internalResponse?.data?.id ?? null,
    };
  } catch (error) {
    const details = extractErrorDetails(error);
    console.error("❌ Order email error:", error, "details:", details);
    return { success: false, error: error instanceof Error ? error.message : String(error), details };
  }
}

/* ----------------------------------
   SHIPPING UPDATE EMAIL
----------------------------------- */

export async function sendShippingUpdateEmail(
  data: ShippingUpdateEmailData
) {
  try {
    const html = generateShippingUpdateHTML(data);

    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? "noreply@favee.com";
    const fromName =
      process.env.RESEND_FROM_NAME ?? "Fave Store";

    const response = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: data.customerEmail,
      subject: `${getShippingSubject(data.shippingStatus)} - Order #${data.orderNumber}`,
      html,
    });

    return {
      success: true,
      emailId: response.data?.id ?? null,
    };
  } catch (error) {
    const details = extractErrorDetails(error);
    console.error("❌ Shipping email error:", error, "details:", details);
    return { success: false, error: error instanceof Error ? error.message : String(error), details };
  }
}

/* ----------------------------------
   HELPERS
----------------------------------- */

function getShippingSubject(status: ShippingStatus): string {
  const map: Record<ShippingStatus, string> = {
    picked_up: "Your order has been picked up",
    out_for_delivery: "Your order is out for delivery",
    delivered: "Your order has been delivered",
  };
  return map[status];
}

function generateShippingUpdateHTML(
  data: ShippingUpdateEmailData
): string {
  const statusConfig: Record<
    ShippingStatus,
    { title: string; message: string; color: string }
  > = {
    picked_up: {
      title: "📦 Order Picked Up",
      message:
        "Your order is with our courier partner and on the way.",
      color: "#3b82f6",
    },
    out_for_delivery: {
      title: "🚚 Out for Delivery",
      message:
        "Your package will be delivered today.",
      color: "#f59e0b",
    },
    delivered: {
      title: "✅ Delivered",
      message:
        "Your package has been successfully delivered.",
      color: "#10b981",
    },
  };

  const status = statusConfig[data.shippingStatus];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="font-family: Arial, sans-serif; background:#f9fafb; margin:0; padding:0;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;">
    <div style="background:${status.color};padding:24px;color:#fff;text-align:center;">
      <h1 style="margin:0;">FAVEE</h1>
      <p style="margin:8px 0 0;">${status.title}</p>
    </div>

    <div style="padding:24px;">
      <p>${status.message}</p>

      <p><b>Order:</b> #${data.orderNumber}</p>
      ${data.awbCode ? `<p><b>AWB:</b> ${data.awbCode}</p>` : ""}
      ${data.courierName ? `<p><b>Courier:</b> ${data.courierName}</p>` : ""}
      ${
        data.estimatedDelivery
          ? `<p><b>Estimated Delivery:</b> ${new Date(
              data.estimatedDelivery
            ).toLocaleDateString()}</p>`
          : ""
      }

      ${
        data.trackingUrl
          ? `<a href="${data.trackingUrl}" style="display:inline-block;margin-top:20px;padding:12px 20px;background:${status.color};color:#fff;text-decoration:none;border-radius:6px;">Track Order</a>`
          : ""
      }
    </div>

    <div style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;">
      © ${new Date().getFullYear()} Favee. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
}
