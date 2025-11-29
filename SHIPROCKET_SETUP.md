# Environment Variables for Shiprocket Integration

Add these environment variables to your `.env.local` file for Shiprocket integration to work properly:

```env
# Existing variables (keep these)
NEXT_PUBLIC_SUPABASE_URL=https://rtuhyoiiezensxfdswhx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay (existing)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# NEW: Shiprocket Configuration
SHIPROCKET_EMAIL=your_shiprocket_account_email@domain.com
SHIPROCKET_PASSWORD=your_shiprocket_account_password
SHIPROCKET_WEBHOOK_SECRET=your_shiprocket_webhook_secret_optional

# Application URL (for webhooks and API calls)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
# For development, use: http://localhost:3000

# Email Configuration (existing - used for shipping notifications)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
```

## Required Steps:

### 1. Shiprocket Account Setup
1. Create account at https://shiprocket.in/
2. Get your login email and password
3. Note down your pickup address details

### 2. Supabase Database Migration
Run the SQL commands from `supabase-shiprocket-migration.sql` in your Supabase SQL Editor

### 3. Webhook Configuration in Shiprocket
1. Login to Shiprocket dashboard
2. Go to Settings → API
3. Add webhook URL: `https://your-domain.com/api/shiprocket/webhook`
4. Select events: Order Status Updates, Shipment Updates

### 4. Update Pickup Address
Update the default pickup address in the `shiprocket_settings` table or modify the default in the migration SQL file:

```sql
UPDATE public.shiprocket_settings 
SET pickup_address = '{
  "pickup_location": "Primary",
  "name": "Your Store Name",
  "email": "your_store_email@domain.com",
  "phone": "your_phone_number",
  "address": "Your complete address",
  "address_2": "Landmark or additional info",
  "city": "Your City",
  "state": "Your State",
  "country": "India",
  "pin_code": "your_pincode"
}'::jsonb;
```

## Testing the Integration:

### 1. Test Shiprocket Login
```bash
curl -X POST http://localhost:3000/api/shiprocket/login
```

### 2. Test Order Creation (after placing a test order)
```bash
curl -X POST http://localhost:3000/api/shiprocket/create-order \
  -H "Content-Type: application/json" \
  -d '{"orderId": "your_order_uuid"}'
```

### 3. Verify Database Updates
Check that orders table has new Shiprocket columns and data is being populated.

## Production Checklist:

- [ ] Set NEXT_PUBLIC_BASE_URL to production domain
- [ ] Configure Shiprocket webhooks with production URL
- [ ] Test email notifications with real Shiprocket events
- [ ] Verify product weights and dimensions are set correctly
- [ ] Test with actual orders (start with Razorpay test mode)
- [ ] Monitor Supabase logs for any integration errors

## Troubleshooting:

### Common Issues:
1. **Token expired errors**: Check Shiprocket login credentials
2. **Order creation fails**: Verify product has weight/dimensions data
3. **Webhook not received**: Check Shiprocket webhook configuration
4. **Email not sent**: Verify GMAIL_USER and GMAIL_APP_PASSWORD

### Useful Queries:
```sql
-- Check shipping logs for errors
SELECT * FROM shipping_logs WHERE error_message IS NOT NULL ORDER BY created_at DESC;

-- Check orders with Shiprocket data
SELECT id, shiprocket_order_id, shipping_status, awb_code FROM orders WHERE shiprocket_order_id IS NOT NULL;

-- Check Shiprocket settings
SELECT * FROM shiprocket_settings;
```