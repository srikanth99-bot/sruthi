import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Target,
  Eye,
  EyeOff,
  Search,
  Grid,
  List,
  Settings,
  Copy,
  Move,
  AlertCircle,
  Check,
  Image as ImageIcon,
  Link,
  Palette,
  Clock,
  Calendar,
  ToggleLeft,
  ToggleRight,
  ChevronUp,
  ChevronDown,
  Percent,
  Type,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Banner } from '../types';

interface BannersManagementPageProps {
  onBack: () => void;
}

const BannersManagementPage: React.FC<BannersManagementPageProps> = ({ onBack }) => {
  const { 
    banners, 
    addBanner, 
    updateBanner, 
    deleteBanner,
    reorderBanners
  } = useStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  const [formData, setFormData] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    gradient: 'from-purple-600 via-pink-600 to-red-500',
    textColor: 'text-white',
    buttonText: 'Shop Now',
    buttonColor: 'bg-white text-purple-600',
    isActive: true,
    sortOrder: 1,
    linkType: 'none',
    linkValue: '',
    bannerType: 'promotional',
    height: 'medium',
    position: 'top',
    showIcon: true,
    icon: '🔥'
  });

  // Filter banners based on search
  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (banner.subtitle && banner.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (banner.description && banner.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.buttonText) {
      return;
    }

    const bannerData: Banner = {
      id: editingBanner?.id || `banner_${Date.now()}`,
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      image: formData.image || '',
      backgroundImage: formData.backgroundImage,
      gradient: formData.gradient || 'from-purple-600 via-pink-600 to-red-500',
      textColor: formData.textColor || 'text-white',
      buttonText: formData.buttonText,
      buttonColor: formData.buttonColor || 'bg-white text-purple-600',
      isActive: formData.isActive ?? true,
      sortOrder: formData.sortOrder || banners.length + 1,
      linkType: formData.linkType || 'none',
      linkValue: formData.linkValue,
      bannerType: formData.bannerType || 'promotional',
      height: formData.height || 'medium',
      position: formData.position || 'top',
      showIcon: formData.showIcon ?? true,
      icon: formData.icon,
      discount: formData.discount,
      createdAt: editingBanner?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: formData.startDate,
      endDate: formData.endDate
    };

    if (editingBanner) {
      updateBanner(editingBanner.id, bannerData);
    } else {
      addBanner(bannerData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      gradient: 'from-purple-600 via-pink-600 to-red-500',
      textColor: 'text-white',
      buttonText: 'Shop Now',
      buttonColor: 'bg-white text-purple-600',
      isActive: true,
      sortOrder: 1,
      linkType: 'none',
      linkValue: '',
      bannerType: 'promotional',
      height: 'medium',
      position: 'top',
      showIcon: true,
      icon: '🔥'
    });
    setEditingBanner(null);
    setShowForm(false);
  };

  const handleEdit = (banner: Banner) => {
    setFormData(banner);
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleDelete = (bannerId: string) => {
    if (window.confirm('Are you sure you want to delete this banner? This action cannot be undone.')) {
      deleteBanner(bannerId);
    }
  };

  const moveBanner = (bannerId: string, direction: 'up' | 'down') => {
    const sortedBanners = [...banners].sort((a, b) => a.sortOrder - b.sortOrder);
    const currentIndex = sortedBanners.findIndex(b => b.id === bannerId);
    
    if (direction === 'up' && currentIndex > 0) {
      const newBanners = [...sortedBanners];
      [newBanners[currentIndex], newBanners[currentIndex - 1]] = [newBanners[currentIndex - 1], newBanners[currentIndex]];
      newBanners.forEach((banner, index) => {
        updateBanner(banner.id, { sortOrder: index + 1 });
      });
    } else if (direction === 'down' && currentIndex < sortedBanners.length - 1) {
      const newBanners = [...sortedBanners];
      [newBanners[currentIndex], newBanners[currentIndex + 1]] = [newBanners[currentIndex + 1], newBanners[currentIndex]];
      newBanners.forEach((banner, index) => {
        updateBanner(banner.id, { sortOrder: index + 1 });
      });
    }
  };

  const getBannerHeight = (height: string) => {
    switch (height) {
      case 'small': return 'h-24';
      case 'large': return 'h-64';
      default: return 'h-48';
    }
  };

  const gradientOptions = [
    { name: 'Purple to Pink to Red', value: 'from-purple-600 via-pink-600 to-red-500' },
    { name: 'Blue to Cyan', value: 'from-blue-600 to-cyan-600' },
    { name: 'Green to Emerald', value: 'from-emerald-500 to-teal-600' },
    { name: 'Orange to Red', value: 'from-orange-500 to-red-600' },
    { name: 'Indigo to Purple', value: 'from-indigo-600 to-purple-600' },
    { name: 'Pink to Rose', value: 'from-pink-500 to-rose-600' },
    { name: 'Yellow to Orange', value: 'from-yellow-400 to-orange-500' },
    { name: 'Teal to Blue', value: 'from-teal-500 to-blue-600' }
  ];

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredBanners
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((banner, index) => (
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          {/* Banner Preview */}
          <div className={`relative ${getBannerHeight(banner.height)} bg-gradient-to-br ${banner.gradient} flex items-center justify-between p-6 overflow-hidden`}>
            {/* Background Image */}
            {banner.image && (
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-black/20" />
            
            {/* Content */}
            <div className="relative z-10 flex-1">
              {banner.showIcon && banner.icon && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{banner.icon}</span>
                  {banner.subtitle && (
                    <span className={`${banner.textColor} font-bold text-sm`}>
                      {banner.subtitle}
                    </span>
                  )}
                </div>
              )}
              <h3 className={`text-xl font-black ${banner.textColor} mb-2`}>
                {banner.title}
              </h3>
              {banner.description && (
                <p className={`${banner.textColor}/90 text-sm`}>
                  {banner.description}
                </p>
              )}
            </div>
            
            <div className="relative z-10">
              <button className={`${banner.buttonColor} font-bold px-4 py-2 rounded-lg shadow-lg text-sm`}>
                {banner.buttonText}
              </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="absolute bottom-2 left-2">
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                banner.isActive 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {banner.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Sort Order */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded-full">
              #{banner.sortOrder}
            </div>
          </div>

          {/* Banner Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {banner.bannerType}
                </span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {banner.height}
                </span>
                {banner.linkValue && (
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    {banner.linkType}: {banner.linkValue}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => moveBanner(banner.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveBanner(banner.id, 'down')}
                  disabled={index === filteredBanners.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateBanner(banner.id, { isActive: !banner.isActive })}
                  className={`p-2 rounded-lg transition-colors ${
                    banner.isActive 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {banner.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleEdit(banner)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Banner</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Link</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBanners
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((banner, index) => (
              <tr key={banner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">#{banner.sortOrder}</span>
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => moveBanner(banner.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveBanner(banner.id, 'down')}
                        disabled={index === filteredBanners.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-12 rounded-lg bg-gradient-to-br ${banner.gradient} flex items-center justify-center relative overflow-hidden`}>
                      {banner.image && (
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                      )}
                      <span className="relative z-10 text-white text-xs font-bold">
                        {banner.icon || banner.title.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{banner.title}</h4>
                      {banner.subtitle && (
                        <p className="text-sm text-gray-600">{banner.subtitle}</p>
                      )}
                      <p className="text-xs text-gray-500">{banner.buttonText}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {banner.bannerType}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {banner.height}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {banner.linkType}
                    </span>
                    {banner.linkValue && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                        {banner.linkValue}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateBanner(banner.id, { isActive: !banner.isActive })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      banner.isActive 
                        ? 'bg-green-100 text-green-800 border-2 border-green-200' 
                        : 'bg-red-100 text-red-800 border-2 border-red-200'
                    }`}
                  >
                    {banner.isActive ? (
                      <div className="flex items-center space-x-1">
                        <ToggleRight className="h-3 w-3" />
                        <span>Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <ToggleLeft className="h-3 w-3" />
                        <span>Inactive</span>
                      </div>
                    )}
                  </motion.button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

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
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Banners Management</h1>
                  <p className="text-sm text-gray-500">{banners.length} banners • {banners.filter(b => b.isActive).length} active</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search banners..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Add Banner Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Banner</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banners Display */}
        <div className="space-y-6">
          {filteredBanners.length > 0 ? (
            viewMode === 'grid' ? renderGridView() : renderListView()
          ) : (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No banners found</h3>
              <p className="text-gray-600 mb-6">Create your first banner to get started</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Create First Banner
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Banner Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Banner Preview */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Preview</h4>
                  <div className={`relative ${getBannerHeight(formData.height)} bg-gradient-to-br ${formData.gradient} rounded-xl flex items-center justify-between p-6 overflow-hidden`}>
                    {/* Background Image */}
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Content */}
                    <div className="relative z-10 flex-1">
                      {formData.showIcon && formData.icon && (
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">{formData.icon}</span>
                          {formData.subtitle && (
                            <span className={`${formData.textColor} font-bold text-sm`}>
                              {formData.subtitle}
                            </span>
                          )}
                        </div>
                      )}
                      <h3 className={`text-2xl font-black ${formData.textColor} mb-2`}>
                        {formData.title || 'Banner Title'}
                      </h3>
                      {formData.description && (
                        <p className={`${formData.textColor}/90 text-sm`}>
                          {formData.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="relative z-10">
                      <button className={`${formData.buttonColor} font-bold px-6 py-3 rounded-xl shadow-lg`}>
                        {formData.buttonText || 'Button Text'}
                      </button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Up to 70% OFF"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., HOT DEAL"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Brief description of the offer or promotion"
                    />
                  </div>
                </div>

                {/* Visual Design */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Visual Design</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Image URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Gradient
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {gradientOptions.map((gradient) => (
                        <button
                          key={gradient.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, gradient: gradient.value })}
                          className={`relative h-12 bg-gradient-to-r ${gradient.value} rounded-lg border-2 transition-all ${
                            formData.gradient === gradient.value 
                              ? 'border-purple-500 scale-105' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {formData.gradient === gradient.value && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <select
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="text-white">White</option>
                        <option value="text-black">Black</option>
                        <option value="text-gray-900">Dark Gray</option>
                        <option value="text-purple-600">Purple</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner Height
                      </label>
                      <select
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Banner Type
                      </label>
                      <select
                        value={formData.bannerType}
                        onChange={(e) => setFormData({ ...formData, bannerType: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="promotional">Promotional</option>
                        <option value="hero">Hero</option>
                        <option value="seasonal">Seasonal</option>
                        <option value="announcement">Announcement</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Button Settings */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Button Settings</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text *
                      </label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Shop Now"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Color
                      </label>
                      <select
                        value={formData.buttonColor}
                        onChange={(e) => setFormData({ ...formData, buttonColor: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="bg-white text-purple-600">White with Purple Text</option>
                        <option value="bg-purple-600 text-white">Purple with White Text</option>
                        <option value="bg-black text-white">Black with White Text</option>
                        <option value="bg-yellow-400 text-black">Yellow with Black Text</option>
                        <option value="bg-green-500 text-white">Green with White Text</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Icon Settings */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Icon Settings</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="showIcon"
                        checked={formData.showIcon}
                        onChange={(e) => setFormData({ ...formData, showIcon: e.target.checked })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="showIcon" className="text-sm font-medium text-gray-700">
                        Show Icon
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon/Emoji
                      </label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl"
                        placeholder="🔥"
                        disabled={!formData.showIcon}
                      />
                    </div>
                  </div>
                </div>

                {/* Link Settings */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Link Settings</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link Type
                      </label>
                      <select
                        value={formData.linkType}
                        onChange={(e) => setFormData({ ...formData, linkType: e.target.value as any })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="none">No Link</option>
                        <option value="category">Category</option>
                        <option value="collection">Collection</option>
                        <option value="external">External URL</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link Value
                      </label>
                      <input
                        type="text"
                        value={formData.linkValue}
                        onChange={(e) => setFormData({ ...formData, linkValue: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder={
                          formData.linkType === 'category' ? 'sarees' :
                          formData.linkType === 'collection' ? 'sale' :
                          formData.linkType === 'external' ? 'https://example.com' :
                          'Leave empty for no link'
                        }
                        disabled={formData.linkType === 'none'}
                      />
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="1"
                    />
                  </div>

                  <div className="flex items-center space-x-3 pt-8">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Active (visible to customers)
                    </label>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-6 border-t">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
                  </motion.button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BannersManagementPage;