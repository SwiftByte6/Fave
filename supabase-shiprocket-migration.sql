-- Shiprocket Integration - Database Schema Updates
-- Execute these queries in your Supabase SQL Editor
-- Date: November 28, 2025

-- ===================================================================
-- 1. UPDATE ORDERS TABLE - Add Shiprocket specific columns
-- ===================================================================

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipment_id text,
ADD COLUMN IF NOT EXISTS awb_code text,
ADD COLUMN IF NOT EXISTS courier_id integer,
ADD COLUMN IF NOT EXISTS courier_name text,
ADD COLUMN IF NOT EXISTS tracking_url text,
ADD COLUMN IF NOT EXISTS shipping_status varchar DEFAULT 'pending' CHECK (shipping_status IN ('pending', 'pickup_scheduled', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned')),
ADD COLUMN IF NOT EXISTS pickup_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS expected_delivery_date date,
ADD COLUMN IF NOT EXISTS actual_delivery_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS shiprocket_order_id text,
ADD COLUMN IF NOT EXISTS shipping_charges numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS order_weight numeric DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS order_length numeric DEFAULT 20,
ADD COLUMN IF NOT EXISTS order_breadth numeric DEFAULT 15,
ADD COLUMN IF NOT EXISTS order_height numeric DEFAULT 5;

-- Add unique constraint for Shiprocket order ID
ALTER TABLE public.orders 
ADD CONSTRAINT unique_shiprocket_order_id UNIQUE (shiprocket_order_id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_shiprocket_order_id ON public.orders(shiprocket_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_status ON public.orders(shipping_status);
CREATE INDEX IF NOT EXISTS idx_orders_awb_code ON public.orders(awb_code);

-- ===================================================================
-- 2. UPDATE PRODUCTS TABLE - Add physical attributes for shipping
-- ===================================================================

ALTER TABLE public.product
ADD COLUMN IF NOT EXISTS weight numeric DEFAULT 0.3,        -- Weight in kg
ADD COLUMN IF NOT EXISTS length numeric DEFAULT 25,         -- Length in cm  
ADD COLUMN IF NOT EXISTS breadth numeric DEFAULT 20,        -- Breadth in cm
ADD COLUMN IF NOT EXISTS height numeric DEFAULT 3,          -- Height in cm
ADD COLUMN IF NOT EXISTS hsn_code text DEFAULT '6204',      -- HSN for women's clothing
ADD COLUMN IF NOT EXISTS is_fragile boolean DEFAULT false;

-- ===================================================================
-- 3. CREATE SHIPROCKET SETTINGS TABLE
-- ===================================================================

CREATE TABLE IF NOT EXISTS public.shiprocket_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    api_token text,
    token_expires_at timestamp with time zone,
    company_name text DEFAULT 'FAVEE',
    pickup_address jsonb DEFAULT '{
        "pickup_location": "Primary",
        "name": "FAVEE",
        "email": "orders@favee.com", 
        "phone": "9876543210",
        "address": "123 Fashion Street",
        "address_2": "Near City Mall",
        "city": "Mumbai",
        "state": "Maharashtra",
        "country": "India",
        "pin_code": "400001"
    }'::jsonb,
    webhook_secret text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT shiprocket_settings_pkey PRIMARY KEY (id)
);

-- ===================================================================
-- 4. CREATE SHIPPING LOGS TABLE (Optional - for debugging)
-- ===================================================================

CREATE TABLE IF NOT EXISTS public.shipping_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    order_id uuid REFERENCES public.orders(id),
    shiprocket_order_id text,
    event_type text NOT NULL, -- 'order_created', 'status_update', 'webhook_received'
    status_from text,
    status_to text,
    webhook_data jsonb,
    api_response jsonb,
    error_message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    CONSTRAINT shipping_logs_pkey PRIMARY KEY (id)
);

-- Add indexes for shipping logs
CREATE INDEX IF NOT EXISTS idx_shipping_logs_order_id ON public.shipping_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_logs_event_type ON public.shipping_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_shipping_logs_created_at ON public.shipping_logs(created_at);

-- ===================================================================
-- 5. INSERT DEFAULT SHIPROCKET SETTINGS
-- ===================================================================

INSERT INTO public.shiprocket_settings (id, company_name, pickup_address, is_active)
VALUES (
    gen_random_uuid(),
    'FAVEE',
    '{
        "pickup_location": "Primary",
        "name": "FAVEE",
        "email": "orders@favee.com", 
        "phone": "9876543210",
        "address": "123 Fashion Street",
        "address_2": "Near City Mall",
        "city": "Mumbai",
        "state": "Maharashtra", 
        "country": "India",
        "pin_code": "400001"
    }'::jsonb,
    true
) ON CONFLICT (id) DO NOTHING;

-- ===================================================================
-- 6. UPDATE DEFAULT PRODUCT WEIGHTS (Optional - Update existing products)
-- ===================================================================

