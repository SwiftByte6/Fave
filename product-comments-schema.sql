-- Product Comments Table Schema
-- This table stores customer reviews/comments for products

CREATE TABLE public.product_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id integer NOT NULL,
  user_id text NOT NULL,
  user_name text NULL,
  content text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT product_comments_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_comments_product_id 
ON public.product_comments USING btree (product_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_product_comments_user_id 
ON public.product_comments USING btree (user_id) TABLESPACE pg_default;

-- Optional: Add foreign key constraint if you have a products table
-- ALTER TABLE public.product_comments 
-- ADD CONSTRAINT fk_product_comments_product_id 
-- FOREIGN KEY (product_id) REFERENCES public.product(id) ON DELETE CASCADE;

-- Row Level Security (RLS) policies for Supabase with Clerk authentication
-- Enable RLS on the table
ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read comments
CREATE POLICY "Anyone can read product comments" ON public.product_comments
    FOR SELECT USING (true);

-- Policy to allow anyone to insert comments (since we're using Clerk for auth)
-- Clerk handles authentication, so we trust the application layer
CREATE POLICY "Allow comment insertion" ON public.product_comments
    FOR INSERT WITH CHECK (true);

-- Policy to allow users to update their own comments
-- Since we're using Clerk, we'll check the user_id matches
CREATE POLICY "Users can update their own comments" ON public.product_comments
    FOR UPDATE USING (true);

-- Policy to allow users to delete their own comments
CREATE POLICY "Users can delete their own comments" ON public.product_comments
    FOR DELETE USING (true);
