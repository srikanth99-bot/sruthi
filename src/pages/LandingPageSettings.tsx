import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Globe,
  Image as ImageIcon,
  Type,
  ToggleLeft,
  ToggleRight,
  Loader,
  Check,
  AlertCircle,
  Tag,
  Grid,
  TrendingUp,
  ShoppingBag,
  Palette,
  Edit,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { useStore } from '../store/useStore';
import DragDropImageUpload from '../components/ImageUpload/DragDropImageUpload';
import type { LandingSettings } from '../types';

interface LandingPageSettingsProps {
  onBack: () => void;
}

const LandingPageSettings: React.FC<LandingPageSettingsProps> = ({ onBack }) => {
  const { 
    landingSettings, 
    updateLandingSettings,
    products,
    categories
  } = useStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<LandingSettings>>({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize form data when landingSettings are loaded
  useEffect(() => {
    if (landingSettings) {
      setFormData(landingSettings);
    }
  }, [landingSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);
    
    try {
      await updateLandingSettings(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update landing page settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof LandingSettings, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field: keyof LandingSettings) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleArrayChange = (field: keyof LandingSettings, value: string) => {
    const values = value.split(',').map(v => v.trim()).filter(v => v);
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleProductSelection = (field: keyof LandingSettings, selectedIds: string[]) => {
    setFormData(prev => ({ ...prev, [field]: selectedIds }));
  };

  const handleCategorySelection = (field: keyof LandingSettings, selectedIds: string[]) => {
    setFormData(prev => ({ ...prev, [field]: selectedIds }));
  };

  if (!landingSettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Settings</h2>
          <p className="text-gray-600">Please wait while we load the landing page settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </motion.button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Landing Page Settings</h1>
                  <p className="text-sm text-gray-500">Customize your website's landing page</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Success/Error Messages */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3"
              >
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-700 font-medium">Settings saved successfully!</span>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
              >
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700 font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Site Identity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Type className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Site Identity</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={formData.pageTitle || ''}
                  onChange={(e) => handleChange('pageTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., looom.shop - Premium Ikkat Handloom Collection"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will appear in the browser tab
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Subtitle
                </label>
                <input
                  type="text"
                  value={formData.pageSubtitle || ''}
                  onChange={(e) => handleChange('pageSubtitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Handwoven Heritage"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={formData.siteName || ''}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., looom.shop"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Logo URL
                </label>
                <input
                  type="text"
                  value={formData.siteLogoUrl || ''}
                  onChange={(e) => handleChange('siteLogoUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., /vite.svg"
                />
              </div>
            </div>
          </div>

          {/* Top Banner */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Tag className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Top Banner</h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {formData.topBannerActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggle('topBannerActive')}
                  className="p-1 rounded-lg transition-colors"
                >
                  {formData.topBannerActive ? (
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Text
              </label>
              <input
                type="text"
                value={formData.topBannerText || ''}
                onChange={(e) => handleChange('topBannerText', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 🎉 Grand Opening Sale - Up to 70% OFF | Free Shipping on Orders ₹1999+"
              />
            </div>
            
            {/* Preview */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className={`bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white text-center py-2 text-sm font-medium rounded-lg ${
                !formData.topBannerActive && 'opacity-50'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  <span>{formData.topBannerText || 'Banner text will appear here'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <ImageIcon className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Hero Banner</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image URL
                </label>
                <input
                  type="text"
                  value={formData.bannerImageUrl || ''}
                  onChange={(e) => handleChange('bannerImageUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Description
                </label>
                <textarea
                  value={formData.heroDescription || ''}
                  onChange={(e) => handleChange('heroDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Discover our exquisite collection of handwoven Ikkat textiles..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.ctaText || ''}
                    onChange={(e) => handleChange('ctaText', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Shop Now"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CTA Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.ctaLink || ''}
                    onChange={(e) => handleChange('ctaLink', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., /collection"
                  />
                </div>
              </div>
              
              {/* Preview */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative h-48 bg-gray-200 rounded-xl overflow-hidden">
                  {formData.bannerImageUrl && (
                    <img
                      src={formData.bannerImageUrl}
                      alt="Banner Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{formData.pageTitle || 'Your Page Title'}</h3>
                    <p className="text-center mb-4">{formData.heroDescription || 'Your hero description will appear here'}</p>
                    <button className="bg-white text-purple-600 font-bold px-6 py-2 rounded-xl">
                      {formData.ctaText || 'Shop Now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Grid className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Categories Section</h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {formData.showCategories ? 'Visible' : 'Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggle('showCategories')}
                  className="p-1 rounded-lg transition-colors"
                >
                  {formData.showCategories ? (
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories Section Title
                </label>
                <input
                  type="text"
                  value={formData.popularCategoriesTitle || ''}
                  onChange={(e) => handleChange('popularCategoriesTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Popular Categories"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories List (comma separated)
                </label>
                <input
                  type="text"
                  value={(formData.categoriesList || []).join(', ')}
                  onChange={(e) => handleArrayChange('categoriesList', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Sarees, Frocks, Kurtas, Lehengas, Dress Materials, Blouses"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Categories
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`cat-${category.id}`}
                        checked={(formData.popularCategoryIds || []).includes(category.id)}
                        onChange={(e) => {
                          const currentIds = formData.popularCategoryIds || [];
                          if (e.target.checked) {
                            handleCategorySelection('popularCategoryIds', [...currentIds, category.id]);
                          } else {
                            handleCategorySelection('popularCategoryIds', currentIds.filter(id => id !== category.id));
                          }
                        }}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`cat-${category.id}`} className="text-sm text-gray-700">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trending Products Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Trending Products Section</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.trendingTitle || ''}
                  onChange={(e) => handleChange('trendingTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Trending Now"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Trending Products
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-xl p-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2 py-2 border-b border-gray-200 last:border-b-0">
                      <input
                        type="checkbox"
                        id={`trending-${product.id}`}
                        checked={(formData.trendingProductIds || []).includes(product.id)}
                        onChange={(e) => {
                          const currentIds = formData.trendingProductIds || [];
                          if (e.target.checked) {
                            handleProductSelection('trendingProductIds', [...currentIds, product.id]);
                          } else {
                            handleProductSelection('trendingProductIds', currentIds.filter(id => id !== product.id));
                          }
                        }}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <div className="w-10 h-10 flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <label htmlFor={`trending-${product.id}`} className="text-sm text-gray-700 flex-1">
                        {product.name}
                      </label>
                      <span className="text-sm font-medium text-gray-900">₹{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Best Selling Products Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Best Selling Products Section</h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {formData.showFeaturedProducts ? 'Visible' : 'Hidden'}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggle('showFeaturedProducts')}
                  className="p-1 rounded-lg transition-colors"
                >
                  {formData.showFeaturedProducts ? (
                    <ToggleRight className="h-6 w-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.bestSellingTitle || ''}
                  onChange={(e) => handleChange('bestSellingTitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Best Selling Products"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Best Selling Products
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-xl p-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2 py-2 border-b border-gray-200 last:border-b-0">
                      <input
                        type="checkbox"
                        id={`bestselling-${product.id}`}
                        checked={(formData.bestSellingProductIds || []).includes(product.id)}
                        onChange={(e) => {
                          const currentIds = formData.bestSellingProductIds || [];
                          if (e.target.checked) {
                            handleProductSelection('bestSellingProductIds', [...currentIds, product.id]);
                          } else {
                            handleProductSelection('bestSellingProductIds', currentIds.filter(id => id !== product.id));
                          }
                        }}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <div className="w-10 h-10 flex-shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <label htmlFor={`bestselling-${product.id}`} className="text-sm text-gray-700 flex-1">
                        {product.name}
                      </label>
                      <span className="text-sm font-medium text-gray-900">₹{product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandingPageSettings;