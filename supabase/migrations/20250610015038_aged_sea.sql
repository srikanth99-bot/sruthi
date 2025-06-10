/*
  # Create products table for looom.shop

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `price` (integer, required) - stored in paise/cents
      - `original_price` (integer, optional) - stored in paise/cents
      - `category` (text, required)
      - `description` (text)
      - `images` (text array)
      - `sizes` (text array)
      - `colors` (text array)
      - `stock` (integer, default 0)
      - `featured` (boolean, default false)
      - `rating` (decimal, default 4.5)
      - `review_count` (integer, default 0)
      - `tags` (text array)
      - `supports_feeding_friendly` (boolean, default false)
      - `is_stitched_dress` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policies for public read access
    - Add policies for authenticated users to insert/update/delete
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
  rating decimal(3,2) DEFAULT 4.5,
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
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS products_name_search_idx ON products USING gin(to_tsvector('english', name));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO products (name, price, original_price, category, description, images, sizes, colors, stock, featured, tags) VALUES
  (
    'Traditional Ikkat Silk Saree',
    450000,
    600000,
    'Sarees',
    'Handwoven Ikkat silk saree with traditional geometric patterns. Perfect for special occasions and festivals.',
    ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg', 'https://images.pexels.com/photos/8106881/pexels-photo-8106881.jpeg'],
    ARRAY['Free Size'],
    ARRAY['Maroon', 'Navy Blue', 'Forest Green'],
    10,
    true,
    ARRAY['silk', 'traditional', 'handwoven', 'festival']
  ),
  (
    'Cotton Ikkat Frock',
    120000,
    150000,
    'Frocks',
    'Comfortable cotton Ikkat frock with beautiful patterns. Perfect for daily wear and casual outings.',
    ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg', 'https://images.pexels.com/photos/5560020/pexels-photo-5560020.jpeg'],
    ARRAY['S', 'M', 'L', 'XL'],
    ARRAY['Pink', 'Blue', 'Yellow'],
    15,
    true,
    ARRAY['cotton', 'casual', 'comfortable', 'daily wear']
  ),
  (
    'Ikkat Dress Material Set',
    280000,
    null,
    'Dress Materials',
    'Premium Ikkat dress material set with matching dupatta. Ready to stitch into your preferred style.',
    ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg', 'https://images.pexels.com/photos/7679719/pexels-photo-7679719.jpeg'],
    ARRAY['2.5m', '3m'],
    ARRAY['Purple', 'Teal', 'Orange'],
    8,
    false,
    ARRAY['dress material', 'dupatta', 'premium', 'custom']
  ),
  (
    'Designer Ikkat Kurta',
    180000,
    220000,
    'Kurtas',
    'Elegant Ikkat kurta with contemporary design. Perfect for office wear and semi-formal occasions.',
    ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'],
    ARRAY['S', 'M', 'L', 'XL', 'XXL'],
    ARRAY['White', 'Cream', 'Light Blue'],
    12,
    false,
    ARRAY['kurta', 'designer', 'office wear', 'semi-formal']
  ),
  (
    'Handwoven Ikkat Blouse',
    80000,
    null,
    'Blouses',
    'Beautiful handwoven Ikkat blouse to pair with your sarees. Available in multiple sizes and colors.',
    ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
    ARRAY['32', '34', '36', '38', '40', '42'],
    ARRAY['Gold', 'Silver', 'Red', 'Black'],
    20,
    false,
    ARRAY['blouse', 'handwoven', 'saree blouse', 'traditional']
  ),
  (
    'Festive Ikkat Lehenga Set',
    850000,
    1200000,
    'Lehengas',
    'Stunning Ikkat lehenga set for weddings and special celebrations. Includes blouse, lehenga, and dupatta.',
    ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'],
    ARRAY['S', 'M', 'L'],
    ARRAY['Royal Blue', 'Deep Red', 'Emerald Green'],
    5,
    true,
    ARRAY['lehenga', 'festive', 'wedding', 'celebration']
  )
ON CONFLICT (id) DO NOTHING;