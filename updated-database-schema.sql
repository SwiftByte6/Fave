-- =====================================================
-- UPDATED ECOMMERCE DATABASE SCHEMA
-- =====================================================
-- This schema includes all missing columns and tables
-- Compatible with Supabase PostgreSQL
-- =====================================================

-- =====================================================
-- 1. CORE USER MANAGEMENT
-- =====================================================

-- User profiles (extends auth.users from Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL, -- Clerk user ID
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'vendor')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- =====================================================
-- 2. PRODUCT CATALOG
-- =====================================================

-- Product categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  parent_id uuid,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id uuid,
  stock INTEGER DEFAULT 0,
  sizes TEXT[] DEFAULT '{}',
  attributes JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Product variants (size, color, etc.)
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  sku TEXT UNIQUE,
  size TEXT,
  color TEXT,
  price DECIMAL(10,2),
  stock INTEGER DEFAULT 0,
  attributes JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  bucket TEXT NOT NULL DEFAULT 'product-images',
  storage_path TEXT NOT NULL,
  caption TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Product tags
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Product-tag relationships
CREATE TABLE IF NOT EXISTS product_tags (
  product_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  PRIMARY KEY (product_id, tag_id),
  CONSTRAINT product_tags_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT product_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags(id)
);

-- =====================================================
-- 3. ORDER MANAGEMENT
-- =====================================================

-- Orders (main order table with JSON items)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Clerk user ID
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'success', 'cancelled')),
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  items JSONB NOT NULL DEFAULT '[]', -- Store cart items as JSON array
  payment_id TEXT, -- Razorpay payment ID
  payment_method TEXT DEFAULT 'razorpay',
  razorpay_order_id TEXT, -- Razorpay order ID
  shipping_provider TEXT,
  shipping_tracking TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- =====================================================
-- 4. PAYMENT SYSTEM
-- =====================================================

-- Payment records
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  provider TEXT, -- 'razorpay', 'stripe', etc.
  provider_payment_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- =====================================================
-- 5. SHIPPING & LOGISTICS
-- =====================================================

-- Shipping addresses
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  label TEXT, -- 'Home', 'Office', etc.
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT addresses_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id)
);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  provider TEXT,
  tracking_number TEXT,
  status TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- =====================================================
-- 6. INVENTORY MANAGEMENT
-- =====================================================

-- Inventory logs
CREATE TABLE IF NOT EXISTS inventory_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid,
  variant_id uuid,
  change INTEGER NOT NULL,
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT inventory_logs_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id),
  CONSTRAINT inventory_logs_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES product_variants(id)
);

-- =====================================================
-- 7. MARKETING & PROMOTIONS
-- =====================================================

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT,
  discount_value DECIMAL(10,2),
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Coupon redemptions
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL,
  user_id TEXT,
  order_id uuid,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT coupon_redemptions_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  CONSTRAINT coupon_redemptions_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- =====================================================
-- 8. REVIEWS & RATINGS
-- =====================================================

-- Product reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  user_id TEXT NOT NULL, -- Clerk user ID
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- 9. INDEXES FOR PERFORMANCE
-- =====================================================

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_items ON orders USING GIN (items);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can upsert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Orders RLS policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Addresses RLS policies
CREATE POLICY "Users can view own addresses" ON addresses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = addresses.profile_id 
      AND profiles.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert own addresses" ON addresses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = addresses.profile_id 
      AND profiles.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update own addresses" ON addresses
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = addresses.profile_id 
      AND profiles.user_id = auth.uid()::text
    )
  );

-- Reviews RLS policies
CREATE POLICY "Users can view approved reviews" ON reviews
  FOR SELECT USING (approved = true);

CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid()::text = user_id);

-- =====================================================
-- 11. UTILITY FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
  BEFORE UPDATE ON payments 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 12. VIEWS FOR COMMON QUERIES
-- =====================================================

-- Orders with items view
CREATE OR REPLACE VIEW orders_with_items AS
SELECT 
  o.id,
  o.user_id,
  o.total_amount,
  o.status,
  o.name,
  o.email,
  o.phone,
  o.address,
  o.city,
  o.pincode,
  o.country,
  o.payment_id,
  o.payment_method,
  o.razorpay_order_id,
  o.created_at,
  o.updated_at,
  o.items
FROM orders o;

-- Product details with category
CREATE OR REPLACE VIEW product_details AS
SELECT 
  p.id,
  p.name,
  p.slug,
  p.description,
  p.price,
  p.image_url,
  p.stock,
  p.sizes,
  p.attributes,
  p.is_active,
  p.created_at,
  p.updated_at,
  c.name as category_name,
  c.slug as category_slug
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- =====================================================
-- 13. PERMISSIONS
-- =====================================================

-- Grant permissions to authenticated users
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON orders TO authenticated;
GRANT ALL ON addresses TO authenticated;
GRANT ALL ON reviews TO authenticated;
GRANT SELECT ON products TO authenticated;
GRANT SELECT ON categories TO authenticated;
GRANT SELECT ON product_variants TO authenticated;
GRANT SELECT ON product_images TO authenticated;

-- =====================================================
-- 14. SAMPLE DATA (OPTIONAL)
-- =====================================================

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Women', 'women', 'Women\'s clothing and accessories'),
('Men', 'men', 'Men\'s clothing and accessories'),
('Kids', 'kids', 'Children\'s clothing and accessories'),
('Accessories', 'accessories', 'Fashion accessories and jewelry')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, price, category_id, stock, sizes) VALUES
('Designer Saree', 'designer-saree', 'Beautiful traditional saree', 2999.00, 
 (SELECT id FROM categories WHERE slug = 'women'), 10, ARRAY['S', 'M', 'L']),
('Bridal Lehenga', 'bridal-lehenga', 'Elegant bridal wear', 15999.00, 
 (SELECT id FROM categories WHERE slug = 'women'), 5, ARRAY['S', 'M', 'L', 'XL']),
('Casual T-Shirt', 'casual-tshirt', 'Comfortable casual wear', 599.00, 
 (SELECT id FROM categories WHERE slug = 'men'), 20, ARRAY['S', 'M', 'L', 'XL'])
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SCHEMA COMPLETE
-- =====================================================
