import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function POST(request: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { form, items, status = 'success', total } = body || {}

    if (!form || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const totalAmount = typeof total === 'number'
      ? total
      : items.reduce((sum: number, it: any) => sum + (Number(it.price) * Number(it.quantity || it.cartQuantity || 1)), 0)

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          user_id: userId,
          total_amount: totalAmount,
          status,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
          country: form.country || 'India',
        }
      ])
      .select()
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: orderError?.message || 'Failed to create order' }, { status: 500 })
    }

    const orderItems = items.map((it: any) => ({
      order_id: order.id,
      title: it.title,
      price: it.price,
      quantity: it.quantity || it.cartQuantity || 1,
      images: Array.isArray(it.images) ? it.images : (it.image ? [it.image] : (it.thumbnail ? [it.thumbnail] : [])),
    }))

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message || 'Failed to create order items' }, { status: 500 })
    }

    return NextResponse.json({ orderId: order.id }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 })
  }
}



