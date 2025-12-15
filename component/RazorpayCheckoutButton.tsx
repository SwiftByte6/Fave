'use client';

import { useState } from 'react';
import { useRazorpayCheckout, type RazorpayOrder } from '@/hooks/useRazorpayCheckout';

interface CheckoutComponentProps {
  order?: RazorpayOrder;
  onPaymentSuccess?: () => void;
}

/**
 * Example checkout button component using the Razorpay hook
 * 
 * Usage:
 * ```tsx
 * <RazorpayCheckoutButton 
 *   order={{ id: 'order_123', amount: 50000, currency: 'INR' }}
 *   onPaymentSuccess={() => router.push('/order-success')}
 * />
 * ```
 */
export function RazorpayCheckoutButton({
  order,
  onPaymentSuccess,
}: CheckoutComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { openCheckout } = useRazorpayCheckout({
    onSuccess: (response) => {
      console.log('Payment successful:', response);
      setError(null);
      setIsProcessing(false);
      onPaymentSuccess?.();
    },
    onError: (error) => {
      console.error('Payment error:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      setIsProcessing(false);
    },
    onDismiss: () => {
      console.log('Checkout dismissed');
      setIsProcessing(false);
    },
  });

  const handlePaymentClick = async () => {
    if (!order) {
      setError('Order information is missing');
      return;
    }

    setError(null);
    setIsProcessing(true);

    // Simulate order creation delay if needed
    // In production, the order should already exist from backend
    await openCheckout(order);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handlePaymentClick}
        disabled={isProcessing || !order}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {isProcessing ? 'Processing Payment...' : 'Pay with Razorpay'}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-semibold">Payment Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Advanced example with custom payment methods preference
 */
export function AdvancedRazorpayCheckout({
  order,
  onPaymentSuccess,
}: CheckoutComponentProps) {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'creating-order' | 'opening-checkout' | 'processing'
  >('idle');

  const { openCheckout } = useRazorpayCheckout({
    onSuccess: (response) => {
      console.log('✅ Payment verified successfully');
      setError(null);
      setStatus('idle');
      onPaymentSuccess?.();
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error('❌ Payment failed:', errorMessage);
      setError(errorMessage);
      setStatus('idle');
    },
    onDismiss: () => {
      console.log('⚠️ User dismissed checkout');
      setStatus('idle');
    },
  });

  const handlePay = async () => {
    if (!order) {
      setError('Order not created. Please try again.');
      return;
    }

    try {
      setError(null);
      setStatus('opening-checkout');
      await openCheckout(order);
      setStatus('processing');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      setStatus('idle');
    }
  };

  const isDisabled =
    status !== 'idle' || !order || typeof window === 'undefined';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Status Indicator */}
      {status !== 'idle' && (
        <div className="mb-4 flex items-center gap-2 text-blue-600">
          <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
          <span className="text-sm font-medium">
            {status === 'creating-order' && 'Creating order...'}
            {status === 'opening-checkout' && 'Opening checkout...'}
            {status === 'processing' && 'Processing payment...'}
          </span>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={handlePay}
        disabled={isDisabled}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
      >
        {status === 'idle'
          ? `Pay ₹${(order?.amount || 0) / 100}`
          : 'Processing...'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold text-sm">
            Payment Error
          </p>
          <p className="text-red-600 text-xs mt-1 break-words">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs text-red-600 underline hover:text-red-700"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Info Message */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        On iOS: UPI payments use QR codes. On Android: UPI intent is supported.
      </p>
    </div>
  );
}
