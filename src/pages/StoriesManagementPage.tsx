import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  MessageSquare,
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
  ChevronDown
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Story } from '../types';

interface StoriesManagementPageProps {
  onBack: () => void;
}

const StoriesManagementPage: React.FC<StoriesManagementPageProps> = ({ onBack }) => {
  const { 
    stories, 
    addStory, 
    updateStory, 
    deleteStory,
    reorderStories
  } = useStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  
  const [formData, setFormData] = useState<Partial<Story>>({
    title: '',
    subtitle: '',
    image: '',
    gradient: 'from-purple-600 to-pink-600',
    isActive: true,
    sortOrder: 1,
    linkType: 'none',
    linkValue: ''
  });

  // Filter stories based on search
  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (story.subtitle && story.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image) {
      return;
    }

    const storyData: Story = {
      id: editingStory?.id || `story_${Date.now()}`,
      title: formData.title,
      subtitle: formData.subtitle,
      image: formData.image,
      gradient: formData.gradient || 'from-purple-600 to-pink-600',
      isActive: formData.isActive ?? true,
      sortOrder: formData.sortOrder || stories.length + 1,
      linkType: formData.linkType || 'none',
      linkValue: formData.linkValue,
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

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image: '',
      gradient: 'from-purple-600 to-pink-600',
      isActive: true,
      sortOrder: 1,
      linkType: 'none',
      linkValue: ''
    });
    setEditingStory(null);
    setShowForm(false);
  };

  const handleEdit = (story: Story) => {
    setFormData(story);
    setEditingStory(story);
    setShowForm(true);
  };

  const handleDelete = (storyId: string) => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      deleteStory(storyId);
    }
  };

  const moveStory = (storyId: string, direction: 'up' | 'down') => {
    const sortedStories = [...stories].sort((a, b) => a.sortOrder - b.sortOrder);
    const currentIndex = sortedStories.findIndex(s => s.id === storyId);
    
    if (direction === 'up' && currentIndex > 0) {
      const newStories = [...sortedStories];
      [newStories[currentIndex], newStories[currentIndex - 1]] = [newStories[currentIndex - 1], newStories[currentIndex]];
      newStories.forEach((story, index) => {
        updateStory(story.id, { sortOrder: index + 1 });
      });
    } else if (direction === 'down' && currentIndex < sortedStories.length - 1) {
      const newStories = [...sortedStories];
      [newStories[currentIndex], newStories[currentIndex + 1]] = [newStories[currentIndex + 1], newStories[currentIndex]];
      newStories.forEach((story, index) => {
        updateStory(story.id, { sortOrder: index + 1 });
      });
    }
  };

  const gradientOptions = [
    { name: 'Purple to Pink', value: 'from-purple-600 to-pink-600' },
    { name: 'Blue to Cyan', value: 'from-blue-600 to-cyan-600' },
    { name: 'Green to Emerald', value: 'from-green-600 to-emerald-600' },
    { name: 'Orange to Red', value: 'from-orange-600 to-red-600' },
    { name: 'Indigo to Purple', value: 'from-indigo-600 to-purple-600' },
    { name: 'Pink to Rose', value: 'from-pink-600 to-rose-600' },
    { name: 'Yellow to Orange', value: 'from-yellow-500 to-orange-600' },
    { name: 'Teal to Blue', value: 'from-teal-600 to-blue-600' }
  ];

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredStories
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          {/* Story Preview */}
          <div className={`relative h-32 bg-gradient-to-br ${story.gradient} flex items-center justify-center`}>
            {story.image && (
              <img
                src={story.image}
                alt={story.title}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
            )}
            <div className="relative z-10 text-center text-white">
              <h3 className="font-bold text-lg">{story.title}</h3>
              {story.subtitle && (
                <p className="text-sm opacity-90">{story.subtitle}</p>
              )}
            </div>
            
            {/* Status Badge */}
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                story.isActive 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {story.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Sort Order */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2 py-1 rounded-full">
              #{story.sortOrder}
            </div>
          </div>

          {/* Story Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {story.linkType}
                </span>
                {story.linkValue && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {story.linkValue}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => moveStory(story.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => moveStory(story.id, 'down')}
                  disabled={index === filteredStories.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateStory(story.id, { isActive: !story.isActive })}
                  className={`p-2 rounded-lg transition-colors ${
                    story.isActive 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {story.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleEdit(story)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(story.id)}
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
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Story</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Link</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStories
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((story, index) => (
              <tr key={story.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">#{story.sortOrder}</span>
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => moveStory(story.id, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveStory(story.id, 'down')}
                        disabled={index === filteredStories.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${story.gradient} flex items-center justify-center relative overflow-hidden`}>
                      {story.image && (
                        <img
                          src={story.image}
                          alt={story.title}
                          className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                      )}
                      <span className="relative z-10 text-white text-xs font-bold">
                        {story.title.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{story.title}</h4>
                      {story.subtitle && (
                        <p className="text-sm text-gray-600">{story.subtitle}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {story.linkType}
                    </span>
                    {story.linkValue && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {story.linkValue}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateStory(story.id, { isActive: !story.isActive })}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      story.isActive 
                        ? 'bg-green-100 text-green-800 border-2 border-green-200' 
                        : 'bg-red-100 text-red-800 border-2 border-red-200'
                    }`}
                  >
                    {story.isActive ? (
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
                      onClick={() => handleEdit(story)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
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
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Stories Management</h1>
                  <p className="text-sm text-gray-500">{stories.length} stories • {stories.filter(s => s.isActive).length} active</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search stories..."
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

              {/* Add Story Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Story</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stories Display */}
        <div className="space-y-6">
          {filteredStories.length > 0 ? (
            viewMode === 'grid' ? renderGridView() : renderListView()
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
              <p className="text-gray-600 mb-6">Create your first story to get started</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Create First Story
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Story Modal */}
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
              className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingStory ? 'Edit Story' : 'Add New Story'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Story Preview */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Preview</h4>
                  <div className={`relative h-24 bg-gradient-to-br ${formData.gradient} rounded-xl flex items-center justify-center overflow-hidden`}>
                    {formData.image && (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                      />
                    )}
                    <div className="relative z-10 text-center text-white">
                      <h3 className="font-bold">{formData.title || 'Story Title'}</h3>
                      {formData.subtitle && (
                        <p className="text-sm opacity-90">{formData.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Story Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., New Collection"
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
                      placeholder="e.g., Latest Arrivals"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Story Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                {/* Gradient */}
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

                {/* Link Settings */}
                <div className="space-y-4">
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
                          formData.linkType === 'collection' ? 'new-arrivals' :
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
                    <span>{editingStory ? 'Update Story' : 'Create Story'}</span>
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

export default StoriesManagementPage;