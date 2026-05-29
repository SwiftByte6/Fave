'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/products';
import { useRazorpayCheckout } from '@/hooks/useRazorpayCheckout';

type DemoProduct = {
  id: number;
  title: string;
  price: number;
  images?: string[];
  category?: string;
  description?: string;
};

type DemoForm = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  country: string;
};

type FlowEvent = {
  title: string;
  detail: string;
  tone?: 'neutral' | 'success' | 'error' | 'loading';
};

const defaultForm: DemoForm = {
  name: 'Demo Customer',
  email: '',
  phone: '9876543210',
  address: '123 Fashion Street',
  city: 'Mumbai',
  pincode: '400001',
  country: 'India',
};

export default function RazorpayShiprocketDemoClient({ products }: { products: DemoProduct[] }) {
  const router = useRouter();
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionEmail, setSessionEmail] = useState('');
  const [form, setForm] = useState<DemoForm>(defaultForm);
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id ?? 0);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [razorpayOrderId, setRazorpayOrderId] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [events, setEvents] = useState<FlowEvent[]>([
    { title: 'Ready', detail: 'Select a product and start the flow.' },
  ]);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const email = data.session?.user?.email || '';
      setSessionEmail(email);
      setSessionReady(true);
      setForm((current) => ({
        ...current,
        email: current.email || email,
      }));
    })();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionEmail(session?.user?.email || '');
      setForm((current) => ({
        ...current,
        email: current.email || session?.user?.email || '',
      }));
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!form.email && sessionEmail) {
      setForm((current) => ({ ...current, email: sessionEmail }));
    }
  }, [form.email, sessionEmail]);

  const totalAmount = Number(selectedProduct?.price || 0) * quantity;

  const pushEvent = (title: string, detail: string, tone: FlowEvent['tone'] = 'neutral') => {
    setEvents((current) => [{ title, detail, tone }, ...current].slice(0, 12));
  };

  const handleFormChange = (field: keyof DemoForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleStartFlow = async () => {
    if (!sessionReady) {
      toast.error('Loading auth session. Try again in a moment.');
      return;
    }

    if (!sessionEmail) {
      toast.error('Please sign in before running the demo.');
      router.push('/signin');
      return;
    }

    if (!selectedProduct) {
      toast.error('No product data available for the demo.');
      return;
    }

    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsProcessing(true);
    setVerificationResult(null);
    setCurrentOrderId('');
    setRazorpayOrderId('');

    try {
      pushEvent('Creating order', 'Sending demo order to /api/orders', 'loading');

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionEmail ? { Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}` } : {}),
        },
        body: JSON.stringify({
          form,
          total: totalAmount,
          items: [
            {
              id: selectedProduct.id,
              title: selectedProduct.title,
              price: selectedProduct.price,
              quantity,
              images: selectedProduct.images || [],
              category: selectedProduct.category || '',
            },
          ],
        }),
      });

      const orderResult = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(orderResult.error || 'Failed to create demo order');
      }

      const orderId = orderResult.orderId as string;
      setCurrentOrderId(orderId);
      pushEvent('Order created', `Database order created: ${orderId}`, 'success');

      pushEvent('Creating Razorpay order', 'Calling /api/razorpay/create-order', 'loading');
      const razorpayResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'INR',
          receipt: orderId,
        }),
      });

      const razorpayResult = await razorpayResponse.json();
      if (!razorpayResponse.ok) {
        throw new Error(razorpayResult.error || 'Failed to create Razorpay order');
      }

      setRazorpayOrderId(razorpayResult.id);
      pushEvent('Razorpay order ready', `Razorpay order ID: ${razorpayResult.id}`, 'success');

      pushEvent('Opening checkout', 'Launching Razorpay payment modal', 'loading');
      await openCheckout({
        id: razorpayResult.id,
        amount: razorpayResult.amount,
        currency: razorpayResult.currency,
        appOrderId: orderId,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      pushEvent('Flow failed', message, 'error');
      toast.error(message);
      setIsProcessing(false);
    }
  };

  const { openCheckout } = useRazorpayCheckout({
    onSuccess: (response) => {
      const result = response.verificationResult;
      setVerificationResult(result);
      setIsProcessing(false);
      pushEvent('Payment verified', `Payment ID: ${result?.payment_id || response.razorpay_payment_id}`, 'success');

      if (result?.shiprocket?.success === false) {
        pushEvent('Shiprocket handoff', 'Payment succeeded, but Shiprocket returned an error.', 'error');
        toast.error('Payment succeeded, Shiprocket handoff reported an error.');
      } else {
        pushEvent('Shiprocket handoff', 'Shiprocket order creation was triggered from verification.', 'success');
        toast.success('End-to-end flow completed successfully.');
      }
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : String(error);
      pushEvent('Checkout error', message, 'error');
      toast.error(message);
      setIsProcessing(false);
    },
    onDismiss: () => {
      pushEvent('Checkout dismissed', 'The Razorpay modal was closed before payment.', 'neutral');
      setIsProcessing(false);
      toast('Payment was dismissed.');
    },
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,var(--background)_0%,#fbf5ed_45%,#f5eadb_100%)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] border border-[var(--fav-blush)] bg-white/80 p-6 shadow-[0_20px_60px_rgba(122,31,42,0.08)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--fav-gold)]">
                Demo Flow
              </p>
              <h1 className="dancing text-5xl text-[var(--primary)] md:text-7xl">
                Razorpay to Shiprocket
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)] md:text-base">
                This page runs the real purchase pipeline using your live application routes: database order creation, Razorpay checkout, payment verification, and Shiprocket fulfillment trigger.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--fav-blush)] bg-[var(--fav-off-white)] px-4 py-3 text-sm text-[var(--foreground)] shadow-sm">
              <div className="font-semibold">Session</div>
              <div className="mt-1 text-[var(--muted-foreground)]">
                {sessionEmail ? sessionEmail : 'Sign in required'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-[var(--fav-blush)] bg-white/85 p-6 shadow-[0_20px_60px_rgba(122,31,42,0.08)] backdrop-blur-xl md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                    className="w-full rounded-2xl border border-[var(--fav-blush)] bg-[var(--fav-off-white)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--fav-gold)]"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full rounded-2xl border border-[var(--fav-blush)] bg-[var(--fav-off-white)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--fav-gold)]"
                  />
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-[var(--fav-blush)] bg-[var(--fav-beige)]/60">
                  <div className="relative aspect-[4/3] bg-[linear-gradient(135deg,rgba(199,138,43,0.12),rgba(122,31,42,0.08))]">
                    {selectedProduct?.images?.[0] ? (
                      <Image
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-[var(--muted-foreground)]">
                        No preview image available
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 p-4">
                    <div className="text-lg font-semibold text-[var(--foreground)]">{selectedProduct?.title}</div>
                    <div className="text-sm text-[var(--muted-foreground)]">
                      {selectedProduct?.category || 'Category not set'}
                    </div>
                    <div className="text-xl font-bold text-[var(--primary)]">₹{Number(selectedProduct?.price || 0).toFixed(0)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {([
                    ['name', 'Full Name'],
                    ['email', 'Email'],
                    ['phone', 'Phone'],
                    ['city', 'City'],
                    ['pincode', 'Pincode'],
                    ['country', 'Country'],
                  ] as Array<[keyof DemoForm, string]>).map(([field, label]) => (
                    <div key={field} className={field === 'address' ? 'sm:col-span-2' : ''}>
                      <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">{label}</label>
                      <input
                        type="text"
                        value={form[field]}
                        onChange={(e) => handleFormChange(field, e.target.value)}
                        className="w-full rounded-2xl border border-[var(--fav-blush)] bg-[var(--fav-off-white)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--fav-gold)]"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[var(--foreground)]">Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => handleFormChange('address', e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-[var(--fav-blush)] bg-[var(--fav-off-white)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--fav-gold)]"
                  />
                </div>

                <button
                  onClick={handleStartFlow}
                  disabled={isProcessing || !products.length}
                  className="group relative mt-2 inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-[var(--primary)] px-5 py-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:shadow-[0_18px_40px_rgba(122,31,42,0.28)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="relative z-10">{isProcessing ? 'Running demo...' : 'Start full Razorpay → Shiprocket flow'}</span>
                </button>

                <div className="grid gap-3 rounded-[1.5rem] border border-[var(--fav-blush)] bg-[var(--fav-off-white)] p-4 text-sm text-[var(--muted-foreground)]">
                  <div className="flex items-center justify-between gap-4">
                    <span>Demo Order ID</span>
                    <span className="font-medium text-[var(--foreground)]">{currentOrderId || 'Not created yet'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Razorpay Order ID</span>
                    <span className="font-medium text-[var(--foreground)]">{razorpayOrderId || 'Pending'}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span>Total</span>
                    <span className="font-medium text-[var(--primary)]">₹{totalAmount.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-[var(--fav-blush)] bg-white/85 p-6 shadow-[0_20px_60px_rgba(122,31,42,0.08)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Flow Timeline</h2>
                <Link href="/test-shiprocket" className="text-sm font-medium text-[var(--fav-gold)] hover:underline">
                  Shiprocket only test
                </Link>
              </div>
              <div className="space-y-3">
                {events.map((event, index) => (
                  <div
                    key={`${event.title}-${index}`}
                    className="rounded-2xl border border-[var(--fav-blush)] bg-[var(--fav-off-white)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-[var(--foreground)]">{event.title}</div>
                        <div className="mt-1 text-sm text-[var(--muted-foreground)]">{event.detail}</div>
                      </div>
                      <span
                        className={[
                          'rounded-full px-3 py-1 text-xs font-semibold',
                          event.tone === 'success' && 'bg-emerald-100 text-emerald-700',
                          event.tone === 'error' && 'bg-red-100 text-red-700',
                          event.tone === 'loading' && 'bg-amber-100 text-amber-700',
                          !event.tone || event.tone === 'neutral' ? 'bg-[var(--fav-beige)] text-[var(--foreground)]' : '',
                        ].join(' ')}
                      >
                        {event.tone || 'info'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[var(--fav-blush)] bg-white/85 p-6 shadow-[0_20px_60px_rgba(122,31,42,0.08)] backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Verification Result</h2>
              <pre className="mt-4 max-h-[320px] overflow-auto rounded-2xl bg-[var(--fav-off-white)] p-4 text-xs leading-6 text-[var(--foreground)]">
                {verificationResult ? JSON.stringify(verificationResult, null, 2) : 'Payment verification response will appear here.'}
              </pre>
            </section>

            <section className="rounded-[2rem] border border-[var(--fav-blush)] bg-[linear-gradient(135deg,rgba(122,31,42,0.08),rgba(199,138,43,0.08))] p-6 shadow-[0_20px_60px_rgba(122,31,42,0.08)]">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">How this demo works</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-[var(--muted-foreground)]">
                <li>Create a real database order using your authenticated Supabase session.</li>
                <li>Create a Razorpay order with your live API route.</li>
                <li>Open the Razorpay checkout modal.</li>
                <li>Verify the payment signature on the server.</li>
                <li>Trigger Shiprocket order creation from the verification route.</li>
              </ol>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
