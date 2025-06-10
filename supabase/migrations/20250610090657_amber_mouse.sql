/*
  # Fix Row Level Security Policies for Products Table

  1. Security Updates
    - Drop existing conflicting policies
    - Add proper policies for public read access
    - Add proper policies for authenticated user write access
    - Ensure admin operations work correctly

  2. Policy Structure
    - Public users can read all products
    - Authenticated users can perform all operations (insert, update, delete)
    - This supports both customer browsing and admin management
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;

-- Create comprehensive RLS policies
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON products
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Ensure RLS is enabled
ALTER TABLE products ENABLE ROW LEVEL SECURITY;