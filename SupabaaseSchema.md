-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.


CREATE TABLE public.order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  title text NOT NULL,
  price numeric NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  images ARRAY DEFAULT '{}'::text[],
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
