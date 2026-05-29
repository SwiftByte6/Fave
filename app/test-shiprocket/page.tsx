'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/products'

type SessionState = {
  ready: boolean
  userEmail: string
  accessToken: string
}

export default function TestShiprocketPage() {
  const [sessionState, setSessionState] = useState<SessionState>({
    ready: false,
    userEmail: '',
    accessToken: '',
  })
  const [loginResult, setLoginResult] = useState<any>(null)
  const [createOrderResult, setCreateOrderResult] = useState<any>(null)
  const [serviceabilityResult, setServiceabilityResult] = useState<any>(null)
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [awbCode, setAwbCode] = useState('')
  const [pickupPostcode, setPickupPostcode] = useState('400001')
  const [deliveryPostcode, setDeliveryPostcode] = useState('110001')
  const [weight, setWeight] = useState('0.5')
  const [length, setLength] = useState('10')
  const [breadth, setBreadth] = useState('10')
  const [height, setHeight] = useState('5')
  const [cod, setCod] = useState('0')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return

      setSessionState({
        ready: true,
        userEmail: data.session?.user?.email || '',
        accessToken: data.session?.access_token || '',
      })
    })()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionState({
        ready: true,
        userEmail: session?.user?.email || '',
        accessToken: session?.access_token || '',
      })
    })

    return () => {
      mounted = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const buildAuthHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {}

    if (sessionState.accessToken) {
      headers.Authorization = `Bearer ${sessionState.accessToken}`
    }

    return headers
  }

  const testShiprocketLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/shiprocket/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()
      setLoginResult({ status: response.status, data: result })
    } catch (error) {
      setLoginResult({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
    }
    setLoading(false)
  }

  const testCreateOrder = async () => {
    setLoading(true)
    try {
      if (!orderId.trim()) {
        setCreateOrderResult({ error: 'Enter a real order ID from your database first.' })
        setLoading(false)
        return
      }

      const response = await fetch('/api/shiprocket/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeaders(),
        },
        body: JSON.stringify({ orderId: orderId.trim() }),
      })

      const result = await response.json()
      setCreateOrderResult({ status: response.status, data: result })
    } catch (error) {
      setCreateOrderResult({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
    }
    setLoading(false)
  }

  const testServiceability = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/shiprocket/serviceability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeaders(),
        },
        body: JSON.stringify({
          pickup_postcode: pickupPostcode.trim(),
          delivery_postcode: deliveryPostcode.trim(),
          weight: Number(weight),
          length: Number(length),
          breadth: Number(breadth),
          height: Number(height),
          cod: Number(cod),
        }),
      })

      const result = await response.json()
      setServiceabilityResult({ status: response.status, data: result })
    } catch (error) {
      setServiceabilityResult({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
    }
    setLoading(false)
  }

  const testTracking = async () => {
    setLoading(true)
    try {
      if (!awbCode.trim()) {
        setTrackingResult({ error: 'Enter a real AWB code first.' })
        setLoading(false)
        return
      }

      const response = await fetch(`/api/shiprocket/track?awb=${encodeURIComponent(awbCode.trim())}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeaders(),
        },
      })

      const result = await response.json()
      setTrackingResult({ status: response.status, data: result })
    } catch (error) {
      setTrackingResult({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto max-w-5xl p-6 md:p-8">
      <div className="mb-8 rounded-3xl border border-fav-blush bg-white/90 p-6 shadow-[0_20px_60px_rgba(122,31,42,0.08)]">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-fav-gold">
          Shiprocket Backend Test
        </p>
        <h1 className="dancing text-5xl text-fav-maroon md:text-6xl">
          Shiprocket Integration Test
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-fav-warm-gray md:text-base">
          This page now talks to your backend routes only. It uses the current Supabase session for authenticated Shiprocket endpoints and no longer exposes hardcoded API credentials in the UI.
        </p>
        <div className="mt-4 rounded-2xl bg-fav-beige/50 p-4 text-sm text-fav-charcoal">
          <div className="font-semibold">Signed in as:</div>
          <div className="mt-1 text-fav-warm-gray">
            {sessionState.userEmail || 'Not signed in'}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-fav-blush bg-white p-6 shadow-[0_20px_60px_rgba(122,31,42,0.08)]">
            <h2 className="text-lg font-semibold text-fav-charcoal">Actions</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={testShiprocketLogin}
                disabled={loading}
                className="rounded-xl bg-fav-maroon px-4 py-3 text-sm font-semibold text-fav-off-white transition hover:bg-fav-rust disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Refresh Shiprocket Login'}
              </button>

              <button
                onClick={testCreateOrder}
                disabled={loading}
                className="rounded-xl bg-fav-gold px-4 py-3 text-sm font-semibold text-fav-charcoal transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Create Order'}
              </button>

              <button
                onClick={testServiceability}
                disabled={loading}
                className="rounded-xl bg-fav-beige px-4 py-3 text-sm font-semibold text-fav-charcoal transition hover:bg-fav-blush disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Serviceability'}
              </button>

              <button
                onClick={testTracking}
                disabled={loading}
                className="rounded-xl bg-fav-plum px-4 py-3 text-sm font-semibold text-fav-off-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Tracking'}
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-fav-blush bg-white p-6 shadow-[0_20px_60px_rgba(122,31,42,0.08)]">
            <h2 className="text-lg font-semibold text-fav-charcoal">Inputs</h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-fav-charcoal sm:col-span-2">
                <span>Order ID for /api/shiprocket/create-order</span>
                <input
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Paste a real orders.id value"
                  className="w-full rounded-2xl border border-fav-blush bg-fav-off-white px-4 py-3 outline-none transition focus:border-fav-gold"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-fav-charcoal">
                <span>Pickup Postcode</span>
                <input
                  value={pickupPostcode}
                  onChange={(e) => setPickupPostcode(e.target.value)}
                  className="w-full rounded-2xl border border-fav-blush bg-fav-off-white px-4 py-3 outline-none transition focus:border-fav-gold"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-fav-charcoal">
                <span>Delivery Postcode</span>
                <input
                  value={deliveryPostcode}
                  onChange={(e) => setDeliveryPostcode(e.target.value)}
                  className="w-full rounded-2xl border border-fav-blush bg-fav-off-white px-4 py-3 outline-none transition focus:border-fav-gold"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-fav-charcoal">
                <span>Weight</span>
                <input
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-2xl border border-fav-blush bg-fav-off-white px-4 py-3 outline-none transition focus:border-fav-gold"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-fav-charcoal">
                <span>COD</span>
                <input
                  value={cod}
                  onChange={(e) => setCod(e.target.value)}
                  className="w-full rounded-2xl border border-fav-blush bg-fav-off-white px-4 py-3 outline-none transition focus:border-fav-gold"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-fav-charcoal">
                <span>Length</span>
                <input
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full rounded-2xl border border-fav-blush bg-fav-off-white px-4 py-3 outline-none transition focus:border-fav-gold"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-fav-charcoal">
                <span>Breadth</span>
                <input
                  value={breadth}
                  onChange={(e) => setBreadth(e.target.value)}
                  className="w-full rounded-2xl border border-fav-blush bg-fav-off-white px-4 py-3 outline-none transition focus:border-fav-gold"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-fav-charcoal">
                <span>Height</span>
                <input
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-2xl border border-fav-blush bg-fav-off-white px-4 py-3 outline-none transition focus:border-fav-gold"
                />
              </label>
            </div>

            <div className="mt-5 rounded-2xl bg-fav-beige/40 p-4 text-sm text-fav-warm-gray">
              Create order, serviceability, and tracking requests all require a signed-in Supabase session because the backend routes enforce auth.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <ResultCard title="Login Result" result={loginResult} />
          <ResultCard title="Create Order Result" result={createOrderResult} />
          <ResultCard title="Serviceability Result" result={serviceabilityResult} />
          <ResultCard title="Tracking Result" result={trackingResult} />

          <div className="rounded-3xl border border-fav-blush bg-fav-off-white p-6 shadow-[0_20px_60px_rgba(122,31,42,0.08)]">
            <h2 className="text-lg font-semibold text-fav-charcoal">What this page fixes</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-fav-warm-gray">
              <li>No hardcoded order ID.</li>
              <li>No hardcoded Shiprocket credentials in the UI.</li>
              <li>Authenticated routes receive the current Supabase access token.</li>
              <li>Uses your backend API routes instead of calling Shiprocket directly from the browser.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultCard({ title, result }: { title: string; result: any }) {
  return (
    <div className="rounded-3xl border border-fav-blush bg-white p-6 shadow-[0_20px_60px_rgba(122,31,42,0.08)]">
      <h2 className="text-lg font-semibold text-fav-charcoal">{title}</h2>
      <pre className="mt-4 max-h-80 overflow-auto rounded-2xl bg-fav-off-white p-4 text-xs leading-6 text-fav-charcoal">
        {result ? JSON.stringify(result, null, 2) : 'No result yet.'}
      </pre>
    </div>
  )
}
