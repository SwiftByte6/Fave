-- Fix RLS policies for product_comments table with Clerk authentication
-- Run this in your Supabase SQL editor

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read product comments" ON public.product_comments;
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON public.product_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.product_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.product_comments;
DROP POLICY IF EXISTS "Allow comment insertion" ON public.product_comments;

-- Create new policies that work with Clerk authentication
-- Allow anyone to read comments
CREATE POLICY "Allow comment reading" ON public.product_comments
    FOR SELECT USING (true);

-- Allow anyone to insert comments (Clerk handles auth at app level)
CREATE POLICY "Allow comment insertion" ON public.product_comments
    FOR INSERT WITH CHECK (true);

-- Allow anyone to update comments (Clerk handles auth at app level)
CREATE POLICY "Allow comment updates" ON public.product_comments
    FOR UPDATE USING (true);

-- Allow anyone to delete comments (Clerk handles auth at app level)
CREATE POLICY "Allow comment deletion" ON public.product_comments
    FOR DELETE USING (true);
