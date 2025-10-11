# 🚀 Complete Razorpay Payment Flow Setup Guide

## 📋 Overview

This guide covers the complete Razorpay payment integration with:
- ✅ Order creation with proper schema
- ✅ Payment processing and verification
- ✅ Email notifications using Resend
- ✅ Webhook handling for payment events
- ✅ Order success page with details

## 🗄️ Database Setup

### 1. Run the Orders Table Schema

Execute the SQL in `orders-table-schema.sql` in your Supabase SQL editor:

```sql
-- This creates the complete orders table with all required columns
-- Includes payment tracking, order numbers, and proper constraints
```

### 2. Verify Table Structure

The orders table includes these key columns:
- `id` - UUID primary key
- `user_id` - Clerk user ID
- `order_number` - Human-readable order number (ORD-XXXXXX)
- `total_amount` - Order total
- `status` - Order status (pending, success, cancelled, etc.)
- `payment_status` - Payment status (pending, success, failed, refunded)
- `payment_id` - Razorpay payment ID
- `razorpay_order_id` - Razorpay order ID
- `razorpay_signature` - Payment signature
- `items` - JSON array of order items
- `name`, `email`, `phone`, `address` - Customer details

## 🔧 Environment Variables

Add these to your `.env.local`:

```env
# Existing variables...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# NEW: Resend Email Service
RESEND_API_KEY=re_your_resend_api_key
```

## 📧 Email Setup (Resend)

### 1. Create Resend Account
- Go to [resend.com](https://resend.com)
- Sign up and verify your account
- Get your API key from the dashboard

### 2. Verify Domain (Optional)
- Add your domain for custom "from" addresses
- Or use the default Resend domain for testing

### 3. Update Email Service
In `lib/email-service.ts`, update the "from" address:
```typescript
from: 'Elegance Boutique <orders@yourdomain.com>', // Replace with your domain
```

## 🔄 Payment Flow

### 1. Order Creation
```javascript
// User fills checkout form
// Order created with status: 'pending'
// Razorpay order created
// Payment modal opens
```

### 2. Payment Processing
```javascript
// User completes payment
// Payment verification happens
// Order status updated to 'success'
// Email sent to customer
// Cart cleared
// Redirect to success page
```

### 3. Webhook Handling
```javascript
// Razorpay sends webhook events
// Payment captured/failed events handled
// Order status updated accordingly
// Email sent for successful payments
```

## 🧪 Testing

### 1. Test Payment Flow
1. Add items to cart
2. Go to checkout
3. Fill in details
4. Click "Proceed to Payment"
5. Use Razorpay test cards:
   - Success: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date

### 2. Test Email Notifications
- Check your email after successful payment
- Verify order details are correct
- Check spam folder if not received

### 3. Test Webhook (Optional)
- Set up webhook URL in Razorpay dashboard
- Use ngrok for local testing
- Monitor webhook events

## 🐛 Troubleshooting

### Common Issues:

1. **Payment Verification Fails**
   - Check Razorpay environment variables
   - Verify signature calculation
   - Check order ID matching

2. **Email Not Sending**
   - Verify RESEND_API_KEY is set
   - Check Resend dashboard for errors
   - Verify "from" domain is correct

3. **Order Not Updating**
   - Check database permissions
   - Verify order ID exists
   - Check Supabase logs

4. **Webhook Not Working**
   - Verify webhook secret
   - Check webhook URL is accessible
   - Monitor webhook events in Razorpay dashboard

## 📱 Features Included

### ✅ Complete Payment Flow
- Order creation with proper validation
- Razorpay payment integration
- Payment verification with signature
- Order status updates

### ✅ Email Notifications
- Beautiful HTML email templates
- Order details and items
- Customer information
- Payment confirmation

### ✅ Database Integration
- Proper order schema
- Payment tracking
- Order history
- User-specific orders

### ✅ Error Handling
- Payment failures
- Network errors
- Validation errors
- Graceful fallbacks

### ✅ User Experience
- Loading states
- Success/error messages
- Order confirmation page
- Cart management

## 🚀 Production Deployment

### 1. Environment Variables
- Set production Razorpay keys
- Configure production Resend
- Update webhook URLs

### 2. Database
- Run schema in production Supabase
- Set up proper RLS policies
- Configure backups

### 3. Monitoring
- Set up error tracking
- Monitor payment success rates
- Track email delivery

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check server logs
3. Verify environment variables
4. Test with Razorpay test cards
5. Check Resend dashboard for email issues

## 🎉 Success!

Your Razorpay payment flow is now complete with:
- Secure payment processing
- Email notifications
- Order tracking
- Professional user experience

Happy selling! 🛍️
