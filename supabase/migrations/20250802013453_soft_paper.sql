/*
  # Complete Database Setup for looom.shop E-commerce Platform

  This migration sets up the complete database schema for the looom.shop e-commerce platform.

  ## 1. New Tables
  
  ### products
  - `id` (uuid, primary key) - Unique product identifier
  - `name` (text) - Product name
  - `price` (integer) - Price in paise (₹1 = 100 paise)
  - `original_price` (integer, nullable) - Original price before discount
  - `category` (text) - Product category
  - `description` (text) - Product description
  - `images` (text[]) - Array of image URLs
  - `sizes` (text[]) - Available sizes
  - `colors` (text[]) - Available colors
  - `stock` (integer) - Stock quantity
  - `featured` (boolean) - Whether product is featured
  - `rating` (numeric) - Product rating (0-5)
  - `review_count` (integer) - Number of reviews
  - `tags` (text[]) - Product tags for search
  - `supports_feeding_friendly` (boolean) - Feeding-friendly feature
  - `is_stitched_dress` (boolean) - Whether it's a stitched dress
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### landing_settings
  - `id` (text, primary key) - Settings identifier
  - `page_title` (text) - Website page title
  - `page_subtitle` (text) - Page subtitle
  - `banner_image_url` (text) - Hero banner image
  - `categories_list` (text[]) - List of categories
  - `hero_description` (text) - Hero section description
  - `cta_text` (text) - Call-to-action button text
  - `cta_link` (text) - Call-to-action link
  - `show_featured_products` (boolean) - Show featured products section
  - `show_categories` (boolean) - Show categories section
  - `top_banner_text` (text) - Top banner text
  - `top_banner_active` (boolean) - Top banner visibility
  - `site_logo_url` (text) - Site logo URL
  - `site_name` (text) - Site name
  - `best_selling_title` (text) - Best selling section title
  - `best_selling_product_ids` (text[]) - Featured best selling product IDs
  - `trending_title` (text) - Trending section title
  - `trending_product_ids` (text[]) - Featured trending product IDs
  - `popular_categories_title` (text) - Popular categories title
  - `popular_category_ids` (text[]) - Featured category IDs
  - `delivery_location` (text) - Default delivery location
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Public read access for products and landing settings
  - Authenticated write access for products
  - Authenticated access for landing settings

  ## 3. Indexes
  - Performance indexes for common queries
  - Full-text search index for product names

  ## 4. Sample Data
  - Sample products across different categories
  - Default landing page settings
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create landing settings updated_at trigger function
CREATE OR REPLACE FUNCTION update_landing_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    price integer NOT NULL, -- Price in paise (₹1 = 100 paise)
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

-- Create landing_settings table
CREATE TABLE IF NOT EXISTS landing_settings (
    id text PRIMARY KEY DEFAULT 'landing_page_config',
    page_title text DEFAULT 'looom.shop - Premium Ikkat Handloom Collection',
    page_subtitle text DEFAULT 'Handwoven Heritage',
    banner_image_url text DEFAULT 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
    categories_list text[] DEFAULT ARRAY['Sarees', 'Frocks', 'Kurtas', 'Lehengas', 'Dress Materials', 'Blouses'],
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
    delivery_location text DEFAULT 'Bangalore 560001',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products table
CREATE POLICY "Allow public read access to products"
    ON products
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to insert products"
    ON products
    FOR INSERT
    TO public
    WITH CHECK ((role() = 'authenticated') OR (role() = 'service_role'));

CREATE POLICY "Allow authenticated users to update products"
    ON products
    FOR UPDATE
    TO public
    USING ((role() = 'authenticated') OR (role() = 'service_role'))
    WITH CHECK ((role() = 'authenticated') OR (role() = 'service_role'));

CREATE POLICY "Allow authenticated users to delete products"
    ON products
    FOR DELETE
    TO public
    USING ((role() = 'authenticated') OR (role() = 'service_role'));

-- Create RLS policies for landing_settings table
CREATE POLICY "Allow public read access to landing settings"
    ON landing_settings
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow authenticated users to insert landing settings"
    ON landing_settings
    FOR INSERT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to update landing settings"
    ON landing_settings
    FOR UPDATE
    TO authenticated
    USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS products_name_search_idx ON products USING gin(to_tsvector('english', name));

-- Create triggers for updated_at
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

-- Insert sample products data
INSERT INTO products (name, price, original_price, category, description, images, sizes, colors, stock, featured, rating, review_count, tags, supports_feeding_friendly, is_stitched_dress) VALUES
-- Sarees
('Traditional Ikkat Silk Saree', 450000, 600000, 'Sarees', 'Handwoven Ikkat silk saree with traditional geometric patterns. Perfect for special occasions and festivals.', 
 ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg', 'https://images.pexels.com/photos/8106881/pexels-photo-8106881.jpeg'], 
 ARRAY['Free Size'], ARRAY['Maroon', 'Navy Blue', 'Forest Green'], 10, true, 4.8, 124, 
 ARRAY['silk', 'traditional', 'handwoven', 'festival'], false, false),

('Royal Blue Ikkat Silk Saree', 520000, 700000, 'Sarees', 'Exquisite royal blue Ikkat silk saree with intricate patterns and gold border.',
 ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'], 
 ARRAY['Free Size'], ARRAY['Royal Blue', 'Deep Purple', 'Emerald Green'], 8, true, 4.9, 89, 
 ARRAY['silk', 'royal', 'handwoven', 'wedding'], false, false),

('Vintage Ikkat Cotton Saree', 280000, 350000, 'Sarees', 'Comfortable cotton Ikkat saree with vintage patterns, perfect for daily wear.',
 ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'], 
 ARRAY['Free Size'], ARRAY['Beige', 'Rust Orange', 'Olive Green'], 15, false, 4.6, 67, 
 ARRAY['cotton', 'vintage', 'daily wear', 'comfortable'], false, false),

-- Frocks
('Cotton Ikkat Frock', 120000, 150000, 'Frocks', 'Comfortable cotton Ikkat frock with beautiful patterns. Perfect for daily wear and casual outings.',
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg', 'https://images.pexels.com/photos/5560020/pexels-photo-5560020.jpeg'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Pink', 'Blue', 'Yellow'], 20, true, 4.6, 89, 
 ARRAY['cotton', 'casual', 'comfortable', 'daily wear'], false, false),

('Designer Ikkat Maxi Frock', 180000, 220000, 'Frocks', 'Elegant maxi frock with contemporary Ikkat designs, perfect for parties.',
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Wine Red', 'Navy Blue'], 12, false, 4.7, 45, 
 ARRAY['designer', 'maxi', 'party wear', 'elegant'], false, false),

('Traditional Ikkat Patterned Dress', 100000, 120000, 'Frocks', 'Beautiful traditional Ikkat patterned dress featuring vibrant red, orange, and brown geometric patterns. Perfect for casual wear and special occasions with its comfortable fit and elegant design.',
 ARRAY['/WhatsApp Image 2025-02-03 at 9.12.46 AM.jpeg', 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Red', 'Orange', 'Brown'], 18, true, 4.7, 15, 
 ARRAY['ikkat', 'traditional', 'patterned', 'casual', 'comfortable'], false, true),

('Kids Ikkat Frock', 80000, 100000, 'Frocks', 'Adorable Ikkat frock for kids with vibrant colors and comfortable fit.',
 ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'], 
 ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y'], ARRAY['Pink', 'Purple', 'Orange'], 25, false, 4.8, 123, 
 ARRAY['kids', 'colorful', 'comfortable', 'cute'], false, false),

-- Dress Materials
('Ikkat Dress Material Set', 280000, 0, 'Dress Materials', 'Premium Ikkat dress material set with matching dupatta. Ready to stitch into your preferred style.',
 ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg', 'https://images.pexels.com/photos/7679719/pexels-photo-7679719.jpeg'], 
 ARRAY['2.5m', '3m'], ARRAY['Purple', 'Teal', 'Orange'], 10, false, 4.7, 56, 
 ARRAY['dress material', 'dupatta', 'premium', 'custom'], false, false),

('Silk Ikkat Dress Material', 350000, 420000, 'Dress Materials', 'Luxurious silk Ikkat dress material with intricate weaving patterns.',
 ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg'], 
 ARRAY['2.5m', '3m', '3.5m'], ARRAY['Gold', 'Silver', 'Bronze'], 8, true, 4.8, 34, 
 ARRAY['silk', 'luxury', 'intricate', 'premium'], false, false),

-- Kurtas
('Designer Ikkat Kurta', 180000, 220000, 'Kurtas', 'Elegant Ikkat kurta with contemporary design. Perfect for office wear and semi-formal occasions.',
 ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'], 
 ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Cream', 'Light Blue'], 15, false, 4.5, 78, 
 ARRAY['kurta', 'designer', 'office wear', 'semi-formal'], false, false),

('Traditional Ikkat Kurta', 150000, 180000, 'Kurtas', 'Classic traditional Ikkat kurta with authentic patterns and comfortable fit.',
 ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'], 
 ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Saffron', 'Maroon', 'Forest Green'], 20, false, 4.6, 92, 
 ARRAY['traditional', 'authentic', 'comfortable', 'classic'], false, false),

-- Blouses
('Handwoven Ikkat Blouse', 80000, 0, 'Blouses', 'Beautiful handwoven Ikkat blouse to pair with your sarees. Available in multiple sizes and colors.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'], 
 ARRAY['32', '34', '36', '38', '40', '42'], ARRAY['Gold', 'Silver', 'Red', 'Black'], 30, false, 4.4, 45, 
 ARRAY['blouse', 'handwoven', 'saree blouse', 'traditional'], false, false),

('Designer Ikkat Blouse', 120000, 150000, 'Blouses', 'Contemporary designer Ikkat blouse with modern cuts and traditional patterns.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'], 
 ARRAY['32', '34', '36', '38', '40', '42'], ARRAY['Rose Gold', 'Copper', 'Antique Gold'], 18, false, 4.7, 28, 
 ARRAY['designer', 'modern', 'contemporary', 'stylish'], false, false),

-- Lehengas
('Festive Ikkat Lehenga Set', 850000, 1200000, 'Lehengas', 'Stunning Ikkat lehenga set for weddings and special celebrations. Includes blouse, lehenga, and dupatta.',
 ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'], 
 ARRAY['S', 'M', 'L'], ARRAY['Royal Blue', 'Deep Red', 'Emerald Green'], 5, true, 4.9, 203, 
 ARRAY['lehenga', 'festive', 'wedding', 'celebration'], false, false),

('Bridal Ikkat Lehenga', 1500000, 2000000, 'Lehengas', 'Exquisite bridal Ikkat lehenga with heavy embellishments and intricate work.',
 ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'], 
 ARRAY['S', 'M', 'L', 'XL'], ARRAY['Bridal Red', 'Golden Yellow', 'Royal Purple'], 3, true, 5.0, 67, 
 ARRAY['bridal', 'heavy work', 'embellished', 'luxury'], false, false),

-- Accessories
('Ikkat Dupatta', 60000, 80000, 'Accessories', 'Beautiful Ikkat dupatta to complement your ethnic outfits.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'], 
 ARRAY['2.5m'], ARRAY['Multi Color', 'Blue Shades', 'Pink Shades'], 25, false, 4.3, 89, 
 ARRAY['dupatta', 'accessory', 'complement', 'ethnic'], false, false),

('Ikkat Stole', 45000, 0, 'Accessories', 'Lightweight Ikkat stole perfect for casual and formal occasions.',
 ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'], 
 ARRAY['2m'], ARRAY['Beige', 'Grey', 'Navy'], 40, false, 4.2, 45, 
 ARRAY['stole', 'lightweight', 'versatile', 'casual'], false, false);

-- Insert default landing settings
INSERT INTO landing_settings (id) VALUES ('landing_page_config')
ON CONFLICT (id) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';