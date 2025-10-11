import nodemailer from 'nodemailer'

// Create Nodemailer transporter
const createTransporter = async () => {
  // Option 1: Use Gmail SMTP if credentials are provided
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    })
  }

  // Option 2: For development/testing without real credentials, use Ethereal Email
  if (process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST) {
    const testAccount = await nodemailer.createTestAccount()
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })
  }

  // Option 3: For production, use configured SMTP
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

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
    const transporter = await createTransporter()
    const emailHtml = generateOrderConfirmationHTML(data)
    
    // Email configuration - use Gmail user if Gmail SMTP is configured
    const fromEmail = process.env.GMAIL_USER || process.env.SMTP_FROM_EMAIL || 'noreply@favee.com'
    const fromName = process.env.SMTP_FROM_NAME || 'Fave Store'
    
    const mailOptions = {
      from: `${fromName} <${fromEmail}>`,
      to: data.customerEmail,
      subject: `Order Confirmation - #${data.orderNumber || data.orderId}`,
      html: emailHtml,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    
    console.log('✅ Order confirmation email sent to:', data.customerEmail)
    
    return { 
      success: true, 
      emailId: info.messageId,
      message: `Email sent successfully to ${data.customerEmail}`
    }
  } catch (error: any) {
    console.error('❌ Email sending error:', error.message)
    return { success: false, error: error.message }
  }
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
          <h1 style="margin: 0; color: #6f5a4d; font-size: 28px; font-weight: 700;">Elegance Boutique</h1>
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
            <p style="margin: 0; color: #6f5a4d; font-size: 16px; font-weight: 600;">Contact us at support@eleganceboutique.com</p>
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
