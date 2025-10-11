'use client'

import { useState, useEffect } from 'react'

const EnvChecker = () => {
  const [envStatus, setEnvStatus] = useState({
    supabaseUrl: false,
    supabaseAnon: false,
    razorpayKeyId: false,
    razorpaySecret: false,
  })

  useEffect(() => {
    setEnvStatus({
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      razorpayKeyId: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      razorpaySecret: !!process.env.RAZORPAY_KEY_SECRET,
    })
  }, [])

  const allConfigured = Object.values(envStatus).every(Boolean)

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-3 text-center">Environment Check</h3>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Supabase URL</span>
          <span className={`px-2 py-1 rounded text-xs ${
            envStatus.supabaseUrl ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {envStatus.supabaseUrl ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Supabase Anon Key</span>
          <span className={`px-2 py-1 rounded text-xs ${
            envStatus.supabaseAnon ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {envStatus.supabaseAnon ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Razorpay Key ID</span>
          <span className={`px-2 py-1 rounded text-xs ${
            envStatus.razorpayKeyId ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {envStatus.razorpayKeyId ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Razorpay Secret</span>
          <span className={`px-2 py-1 rounded text-xs ${
            envStatus.razorpaySecret ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {envStatus.razorpaySecret ? '✓' : '✗'}
          </span>
        </div>
      </div>

      <div className={`mt-4 p-3 rounded text-center text-sm ${
        allConfigured 
          ? 'bg-green-50 text-green-800 border border-green-200' 
          : 'bg-red-50 text-red-800 border border-red-200'
      }`}>
        {allConfigured ? (
          <span>🎉 All environment variables are configured!</span>
        ) : (
          <span>⚠️ Some environment variables are missing. Check your .env.local file.</span>
        )}
      </div>
    </div>
  )
}

export default EnvChecker

