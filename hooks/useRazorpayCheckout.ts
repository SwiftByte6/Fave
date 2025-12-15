import { useCallback, useRef } from 'react';

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface PaymentVerificationPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string;
}

interface RazorpayCheckoutError {
  code: string;
  description: string;
}

interface UseRazorpayCheckoutOptions {
  onSuccess?: (response: PaymentVerificationPayload) => void;
  onError?: (error: RazorpayCheckoutError | Error | string) => void;
  onDismiss?: () => void;
}

/**
 * Detects if the current device is running iOS
 * @returns boolean indicating if the device is iOS
 */
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

/**
 * Custom hook for Razorpay Checkout integration with iOS UPI handling
 * 
 * Features:
 * - iOS Safari UPI QR flow (disables intent-based UPI on iOS)
 * - Android/other platforms support intent-based UPI
 * - Only opens checkout on explicit user interaction
 * - TypeScript type safety
 * - Error and dismissal handling
 * 
 * @param options Configuration options for checkout behavior
 * @returns Object with openCheckout function and loading state
 */
export function useRazorpayCheckout(options: UseRazorpayCheckoutOptions = {}) {
  const { onSuccess, onError, onDismiss } = options;
  const isLoadingRef = useRef(false);

  const openCheckout = useCallback(
    async (order: RazorpayOrder) => {
      // Prevent multiple simultaneous checkout opens
      if (isLoadingRef.current) {
        console.warn('Checkout is already open');
        return;
      }

      // Validate required environment variable
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKeyId) {
        const error = new Error(
          'NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured in environment variables'
        );
        console.error(error);
        onError?.(error);
        return;
      }

      // Validate order object
      if (!order.id || !order.amount || !order.currency) {
        const error = new Error(
          'Order must contain: id, amount, and currency'
        );
        console.error(error);
        onError?.(error);
        return;
      }

      // Ensure Razorpay script is loaded
      if (typeof window.Razorpay === 'undefined') {
        const error = new Error(
          'Razorpay SDK is not loaded. Make sure the script tag is in your HTML.'
        );
        console.error(error);
        onError?.(error);
        return;
      }

      isLoadingRef.current = true;

      try {
        // Detect iOS to configure UPI flow
        const deviceIsIOS = isIOS();

        // Configure Razorpay checkout options
        const razorpayOptions: RazorpayCheckoutOptions = {
          key: razorpayKeyId,
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          name: 'Fave',
          description: 'Order Payment',
          
          // UPI configuration
          upi: deviceIsIOS
            ? { flow: 'qr' } // iOS Safari: Force QR-based UPI
            : { flow: 'intent' }, // Android/Others: Allow intent-based UPI

          // Payment callback on success
          handler: async (response: RazorpayPaymentResponse) => {
            try {
              // Prepare verification payload
              const verificationPayload: PaymentVerificationPayload = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id,
              };

              // Call backend verification API
              const verificationResponse = await fetch(
                '/api/razorpay/verify-payment',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(verificationPayload),
                }
              );

              if (!verificationResponse.ok) {
                const errorData = await verificationResponse.json();
                throw new Error(
                  errorData.error || 'Payment verification failed'
                );
              }

              // Verification successful
              onSuccess?.(verificationPayload);
            } catch (error) {
              const errorMsg =
                error instanceof Error ? error.message : 'Verification failed';
              console.error('Payment verification error:', errorMsg);
              onError?.(error instanceof Error ? error : errorMsg);
            } finally {
              isLoadingRef.current = false;
            }
          },

          // Handle checkout dismissal
          modal: {
            ondismiss: () => {
              isLoadingRef.current = false;
              onDismiss?.();
            },
          },

          // Error handler
          prefill: {
            contact: '',
            email: '',
          },

          // Theme configuration (optional, customize as needed)
          theme: {
            color: '#3399cc',
          },
        };

        // Open Razorpay Checkout
        const checkout = new window.Razorpay(razorpayOptions);
        
        // Handle checkout errors
        checkout.on('payment.failed', (response: RazorpayCheckoutError) => {
          isLoadingRef.current = false;
          console.error('Payment failed:', response);
          onError?.(response);
        });

        checkout.open();
      } catch (error) {
        isLoadingRef.current = false;
        console.error('Checkout open error:', error);
        onError?.(error instanceof Error ? error : 'Failed to open checkout');
      }
    },
    [onSuccess, onError, onDismiss]
  );

  return {
    openCheckout,
    isLoading: isLoadingRef.current,
  };
}

/**
 * Type definitions for Razorpay (extend Window interface)
 */
declare global {
  interface Window {
    Razorpay: RazorpayConstructor;
  }

  interface RazorpayConstructor {
    new (options: RazorpayCheckoutOptions): RazorpayCheckoutInstance;
  }

  interface RazorpayCheckoutInstance {
    open(): void;
    close(): void;
    on(event: string, callback: (response: any) => void): void;
  }

  interface RazorpayCheckoutOptions {
    key: string;
    order_id: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    upi: {
      flow: 'intent' | 'qr';
    };
    handler: (response: RazorpayPaymentResponse) => void;
    modal: {
      ondismiss: () => void;
    };
    prefill?: {
      contact?: string;
      email?: string;
      name?: string;
    };
    theme?: {
      color?: string;
    };
  }

  interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }

  interface RazorpayCheckoutError {
    code: string;
    description: string;
  }
}

export type { RazorpayOrder };
