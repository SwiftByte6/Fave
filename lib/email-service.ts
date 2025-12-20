import { Resend } from 'resend';
import { orderConfirmationTemplate } from './email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  totalAmount: number
  items: Array<{
    title: string
    price: number
    quantity: number
    images?: string[]
  }>
  paymentId: string
  orderNumber?: string
  address: {
    name: string
    address: string
    city: string
    pincode: string
    country: string
    phone: string
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const html = orderConfirmationTemplate(data);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@favee.com';
    const fromName = process.env.RESEND_FROM_NAME || 'Fave Store';
    const subject = `Order Confirmation - #${data.orderNumber || data.orderId}`;
    const to = data.customerEmail;

    const response = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to,
      subject,
      html,
    });

    if (response.error) {
      throw new Error(response.error.message || 'Resend API error');
    }

    console.log('✅ Order confirmation email sent to:', to);
    return {
      success: true,
      emailId: response.id,
      message: `Email sent successfully to ${to}`,
    };
  } catch (error: any) {
    console.error('❌ Email sending error:', error.message);
    return { success: false, error: error.message };
  }
}

interface ShippingUpdateEmailData {
  orderId: string
  customerName: string
  customerEmail: string
  orderNumber: string
  shippingStatus: string
  awbCode?: string
  courierName?: string
  trackingUrl?: string
  estimatedDelivery?: string
}

export async function sendShippingUpdateEmail(data: ShippingUpdateEmailData) {
  try {
    const transporter = await createTransporter()
    const emailHtml = generateShippingUpdateHTML(data)
    
    const fromEmail = process.env.GMAIL_USER || process.env.SMTP_FROM_EMAIL || 'noreply@favee.com'
    const fromName = process.env.SMTP_FROM_NAME || 'FAVEE'
    
    const statusMessages = {
      picked_up: 'Your order has been picked up!',
      out_for_delivery: 'Your order is out for delivery!', 
      delivered: 'Your order has been delivered!'
    }
    
    const mailOptions = {
      from: `${fromName} <${fromEmail}>`,
      to: data.customerEmail,
      subject: `${statusMessages[data.shippingStatus as keyof typeof statusMessages] || 'Shipping Update'} - Order #${data.orderNumber}`,
      html: emailHtml,
    }

    const info = await transporter.sendMail(mailOptions)
    return { success: true, emailId: info.messageId }
  } catch (error: any) {
    console.error('Shipping update email error:', error)
    return { success: false, error: error.message }
  }
}

