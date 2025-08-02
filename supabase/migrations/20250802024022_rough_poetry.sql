```sql
-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id text PRIMARY KEY DEFAULT 'prod_' || substr(md5(random()::text), 0, 10),
    name text NOT NULL,
    price bigint NOT NULL,
    original_price bigint,
    category text NOT NULL,
    description text NOT NULL DEFAULT '',
    images text[] NOT NULL DEFAULT '{}',
    sizes text[] NOT NULL DEFAULT '{}',
    colors text[] NOT NULL DEFAULT '{}',
    stock integer NOT NULL DEFAULT 10,
    featured boolean NOT NULL DEFAULT FALSE,
    rating numeric NOT NULL DEFAULT 4.5,
    review_count integer NOT NULL DEFAULT 0,
    tags text[] NOT NULL DEFAULT '{}',
    supports_feeding_friendly boolean NOT NULL DEFAULT FALSE,
    is_stitched_dress boolean NOT NULL DEFAULT FALSE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create landing_settings table
CREATE TABLE IF NOT EXISTS public.landing_settings (
    id text PRIMARY KEY DEFAULT 'landing_page_config',
    page_title text NOT NULL DEFAULT 'looom.shop - Premium Ikkat Handloom Collection',
    page_subtitle text,
    banner_image_url text,
    categories_list text[],
    hero_description text,
    cta_text text,
    cta_link text,
    show_featured_products boolean DEFAULT TRUE,
    show_categories boolean DEFAULT TRUE,
    top_banner_text text,
    top_banner_active boolean DEFAULT TRUE,
    site_logo_url text,
    site_name text,
    best_selling_title text,
    best_selling_product_ids text[],
    trending_title text,
    trending_product_ids text[],
    popular_categories_title text,
    popular_category_ids text[],
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) for products table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors on re-run
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
DROP POLICY IF EXISTS "Public can read products" ON public.products;

-- RLS Policy: Public can read products
CREATE POLICY "Public can read products" ON public.products
FOR SELECT USING (TRUE);

-- RLS Policy: Authenticated users can insert products
CREATE POLICY "Authenticated users can insert products" ON public.products
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can update products
CREATE POLICY "Authenticated users can update products" ON public.products
FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policy: Authenticated users can delete products
CREATE POLICY "Authenticated users can delete products" ON public.products
FOR DELETE USING (auth.role() = 'authenticated');

-- Enable Row Level Security (RLS) for landing_settings table
ALTER TABLE public.landing_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist for landing_settings
DROP POLICY IF EXISTS "Public can read landing settings" ON public.landing_settings;
DROP POLICY IF EXISTS "Authenticated users can update landing settings" ON public.landing_settings;

-- RLS Policy: Public can read landing settings
CREATE POLICY "Public can read landing settings" ON public.landing_settings
FOR SELECT USING (TRUE);

-- RLS Policy: Authenticated users can update landing settings
CREATE POLICY "Authenticated users can update landing settings" ON public.landing_settings
FOR UPDATE USING (auth.role() = 'authenticated');

-- Create a function to update the updated_at column automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products table to update updated_at
DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for landing_settings table to update updated_at
DROP TRIGGER IF EXISTS set_landing_settings_updated_at ON public.landing_settings;
CREATE TRIGGER set_landing_settings_updated_at
BEFORE UPDATE ON public.landing_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data for landing_settings if it doesn't exist
INSERT INTO public.landing_settings (id, page_title, page_subtitle, banner_image_url, categories_list, hero_description, cta_text, cta_link, show_featured_products, show_categories, top_banner_text, top_banner_active, site_logo_url, site_name, best_selling_title, trending_title, popular_categories_title)
VALUES (
    'landing_page_config',
    'looom.shop - Premium Ikkat Handloom Collection',
    'Handwoven Heritage',
    'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
    ARRAY['Sarees', 'Frocks', 'Kurtas', 'Lehengas', 'Dress Materials', 'Blouses'],
    'Discover our exquisite collection of handwoven Ikkat textiles, crafted with traditional techniques and modern designs.',
    'Shop Now',
    '/collection',
    TRUE,
    TRUE,
    '🎉 Grand Opening Sale - Up to 70% OFF | Free Shipping on Orders ₹1999+',
    TRUE,
    '/vite.svg',
    'looom.shop',
    'Best Selling Products',
    'Trending Now',
    'Popular Categories'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample products if the table is empty
INSERT INTO public.products (id, name, price, original_price, category, description, images, sizes, colors, stock, featured, rating, review_count, tags, supports_feeding_friendly, is_stitched_dress)
VALUES
('prod_1', 'Traditional Ikkat Silk Saree', 450000, 600000, 'Sarees', 'Handwoven Ikkat silk saree with traditional geometric patterns. Perfect for special occasions and festivals.', ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg', 'https://images.pexels.com/photos/8106881/pexels-photo-8106881.jpeg'], ARRAY['Free Size'], ARRAY['Maroon', 'Navy Blue', 'Forest Green'], 10, TRUE, 4.8, 124, ARRAY['silk', 'traditional', 'handwoven', 'festival'], FALSE, FALSE),
('prod_2', 'Cotton Ikkat Frock', 120000, 150000, 'Frocks', 'Comfortable cotton Ikkat frock with beautiful patterns. Perfect for daily wear and casual outings.', ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg', 'https://images.pexels.com/photos/5560020/pexels-photo-5560020.jpeg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Pink', 'Blue', 'Yellow'], 15, TRUE, 4.6, 89, ARRAY['cotton', 'casual', 'comfortable', 'daily wear'], FALSE, TRUE),
('prod_3', 'Ikkat Dress Material Set', 280000, NULL, 'Dress Materials', 'Premium Ikkat dress material set with matching dupatta. Ready to stitch into your preferred style.', ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg', 'https://images.pexels.com/photos/7679719/pexels-photo-7679719.jpeg'], ARRAY['2.5m', '3m'], ARRAY['Purple', 'Teal', 'Orange'], 8, FALSE, 4.7, 56, ARRAY['dress material', 'dupatta', 'premium', 'custom'], FALSE, FALSE),
('prod_4', 'Designer Ikkat Kurta', 180000, 220000, 'Kurtas', 'Elegant Ikkat kurta with contemporary design. Perfect for office wear and semi-formal occasions.', ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['White', 'Cream', 'Light Blue'], 12, FALSE, 4.5, 78, ARRAY['kurta', 'designer', 'office wear', 'semi-formal'], FALSE, TRUE),
('prod_5', 'Handwoven Ikkat Blouse', 80000, NULL, 'Blouses', 'Beautiful handwoven Ikkat blouse to pair with your sarees. Available in multiple sizes and colors.', ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'], ARRAY['32', '34', '36', '38', '40', '42'], ARRAY['Gold', 'Silver', 'Red', 'Black'], 20, FALSE, 4.4, 45, ARRAY['blouse', 'handwoven', 'saree blouse', 'traditional'], FALSE, FALSE),
('prod_6', 'Festive Ikkat Lehenga Set', 850000, 1200000, 'Lehengas', 'Stunning Ikkat lehenga set for weddings and special celebrations. Includes blouse, lehenga, and dupatta.', ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'], ARRAY['S', 'M', 'L'], ARRAY['Royal Blue', 'Deep Red', 'Emerald Green'], 5, TRUE, 4.9, 203, ARRAY['lehenga', 'festive', 'wedding', 'celebration'], FALSE, TRUE),
('prod_7', 'Royal Blue Ikkat Silk Saree', 520000, 700000, 'Sarees', 'Exquisite royal blue Ikkat silk saree with intricate patterns and gold border.', ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'], ARRAY['Free Size'], ARRAY['Royal Blue', 'Deep Purple', 'Emerald Green'], 7, TRUE, 4.9, 89, ARRAY['silk', 'royal', 'handwoven', 'wedding'], FALSE, FALSE),
('prod_8', 'Vintage Ikkat Cotton Saree', 280000, 350000, 'Sarees', 'Comfortable cotton Ikkat saree with vintage patterns, perfect for daily wear.', ARRAY['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'], ARRAY['Free Size'], ARRAY['Beige', 'Rust Orange', 'Olive Green'], 18, FALSE, 4.6, 67, ARRAY['cotton', 'vintage', 'daily wear', 'comfortable'], FALSE, FALSE),
('prod_9', 'Designer Ikkat Maxi Frock', 180000, 220000, 'Frocks', 'Elegant maxi frock with contemporary Ikkat designs, perfect for parties.', ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Wine Red', 'Navy Blue'], 9, FALSE, 4.7, 45, ARRAY['designer', 'maxi', 'party wear', 'elegant'], FALSE, TRUE),
('prod_10', 'Kids Ikkat Frock', 80000, 100000, 'Frocks', 'Adorable Ikkat frock for kids with vibrant colors and comfortable fit.', ARRAY['https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'], ARRAY['2-3Y', '4-5Y', '6-7Y', '8-9Y'], ARRAY['Pink', 'Purple', 'Orange'], 25, FALSE, 4.8, 123, ARRAY['kids', 'colorful', 'comfortable', 'cute'], FALSE, TRUE),
('prod_11', 'Silk Ikkat Dress Material', 350000, 420000, 'Dress Materials', 'Luxurious silk Ikkat dress material with intricate weaving patterns.', ARRAY['https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg'], ARRAY['2.5m', '3m', '3.5m'], ARRAY['Gold', 'Silver', 'Bronze'], 6, TRUE, 4.8, 34, ARRAY['silk', 'luxury', 'intricate', 'premium'], FALSE, FALSE),
('prod_12', 'Traditional Ikkat Kurta', 150000, 180000, 'Kurtas', 'Classic traditional Ikkat kurta with authentic patterns and comfortable fit.', ARRAY['https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg'], ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Saffron', 'Maroon', 'Forest Green'], 14, FALSE, 4.6, 92, ARRAY['traditional', 'authentic', 'comfortable', 'classic'], FALSE, TRUE),
('prod_13', 'Designer Ikkat Blouse', 120000, 150000, 'Blouses', 'Contemporary designer Ikkat blouse with modern cuts and traditional patterns.', ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'], ARRAY['32', '34', '36', '38', '40', '42'], ARRAY['Rose Gold', 'Copper', 'Antique Gold'], 11, FALSE, 4.7, 28, ARRAY['designer', 'modern', 'contemporary', 'stylish'], FALSE, FALSE),
('prod_14', 'Bridal Ikkat Lehenga', 1500000, 2000000, 'Lehengas', 'Exquisite bridal Ikkat lehenga with heavy embellishments and intricate work.', ARRAY['https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Bridal Red', 'Golden Yellow', 'Royal Purple'], 3, TRUE, 5.0, 67, ARRAY['bridal', 'heavy work', 'embellished', 'luxury'], FALSE, TRUE),
('prod_15', 'Ikkat Dupatta', 60000, 80000, 'Accessories', 'Beautiful Ikkat dupatta to complement your ethnic outfits.', ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'], ARRAY['2.5m'], ARRAY['Multi Color', 'Blue Shades', 'Pink Shades'], 30, FALSE, 4.3, 89, ARRAY['dupatta', 'accessory', 'complement', 'ethnic'], FALSE, FALSE),
('prod_16', 'Ikkat Stole', 45000, NULL, 'Accessories', 'Lightweight Ikkat stole perfect for casual and formal occasions.', ARRAY['https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg'], ARRAY['2m'], ARRAY['Beige', 'Grey', 'Navy'], 22, FALSE, 4.2, 45, ARRAY['stole', 'lightweight', 'versatile', 'casual'], FALSE, FALSE),
('prod_17', 'Traditional Ikkat Patterned Dress', 100000, 120000, 'Frocks', 'Beautiful traditional Ikkat patterned dress featuring vibrant red, orange, and brown geometric patterns. Perfect for casual wear and special occasions with its comfortable fit and elegant design.', ARRAY['/WhatsApp Image 2025-02-03 at 9.12.46 AM.jpeg', 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg'], ARRAY['S', 'M', 'L', 'XL'], ARRAY['Red', 'Orange', 'Brown'], 10, TRUE, 4.7, 15, ARRAY['ikkat', 'traditional', 'patterned', 'casual', 'comfortable'], FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;
```