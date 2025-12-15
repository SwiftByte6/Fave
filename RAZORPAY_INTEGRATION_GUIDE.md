# Razorpay Checkout iOS Safari Integration Guide

## Overview
This guide covers the production-ready Razorpay Checkout integration for Next.js with iOS Safari UPI handling.

## What's Included

### 1. **useRazorpayCheckout Hook** (`hooks/useRazorpayCheckout.ts`)
- Custom React hook for Razorpay integration
- iOS detection using `navigator.userAgent`
- Automatic UPI configuration switching
- Payment verification API integration
- Error handling and checkout dismissal
- TypeScript type definitions

### 2. **Example Components** (`component/RazorpayCheckoutButton.tsx`)
- Basic checkout button component
- Advanced checkout with status tracking
- Error display and handling
- Ready-to-use examples

## Setup Instructions

### Step 1: Add Razorpay Script to HTML

Add this to your `app/layout.tsx` (in the `<head>` section):

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        {/* Other meta tags... */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Step 2: Set Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

Get your key from: https://dashboard.razorpay.com/app/keys

### Step 3: Ensure Backend APIs Exist

Your backend should have:
- `POST /api/razorpay/create-order` - Creates Razorpay order (already implemented)
- `POST /api/razorpay/verify-payment` - Verifies payment signature (already implemented)

The hook expects these endpoints to already exist and work correctly.

## Usage Examples

### Basic Usage in a Page Component

```tsx
'use client';

import { useState } from 'react';
import { RazorpayCheckoutButton, type RazorpayOrder } from '@/component/RazorpayCheckoutButton';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [order, setOrder] = useState<RazorpayOrder | null>(null);

  const handleCreateOrder = async () => {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 50000, // Amount in paise
          currency: 'INR',
          // ... other order details
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      const data = await response.json();
      setOrder({
        id: data.id,
        amount: data.amount,
        currency: data.currency,
      });
    } catch (error) {
      console.error('Order creation failed:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {!order ? (
        <button
          onClick={handleCreateOrder}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Create Order
        </button>
      ) : (
        <RazorpayCheckoutButton
          order={order}
          onPaymentSuccess={() => {
            router.push('/order-success');
          }}
        />
      )}
    </div>
  );
}
```

### Using the Hook Directly

```tsx
'use client';

import { useRazorpayCheckout } from '@/hooks/useRazorpayCheckout';

export default function PaymentForm() {
  const { openCheckout } = useRazorpayCheckout({
    onSuccess: (response) => {
      console.log('Payment successful:', response);
      // Handle success
    },
    onError: (error) => {
      console.error('Payment failed:', error);
      // Handle error
    },
    onDismiss: () => {
      console.log('Checkout dismissed by user');
    },
  });

  return (
    <button
      onClick={() => openCheckout({
        id: 'order_123',
        amount: 50000,
        currency: 'INR',
      })}
    >
      Pay Now
    </button>
  );
}
```

## Key Features

### iOS Safari UPI Handling

**Problem:** UPI intent deep links (`upi://pay`) fail on iOS Safari

**Solution:** Automatic detection and configuration switching

```typescript
// Automatically handles this in useRazorpayCheckout hook:
const deviceIsIOS = isIOS();

const upiConfig = deviceIsIOS
  ? { flow: 'qr' }      // iOS: Force QR-based UPI
  : { flow: 'intent' }; // Android/Others: Allow intent
```

### Payment Verification

The hook automatically:
1. Calls `/api/razorpay/verify-payment` after successful payment
2. Sends: `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`, `order_id`
3. Validates server response
4. Calls `onSuccess` callback on successful verification

### Error Handling

```typescript
const { openCheckout } = useRazorpayCheckout({
  onError: (error) => {
    // error can be:
    // - RazorpayCheckoutError object (with code & description)
    // - Error instance (with message)
    // - String message
    
    const message = error instanceof Error ? error.message : String(error);
    console.error('Payment error:', message);
  },
});
```

### Checkout Dismissal

```typescript
const { openCheckout } = useRazorpayCheckout({
  onDismiss: () => {
    console.log('User closed checkout without completing payment');
    // Reset UI state, show message, etc.
  },
});
```

## Type Definitions

All TypeScript types are included in `useRazorpayCheckout.ts`:

```typescript
interface RazorpayOrder {
  id: string;        // Razorpay order ID from backend
  amount: number;    // Amount in paise (e.g., 50000 = ₹500)
  currency: string;  // Currency code (e.g., 'INR')
}

interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string;  // Your local order ID
}

interface UseRazorpayCheckoutOptions {
  onSuccess?: (response: PaymentVerificationPayload) => void;
  onError?: (error: RazorpayCheckoutError | Error | string) => void;
  onDismiss?: () => void;
}
```

## Best Practices

### ✅ Do's

- Load the Razorpay script in layout component
- Call `openCheckout()` only on explicit user interaction
- Always handle errors and dismissal
- Validate order object before passing to hook
- Use TypeScript for type safety
- Store `NEXT_PUBLIC_RAZORPAY_KEY_ID` in environment variables

### ❌ Don'ts

- Don't open checkout in `useEffect` without user interaction
- Don't manually create `upi://` deep links
- Don't change backend APIs
- Don't call `openCheckout()` multiple times rapidly
- Don't remove the Razorpay script from HTML
- Don't skip payment verification on backend

## Customization

### Theming

```typescript
const { openCheckout } = useRazorpayCheckout({...});

// Customize in the hook by modifying razorpayOptions.theme:
// theme: {
//   color: '#your-brand-color',
// },
```

### Custom Prefill Data

```typescript
// In the hook, modify razorpayOptions.prefill:
// prefill: {
//   email: 'customer@example.com',
//   contact: '9876543210',
//   name: 'Customer Name',
// },
```

### Additional Payment Methods

The current configuration supports:
- UPI (QR on iOS, Intent on Android)
- Credit/Debit Cards
- Net Banking
- Wallets

Razorpay automatically enables based on configuration.

## Testing

### iOS Safari Testing

1. Use an actual iOS device or iOS simulator
2. Visit your checkout page
3. Proceed to payment
4. On iOS: UPI will show QR code flow
5. On Android: UPI will show intent-based flow

### Verification

Ensure `/api/razorpay/verify-payment` correctly:
1. Receives verification payload
2. Validates Razorpay signature
3. Updates order status in Supabase
4. Returns success response

## Troubleshooting

### "Razorpay SDK is not loaded"
- Ensure script tag is in `layout.tsx` head
- Check if script loaded successfully in browser DevTools

### Payment verification fails
- Verify backend `/api/razorpay/verify-payment` is working
- Check Razorpay key ID is correct
- Ensure order ID matches backend

### iOS UPI still shows intent
- Clear browser cache
- Update hook to verify iOS detection
- Check in DevTools: `console.log(navigator.userAgent)`

### Checkout doesn't open
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Check browser console for errors
- Ensure button click is triggering `openCheckout()`

## Production Checklist

- [ ] Razorpay script added to `layout.tsx`
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` set in `.env.local` and deployment
- [ ] Backend `/api/razorpay/create-order` working
- [ ] Backend `/api/razorpay/verify-payment` working
- [ ] Tested on iOS Safari (QR flow)
- [ ] Tested on Android (Intent flow)
- [ ] Tested on Desktop/Web
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Success page configured
- [ ] Analytics/logging integrated

## Support & Documentation

- [Razorpay Checkout Documentation](https://razorpay.com/docs/payments/checkout/)
- [Razorpay UPI Integration](https://razorpay.com/docs/payments/payment-gateway/web/upi/)
- [Razorpay API Signature Verification](https://razorpay.com/docs/api/payments/verify-payment-signature/)

## Files Included

1. **hooks/useRazorpayCheckout.ts** - Main hook implementation
2. **component/RazorpayCheckoutButton.tsx** - Example components
3. **RAZORPAY_INTEGRATION_GUIDE.md** - This guide
