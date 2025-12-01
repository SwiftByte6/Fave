'use client'

import { useState } from 'react'

export default function TestShiprocketPage() {
  const [loginResult, setLoginResult] = useState<any>(null)
  const [createOrderResult, setCreateOrderResult] = useState<any>(null)
  const [serviceabilityResult, setServiceabilityResult] = useState<any>(null)
  const [trackingResult, setTrackingResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

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
      console.log('Login result:', result)
    } catch (error) {
      setLoginResult({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
      console.error('Login error:', error)
    }
    setLoading(false)
  }

  const testCreateOrder = async () => {
    setLoading(true)
    try {
      // You'll need to replace this with an actual order ID from your database
      const response = await fetch('/api/shiprocket/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: 'ebb9a99f-3cdf-405f-a263-382074f3408e' // Replace with actual order ID
        })
      })
      
      const result = await response.json()
      setCreateOrderResult({ status: response.status, data: result })
      console.log('Create order result:', result)
    } catch (error) {
      setCreateOrderResult({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
      console.error('Create order error:', error)
    }
    setLoading(false)
  }

  const testDirectShiprocketAPI = async () => {
    setLoading(true)
    try {
      // Test direct API call to Shiprocket using Bearer token authentication
      const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'favestore06@gmail.com',
          password: 'WP#a6ebXMZm@oTS8FGz4uGQvM*A!5iI5',
        }),
      })

      const result = await response.json()
      setLoginResult({ 
        status: response.status, 
        data: result,
        type: 'Direct Bearer Token Auth'
      })
      console.log('Direct API result:', result)
    } catch (error) {
      setLoginResult({ error: error instanceof Error ? error.message : 'Unknown error occurred', type: 'Direct Bearer Token Auth' })
      console.error('Direct API error:', error)
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
        },
        body: JSON.stringify({
          pickup_postcode: '400001',
          delivery_postcode: '110001',
          weight: 0.5,
          length: 10,
          breadth: 10,
          height: 5,
          cod: 0
        })
      })
      
      const result = await response.json()
      setServiceabilityResult({ status: response.status, data: result })
      console.log('Serviceability result:', result)
    } catch (error) {
      setServiceabilityResult({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
      console.error('Serviceability error:', error)
    }
    setLoading(false)
  }

  const testTracking = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/shiprocket/track?awb=1234567890', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const result = await response.json()
      setTrackingResult({ status: response.status, data: result })
      console.log('Tracking result:', result)
    } catch (error) {
      setTrackingResult({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
      console.error('Tracking error:', error)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Shiprocket Integration Test</h1>
      
      <div className="space-y-6">
        {/* Test Buttons */}
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={testShiprocketLogin}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Shiprocket Login (via API)'}
          </button>
          
          <button
            onClick={testDirectShiprocketAPI}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Bearer Token Auth'}
          </button>
          
          <button
            onClick={testCreateOrder}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Create Order'}
          </button>
          
          <button
            onClick={testServiceability}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Serviceability'}
          </button>
          
          <button
            onClick={testTracking}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Tracking'}
          </button>
        </div>

        {/* Environment Variables Display */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Environment Variables Check (Bearer Token Auth)</h3>
          <div className="text-sm space-y-1">
            <div>SHIPROCKET_API_EMAIL: favestore06@gmail.com</div>
            <div>SHIPROCKET_API_PASSWORD: WP#a6ebXMZm@oTS8FGz4uGQvM*A!5iI5</div>
            <div>SHIPROCKET_BASE_URL: https://apiv2.shiprocket.in/v1/external</div>
            <div>NEXT_PUBLIC_BASE_URL: http://localhost:3000</div>
          </div>
        </div>

        {/* Login Results */}
        {loginResult && (
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              Login Test Results {loginResult.type && `(${loginResult.type})`}
            </h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(loginResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Create Order Results */}
        {createOrderResult && (
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Create Order Test Results</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(createOrderResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Serviceability Results */}
        {serviceabilityResult && (
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Serviceability Test Results</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(serviceabilityResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Tracking Results */}
        {trackingResult && (
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Tracking Test Results</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(trackingResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="text-lg font-semibold mb-2">Testing Instructions (Bearer Token Auth)</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>First, test "Bearer Token Auth" to verify your API User credentials work</li>
            <li>Then test "Shiprocket Login (via API)" to check if backend authentication works</li>
            <li>Test "Serviceability" to check courier availability for pickup/delivery pincodes</li>
            <li>Test "Create Order" to create a shipment order</li>
            <li>Test "Tracking" with a real AWB code when available</li>
            <li>Check the browser console and server logs for detailed error messages</li>
          </ol>
        </div>

        {/* Common Issues */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <h3 className="text-lg font-semibold mb-2">Common Issues</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>401 Unauthorized:</strong> Incorrect email/password or account not activated</li>
            <li><strong>CORS Error:</strong> Browser blocking direct API calls (normal for security)</li>
            <li><strong>500 Server Error:</strong> Check server logs for detailed error messages</li>
            <li><strong>Environment Variables:</strong> Make sure .env.local is properly loaded</li>
          </ul>
        </div>
      </div>
    </div>
  )
}