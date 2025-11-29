'use client'

import { useState } from 'react'

export default function TestShiprocketPage() {
  const [loginResult, setLoginResult] = useState<any>(null)
  const [createOrderResult, setCreateOrderResult] = useState<any>(null)
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
      setLoginResult({ error: error.message })
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
      setCreateOrderResult({ error: error.message })
      console.error('Create order error:', error)
    }
    setLoading(false)
  }

  const testDirectShiprocketAPI = async () => {
    setLoading(true)
    try {
      // Test direct API call to Shiprocket
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
        type: 'Direct API Call'
      })
      console.log('Direct API result:', result)
    } catch (error) {
      setLoginResult({ error: error.message, type: 'Direct API Call' })
      console.error('Direct API error:', error)
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
            {loading ? 'Testing...' : 'Test Direct Shiprocket API'}
          </button>
          
          <button
            onClick={testCreateOrder}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Create Order'}
          </button>
        </div>

        {/* Environment Variables Display */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Environment Variables Check</h3>
          <div className="text-sm space-y-1">
            <div>SHIPROCKET_EMAIL: favestore06@gmail.com</div>
            <div>SHIPROCKET_PASSWORD: WP#a6ebXMZm@oTS8FGz4uGQvM*A!5iI5</div>
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

        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>First, test the "Direct Shiprocket API" to verify your credentials work</li>
            <li>Then test "Shiprocket Login (via API)" to check if the backend endpoint works</li>
            <li>Finally, test "Create Order" to see the full integration</li>
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