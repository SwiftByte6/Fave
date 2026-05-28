// Server-side helper to validate Supabase access token from incoming requests
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

const supabaseAdmin = createClient(supabaseUrl, serviceKey)

export async function getUserIdFromRequest(request: Request): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null
    if (!token) return null

    // Call Supabase Auth REST endpoint to resolve the user from the access token
    const url = `${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: serviceKey,
      },
    })

    if (!res.ok) return null
    const data = await res.json()
    return data?.id ?? null
  } catch (err) {
    console.error('Failed to validate Supabase token:', err)
    return null
  }
}
