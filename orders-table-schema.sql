-- =====================================================
-- UPDATED ORDERS TABLE SCHEMA
-- =====================================================
-- This schema matches the provided orders table structure
-- Compatible with Supabase PostgreSQL
-- =====================================================

-- Drop existing orders table if it exists (be careful in production!)
-- DROP TABLE IF EXISTS orders CASCADE;

-- Create the orders table with the exact schema provided
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text NULL,
  pincode text NULL,
  country text NULL DEFAULT 'India'::text,
  total_amount numeric NOT NULL,
  created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NULL DEFAULT now(),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  status character varying(50) NULL DEFAULT 'pending'::character varying,
  discount_amount numeric NULL DEFAULT 0,
  shipping_cost numeric NULL DEFAULT 0,
  tax_amount numeric NULL DEFAULT 0,
  payment_status character varying(20) NULL DEFAULT 'pending'::character varying,
  payment_method text NULL DEFAULT 'razorpay'::text,
  payment_id text NULL,
  razorpay_order_id text NULL,
  razorpay_signature text NULL,
  order_number text NULL,
  notes text NULL,
  tracking_number text NULL,
  estimated_delivery date NULL,
  delivered_at timestamp with time zone NULL,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_order_status_check CHECK (
    (
      (status)::text = ANY (
        ARRAY[
          ('pending'::character varying)::text,
          ('processing'::character varying)::text,
          ('shipped'::character varying)::text,
          ('delivered'::character varying)::text,
          ('cancelled'::character varying)::text,
          ('confirmed'::character varying)::text,
          ('success'::character varying)::text
        ]
      )
    )
  ),
  CONSTRAINT orders_payment_status_check CHECK (
    (
      (payment_status)::text = ANY (
        ARRAY[
          ('pending'::character varying)::text,
          ('success'::character varying)::text,
          ('failed'::character varying)::text,
          ('refunded'::character varying)::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders USING btree (payment_status) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders USING btree (payment_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders USING btree (order_number) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_orders_items ON public.orders USING gin (items) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders USING btree (user_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders USING btree (status) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders USING btree (created_at) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders USING btree (razorpay_order_id) TABLESPACE pg_default;

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Grant permissions
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
