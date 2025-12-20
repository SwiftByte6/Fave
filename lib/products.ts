// lib/products.ts
// Single source of truth for all product data fetching. All functions are server-safe and typed.
// Uses Supabase JS client. No client-side sessionStorage. All queries are paginated and select only required columns.
// This file is the only place that should talk to Supabase for product data.

import { createClient } from '@supabase/supabase-js';

// Use env vars directly for server-side safety
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// Columns to select for product list and detail
const PRODUCT_COLUMNS = 'id, title, price, images, category, description, created_at, rating, quantity, sizes';

export interface Product {
  id: number;
  slug: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  created_at: string;
  rating: number;
  quantity: number;
  sizes: string[];
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

// Fetch paginated products for collection page (server-side, ISR safe)
export async function fetchProducts({ page = 1, pageSize = 20 }: { page?: number; pageSize?: number }): Promise<ProductListResult> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from('product')
    .select(PRODUCT_COLUMNS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) throw new Error(error.message);
  return {
    products: data as Product[],
    total: count || 0,
    page,
    pageSize,
  };
}

// Fetch a single product by slug or id (server-side, SSR/ISR safe)
export async function fetchProductBySlugOrId({ slug, id }: { slug?: string; id?: string | number }): Promise<Product | null> {
  let query = supabase.from('product').select(PRODUCT_COLUMNS).limit(1);
  if (slug) query = query.eq('slug', slug);
  else if (id) query = query.eq('id', id);
  else throw new Error('slug or id required');
  const { data, error } = await query.single();
  if (error) return null;
  return data as Product;
}

// Utility to get optimized image URLs from Supabase Storage (for different sizes)
export function getProductImageUrl(path: string, size: 'sm' | 'md' | 'lg' = 'md'): string {
  // Example: /storage/v1/object/public/products/filename.jpg
  // You may want to use a CDN or image proxy for resizing in production
  // Here, we just append a query param for demonstration
  if (!path) return '/placeholder.png';
  let url = path.startsWith('http') ? path : `${supabaseUrl}/storage/v1/object/public/${path}`;
  // Example: add ?width=400 for CDN resizing
  if (size === 'sm') url += '?width=200';
  if (size === 'md') url += '?width=400';
  if (size === 'lg') url += '?width=800';
  return url;
}

// (Optional) Server-side filter utility for advanced use cases
export async function fetchFilteredProducts({
  filters = {},
  page = 1,
  pageSize = 20,
}: {
  filters?: Record<string, any>;
  page?: number;
  pageSize?: number;
}): Promise<ProductListResult> {
  let query = supabase.from('product').select(PRODUCT_COLUMNS, { count: 'exact' });
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query = query.eq(key, value);
  });
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.order('created_at', { ascending: false }).range(from, to);
  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return {
    products: data as Product[],
    total: count || 0,
    page,
    pageSize,
  };
}

// All product data fetching should go through this file only.
// Client components should only use data passed from server components or use a filter hook for UI state.
