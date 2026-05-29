-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.contacts (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  mobile text,
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text])),
  discount_value numeric NOT NULL,
  min_order_amount numeric,
  max_discount numeric,
  expiry_date date,
  usage_limit integer,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);
CREATE TABLE public.likes_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  track_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT likes_log_pkey PRIMARY KEY (id)
);
CREATE TABLE public.listings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  title text,
  description text,
  rent integer,
  contact_number text,
  image_url text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT listings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.music_likes (
  track_id text NOT NULL,
  likes integer DEFAULT 0,
  CONSTRAINT music_likes_pkey PRIMARY KEY (track_id)
);
CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  title text NOT NULL,
  price numeric NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  images ARRAY DEFAULT '{}'::text[],
  size text DEFAULT 'Free Size - Saree'::text,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  city text,
  pincode text,
  country text DEFAULT 'India'::text,
  total_amount numeric NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT now(),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying::text, 'processing'::character varying::text, 'shipped'::character varying::text, 'delivered'::character varying::text, 'cancelled'::character varying::text, 'confirmed'::character varying::text, 'success'::character varying::text])),
  discount_amount numeric DEFAULT 0,
  shipping_cost numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  payment_status character varying DEFAULT 'pending'::character varying CHECK (payment_status::text = ANY (ARRAY['pending'::character varying::text, 'success'::character varying::text, 'failed'::character varying::text, 'refunded'::character varying::text])),
  payment_method text DEFAULT 'razorpay'::text,
  payment_id text,
  razorpay_order_id text,
  razorpay_signature text,
  order_number text,
  notes text,
  tracking_number text,
  estimated_delivery date,
  delivered_at timestamp with time zone,
  shipment_id text,
  awb_code text,
  courier_id integer,
  courier_name text,
  tracking_url text,
  shipping_status character varying DEFAULT 'pending'::character varying CHECK (shipping_status::text = ANY (ARRAY['pending'::character varying, 'pickup_scheduled'::character varying, 'picked_up'::character varying, 'in_transit'::character varying, 'out_for_delivery'::character varying, 'delivered'::character varying, 'cancelled'::character varying, 'returned'::character varying]::text[])),
  pickup_date timestamp with time zone,
  expected_delivery_date date,
  actual_delivery_date timestamp with time zone,
  shiprocket_order_id text UNIQUE,
  shipping_charges numeric DEFAULT 0,
  order_weight numeric DEFAULT 0.5,
  order_length numeric DEFAULT 20,
  order_breadth numeric DEFAULT 15,
  order_height numeric DEFAULT 5,
  razorpay_payment_id text,
  CONSTRAINT orders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  title text,
  price integer,
  description character varying,
  category character varying,
  rating json,
  quantity integer,
  images ARRAY,
  sizes ARRAY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  weight numeric DEFAULT 0.3,
  length numeric DEFAULT 25,
  breadth numeric DEFAULT 20,
  height numeric DEFAULT 3,
  hsn_code text DEFAULT '6204'::text,
  is_fragile boolean DEFAULT false,
  available_sizes ARRAY DEFAULT ARRAY['XS (Free Size - Saree)'::text, 'S (Free Size - Saree)'::text, 'M (Free Size - Saree)'::text, 'L (Free Size - Saree)'::text, 'XL (Free Size - Saree)'::text, 'XXL (Free Size - Saree)'::text, 'Free Size - Saree'::text],
  CONSTRAINT product_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id integer NOT NULL,
  user_id text NOT NULL,
  user_name text,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT product_comments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  role text NOT NULL DEFAULT 'user'::text CHECK (role = ANY (ARRAY['admin'::text, 'user'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.query (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  email text,
  number text,
  type text,
  message text,
  CONSTRAINT query_pkey PRIMARY KEY (id)
);
CREATE TABLE public.razorpay_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  product_name text NOT NULL,
  amount bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR'::text,
  razorpay_order_id text,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  customer_name text,
  phone text,
  address text,
  state text,
  email text,
  CONSTRAINT razorpay_orders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.razorpay_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  razorpay_payment_id text,
  amount bigint NOT NULL,
  status text NOT NULL,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT razorpay_payments_pkey PRIMARY KEY (id),
  CONSTRAINT razorpay_payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.razorpay_orders(id)
);
CREATE TABLE public.rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  rent integer,
  address text,
  gender text,
  contact text,
  image_url text,
  user_id uuid,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  room_size integer,
  amenities ARRAY,
  CONSTRAINT rooms_pkey PRIMARY KEY (id),
  CONSTRAINT rooms_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.shipping_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid,
  shiprocket_order_id text,
  event_type text NOT NULL,
  status_from text,
  status_to text,
  webhook_data jsonb,
  api_response jsonb,
  error_message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT shipping_logs_pkey PRIMARY KEY (id),
  CONSTRAINT shipping_logs_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id)
);
CREATE TABLE public.shiprocket_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  api_token text,
  token_expires_at timestamp with time zone,
  company_name text DEFAULT 'Elegance Boutique'::text,
  pickup_address jsonb DEFAULT '{"city": "Mumbai", "name": "Elegance Boutique", "email": "orders@eleganceboutique.com", "phone": "9876543210", "state": "Maharashtra", "address": "123 Fashion Street", "country": "India", "pin_code": "400001", "address_2": "Near City Mall", "pickup_location": "Primary"}'::jsonb,
  webhook_secret text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shiprocket_settings_pkey PRIMARY KEY (id)
);