function generateShippingUpdateHTML(data: ShippingUpdateEmailData): string {
  const statusMessages = {
    picked_up: { 
      title: '📦 Your order has been picked up!',
      message: 'Great news! Your order is now with our courier partner and on its way to you.',
      color: '#3b82f6'
    },
    out_for_delivery: { 
      title: '🚚 Your order is out for delivery!',
      message: 'Your package is on the delivery vehicle and will reach you soon.',
      color: '#f59e0b'
    },
    delivered: { 
      title: '✅ Your order has been delivered!',
      message: 'Your package has been successfully delivered. We hope you love your purchase!',
      color: '#10b981'
    }
  }

  const statusInfo = statusMessages[data.shippingStatus as keyof typeof statusMessages] || {
    title: '📋 Shipping Status Update',
    message: `Your order status has been updated to: ${data.shippingStatus}`,
    color: '#6b7280'
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shipping Update</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fbf8f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f4dcdc 0%, #f0e7de 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: #6f5a4d; font-size: 28px; font-weight: 700;">FAVEE</h1>
          <p style="margin: 10px 0 0 0; color: #8a6f5c; font-size: 16px;">Shipping Update</p>
        </div>

        <!-- Status Update -->
        <div style="padding: 30px;">
          <div style="background-color: ${statusInfo.color}20; padding: 20px; border-radius: 10px; margin-bottom: 30px; border-left: 4px solid ${statusInfo.color};">
            <h2 style="margin: 0 0 15px 0; color: ${statusInfo.color}; font-size: 24px;">${statusInfo.title}</h2>
            <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.5;">
              Hi ${data.customerName}, ${statusInfo.message}
            </p>
          </div>

          <!-- Order & Tracking Info -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #6f5a4d; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #f4dcdc; padding-bottom: 10px;">Tracking Information</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #8a6f5c; font-size: 14px; font-weight: 600;">Order Number</p>
                <p style="margin: 0; color: #6f5a4d; font-size: 16px; font-weight: 700;">#${data.orderNumber}</p>
              </div>
              ${data.awbCode ? `
              <div>
                <p style="margin: 0 0 5px 0; color: #8a6f5c; font-size: 14px; font-weight: 600;">AWB Number</p>
                <p style="margin: 0; color: #6f5a4d; font-size: 16px; font-weight: 700;">${data.awbCode}</p>
              </div>
              ` : ''}
            </div>

            ${data.courierName ? `
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; color: #8a6f5c; font-size: 14px; font-weight: 600;">Courier Partner</p>
              <p style="margin: 0; color: #6f5a4d; font-size: 16px; font-weight: 700;">${data.courierName}</p>
            </div>
            ` : ''}

            ${data.estimatedDelivery ? `
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 5px 0; color: #8a6f5c; font-size: 14px; font-weight: 600;">Expected Delivery</p>
              <p style="margin: 0; color: #6f5a4d; font-size: 16px; font-weight: 700;">${new Date(data.estimatedDelivery).toLocaleDateString()}</p>
            </div>
            ` : ''}

            ${data.trackingUrl ? `
            <div style="text-align: center; margin-top: 30px;">
              <a href="${data.trackingUrl}" target="_blank" style="display: inline-block; background-color: ${statusInfo.color}; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Track Your Package →
              </a>
            </div>
            ` : ''}
          </div>

          <!-- Contact Info -->}
          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
            <p style="margin: 0 0 10px 0; color: #8a6f5c; font-size: 14px;">Questions about your order?</p>
            <p style="margin: 0; color: #6f5a4d; font-size: 16px; font-weight: 600;">Contact us at support@favee.com</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #6f5a4d; padding: 20px; text-align: center;">
          <p style="margin: 0; color: white; font-size: 14px;">© 2024 Elegance Boutique. All rights reserved.</p>
          <p style="margin: 10px 0 0 0; color: #f4dcdc; font-size: 12px;">Thank you for choosing Elegance Boutique!</p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateOrderConfirmationHTML(data: OrderEmailData): string {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #f0f0f0;">
        <div style="display: flex; align-items: center;">
          ${item.images && item.images.length > 0 ? 
            `<img src="${item.images[0]}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">` : 
            `<div style="width: 60px; height: 60px; background: #f4dcdc; border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center; color: #6f5a4d; font-size: 12px;">No Image</div>`
          }
          <div>
            <h4 style="margin: 0; color: #6f5a4d; font-size: 16px;">${item.title}</h4>
            <p style="margin: 5px 0 0 0; color: #8a6f5c; font-size: 14px;">Quantity: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #f0f0f0; text-align: right; color: #6f5a4d; font-weight: 600;">
        ₹${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fbf8f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f4dcdc 0%, #f0e7de 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: #6f5a4d; font-size: 28px; font-weight: 700;">FAVEE</h1>
          <p style="margin: 10px 0 0 0; color: #8a6f5c; font-size: 16px;">Thank you for your order!</p>
        </div>

        <!-- Order Confirmation -->
        <div style="padding: 30px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 30px; border-left: 4px solid #f4dcdc;">
            <h2 style="margin: 0 0 15px 0; color: #6f5a4d; font-size: 24px;">Order Confirmed! 🎉</h2>
            <p style="margin: 0; color: #8a6f5c; font-size: 16px; line-height: 1.5;">
              Hi ${data.customerName}, your order has been successfully placed and payment has been processed.
            </p>
          </div>

          <!-- Order Details -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #6f5a4d; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #f4dcdc; padding-bottom: 10px;">Order Details</h3>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #8a6f5c; font-size: 14px; font-weight: 600;">Order Number</p>
                <p style="margin: 0; color: #6f5a4d; font-size: 16px; font-weight: 700;">#${data.orderNumber || data.orderId}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #8a6f5c; font-size: 14px; font-weight: 600;">Payment ID</p>
                <p style="margin: 0; color: #6f5a4d; font-size: 16px; font-weight: 700;">${data.paymentId}</p>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #6f5a4d; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #f4dcdc; padding-bottom: 10px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              <thead>
                <tr style="background-color: #f4dcdc;">
                  <th style="padding: 15px; text-align: left; color: #6f5a4d; font-weight: 600;">Item</th>
                  <th style="padding: 15px; text-align: right; color: #6f5a4d; font-weight: 600;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background-color: #f8f9fa;">
                  <td style="padding: 20px; text-align: right; color: #6f5a4d; font-weight: 700; font-size: 18px;" colspan="2">
                    Total: ₹${data.totalAmount.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Shipping Address -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #6f5a4d; font-size: 20px; margin-bottom: 20px; border-bottom: 2px solid #f4dcdc; padding-bottom: 10px;">Shipping Address</h3>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #f4dcdc;">
              <p style="margin: 0 0 5px 0; color: #6f5a4d; font-weight: 600; font-size: 16px;">${data.address.name}</p>
              <p style="margin: 0 0 5px 0; color: #8a6f5c; font-size: 14px;">${data.address.address}</p>
              <p style="margin: 0 0 5px 0; color: #8a6f5c; font-size: 14px;">${data.address.city}, ${data.address.pincode}</p>
              <p style="margin: 0 0 5px 0; color: #8a6f5c; font-size: 14px;">${data.address.country}</p>
              <p style="margin: 0; color: #8a6f5c; font-size: 14px;">Phone: ${data.address.phone}</p>
            </div>
          </div>

          <!-- Next Steps -->
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 10px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.6;">
              <li>Your order is being processed and will be shipped within 1-2 business days</li>
              <li>You will receive a tracking number once your order is shipped</li>
              <li>Estimated delivery time: 3-5 business days</li>
              <li>You can track your order status in your account dashboard</li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
            <p style="margin: 0 0 10px 0; color: #8a6f5c; font-size: 14px;">Need help with your order?</p>
            <p style="margin: 0; color: #6f5a4d; font-size: 16px; font-weight: 600;">Contact us at support@favee.com</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #6f5a4d; padding: 20px; text-align: center;">
          <p style="margin: 0; color: white; font-size: 14px;">© 2024 Elegance Boutique. All rights reserved.</p>
          <p style="margin: 10px 0 0 0; color: #f4dcdc; font-size: 12px;">Thank you for choosing Elegance Boutique!</p>
        </div>
      </div>
    </body>
    </html>
  `
}
