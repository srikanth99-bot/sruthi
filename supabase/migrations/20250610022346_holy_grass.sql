/*
  # Fix Products Table Migration

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `price` (integer, required - stored in paise)
      - `original_price` (integer, optional - stored in paise)
      - `category` (text, required)
      - `description` (text, default empty)
      - `images` (text array, default empty)
      - `sizes` (text array, default empty)
      - `colors` (text array, default empty)
      - `stock` (integer, default 0)
      - `featured` (boolean, default false)
      - `rating` (numeric, default 4.5)
      - `review_count` (integer, default 0)
      - `tags` (text array, default empty)
      - `supports_feeding_friendly` (boolean, default false)
      - `is_stitched_dress` (boolean, default false)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `products` table
    - Add policies for public read access
    - Add policies for authenticated user operations
*/

-- Drop existing table if it exists to start fresh
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (prices in paise: ₹45.00 = 4500 paise)
INSERT INTO products (name, price, original_price, category, description, images, sizes, colors, stock, featured, rating, review_count, tags) VALUES
('Traditional Ikkat Silk Saree', 450000, 600000, 'Sarees', 'Handwoven Ikkat silk saree with traditional geometric patterns. Perfect for special occasions and festivals.', 
 ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg', 'https://images.pexels.com/photos/8106881/pexels-photo-8106881.jpeg'], 
 ARRAY['Free Size'], ARRAY['Maroon', 'Navy Blue', 'Forest Green'], 10, true, 4.8, 124, 
 ARRAY['silk', 'traditional', 'handwoven', 'festival']),

('Cotton Ikkat Frock', 120000, 150000, 'Frocks', 'Comfortable cotton Ikkat frock with beautiful patterns. Perfect for daily wear and casual outings.',
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg', 'https://images.pexels.com/photos/5560020/pexels-photo-5560020.jpeg'],
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Pink', 'Blue', 'Yellow'], 15, true, 4.6, 89,
 ARRAY['cotton', 'casual', 'comfortable', 'daily wear']),

('Ikkat Dress Material Set', 280000, NULL, 'Dress Materials', 'Premium Ikkat dress material set with matching dupatta. Ready to stitch into your preferred style.',
 ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg', 'https://images.pexels.com/photos/7679719/pexels-photo-7679719.jpeg'],
 ARRAY['2.5m', '3m'], ARRAY['Purple', 'Teal', 'Orange'], 8, false, 4.7, 56,
 ARRAY['dress material', 'dupatta', 'premium', 'custom']),

('Designer Ikkat Kurta', 180000, 220000, 'Kurtas', 'Elegant Ikkat kurta with contemporary design. Perfect for office wear and semi-formal occasions.',
 ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'],
 ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Cream', 'Light Blue'], 12, false, 4.5, 78,
 ARRAY['kurta', 'designer', 'office wear', 'semi-formal']),

('Handwoven Ikkat Blouse', 80000, NULL, 'Blouses', 'Beautiful handwoven Ikkat blouse to pair with your sarees. Available in multiple sizes and colors.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
 ARRAY['32', '34', '36', '38', '40', '42'], ARRAY['Gold', 'Silver', 'Red', 'Black'], 20, false, 4.4, 45,
 ARRAY['blouse', 'handwoven', 'saree blouse', 'traditional']),

('Festive Ikkat Lehenga Set', 850000, 1200000, 'Lehengas', 'Stunning Ikkat lehenga set for weddings and special celebrations. Includes blouse, lehenga, and dupatta.',
 ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'],
 ARRAY['S', 'M', 'L'], ARRAY['Royal Blue', 'Deep Red', 'Emerald Green'], 5, true, 4.9, 203,
 ARRAY['lehenga', 'festive', 'wedding', 'celebration']),

('Royal Blue Ikkat Silk Saree', 520000, 700000, 'Sarees', 'Exquisite royal blue Ikkat silk saree with intricate patterns and gold border.',
 ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'],
 ARRAY['Free Size'], ARRAY['Royal Blue', 'Deep Purple', 'Emerald Green'], 8, true, 4.9, 89,
 ARRAY['silk', 'royal', 'handwoven', 'wedding']),

('Vintage Ikkat Cotton Saree', 280000, 350000, 'Sarees', 'Comfortable cotton Ikkat saree with vintage patterns, perfect for daily wear.',
 ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'],
 ARRAY['Free Size'], ARRAY['Beige', 'Rust Orange', 'Olive Green'], 12, false, 4.6, 67,
 ARRAY['cotton', 'vintage', 'daily wear', 'comfortable']),

('Designer Ikkat Maxi Frock', 180000, 220000, 'Frocks', 'Elegant maxi frock with contemporary Ikkat designs, perfect for parties.',
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'],
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Wine Red', 'Navy Blue'], 10, false, 4.7, 45,
 ARRAY['designer', 'maxi', 'party wear', 'elegant']),

('Kids Ikkat Frock', 80000, 100000, 'Frocks', 'Adorable Ikkat frock for kids with vibrant colors and comfortable fit.',
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'],
 ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y'], ARRAY['Pink', 'Purple', 'Orange'], 18, false, 4.8, 123,
 ARRAY['kids', 'colorful', 'comfortable', 'cute']),

('Silk Ikkat Dress Material', 350000, 420000, 'Dress Materials', 'Luxurious silk Ikkat dress material with intricate weaving patterns.',
 ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg'],
 ARRAY['2.5m', '3m', '3.5m'], ARRAY['Gold', 'Silver', 'Bronze'], 6, true, 4.8, 34,
 ARRAY['silk', 'luxury', 'intricate', 'premium']),

('Traditional Ikkat Kurta', 150000, 180000, 'Kurtas', 'Classic traditional Ikkat kurta with authentic patterns and comfortable fit.',
 ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'],
 ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Saffron', 'Maroon', 'Forest Green'], 14, false, 4.6, 92,
 ARRAY['traditional', 'authentic', 'comfortable', 'classic']),

('Designer Ikkat Blouse', 120000, 150000, 'Blouses', 'Contemporary designer Ikkat blouse with modern cuts and traditional patterns.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
 ARRAY['32', '34', '36', '38', '40', '42'], ARRAY['Rose Gold', 'Copper', 'Antique Gold'], 16, false, 4.7, 28,
 ARRAY['designer', 'modern', 'contemporary', 'stylish']),

('Bridal Ikkat Lehenga', 1500000, 2000000, 'Lehengas', 'Exquisite bridal Ikkat lehenga with heavy embellishments and intricate work.',
 ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'],
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Bridal Red', 'Golden Yellow', 'Royal Purple'], 3, true, 5.0, 67,
 ARRAY['bridal', 'heavy work', 'embellished', 'luxury']),

('Ikkat Dupatta', 60000, 80000, 'Accessories', 'Beautiful Ikkat dupatta to complement your ethnic outfits.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
 ARRAY['2.5m'], ARRAY['Multi Color', 'Blue Shades', 'Pink Shades'], 25, false, 4.3, 89,
 ARRAY['dupatta', 'accessory', 'complement', 'ethnic']),

('Ikkat Stole', 45000, NULL, 'Accessories', 'Lightweight Ikkat stole perfect for casual and formal occasions.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
 ARRAY['2m'], ARRAY['Beige', 'Grey', 'Navy'], 30, false, 4.2, 45,
 ARRAY['stole', 'lightweight', 'versatile', 'casual']);