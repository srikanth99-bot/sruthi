/*
  # Create landing_settings table

  1. New Tables
    - `landing_settings`
      - `id` (text, primary key, default: 'landing_page_config')
      - `page_title` (text, default: 'looom.shop - Premium Ikkat Handloom Collection')
      - `page_subtitle` (text, default: 'Handwoven Heritage')
      - `banner_image_url` (text, default: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg')
      - `categories_list` (text[], default: array of category names)
      - `hero_description` (text, default: description text)
      - `cta_text` (text, default: 'Shop Now')
      - `cta_link` (text, default: '/collection')
      - `show_featured_products` (boolean, default: true)
      - `show_categories` (boolean, default: true)
      - `top_banner_text` (text, default: '🎉 Grand Opening Sale - Up to 70% OFF | Free Shipping on Orders ₹1999+')
      - `top_banner_active` (boolean, default: true)
      - `site_logo_url` (text, default: '/vite.svg')
      - `site_name` (text, default: 'looom.shop')
      - `best_selling_title` (text, default: 'Best Selling Products')
      - `best_selling_product_ids` (text[], default: '{}')
      - `trending_title` (text, default: 'Trending Now')
      - `trending_product_ids` (text[], default: '{}')
      - `popular_categories_title` (text, default: 'Popular Categories')
      - `popular_category_ids` (text[], default: '{}')
      - `created_at` (timestamptz, default: now())
      - `updated_at` (timestamptz, default: now())
  
  2. Security
    - Enable RLS on `landing_settings` table
    - Add policy for authenticated users to insert landing settings
    - Add policy for authenticated users to update landing settings
    - Add policy for public read access to landing settings
*/

-- Create landing_settings table
CREATE TABLE IF NOT EXISTS landing_settings (
  id text PRIMARY KEY DEFAULT 'landing_page_config',
  page_title text NOT NULL DEFAULT 'looom.shop - Premium Ikkat Handloom Collection',
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
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE landing_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to insert landing settings"
  ON landing_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update landing settings"
  ON landing_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public read access to landing settings"
  ON landing_settings
  FOR SELECT
  TO public
  USING (true);

-- Create trigger function to update the updated_at column
CREATE OR REPLACE FUNCTION update_landing_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_landing_settings_updated_at
BEFORE UPDATE ON landing_settings
FOR EACH ROW
EXECUTE FUNCTION update_landing_settings_updated_at();

-- Insert default row if it doesn't exist
INSERT INTO landing_settings (id)
VALUES ('landing_page_config')
ON CONFLICT (id) DO NOTHING;