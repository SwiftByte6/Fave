# Razorpay Payment Integration Setup

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here

# Clerk Authentication (if using)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

## Razorpay Setup Steps

1. **Create Razorpay Account**
   - Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
   - Sign up for a new account or log in

2. **Get API Keys**
   - Go to Settings → API Keys
   - Generate new API keys
   - Copy the Key ID and Key Secret

3. **Configure Webhook (Recommended for Production)**
   - Go to Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
   - Select events: `payment.captured`, `payment.failed`
   - Copy the webhook secret and add it to your environment variables

## Database Schema Updates

Run the updated SQL commands in your Supabase SQL editor. The schema now includes:
- `payment_id` - Razorpay payment ID
- `payment_method` - Payment method used
- `razorpay_order_id` - Razorpay order ID

## Features Implemented

✅ **Razorpay Payment Integration**
- Secure payment processing
- Payment verification
- Order status updates
- Error handling

✅ **Enhanced Checkout Flow**
- Two-step checkout (Order → Payment)
- Payment button with Razorpay branding
- Real-time payment status updates

✅ **Database Integration**
- Orders stored with payment details
- JSON-based item storage
- Payment verification tracking

## Testing

1. Use Razorpay test mode for development
2. Test with Razorpay test cards:
   - Success: 4111 1111 1111 1111
   - Failure: 4000 0000 0000 0002
   - CVV: Any 3 digits
   - Expiry: Any future date

## Production Deployment

1. Switch to Razorpay live mode
2. Update environment variables with live keys
3. Configure webhook URLs for production
4. Test with real payment methods
