# Product Comments Feature

This document describes the product comments/reviews feature implemented for the ecommerce application.

## Overview

The product comments feature allows customers to leave reviews and comments on product detail pages. It integrates with Supabase for data storage and Clerk for user authentication.

## Database Schema

The feature uses a `product_comments` table with the following structure:

```sql
CREATE TABLE public.product_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id integer NOT NULL,
  user_id text NOT NULL,
  user_name text NULL,
  content text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT product_comments_pkey PRIMARY KEY (id)
);
```

## Components

### ProductComments.tsx
- **Purpose**: Handles the display and submission of product comments
- **Features**:
  - Displays existing comments with user names and timestamps
  - Allows authenticated users to submit new comments
  - Shows loading states and empty states
  - Formats timestamps in a user-friendly way (e.g., "2h ago", "3d ago")
  - Includes user avatars with initials

### ProductDetailPage.tsx
- **Purpose**: Main product detail page that includes the comments section
- **Integration**: Uses the `ProductComments` component to display comments for each product

## Features

1. **User Authentication**: Only authenticated users can submit comments
2. **Real-time Updates**: Comments are immediately visible after submission
3. **User-friendly Timestamps**: Shows relative time (e.g., "2h ago") instead of full dates
4. **Responsive Design**: Works well on mobile and desktop devices
5. **Loading States**: Shows appropriate loading indicators
6. **Empty States**: Encourages users to be the first to review

## Usage

1. Navigate to any product detail page (`/products/[id]`)
2. Scroll down to the "Customer Reviews" section
3. If not signed in, you'll see a "Sign in to write a review" placeholder
4. If signed in, you can type a review and click "Submit"
5. Your review will appear immediately in the comments list

## Database Setup

To set up the database schema, run the SQL commands in `product-comments-schema.sql`:

1. Create the table with proper indexes
2. Set up Row Level Security (RLS) policies
3. Configure policies for read/write access

## Security

- Row Level Security (RLS) is enabled on the table
- Users can only update/delete their own comments
- Anyone can read comments (public reviews)
- Only authenticated users can create comments

## Dependencies

- Supabase: For database operations
- Clerk: For user authentication
- React Hot Toast: For user feedback notifications
- Next.js: For the application framework

## File Structure

```
component/
├── ProductComments.tsx      # Comments component
├── ProductDetailPage.tsx    # Main product page
└── ...

product-comments-schema.sql  # Database schema
PRODUCT_COMMENTS_README.md   # This documentation
```
