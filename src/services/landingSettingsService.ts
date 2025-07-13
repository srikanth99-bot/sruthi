import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { LandingSettings } from '../types';

// Transform database row to LandingSettings type
const transformDbLandingSettings = (dbSettings: any): LandingSettings => ({
  id: dbSettings.id,
  pageTitle: dbSettings.page_title,
  pageSubtitle: dbSettings.page_subtitle,
  bannerImageUrl: dbSettings.banner_image_url,
  categoriesList: dbSettings.categories_list,
  heroDescription: dbSettings.hero_description,
  ctaText: dbSettings.cta_text,
  ctaLink: dbSettings.cta_link,
  showFeaturedProducts: dbSettings.show_featured_products,
  showCategories: dbSettings.show_categories,
  topBannerText: dbSettings.top_banner_text,
  topBannerActive: dbSettings.top_banner_active,
  siteLogoUrl: dbSettings.site_logo_url,
  siteName: dbSettings.site_name,
  bestSellingTitle: dbSettings.best_selling_title,
  bestSellingProductIds: dbSettings.best_selling_product_ids,
  trendingTitle: dbSettings.trending_title,
  trendingProductIds: dbSettings.trending_product_ids,
  popularCategoriesTitle: dbSettings.popular_categories_title,
  popularCategoryIds: dbSettings.popular_category_ids,
  createdAt: dbSettings.created_at,
  updatedAt: dbSettings.updated_at
});

// Transform LandingSettings type to database insert/update
const transformSettingsToDb = (settings: Partial<LandingSettings>) => {
  const dbSettings: Record<string, any> = {};
  
  if (settings.pageTitle !== undefined) dbSettings.page_title = settings.pageTitle;
  if (settings.pageSubtitle !== undefined) dbSettings.page_subtitle = settings.pageSubtitle;
  if (settings.bannerImageUrl !== undefined) dbSettings.banner_image_url = settings.bannerImageUrl;
  if (settings.categoriesList !== undefined) dbSettings.categories_list = settings.categoriesList;
  if (settings.heroDescription !== undefined) dbSettings.hero_description = settings.heroDescription;
  if (settings.ctaText !== undefined) dbSettings.cta_text = settings.ctaText;
  if (settings.ctaLink !== undefined) dbSettings.cta_link = settings.ctaLink;
  if (settings.showFeaturedProducts !== undefined) dbSettings.show_featured_products = settings.showFeaturedProducts;
  if (settings.showCategories !== undefined) dbSettings.show_categories = settings.showCategories;
  if (settings.topBannerText !== undefined) dbSettings.top_banner_text = settings.topBannerText;
  if (settings.topBannerActive !== undefined) dbSettings.top_banner_active = settings.topBannerActive;
  if (settings.siteLogoUrl !== undefined) dbSettings.site_logo_url = settings.siteLogoUrl;
  if (settings.siteName !== undefined) dbSettings.site_name = settings.siteName;
  if (settings.bestSellingTitle !== undefined) dbSettings.best_selling_title = settings.bestSellingTitle;
  if (settings.bestSellingProductIds !== undefined) dbSettings.best_selling_product_ids = settings.bestSellingProductIds;
  if (settings.trendingTitle !== undefined) dbSettings.trending_title = settings.trendingTitle;
  if (settings.trendingProductIds !== undefined) dbSettings.trending_product_ids = settings.trendingProductIds;
  if (settings.popularCategoriesTitle !== undefined) dbSettings.popular_categories_title = settings.popularCategoriesTitle;
  if (settings.popularCategoryIds !== undefined) dbSettings.popular_category_ids = settings.popularCategoryIds;
  
  return dbSettings;
};

// Default landing settings for demo mode
const defaultLandingSettings: LandingSettings = {
  id: 'landing_page_config',
  pageTitle: 'looom.shop - Premium Ikkat Handloom Collection',
  pageSubtitle: 'Handwoven Heritage',
  bannerImageUrl: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
  categoriesList: ['Sarees', 'Frocks', 'Kurtas', 'Lehengas', 'Dress Materials', 'Blouses'],
  heroDescription: 'Discover our exquisite collection of handwoven Ikkat textiles, crafted with traditional techniques and modern designs.',
  ctaText: 'Shop Now',
  ctaLink: '/collection',
  showFeaturedProducts: true,
  showCategories: true,
  topBannerText: '🎉 Grand Opening Sale - Up to 70% OFF | Free Shipping on Orders ₹1999+',
  topBannerActive: true,
  siteLogoUrl: '/vite.svg',
  siteName: 'looom.shop',
  bestSellingTitle: 'Best Selling Products',
  bestSellingProductIds: [],
  trendingTitle: 'Trending Now',
  trendingProductIds: [],
  popularCategoriesTitle: 'Popular Categories',
  popularCategoryIds: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const landingSettingsService = {
  // Get landing settings
  async getLandingSettings(): Promise<LandingSettings> {
    if (!isSupabaseConfigured()) {
      console.log('📦 Using default landing settings - Supabase not configured');
      return defaultLandingSettings;
    }

    try {
      console.log('📡 Fetching landing settings from Supabase...');
      const { data, error } = await supabase
        .from('landing_settings')
        .select('*')
        .eq('id', 'landing_page_config')
        .single();

      if (error) {
        console.error('❌ Error fetching landing settings:', error);
        console.log('🔄 Falling back to default landing settings');
        return defaultLandingSettings;
      }

      console.log('✅ Loaded landing settings from Supabase');
      return data ? transformDbLandingSettings(data) : defaultLandingSettings;
    } catch (error) {
      console.error('❌ Error fetching landing settings:', error);
      console.log('🔄 Falling back to default landing settings');
      return defaultLandingSettings;
    }
  },

  // Update landing settings
  async updateLandingSettings(settings: Partial<LandingSettings>): Promise<LandingSettings | null> {
    if (!isSupabaseConfigured()) {
      console.log('⚠️ Demo mode: Landing settings update simulated');
      return {
        ...defaultLandingSettings,
        ...settings,
        updatedAt: new Date().toISOString()
      };
    }

    try {
      console.log('💾 Updating landing settings in Supabase...');
      const dbSettings = transformSettingsToDb(settings);
      
      // Always set the ID to ensure we're updating the single row
      dbSettings.id = 'landing_page_config';
      
      const { data, error } = await supabase
        .from('landing_settings')
        .upsert(dbSettings)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating landing settings:', error);
        throw error;
      }

      console.log('✅ Landing settings updated successfully');
      return data ? transformDbLandingSettings(data) : null;
    } catch (error) {
      console.error('❌ Error updating landing settings:', error);
      throw error;
    }
  }
};