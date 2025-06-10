-- Fix authentication and RLS policies for products table

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON products;

-- Create comprehensive RLS policies that work with both authenticated and anonymous users
CREATE POLICY "Allow public read access to products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert products" ON products
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Allow authenticated users to update products" ON products
  FOR UPDATE USING (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  ) WITH CHECK (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  );

CREATE POLICY "Allow authenticated users to delete products" ON products
  FOR DELETE USING (
    auth.role() = 'authenticated' OR 
    auth.role() = 'service_role'
  );

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated users
GRANT ALL ON products TO authenticated;
GRANT ALL ON products TO service_role;

-- Create a function to check if user is admin (optional for future use)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email LIKE '%admin%'
  );
$$;