-- Update existing products with default shipping attributes
-- Adjust these values based on your actual product categories
UPDATE public.product 
SET 
    weight = CASE 
        WHEN category ILIKE '%dress%' OR category ILIKE '%gown%' THEN 0.5
        WHEN category ILIKE '%top%' OR category ILIKE '%shirt%' THEN 0.3
        WHEN category ILIKE '%pants%' OR category ILIKE '%jeans%' THEN 0.4
        WHEN category ILIKE '%jacket%' OR category ILIKE '%coat%' THEN 0.7
        ELSE 0.3
    END,
    length = CASE 
        WHEN category ILIKE '%dress%' OR category ILIKE '%gown%' THEN 30
        WHEN category ILIKE '%pants%' OR category ILIKE '%jeans%' THEN 35
        ELSE 25
    END,
    height = CASE 
        WHEN category ILIKE '%jacket%' OR category ILIKE '%coat%' THEN 5
        ELSE 3
    END
WHERE weight IS NULL OR weight = 0;

-- ===================================================================
-- 7. CREATE USEFUL VIEWS (Optional)
-- ===================================================================

-- View for orders with shipping details
CREATE OR REPLACE VIEW orders_with_shipping AS
SELECT 
    o.*,
    CASE 
        WHEN o.shipping_status = 'delivered' THEN 'Delivered'
        WHEN o.shipping_status = 'out_for_delivery' THEN 'Out for Delivery'
        WHEN o.shipping_status = 'in_transit' THEN 'In Transit'
        WHEN o.shipping_status = 'picked_up' THEN 'Picked Up'
        WHEN o.shipping_status = 'pickup_scheduled' THEN 'Pickup Scheduled'
        ELSE 'Processing'
    END as shipping_status_display,
    CASE 
        WHEN o.actual_delivery_date IS NOT NULL THEN o.actual_delivery_date
        WHEN o.expected_delivery_date IS NOT NULL THEN o.expected_delivery_date::timestamp with time zone
        ELSE (o.created_at + INTERVAL '5 days')
    END as delivery_estimate
FROM public.orders o;

-- ===================================================================
-- 8. ENABLE ROW LEVEL SECURITY (RLS) FOR NEW TABLES
-- ===================================================================

-- Enable RLS on shiprocket_settings (admin only access)
ALTER TABLE public.shiprocket_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can read shiprocket settings
CREATE POLICY "Enable read access for authenticated users" ON public.shiprocket_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Only service role can modify shiprocket settings  
CREATE POLICY "Enable insert/update for service role" ON public.shiprocket_settings
    FOR ALL USING (auth.role() = 'service_role');

-- Enable RLS on shipping_logs
ALTER TABLE public.shipping_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see logs for their orders
CREATE POLICY "Users can view their own shipping logs" ON public.shipping_logs
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM public.orders WHERE user_id = auth.uid()::text
        )
    );

-- Policy: Service role can manage all shipping logs
CREATE POLICY "Service role can manage shipping logs" ON public.shipping_logs
    FOR ALL USING (auth.role() = 'service_role');

-- ===================================================================
-- VERIFICATION QUERIES - Run these to verify the migration
-- ===================================================================

-- Check if all columns were added to orders table
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
AND column_name IN (
    'shipment_id', 'awb_code', 'courier_id', 'courier_name', 
    'tracking_url', 'shipping_status', 'shiprocket_order_id'
);

-- Check if shiprocket_settings table was created
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'shiprocket_settings'
);

-- Check if default settings were inserted
SELECT count(*) as settings_count FROM public.shiprocket_settings;

-- ===================================================================
-- ROLLBACK QUERIES (Use only if you need to revert changes)
-- ===================================================================

/*
-- CAUTION: These queries will remove all Shiprocket integration data
-- Only run if you need to completely rollback the integration

-- Remove columns from orders table
ALTER TABLE public.orders 
DROP COLUMN IF EXISTS shipment_id,
DROP COLUMN IF EXISTS awb_code,
DROP COLUMN IF EXISTS courier_id,
DROP COLUMN IF EXISTS courier_name,
DROP COLUMN IF EXISTS tracking_url,
DROP COLUMN IF EXISTS shipping_status,
DROP COLUMN IF EXISTS pickup_date,
DROP COLUMN IF EXISTS expected_delivery_date,
DROP COLUMN IF EXISTS actual_delivery_date,
DROP COLUMN IF EXISTS shiprocket_order_id,
DROP COLUMN IF EXISTS shipping_charges,
DROP COLUMN IF EXISTS order_weight,
DROP COLUMN IF EXISTS order_length,
DROP COLUMN IF EXISTS order_breadth,
DROP COLUMN IF EXISTS order_height;

-- Remove columns from products table
ALTER TABLE public.product
DROP COLUMN IF EXISTS weight,
DROP COLUMN IF EXISTS length,
DROP COLUMN IF EXISTS breadth,
DROP COLUMN IF EXISTS height,
DROP COLUMN IF EXISTS hsn_code,
DROP COLUMN IF EXISTS is_fragile;

-- Drop tables
DROP TABLE IF EXISTS public.shipping_logs;
DROP TABLE IF EXISTS public.shiprocket_settings;

-- Drop view
DROP VIEW IF EXISTS orders_with_shipping;
*/