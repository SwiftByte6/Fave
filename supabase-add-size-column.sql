-- Migration: Add size column to order_items table
-- This adds size tracking for ordered items

-- Add size column to order_items table
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS size text DEFAULT 'Free Size - Saree';

-- Add size column to orders table items JSONB field (handled via application)
-- The items JSONB already can store size in each item object

-- Add size column to product table to show available sizes
ALTER TABLE public.product
ADD COLUMN IF NOT EXISTS available_sizes text[] DEFAULT ARRAY['XS (Free Size - Saree)', 'S (Free Size - Saree)', 'M (Free Size - Saree)', 'L (Free Size - Saree)', 'XL (Free Size - Saree)', 'XXL (Free Size - Saree)', 'Free Size - Saree'];

-- Create index for faster queries on order_items size
CREATE INDEX IF NOT EXISTS idx_order_items_size ON public.order_items(size);

-- Add comment for clarity
COMMENT ON COLUMN public.order_items.size IS 'Size selected for the ordered item (e.g., XS, S, M, L, XL, XXL, Free Size - Saree)';
COMMENT ON COLUMN public.product.available_sizes IS 'Array of available sizes for the product';
