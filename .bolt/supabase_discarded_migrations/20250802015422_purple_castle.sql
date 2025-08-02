/*
  # Complete Database Setup for looom.shop

  1. New Tables
    - `products` - Main products table with all product information
    - `landing_settings` - Website configuration and landing page settings
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public read access and authenticated write access
  
  3. Sample Data
    - 17 sample products across all categories (Sarees, Frocks, Kurtas, etc.)
    - Default landing page configuration
  
  4. Indexes
    - Performance indexes for common queries
  
  5. Triggers
    - Auto-update timestamps on record changes
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY DEFAULT 'prod_' || extract(epoch from now()) || '_' || floor(random() * 1000),
  name text NOT NULL,
  price integer NOT NULL, -- Price in paise (multiply by 100)
  original_price integer, -- Original price in paise
  category text NOT NULL,
  description text DEFAULT '',
  images text[] DEFAULT '{}',
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  stock integer DEFAULT 10,
  featured boolean DEFAULT false,
  rating numeric(2,1) DEFAULT 4.5,
  review_count integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  supports_feeding_friendly boolean DEFAULT false,
  is_stitched_dress boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create landing_settings table
CREATE TABLE IF NOT EXISTS landing_settings (
  id text PRIMARY KEY DEFAULT 'landing_page_config',
  page_title text DEFAULT 'looom.shop - Premium Ikkat Handloom Collection',
  page_subtitle text DEFAULT 'Handwoven Heritage',
  banner_image_url text,
  categories_list text[] DEFAULT '{"Sarees","Frocks","Kurtas","Lehengas","Dress Materials","Blouses"}',
  hero_description text DEFAULT 'Discover our exquisite collection of handwoven Ikkat textiles, crafted with traditional techniques and modern designs.',
  cta_text text DEFAULT 'Shop Now',
  cta_link text DEFAULT '/collection',
  show_featured_products boolean DEFAULT true,
  show_categories boolean DEFAULT true,
  top_banner_text text DEFAULT '🎉 Grand Opening Sale - Up to 70% OFF | Free Shipping on Orders ₹1999+',
  top_banner_active boolean DEFAULT true,
  site_logo_url text DEFAULT '/vite.svg',
  site_name text DEFAULT 'looom.shop',
  best_selling_title text DEFAULT 'Best Selling Products',
  best_selling_product_ids text[] DEFAULT '{}',
  trending_title text DEFAULT 'Trending Now',
  trending_product_ids text[] DEFAULT '{}',
  popular_categories_title text DEFAULT 'Popular Categories',
  popular_category_ids text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for landing_settings table
CREATE POLICY "Landing settings are viewable by everyone"
  ON landing_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update landing settings"
  ON landing_settings
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert landing settings"
  ON landing_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('english', name));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to update landing_settings updated_at timestamp
CREATE OR REPLACE FUNCTION update_landing_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update timestamps
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_landing_settings_updated_at ON landing_settings;
CREATE TRIGGER update_landing_settings_updated_at
  BEFORE UPDATE ON landing_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_landing_settings_updated_at();

-- Insert sample products
INSERT INTO products (id, name, price, original_price, category, description, images, sizes, colors, stock, featured, rating, review_count, tags, supports_feeding_friendly, is_stitched_dress) VALUES
-- Traditional Ikkat Patterned Dress (Featured)
('17', 'Traditional Ikkat Patterned Dress', 100000, 120000, 'Frocks', 'Beautiful traditional Ikkat patterned dress featuring vibrant red, orange, and brown geometric patterns. Perfect for casual wear and special occasions with its comfortable fit and elegant design.', 
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg', 'https://images.pexels.com/photos/5560020/pexels-photo-5560020.jpeg'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Red', 'Orange', 'Brown'], 15, true, 4.7, 15, 
 ARRAY['ikkat', 'traditional', 'patterned', 'casual', 'comfortable'], false, true),

-- Sarees
('1', 'Traditional Ikkat Silk Saree', 450000, 600000, 'Sarees', 'Handwoven Ikkat silk saree with traditional geometric patterns. Perfect for special occasions and festivals.',
 ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg', 'https://images.pexels.com/photos/8106881/pexels-photo-8106881.jpeg'],
 ARRAY['Free Size'], ARRAY['Maroon', 'Navy Blue', 'Forest Green'], 8, true, 4.8, 124,
 ARRAY['silk', 'traditional', 'handwoven', 'festival'], false, false),

('7', 'Royal Blue Ikkat Silk Saree', 520000, 700000, 'Sarees', 'Exquisite royal blue Ikkat silk saree with intricate patterns and gold border.',
 ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'],
 ARRAY['Free Size'], ARRAY['Royal Blue', 'Deep Purple', 'Emerald Green'], 5, true, 4.9, 89,
 ARRAY['silk', 'royal', 'handwoven', 'wedding'], false, false),

('8', 'Vintage Ikkat Cotton Saree', 280000, 350000, 'Sarees', 'Comfortable cotton Ikkat saree with vintage patterns, perfect for daily wear.',
 ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'],
 ARRAY['Free Size'], ARRAY['Beige', 'Rust Orange', 'Olive Green'], 12, false, 4.6, 67,
 ARRAY['cotton', 'vintage', 'daily wear', 'comfortable'], false, false),

-- Frocks
('2', 'Cotton Ikkat Frock', 120000, 150000, 'Frocks', 'Comfortable cotton Ikkat frock with beautiful patterns. Perfect for daily wear and casual outings.',
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg', 'https://images.pexels.com/photos/5560020/pexels-photo-5560020.jpeg'],
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Pink', 'Blue', 'Yellow'], 20, true, 4.6, 89,
 ARRAY['cotton', 'casual', 'comfortable', 'daily wear'], false, true),

('9', 'Designer Ikkat Maxi Frock', 180000, 220000, 'Frocks', 'Elegant maxi frock with contemporary Ikkat designs, perfect for parties.',
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'],
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Wine Red', 'Navy Blue'], 10, false, 4.7, 45,
 ARRAY['designer', 'maxi', 'party wear', 'elegant'], false, true),

('10', 'Kids Ikkat Frock', 80000, 100000, 'Frocks', 'Adorable Ikkat frock for kids with vibrant colors and comfortable fit.',
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'],
 ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y'], ARRAY['Pink', 'Purple', 'Orange'], 25, false, 4.8, 123,
 ARRAY['kids', 'colorful', 'comfortable', 'cute'], false, true),

-- Dress Materials
('3', 'Ikkat Dress Material Set', 280000, null, 'Dress Materials', 'Premium Ikkat dress material set with matching dupatta. Ready to stitch into your preferred style.',
 ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg', 'https://images.pexels.com/photos/7679719/pexels-photo-7679719.jpeg'],
 ARRAY['2.5m', '3m'], ARRAY['Purple', 'Teal', 'Orange'], 15, false, 4.7, 56,
 ARRAY['dress material', 'dupatta', 'premium', 'custom'], false, false),

('11', 'Silk Ikkat Dress Material', 350000, 420000, 'Dress Materials', 'Luxurious silk Ikkat dress material with intricate weaving patterns.',
 ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg'],
 ARRAY['2.5m', '3m', '3.5m'], ARRAY['Gold', 'Silver', 'Bronze'], 8, true, 4.8, 34,
 ARRAY['silk', 'luxury', 'intricate', 'premium'], false, false),

-- Kurtas
('4', 'Designer Ikkat Kurta', 180000, 220000, 'Kurtas', 'Elegant Ikkat kurta with contemporary design. Perfect for office wear and semi-formal occasions.',
 ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'],
 ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Cream', 'Light Blue'], 18, false, 4.5, 78,
 ARRAY['kurta', 'designer', 'office wear', 'semi-formal'], false, false),

('12', 'Traditional Ikkat Kurta', 150000, 180000, 'Kurtas', 'Classic traditional Ikkat kurta with authentic patterns and comfortable fit.',
 ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'],
 ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Saffron', 'Maroon', 'Forest Green'], 22, false, 4.6, 92,
 ARRAY['traditional', 'authentic', 'comfortable', 'classic'], false, false),

-- Blouses
('5', 'Handwoven Ikkat Blouse', 80000, null, 'Blouses', 'Beautiful handwoven Ikkat blouse to pair with your sarees. Available in multiple sizes and colors.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
 ARRAY['32', '34', '36', '38', '40', '42'], ARRAY['Gold', 'Silver', 'Red', 'Black'], 30, false, 4.4, 45,
 ARRAY['blouse', 'handwoven', 'saree blouse', 'traditional'], false, false),

('13', 'Designer Ikkat Blouse', 120000, 150000, 'Blouses', 'Contemporary designer Ikkat blouse with modern cuts and traditional patterns.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
 ARRAY['32', '34', '36', '38', '40', '42'], ARRAY['Rose Gold', 'Copper', 'Antique Gold'], 15, false, 4.7, 28,
 ARRAY['designer', 'modern', 'contemporary', 'stylish'], false, false),

-- Lehengas
('6', 'Festive Ikkat Lehenga Set', 850000, 1200000, 'Lehengas', 'Stunning Ikkat lehenga set for weddings and special celebrations. Includes blouse, lehenga, and dupatta.',
 ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'],
 ARRAY['S', 'M', 'L'], ARRAY['Royal Blue', 'Deep Red', 'Emerald Green'], 6, true, 4.9, 203,
 ARRAY['lehenga', 'festive', 'wedding', 'celebration'], false, false),

('14', 'Bridal Ikkat Lehenga', 1500000, 2000000, 'Lehengas', 'Exquisite bridal Ikkat lehenga with heavy embellishments and intricate work.',
 ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'],
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Bridal Red', 'Golden Yellow', 'Royal Purple'], 3, true, 5.0, 67,
 ARRAY['bridal', 'heavy work', 'embellished', 'luxury'], false, false),

-- Accessories
('15', 'Ikkat Dupatta', 60000, 80000, 'Accessories', 'Beautiful Ikkat dupatta to complement your ethnic outfits.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
 ARRAY['2.5m'], ARRAY['Multi Color', 'Blue Shades', 'Pink Shades'], 40, false, 4.3, 89,
 ARRAY['dupatta', 'accessory', 'complement', 'ethnic'], false, false),

('16', 'Ikkat Stole', 45000, null, 'Accessories', 'Lightweight Ikkat stole perfect for casual and formal occasions.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'],
 ARRAY['2m'], ARRAY['Beige', 'Grey', 'Navy'], 35, false, 4.2, 45,
 ARRAY['stole', 'lightweight', 'versatile', 'casual'], false, false);

-- Insert default landing settings
INSERT INTO landing_settings (id) VALUES ('landing_page_config')
ON CONFLICT (id) DO NOTHING;

-- Create additional indexes for text search
CREATE INDEX IF NOT EXISTS idx_products_description_search ON products USING gin(to_tsvector('english', description));
CREATE INDEX IF NOT EXISTS idx_products_tags_search ON products USING gin(tags);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Created tables: products, landing_settings';
  RAISE NOTICE 'Inserted % sample products', (SELECT count(*) FROM products);
  RAISE NOTICE 'Setup landing page configuration';
  RAISE NOTICE 'Enabled Row Level Security with public read access';
END $$;