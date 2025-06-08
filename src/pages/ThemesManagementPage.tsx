import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Globe,
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
  Palette,
  Calendar,
  ToggleLeft,
  ToggleRight,
  ChevronUp,
  ChevronDown,
  Star,
  Crown,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Theme } from '../types';

interface ThemesManagementPageProps {
  onBack: () => void;
}

const ThemesManagementPage: React.FC<ThemesManagementPageProps> = ({ onBack }) => {
  const { 
    themes, 
    addTheme, 
    updateTheme, 
    deleteTheme,
    setActiveTheme
  } = useStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  
  const [formData, setFormData] = useState<Partial<Theme>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    bannerImage: '',
    icon: '🎨',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#F9FAFB',
      text: '#1F2937'
    },
    isActive: false,
    isDefault: false,
    sortOrder: 1,
    settings: {
      showBanner: true,
      showCountdown: false,
      enableSpecialOffers: true
    }
  });

  // Filter themes based on search
  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    theme.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      return;
    }

    // Generate slug from name if not provided
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const themeData: Theme = {
      id: editingTheme?.id || `theme_${Date.now()}`,
      name: formData.name,
      slug,
      description: formData.description,
      image: formData.image || 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
      bannerImage: formData.bannerImage,
      icon: formData.icon || '🎨',
      colors: formData.colors || {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        accent: '#F59E0B',
        background: '#F9FAFB',
        text: '#1F2937'
      },
      isActive: formData.isActive ?? false,
      isDefault: formData.isDefault ?? false,
      sortOrder: formData.sortOrder || themes.length + 1,
      settings: formData.settings || {
        showBanner: true,
        showCountdown: false,
        enableSpecialOffers: true
      },
      createdAt: editingTheme?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      startDate: formData.startDate,
      endDate: formData.endDate
    };

    if (editingTheme) {
      updateTheme(editingTheme.id, themeData);
    } else {
      addTheme(themeData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      bannerImage: '',
      icon: '🎨',
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        accent: '#F59E0B',
        background: '#F9FAFB',
        text: '#1F2937'
      },
      isActive: false,
      isDefault: false,
      sortOrder: 1,
      settings: {
        showBanner: true,
        showCountdown: false,
        enableSpecialOffers: true
      }
    });
    setEditingTheme(null);
    setShowForm(false);
  };

  const handleEdit = (theme: Theme) => {
    setFormData(theme);
    setEditingTheme(theme);
    setShowForm(true);
  };

  const handleDelete = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme?.isDefault) {
      alert('Cannot delete the default theme. Please set another theme as default first.');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this theme? This action cannot be undone.')) {
      deleteTheme(themeId);
    }
  };

  const handleSetActive = (themeId: string) => {
    setActiveTheme(themeId);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredThemes
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((theme) => (
        <motion.div
          key={theme.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          {/* Theme Preview */}
          <div 
            className="h-32 relative overflow-hidden"
            style={{ backgroundColor: theme.colors.primary }}
          >
            {theme.image && (
              <img
                src={theme.image}
                alt={theme.name}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <span className="text-3xl mb-2 block">{theme.icon}</span>
                <h3 className="font-bold text-lg">{theme.name}</h3>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="absolute top-2 right-2 flex flex-col space-y-1">
              {theme.isDefault && (
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Default
                </span>
              )}
              {theme.isActive && (
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>

            {/* Sort Order */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded-full">
              #{theme.sortOrder}
            </div>
          </div>

          {/* Theme Info */}
          <div className="p-6">
            <div className="mb-4">
              <h4 className="font-bold text-gray-900 mb-2">{theme.name}</h4>
              <p className="text-gray-600 text-sm line-clamp-2">{theme.description}</p>
            </div>

            {/* Color Palette */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Color Palette</p>
              <div className="flex space-x-2">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-gray-200"
                  style={{ backgroundColor: theme.colors.primary }}
                  title="Primary"
                />
                <div 
                  className="w-6 h-6 rounded-full border-2 border-gray-200"
                  style={{ backgroundColor: theme.colors.secondary }}
                  title="Secondary"
                />
                <div 
                  className="w-6 h-6 rounded-full border-2 border-gray-200"
                  style={{ backgroundColor: theme.colors.accent }}
                  title="Accent"
                />
                <div 
                  className="w-6 h-6 rounded-full border-2 border-gray-200"
                  style={{ backgroundColor: theme.colors.background }}
                  title="Background"
                />
                <div 
                  className="w-6 h-6 rounded-full border-2 border-gray-200"
                  style={{ backgroundColor: theme.colors.text }}
                  title="Text"
                />
              </div>
            </div>

            {/* Settings Preview */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">Features</p>
              <div className="flex flex-wrap gap-1">
                {theme.settings.showBanner && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Banner
                  </span>
                )}
                {theme.settings.showCountdown && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    Countdown
                  </span>
                )}
                {theme.settings.enableSpecialOffers && (
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                    Offers
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {!theme.isActive && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSetActive(theme.id)}
                    className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-colors"
                  >
                    Activate
                  </motion.button>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(theme)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {!theme.isDefault && (
                  <button
                    onClick={() => handleDelete(theme.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Theme</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Colors</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Features</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredThemes
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((theme) => (
              <tr key={theme.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      {theme.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <span>{theme.name}</span>
                        {theme.isDefault && <Crown className="h-4 w-4 text-yellow-500" />}
                      </h4>
                      <p className="text-sm text-gray-600">{theme.description}</p>
                      <p className="text-xs text-gray-500">#{theme.sortOrder}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: theme.colors.primary }}
                      title="Primary"
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: theme.colors.secondary }}
                      title="Secondary"
                    />
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: theme.colors.accent }}
                      title="Accent"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    {theme.isDefault && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      theme.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {theme.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {theme.settings.showBanner && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        Banner
                      </span>
                    )}
                    {theme.settings.showCountdown && (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                        Countdown
                      </span>
                    )}
                    {theme.settings.enableSpecialOffers && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        Offers
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {!theme.isActive && (
                      <button
                        onClick={() => handleSetActive(theme.id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(theme)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {!theme.isDefault && (
                      <button
                        onClick={() => handleDelete(theme.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
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
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Themes Management</h1>
                  <p className="text-sm text-gray-500">{themes.length} themes • {themes.filter(t => t.isActive).length} active</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search themes..."
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

              {/* Add Theme Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Theme</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Themes Display */}
        <div className="space-y-6">
          {filteredThemes.length > 0 ? (
            viewMode === 'grid' ? renderGridView() : renderListView()
          ) : (
            <div className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No themes found</h3>
              <p className="text-gray-600 mb-6">Create your first theme to get started</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Create First Theme
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Theme Modal */}
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
                  {editingTheme ? 'Edit Theme' : 'Add New Theme'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Theme Preview */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Preview</h4>
                  <div 
                    className="h-32 rounded-xl flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: formData.colors?.primary || '#8B5CF6' }}
                  >
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                    )}
                    <div className="relative z-10 text-center text-white">
                      <span className="text-3xl mb-2 block">{formData.icon || '🎨'}</span>
                      <h3 className="font-bold text-xl">{formData.name || 'Theme Name'}</h3>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Festival Collection"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="festival-collection"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Brief description of this theme"
                      required
                    />
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
                      placeholder="🎨"
                    />
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Color Scheme</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <input
                        type="color"
                        value={formData.colors?.primary}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          colors: { ...formData.colors!, primary: e.target.value }
                        })}
                        className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Color
                      </label>
                      <input
                        type="color"
                        value={formData.colors?.secondary}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          colors: { ...formData.colors!, secondary: e.target.value }
                        })}
                        className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Accent Color
                      </label>
                      <input
                        type="color"
                        value={formData.colors?.accent}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          colors: { ...formData.colors!, accent: e.target.value }
                        })}
                        className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={formData.colors?.background}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          colors: { ...formData.colors!, background: e.target.value }
                        })}
                        className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Color
                      </label>
                      <input
                        type="color"
                        value={formData.colors?.text}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          colors: { ...formData.colors!, text: e.target.value }
                        })}
                        className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Images</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme Image URL
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
                        Banner Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.bannerImage}
                        onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="https://example.com/banner.jpg"
                      />
                    </div>
                  </div>
                </div>

                {/* Theme Settings */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Theme Settings</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="showBanner"
                        checked={formData.settings?.showBanner}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings!, showBanner: e.target.checked }
                        })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="showBanner" className="text-sm font-medium text-gray-700">
                        Show Banner
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="showCountdown"
                        checked={formData.settings?.showCountdown}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings!, showCountdown: e.target.checked }
                        })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="showCountdown" className="text-sm font-medium text-gray-700">
                        Show Countdown
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="enableSpecialOffers"
                        checked={formData.settings?.enableSpecialOffers}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          settings: { ...formData.settings!, enableSpecialOffers: e.target.checked }
                        })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="enableSpecialOffers" className="text-sm font-medium text-gray-700">
                        Enable Special Offers
                      </label>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900">Schedule (Optional)</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.startDate?.slice(0, 16)}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.endDate?.slice(0, 16)}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      Active Theme
                    </label>
                  </div>

                  <div className="flex items-center space-x-3 pt-8">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isDefault" className="text-sm font-medium text-gray-700">
                      Default Theme
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
                    <span>{editingTheme ? 'Update Theme' : 'Create Theme'}</span>
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

export default ThemesManagementPage;