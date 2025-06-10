/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `price` (integer)
      - `original_price` (integer, nullable)
      - `category` (text)
      - `description` (text)
      - `images` (text array)
      - `sizes` (text array)
      - `colors` (text array)
      - `stock` (integer, default 0)
      - `featured` (boolean, default false)
      - `rating` (numeric, default 4.5)
      - `review_count` (integer, default 0)
      - `tags` (text array)
      - `supports_feeding_friendly` (boolean, default false)
      - `is_stitched_dress` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access
    - Add policies for authenticated users to manage products
*/

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

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

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

-- Insert sample data
INSERT INTO products (name, price, original_price, category, description, images, sizes, colors, stock, featured, rating, review_count, tags) VALUES
('Traditional Ikkat Silk Saree', 4500, 6000, 'Sarees', 'Handwoven Ikkat silk saree with traditional geometric patterns. Perfect for special occasions and festivals.', 
 ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg', 'https://images.pexels.com/photos/8106881/pexels-photo-8106881.jpeg'], 
 ARRAY['Free Size'], ARRAY['Maroon', 'Navy Blue', 'Forest Green'], 10, true, 4.8, 124, 
 ARRAY['silk', 'traditional', 'handwoven', 'festival']),

('Cotton Ikkat Frock', 1200, 1500, 'Frocks', 'Comfortable cotton Ikkat frock with beautiful patterns. Perfect for daily wear and casual outings.',
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg', 'https://images.pexels.com/photos/5560020/pexels-photo-5560020.jpeg'],
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Pink', 'Blue', 'Yellow'], 15, true, 4.6, 89,
 ARRAY['cotton', 'casual', 'comfortable', 'daily wear']),

('Ikkat Dress Material Set', 2800, NULL, 'Dress Materials', 'Premium Ikkat dress material set with matching dupatta. Ready to stitch into your preferred style.',
 ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg', 'https://images.pexels.com/photos/7679719/pexels-photo-7679719.jpeg'],
 ARRAY['2.5m', '3m'], ARRAY['Purple', 'Teal', 'Orange'], 8, false, 4.7, 56,
 ARRAY['dress material', 'dupatta', 'premium', 'custom']),

('Designer Ikkat Kurta', 1800, 2200, 'Kurtas', 'Elegant Ikkat kurta with contemporary design. Perfect for office wear and semi-formal occasions.',
 ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'],
 ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Cream', 'Light Blue'], 12, false, 4.5, 78,
 ARRAY['kurta', 'designer', 'office wear', 'semi-formal']),

('Handwoven Ikkat Blouse', 800, NULL, 'Blouses', 'Beautiful handwoven Ikkat blouse to pair with your sarees. Available in multiple sizes and colors.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
 ARRAY['32', '34', '36', '38', '40', '42'], ARRAY['Gold', 'Silver', 'Red', 'Black'], 20, false, 4.4, 45,
 ARRAY['blouse', 'handwoven', 'saree blouse', 'traditional']),

('Festive Ikkat Lehenga Set', 8500, 12000, 'Lehengas', 'Stunning Ikkat lehenga set for weddings and special celebrations. Includes blouse, lehenga, and dupatta.',
 ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'],
 ARRAY['S', 'M', 'L'], ARRAY['Royal Blue', 'Deep Red', 'Emerald Green'], 5, true, 4.9, 203,
 ARRAY['lehenga', 'festive', 'wedding', 'celebration']);