import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Users, 
  Eye,
  Edit,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Calendar,
  Download,
  Settings,
  Bell,
  Zap,
  Target,
  Award,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
  Activity,
  Smartphone,
  Globe,
  Star,
  Heart,
  MessageCircle,
  Share2,
  RefreshCw,
  Grid,
  Palette,
  Image as ImageIcon,
  Save,
  X,
  Trash2,
  Move,
  Link,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  Copy,
  ExternalLink,
  Monitor,
  Type,
  Layers
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { mockOrders, mockProducts } from '../data/mockData';
import type { Story, Theme, Category, Banner } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('today');
  const { 
    orders, 
    products, 
    categories, 
    themes, 
    stories,
    banners,
    addCategory,
    updateCategory,
    deleteCategory,
    addTheme,
    updateTheme,
    deleteTheme,
    setActiveTheme,
    addStory,
    updateStory,
    deleteStory,
    reorderStories,
    addBanner,
    updateBanner,
    deleteBanner,
    reorderBanners
  } = useStore();

  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showThemeForm, setShowThemeForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Enhanced stats with real-time feel
  const stats = {
    revenue: { value: 125600, change: +12.5, trend: 'up', label: "Today's Revenue" },
    orders: { value: 47, change: +8, trend: 'up', label: "New Orders" },
    customers: { value: 1247, change: +15, trend: 'up', label: "Active Customers" },
    conversion: { value: 3.2, change: -0.3, trend: 'down', label: "Conversion Rate" },
  };

  const recentActivity = [
    { id: 1, type: 'order', message: 'New order #ORD001 received', time: '2 min ago', icon: ShoppingBag, color: 'text-green-600' },
    { id: 2, type: 'review', message: 'New 5-star review on Silk Saree', time: '5 min ago', icon: Star, color: 'text-yellow-600' },
    { id: 3, type: 'customer', message: 'New customer registration', time: '8 min ago', icon: Users, color: 'text-blue-600' },
    { id: 4, type: 'product', message: 'Low stock alert: Cotton Frock', time: '12 min ago', icon: Package, color: 'text-red-600' },
  ];

  const topProducts = mockProducts.slice(0, 5).map((product, index) => ({
    ...product,
    sales: Math.floor(Math.random() * 100) + 20,
    revenue: product.price * (Math.floor(Math.random() * 100) + 20),
    rank: index + 1
  }));

  const StatCard = ({ stat, icon: Icon, gradient }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className={`flex items-center space-x-1 text-sm font-bold ${
            stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {stat.trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span>{Math.abs(stat.change)}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
          <p className="text-3xl font-black text-gray-900">
            {stat.label.includes('Revenue') ? `₹${stat.value.toLocaleString()}` : 
             stat.label.includes('Rate') ? `${stat.value}%` : stat.value.toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );

  // Banner Form Component
  const BannerForm = () => {
    const [formData, setFormData] = useState<Partial<Banner>>(
      editingBanner || {
        title: '',
        subtitle: '',
        description: '',
        image: '',
        gradient: 'from-purple-600 via-pink-600 to-red-500',
        textColor: 'text-white',
        buttonText: 'Shop Now',
        buttonColor: 'bg-white text-purple-600',
        isActive: true,
        sortOrder: banners.length + 1,
        linkType: 'none',
        linkValue: '',
        bannerType: 'promotional',
        height: 'medium',
        position: 'top',
        showIcon: true,
        icon: '🔥'
      }
    );

    const gradientOptions = [
      { name: 'Purple to Pink to Red', value: 'from-purple-600 via-pink-600 to-red-500' },
      { name: 'Blue to Cyan', value: 'from-blue-600 to-cyan-600' },
      { name: 'Emerald to Teal', value: 'from-emerald-500 to-teal-600' },
      { name: 'Orange to Red', value: 'from-orange-600 to-red-600' },
      { name: 'Yellow to Orange', value: 'from-yellow-500 to-orange-500' },
      { name: 'Indigo to Purple', value: 'from-indigo-600 to-purple-600' },
    ];

    const bannerTypes = [
      { value: 'hero', label: 'Hero Banner' },
      { value: 'promotional', label: 'Promotional' },
      { value: 'seasonal', label: 'Seasonal' },
      { value: 'announcement', label: 'Announcement' }
    ];

    const heightOptions = [
      { value: 'small', label: 'Small (128px)' },
      { value: 'medium', label: 'Medium (192px)' },
      { value: 'large', label: 'Large (256px)' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title || !formData.buttonText) return;

      const bannerData: Banner = {
        id: editingBanner?.id || `banner_${Date.now()}`,
        title: formData.title!,
        subtitle: formData.subtitle || '',
        description: formData.description || '',
        image: formData.image || '',
        gradient: formData.gradient!,
        textColor: formData.textColor!,
        buttonText: formData.buttonText!,
        buttonColor: formData.buttonColor!,
        isActive: formData.isActive!,
        sortOrder: formData.sortOrder!,
        linkType: formData.linkType!,
        linkValue: formData.linkValue || '',
        createdAt: editingBanner?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        bannerType: formData.bannerType!,
        height: formData.height!,
        position: formData.position!,
        showIcon: formData.showIcon!,
        icon: formData.icon,
        discount: formData.discount
      };

      if (editingBanner) {
        updateBanner(editingBanner.id, bannerData);
      } else {
        addBanner(bannerData);
      }

      setShowBannerForm(false);
      setEditingBanner(null);
    };

    const getBannerHeight = (height: string) => {
      switch (height) {
        case 'small': return 'h-32';
        case 'large': return 'h-64';
        default: return 'h-48';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {editingBanner ? 'Edit Banner' : 'Create New Banner'}
            </h3>
            <button
              onClick={() => {
                setShowBannerForm(false);
                setEditingBanner(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Live Preview</h4>
              <div className={`relative ${getBannerHeight(formData.height || 'medium')} bg-gradient-to-br ${formData.gradient} rounded-3xl overflow-hidden`}>
                {formData.image && (
                  <img
                    src={formData.image}
                    alt="Banner background"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />
                )}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div>
                    {formData.showIcon && formData.icon && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{formData.icon}</span>
                        <span className={`${formData.textColor} font-bold text-sm`}>
                          {formData.subtitle || 'SUBTITLE'}
                        </span>
                      </div>
                    )}
                    <h2 className={`text-2xl font-black ${formData.textColor} mb-2`}>
                      {formData.title || 'Banner Title'}
                    </h2>
                    {formData.description && (
                      <p className={`${formData.textColor}/90 text-sm`}>
                        {formData.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className={`self-start ${formData.buttonColor} font-bold px-6 py-3 rounded-xl shadow-lg`}
                  >
                    {formData.buttonText || 'Button Text'}
                  </button>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Up to 70% OFF"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., HOT DEAL"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., On premium Ikkat collection"
                rows={3}
              />
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image URL (Optional)
              </label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Gradient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Gradient
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gradientOptions.map((gradient) => (
                  <button
                    key={gradient.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, gradient: gradient.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.gradient === gradient.value
                        ? 'border-purple-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${gradient.value} mb-2`} />
                    <span className="text-xs font-medium text-gray-700">{gradient.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Button Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text *
                </label>
                <input
                  type="text"
                  value={formData.buttonText || ''}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Shop Now"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Style
                </label>
                <select
                  value={formData.buttonColor || 'bg-white text-purple-600'}
                  onChange={(e) => setFormData({ ...formData, buttonColor: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="bg-white text-purple-600">White with Purple Text</option>
                  <option value="bg-white text-gray-900">White with Black Text</option>
                  <option value="bg-black text-white">Black with White Text</option>
                  <option value="bg-purple-600 text-white">Purple Background</option>
                  <option value="bg-transparent border-2 border-white text-white">Transparent with Border</option>
                </select>
              </div>
            </div>

            {/* Banner Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Type
                </label>
                <select
                  value={formData.bannerType || 'promotional'}
                  onChange={(e) => setFormData({ ...formData, bannerType: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {bannerTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height
                </label>
                <select
                  value={formData.height || 'medium'}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {heightOptions.map((height) => (
                    <option key={height.value} value={height.value}>{height.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder || 1}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            {/* Icon Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="showIcon"
                  checked={formData.showIcon || false}
                  onChange={(e) => setFormData({ ...formData, showIcon: e.target.checked })}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="showIcon" className="text-sm font-medium text-gray-700">
                  Show Icon
                </label>
              </div>

              {formData.showIcon && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={formData.icon || ''}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="🔥"
                    maxLength={2}
                  />
                </div>
              )}
            </div>

            {/* Link Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Type
                </label>
                <select
                  value={formData.linkType || 'none'}
                  onChange={(e) => setFormData({ ...formData, linkType: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="none">No Link</option>
                  <option value="category">Category</option>
                  <option value="collection">Collection</option>
                  <option value="external">External URL</option>
                </select>
              </div>

              {formData.linkType !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Value
                  </label>
                  <input
                    type="text"
                    value={formData.linkValue || ''}
                    onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={
                      formData.linkType === 'external' 
                        ? 'https://example.com' 
                        : 'category-slug or collection-name'
                    }
                  />
                </div>
              )}
            </div>

            {/* Scheduling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate ? formData.startDate.slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate ? formData.endDate.slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (visible on homepage)
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
              </motion.button>
              <button
                type="button"
                onClick={() => {
                  setShowBannerForm(false);
                  setEditingBanner(null);
                }}
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Story Form Component
  const StoryForm = () => {
    const [formData, setFormData] = useState<Partial<Story>>(
      editingStory || {
        title: '',
        subtitle: '',
        image: '',
        gradient: 'from-purple-600 to-pink-600',
        isActive: true,
        sortOrder: stories.length + 1,
        linkType: 'none',
        linkValue: ''
      }
    );

    const gradientOptions = [
      { name: 'Purple to Pink', value: 'from-purple-600 to-pink-600' },
      { name: 'Blue to Cyan', value: 'from-blue-600 to-cyan-600' },
      { name: 'Orange to Red', value: 'from-orange-600 to-red-600' },
      { name: 'Emerald to Teal', value: 'from-emerald-600 to-teal-600' },
      { name: 'Yellow to Orange', value: 'from-yellow-600 to-orange-600' },
      { name: 'Indigo to Purple', value: 'from-indigo-600 to-purple-600' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title || !formData.image) return;

      const storyData: Story = {
        id: editingStory?.id || `story_${Date.now()}`,
        title: formData.title!,
        subtitle: formData.subtitle || '',
        image: formData.image!,
        gradient: formData.gradient!,
        isActive: formData.isActive!,
        sortOrder: formData.sortOrder!,
        linkType: formData.linkType!,
        linkValue: formData.linkValue || '',
        createdAt: editingStory?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        startDate: formData.startDate,
        endDate: formData.endDate
      };

      if (editingStory) {
        updateStory(editingStory.id, storyData);
      } else {
        addStory(storyData);
      }

      setShowStoryForm(false);
      setEditingStory(null);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {editingStory ? 'Edit Story' : 'Create New Story'}
            </h3>
            <button
              onClick={() => {
                setShowStoryForm(false);
                setEditingStory(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Preview</h4>
              <div className="flex justify-center">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${formData.gradient} opacity-60`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-xs font-bold text-center">
                      {formData.title || 'Title'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., New Collection"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., Latest Arrivals"
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            {/* Gradient */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gradient Overlay
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {gradientOptions.map((gradient) => (
                  <button
                    key={gradient.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, gradient: gradient.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.gradient === gradient.value
                        ? 'border-purple-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-8 rounded-lg bg-gradient-to-r ${gradient.value} mb-2`} />
                    <span className="text-xs font-medium text-gray-700">{gradient.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Link Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Type
                </label>
                <select
                  value={formData.linkType || 'none'}
                  onChange={(e) => setFormData({ ...formData, linkType: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="none">No Link</option>
                  <option value="category">Category</option>
                  <option value="collection">Collection</option>
                  <option value="external">External URL</option>
                </select>
              </div>

              {formData.linkType !== 'none' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Value
                  </label>
                  <input
                    type="text"
                    value={formData.linkValue || ''}
                    onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={
                      formData.linkType === 'external' 
                        ? 'https://example.com' 
                        : 'category-slug or collection-name'
                    }
                  />
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={formData.sortOrder || 1}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.startDate ? formData.startDate.slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.endDate ? formData.endDate.slice(0, 16) : ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive || false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Active (visible on homepage)
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>{editingStory ? 'Update Story' : 'Create Story'}</span>
              </motion.button>
              <button
                type="button"
                onClick={() => {
                  setShowStoryForm(false);
                  setEditingStory(null);
                }}
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  const renderBannerManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Banner Management</h3>
          <p className="text-gray-600">Create and manage homepage banners and promotional content</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowBannerForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Banner</span>
        </motion.button>
      </div>

      {/* Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Monitor className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Banners</p>
              <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Banners</p>
              <p className="text-2xl font-bold text-gray-900">{banners.filter(b => b.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {banners.filter(b => b.startDate && new Date(b.startDate) > new Date()).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Layers className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Banner Types</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(banners.map(b => b.bannerType)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900">All Banners</h4>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Drag to reorder</span>
            <Move className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {banners.length === 0 ? (
          <div className="text-center py-12">
            <Monitor className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">No banners yet</h4>
            <p className="text-gray-600 mb-6">Create your first banner to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBannerForm(true)}
              className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
            >
              Create First Banner
            </motion.button>
          </div>
        ) : (
          <div className="space-y-6">
            {banners.sort((a, b) => a.sortOrder - b.sortOrder).map((banner) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative"
              >
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all">
                  {/* Banner Preview */}
                  <div className="mb-4">
                    <div className={`relative h-32 bg-gradient-to-br ${banner.gradient} rounded-2xl overflow-hidden`}>
                      {banner.image && (
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 p-4 flex flex-col justify-between">
                        <div>
                          {banner.showIcon && banner.icon && (
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-lg">{banner.icon}</span>
                              <span className={`${banner.textColor} font-bold text-xs`}>
                                {banner.subtitle}
                              </span>
                            </div>
                          )}
                          <h2 className={`text-lg font-black ${banner.textColor} mb-1`}>
                            {banner.title}
                          </h2>
                          {banner.description && (
                            <p className={`${banner.textColor}/90 text-xs`}>
                              {banner.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          className={`self-start ${banner.buttonColor} font-bold px-4 py-2 rounded-lg text-xs`}
                        >
                          {banner.buttonText}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Banner Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h5 className="font-bold text-gray-900 mb-1">{banner.title}</h5>
                      <div className="flex items-center space-x-2 text-xs">
                        <span className={`px-2 py-1 rounded-full ${
                          banner.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {banner.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-gray-500">#{banner.sortOrder}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Type: <span className="font-medium capitalize">{banner.bannerType}</span></p>
                      <p className="text-sm text-gray-600">Height: <span className="font-medium capitalize">{banner.height}</span></p>
                    </div>

                    <div>
                      {banner.linkType !== 'none' && (
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-1 text-xs">
                            <Link className="h-3 w-3 text-blue-600" />
                            <span className="text-blue-800 font-medium">
                              {banner.linkType === 'external' ? 'External Link' : 
                               banner.linkType === 'category' ? 'Category' : 'Collection'}
                            </span>
                          </div>
                          {banner.linkValue && (
                            <p className="text-xs text-blue-600 mt-1 truncate">
                              {banner.linkValue}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingBanner(banner);
                        setShowBannerForm(true);
                      }}
                      className="flex-1 bg-blue-100 text-blue-700 font-semibold py-2 px-3 rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteBanner(banner.id)}
                      className="bg-red-100 text-red-700 font-semibold py-2 px-3 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Banner Form Modal */}
      {showBannerForm && <BannerForm />}
    </div>
  );

  const renderStoryManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Story Management</h3>
          <p className="text-gray-600">Manage homepage story cards and their content</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStoryForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Story</span>
        </motion.button>
      </div>

      {/* Story Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Grid className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Stories</p>
              <p className="text-2xl font-bold text-gray-900">{stories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Stories</p>
              <p className="text-2xl font-bold text-gray-900">{stories.filter(s => s.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {stories.filter(s => s.startDate && new Date(s.startDate) > new Date()).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Link className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">With Links</p>
              <p className="text-2xl font-bold text-gray-900">
                {stories.filter(s => s.linkType !== 'none').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900">All Stories</h4>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Drag to reorder</span>
            <Move className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-12">
            <Grid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">No stories yet</h4>
            <p className="text-gray-600 mb-6">Create your first story to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStoryForm(true)}
              className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
            >
              Create First Story
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stories.sort((a, b) => a.sortOrder - b.sortOrder).map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative"
              >
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-purple-300 transition-all">
                  {/* Story Preview */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-60`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold text-center">
                          {story.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Story Info */}
                  <div className="text-center mb-4">
                    <h5 className="font-bold text-gray-900 mb-1">{story.title}</h5>
                    {story.subtitle && (
                      <p className="text-sm text-gray-600 mb-2">{story.subtitle}</p>
                    )}
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <span className={`px-2 py-1 rounded-full ${
                        story.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {story.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-gray-500">#{story.sortOrder}</span>
                    </div>
                  </div>

                  {/* Link Info */}
                  {story.linkType !== 'none' && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center space-x-2 text-sm">
                        <Link className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">
                          {story.linkType === 'external' ? 'External Link' : 
                           story.linkType === 'category' ? 'Category' : 'Collection'}
                        </span>
                      </div>
                      {story.linkValue && (
                        <p className="text-xs text-blue-600 mt-1 truncate">
                          {story.linkValue}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEditingStory(story);
                        setShowStoryForm(true);
                      }}
                      className="flex-1 bg-blue-100 text-blue-700 font-semibold py-2 px-3 rounded-xl hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteStory(story.id)}
                      className="bg-red-100 text-red-700 font-semibold py-2 px-3 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Story Form Modal */}
      {showStoryForm && <StoryForm />}
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-black mb-2">Good morning, Admin! 👋</h1>
              <p className="text-xl opacity-90">Your store is performing great today</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30"
            >
              <Bell className="h-6 w-6" />
            </motion.button>
          </div>
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
              <div className="text-2xl font-black">₹1.2M</div>
              <div className="text-sm opacity-90">This Month</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
              <div className="text-2xl font-black">847</div>
              <div className="text-sm opacity-90">Orders</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard stat={stats.revenue} icon={DollarSign} gradient="from-green-500 to-emerald-600" />
        <StatCard stat={stats.orders} icon={ShoppingBag} gradient="from-blue-500 to-cyan-600" />
        <StatCard stat={stats.customers} icon={Users} gradient="from-purple-500 to-pink-600" />
        <StatCard stat={stats.conversion} icon={Target} gradient="from-orange-500 to-red-600" />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Revenue Analytics</h3>
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4 text-gray-600" />
              </motion.button>
            </div>
          </div>
          <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Interactive charts coming soon</p>
              <p className="text-sm text-gray-500">Real-time analytics dashboard</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Live Activity</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className={`p-2 rounded-xl bg-white shadow-sm ${activity.color}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl"
          >
            View All Activity
          </motion.button>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Top Performing Products</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl"
          >
            View All Products
          </motion.button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Rank</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Product</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Sales</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Revenue</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Rating</th>
                <th className="text-left py-4 px-2 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      product.rank === 1 ? 'bg-yellow-500' :
                      product.rank === 2 ? 'bg-gray-400' :
                      product.rank === 3 ? 'bg-orange-500' :
                      'bg-gray-300'
                    }`}>
                      {product.rank}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded-xl"
                      />
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="font-semibold text-gray-900">{product.sales}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="font-semibold text-green-600">₹{product.revenue.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { icon: Plus, label: 'Add Product', color: 'from-green-500 to-emerald-600', action: () => {} },
        { icon: Package, label: 'Manage Inventory', color: 'from-blue-500 to-cyan-600', action: () => {} },
        { icon: Users, label: 'View Customers', color: 'from-purple-500 to-pink-600', action: () => {} },
        { icon: BarChart3, label: 'Analytics', color: 'from-orange-500 to-red-600', action: () => {} },
      ].map((action, index) => (
        <motion.button
          key={action.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={action.action}
          className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-3xl shadow-xl`}
        >
          <action.icon className="h-8 w-8 mx-auto mb-3" />
          <span className="font-bold text-sm">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'themes', label: 'Themes', icon: Palette },
    { id: 'stories', label: 'Stories', icon: ImageIcon },
    { id: 'banners', label: 'Banners', icon: Monitor },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Studio
              </h1>
              <p className="text-sm text-gray-500">Manage your store</p>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="relative p-3 bg-gray-100 rounded-full"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gray-100 rounded-full"
              >
                <Settings className="h-5 w-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="px-4 py-2">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {renderQuickActions()}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'stories' && renderStoryManagement()}
            {activeTab === 'banners' && renderBannerManagement()}
            {activeTab === 'products' && (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Management</h3>
                <p className="text-gray-600">Advanced product management system</p>
              </div>
            )}
            {activeTab === 'orders' && (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Management</h3>
                <p className="text-gray-600">Track and manage all orders</p>
              </div>
            )}
            {activeTab === 'customers' && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Management</h3>
                <p className="text-gray-600">Manage customer relationships</p>
              </div>
            )}
            {activeTab === 'categories' && (
              <div className="text-center py-12">
                <Grid className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Category Management</h3>
                <p className="text-gray-600">Organize your product categories</p>
              </div>
            )}
            {activeTab === 'themes' && (
              <div className="text-center py-12">
                <Palette className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Theme Management</h3>
                <p className="text-gray-600">Customize your store appearance</p>
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                <p className="text-gray-600">Detailed insights and reports</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;