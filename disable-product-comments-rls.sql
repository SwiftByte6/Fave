-- Disable RLS for product_comments table (simpler approach with Clerk)
-- Run this in your Supabase SQL editor

-- Disable Row Level Security for product_comments table
ALTER TABLE public.product_comments DISABLE ROW LEVEL SECURITY;

-- This allows the application (with Clerk authentication) to handle all access control
-- Clerk will ensure only authenticated users can submit comments
