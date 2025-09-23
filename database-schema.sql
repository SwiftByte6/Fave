-- Database Schema for Orders and History System
-- Run these SQL commands in your Supabase SQL editor

-- 1. Create orders table (if not exists)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'success', 'cancelled')),
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create order_items table (if not exists)
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for orders table
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid()::text = user_id);

-- 6. Create RLS policies for order_items table
CREATE POLICY "Users can view items from their own orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can insert items to their own orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()::text
    )
  );

-- 7. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 9. Insert sample data for testing (optional)
-- INSERT INTO orders (user_id, total_amount, status, name, email, phone, address, city, pincode) 
-- VALUES 
--   ('test-user-1', 2999.00, 'success', 'John Doe', 'john@example.com', '+91-9876543210', '123 Main St', 'Mumbai', '400001'),
--   ('test-user-1', 1599.00, 'delivered', 'John Doe', 'john@example.com', '+91-9876543210', '123 Main St', 'Mumbai', '400001');

-- INSERT INTO order_items (order_id, title, price, quantity, images) 
-- VALUES 
--   (1, 'Designer Saree', 1499.00, 2, ARRAY['https://example.com/saree1.jpg']),
--   (1, 'Bridal Lehenga', 1500.00, 1, ARRAY['https://example.com/lehenga1.jpg']),
--   (2, 'Casual Wear', 1599.00, 1, ARRAY['https://example.com/casual1.jpg']);

-- 10. View to get orders with items (useful for complex queries)
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
  o.created_at,
  o.updated_at,
  json_agg(
    json_build_object(
      'id', oi.id,
      'title', oi.title,
      'price', oi.price,
      'quantity', oi.quantity,
      'images', oi.images
    )
  ) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- 11. Grant necessary permissions
GRANT ALL ON orders TO authenticated;
GRANT ALL ON order_items TO authenticated;
-- UUID uses gen_random_uuid(), no sequence grants needed

-- 12. Profiles table for user info used in account page
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  pincode TEXT,
  country TEXT DEFAULT 'India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can upsert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = user_id);

GRANT ALL ON profiles TO authenticated;
