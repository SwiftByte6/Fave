import { NextResponse } from 'next/server'
import { buildGoogleFeedXml, fetchGoogleFeedProducts } from '@/lib/google-feed'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  try {
    const { items, scanned, skipped } = await fetchGoogleFeedProducts()
    const xml = buildGoogleFeedXml(items)

    console.log('Google feed generated successfully', {
      scanned,
      skipped,
      included: items.length,
    })

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Google feed generation failed:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate Google Merchant Center feed',
      },
      { status: 500 }
    )
  }
}