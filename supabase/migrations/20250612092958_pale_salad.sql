/*
  # Products Table Setup for looom.shop

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `price` (integer, price in paise)
      - `original_price` (integer, original price in paise)
      - `category` (text, product category)
      - `description` (text, product description)
      - `images` (text[], array of image URLs)
      - `sizes` (text[], available sizes)
      - `colors` (text[], available colors)
      - `stock` (integer, stock quantity)
      - `featured` (boolean, featured product flag)
      - `rating` (numeric, product rating)
      - `review_count` (integer, number of reviews)
      - `tags` (text[], product tags)
      - `supports_feeding_friendly` (boolean, feeding friendly flag)
      - `is_stitched_dress` (boolean, stitched dress flag)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policies for public read access
    - Add policies for authenticated users to manage products
    
  3. Indexes
    - Add indexes for better query performance
    - Full-text search index on product names
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL,
  original_price integer,
  category text NOT NULL,
  description text DEFAULT '',
  images text[] DEFAULT '{}',
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  stock integer DEFAULT 0,
  featured boolean DEFAULT false,
  rating numeric DEFAULT 4.5,
  review_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  supports_feeding_friendly boolean DEFAULT false,
  is_stitched_dress boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert products"
  ON products
  FOR INSERT
  TO public
  WITH CHECK (
    (role() = 'authenticated'::text) OR (role() = 'service_role'::text)
  );

CREATE POLICY "Allow authenticated users to update products"
  ON products
  FOR UPDATE
  TO public
  USING (
    (role() = 'authenticated'::text) OR (role() = 'service_role'::text)
  )
  WITH CHECK (
    (role() = 'authenticated'::text) OR (role() = 'service_role'::text)
  );

CREATE POLICY "Allow authenticated users to delete products"
  ON products
  FOR DELETE
  TO public
  USING (
    (role() = 'authenticated'::text) OR (role() = 'service_role'::text)
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products (featured);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products (created_at DESC);
CREATE INDEX IF NOT EXISTS products_name_search_idx ON products USING gin (to_tsvector('english', name));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products from mock data
INSERT INTO products (name, price, original_price, category, description, images, sizes, colors, stock, featured, rating, review_count, tags, supports_feeding_friendly, is_stitched_dress) VALUES
  (
    'Traditional Ikkat Patterned Dress',
    100000, -- ₹1000 in paise
    120000, -- ₹1200 in paise
    'Frocks',
    'Beautiful traditional Ikkat patterned dress featuring vibrant red, orange, and brown geometric patterns. Perfect for casual wear and special occasions with its comfortable fit and elegant design.',
    ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'],
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Red', 'Orange', 'Brown'],
    10,
    true,
    4.7,
    15,
    ARRAY['ikkat', 'traditional', 'patterned', 'casual', 'comfortable'],
    false,
    true
  ),
  (
    'Traditional Ikkat Silk Saree',
    450000, -- ₹4500 in paise
    600000, -- ₹6000 in paise
    'Sarees',
    'Handwoven Ikkat silk saree with traditional geometric patterns. Perfect for special occasions and festivals.',
    ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg', 'https://images.pexels.com/photos/8106881/pexels-photo-8106881.jpeg'],
    ARRAY['Free Size'],
    ARRAY['Maroon', 'Navy Blue', 'Forest Green'],
    5,
    true,
    4.8,
    124,
    ARRAY['silk', 'traditional', 'handwoven', 'festival'],
    false,
    false
  ),
  (
    'Cotton Ikkat Frock',
    120000, -- ₹1200 in paise
    150000, -- ₹1500 in paise
    'Frocks',
    'Comfortable cotton Ikkat frock with beautiful patterns. Perfect for daily wear and casual outings.',
    ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg', 'https://images.pexels.com/photos/5560020/pexels-photo-5560020.jpeg'],
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Pink', 'Blue', 'Yellow'],
    15,
    true,
    4.6,
    89,
    ARRAY['cotton', 'casual', 'comfortable', 'daily wear'],
    false,
    true
  ),
  (
    'Ikkat Dress Material Set',
    280000, -- ₹2800 in paise
    NULL,
    'Dress Materials',
    'Premium Ikkat dress material set with matching dupatta. Ready to stitch into your preferred style.',
    ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg', 'https://images.pexels.com/photos/7679719/pexels-photo-7679719.jpeg'],
    ARRAY['2.5m', '3m'],
    ARRAY['Purple', 'Teal', 'Orange'],
    8,
    false,
    4.7,
    56,
    ARRAY['dress material', 'dupatta', 'premium', 'custom'],
    false,
    false
  ),
  (
    'Designer Ikkat Kurta',
    180000, -- ₹1800 in paise
    220000, -- ₹2200 in paise
    'Kurtas',
    'Elegant Ikkat kurta with contemporary design. Perfect for office wear and semi-formal occasions.',
    ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['White', 'Cream', 'Light Blue'],
    12,
    false,
    4.5,
    78,
    ARRAY['kurta', 'designer', 'office wear', 'semi-formal'],
    false,
    false
  ),
  (
    'Handwoven Ikkat Blouse',
    80000, -- ₹800 in paise
    NULL,
    'Blouses',
    'Beautiful handwoven Ikkat blouse to pair with your sarees. Available in multiple sizes and colors.',
    ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
    ARRAY['32', '34', '36', '38', '40', '42'],
    ARRAY['Gold', 'Silver', 'Red', 'Black'],
    20,
    false,
    4.4,
    45,
    ARRAY['blouse', 'handwoven', 'saree blouse', 'traditional'],
    false,
    false
  ),
  (
    'Festive Ikkat Lehenga Set',
    850000, -- ₹8500 in paise
    1200000, -- ₹12000 in paise
    'Lehengas',
    'Stunning Ikkat lehenga set for weddings and special celebrations. Includes blouse, lehenga, and dupatta.',
    ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'],
    ARRAY['S', 'M', 'L'],
    ARRAY['Royal Blue', 'Deep Red', 'Emerald Green'],
    3,
    true,
    4.9,
    203,
    ARRAY['lehenga', 'festive', 'wedding', 'celebration'],
    false,
    false
  );