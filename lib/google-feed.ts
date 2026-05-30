import { supabase } from '@/lib/products'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://favee.shop'
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const PAGE_SIZE = 250

const INACTIVE_STATUSES = new Set([
  'inactive',
  'draft',
  'disabled',
  'archived',
  'unpublished',
])

export interface GoogleFeedProductRow {
  id: number | string
  title?: string | null
  description?: string | null
  price?: number | string | null
  images?: unknown
  category?: string | null
  quantity?: number | string | null
  created_at?: string | null
  updated_at?: string | null
  slug?: string | null
  brand?: string | null
  sku?: string | null
  condition?: string | null
  active?: boolean | null
  is_active?: boolean | null
  status?: string | null
}

export interface GoogleFeedItem {
  id: string
  title: string
  description: string
  link: string
  imageLink: string
  availability: 'in stock' | 'out of stock' | 'preorder'
  price: string
  condition: 'new'
  brand: string
  googleProductCategory: string
}

export interface GoogleFeedResult {
  items: GoogleFeedItem[]
  scanned: number
  skipped: number
}

export async function fetchGoogleFeedProducts(): Promise<GoogleFeedResult> {
  const items: GoogleFeedItem[] = []
  let scanned = 0
  let skipped = 0
  let page = 0

  while (true) {
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, error } = await supabase
      .from('product')
      .select('*')
      .order('id', { ascending: true })
      .range(from, to)

    if (error) {
      throw new Error(`Failed to fetch products for Google feed: ${error.message}`)
    }

    const batch = (data ?? []) as GoogleFeedProductRow[]
    if (batch.length === 0) {
      break
    }

    for (const product of batch) {
      scanned += 1

      if (shouldSkipProduct(product)) {
        skipped += 1
        continue
      }

      const feedItem = mapProductToFeedItem(product)
      if (!feedItem) {
        skipped += 1
        continue
      }

      items.push(feedItem)
    }

    if (batch.length < PAGE_SIZE) {
      break
    }

    page += 1
  }

  return { items, scanned, skipped }
}

export function buildGoogleFeedXml(items: GoogleFeedItem[]): string {
  const channelTitle = 'Favee Google Merchant Center Feed'
  const channelDescription = 'Live product feed for Google Merchant Center'

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(channelDescription)}</description>
${items.map((item) => `    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(item.description)}</g:description>
      <g:link>${escapeXml(item.link)}</g:link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
      <g:availability>${escapeXml(item.availability)}</g:availability>
      <g:price>${escapeXml(item.price)}</g:price>
      <g:condition>${escapeXml(item.condition)}</g:condition>
      <g:brand>${escapeXml(item.brand)}</g:brand>
      <g:google_product_category>${escapeXml(item.googleProductCategory)}</g:google_product_category>
    </item>`).join('\n')}
  </channel>
</rss>
`
}

function shouldSkipProduct(product: GoogleFeedProductRow): boolean {
  if (!product || product.title == null || String(product.title).trim() === '') {
    return true
  }

  const priceValue = Number(product.price)
  if (!Number.isFinite(priceValue) || priceValue <= 0) {
    return true
  }

  if (!hasValidImage(product.images)) {
    return true
  }

  if (typeof product.active === 'boolean' && product.active === false) {
    return true
  }

  if (typeof product.is_active === 'boolean' && product.is_active === false) {
    return true
  }

  const status = normalizeText(product.status)
  if (status && INACTIVE_STATUSES.has(status)) {
    return true
  }

  return false
}

function mapProductToFeedItem(product: GoogleFeedProductRow): GoogleFeedItem | null {
  const title = normalizeText(product.title)
  const description = normalizeText(product.description) || title
  const priceValue = Number(product.price)

  if (!title || !Number.isFinite(priceValue) || priceValue <= 0) {
    return null
  }

  const imageLink = resolveImageLink(product.images)
  if (!imageLink) {
    return null
  }

  return {
    id: String(product.id),
    title,
    description: stripHtml(description),
    link: `${SITE_URL}/products/${product.id}`,
    imageLink,
    availability: getAvailability(product.quantity),
    price: `${priceValue.toFixed(2)} INR`,
    condition: 'new',
    brand: normalizeText(product.brand) || 'Favee',
    googleProductCategory: mapGoogleCategory(product.category),
  }
}

function getAvailability(quantity: GoogleFeedProductRow['quantity']): 'in stock' | 'out of stock' | 'preorder' {
  const parsedQuantity = Number(quantity)
  if (Number.isFinite(parsedQuantity) && parsedQuantity <= 0) {
    return 'out of stock'
  }

  return 'in stock'
}

function mapGoogleCategory(category?: string | null): string {
  const normalized = normalizeText(category).toLowerCase()

  if (!normalized) {
    return 'Apparel & Accessories > Clothing'
  }

  if (/(saree|sarees|lehenga|bridal|wedding)/i.test(normalized)) {
    return 'Apparel & Accessories > Clothing > Traditional & Ceremonial Clothing'
  }

  if (/(kurta|kurti|kurtis|western|dress|gown|top|skirt)/i.test(normalized)) {
    return 'Apparel & Accessories > Clothing'
  }

  return 'Apparel & Accessories > Clothing'
}

function hasValidImage(images: unknown): boolean {
  return Boolean(resolveImageLink(images))
}

function resolveImageLink(images: unknown): string | null {
  const candidates = normalizeImages(images)

  for (const candidate of candidates) {
    const resolved = resolveUrl(candidate)
    if (resolved) {
      return resolved
    }
  }

  return null
}

function normalizeImages(images: unknown): string[] {
  if (Array.isArray(images)) {
    return images
      .map((image) => normalizeText(image))
      .filter((image): image is string => Boolean(image))
  }

  if (typeof images === 'string') {
    const trimmed = images.trim()
    if (!trimmed) {
      return []
    }

    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) {
          return parsed
            .map((image) => normalizeText(image))
            .filter((image): image is string => Boolean(image))
        }
      } catch (error) {
        console.warn('Failed to parse product images JSON string:', error)
      }
    }

    return trimmed
      .split(',')
      .map((image) => image.trim())
      .filter(Boolean)
  }

  return []
}

function resolveUrl(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`
  }

  const clean = trimmed.replace(/^\/+/, '')

  if (clean.startsWith('storage/v1/object/public/')) {
    return SUPABASE_URL ? `${SUPABASE_URL}/${clean}` : null
  }

  if (SUPABASE_URL) {
    return `${SUPABASE_URL}/storage/v1/object/public/${clean}`
  }

  return `${SITE_URL}/${clean}`
}

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value.trim()
  }

  return String(value).trim()
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;')
}