import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FolderTree,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Search,
  Filter,
  Grid,
  List,
  Settings,
  Copy,
  Move,
  AlertCircle,
  Check
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Category } from '../types';

interface CategoriesManagementPageProps {
  onBack: () => void;
}

const CategoriesManagementPage: React.FC<CategoriesManagementPageProps> = ({ onBack }) => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory 
  } = useStore();
  
  const [viewMode, setViewMode] = useState<'tree' | 'grid' | 'list'>('tree');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedParent, setSelectedParent] = useState<string>('');
  
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    autoDescription: '',
    image: '',
    icon: '',
    color: '#8B5CF6',
    isActive: true,
    level: 0,
    parentId: undefined,
    sortOrder: 1
  });

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Build category tree structure
  const buildCategoryTree = (cats: Category[], parentId?: string): Category[] => {
    return cats
      .filter(cat => cat.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(cat => ({
        ...cat,
        children: buildCategoryTree(cats, cat.id)
      }));
  };

  const categoryTree = buildCategoryTree(filteredCategories);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      return;
    }

    // Generate slug from name if not provided
    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const categoryData: Category = {
      id: editingCategory?.id || `cat_${Date.now()}`,
      name: formData.name,
      slug,
      description: formData.description,
      autoDescription: formData.autoDescription || formData.description,
      image: formData.image || 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
      icon: formData.icon || '📁',
      color: formData.color || '#8B5CF6',
      isActive: formData.isActive ?? true,
      level: formData.parentId ? (categories.find(c => c.id === formData.parentId)?.level || 0) + 1 : 0,
      parentId: formData.parentId,
      sortOrder: formData.sortOrder || 1,
      productCount: editingCategory?.productCount || 0,
      createdAt: editingCategory?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      autoDescription: '',
      image: '',
      icon: '',
      color: '#8B5CF6',
      isActive: true,
      level: 0,
      parentId: undefined,
      sortOrder: 1
    });
    setEditingCategory(null);
    setShowForm(false);
    setSelectedParent('');
  };

  const handleEdit = (category: Category) => {
    setFormData(category);
    setEditingCategory(category);
    setSelectedParent(category.parentId || '');
    setShowForm(true);
  };

  const handleDelete = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      deleteCategory(categoryId);
    }
  };

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return cats.map((category) => (
      <div key={category.id} className="space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all ${
            level > 0 ? 'ml-8' : ''
          }`}
        >
          {/* Expand/Collapse Button */}
          {category.children && category.children.length > 0 && (
            <button
              onClick={() => toggleExpanded(category.id)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {expandedCategories.has(category.id) ? (
                <ChevronDown className="h-4 w-4 text-gray-600" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-600" />
              )}
            </button>
          )}

          {/* Category Icon */}
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: category.color }}
          >
            {category.icon}
          </div>

          {/* Category Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="font-bold text-gray-900">{category.name}</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                Level {category.level}
              </span>
              {!category.isActive && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">{category.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span>Slug: {category.slug}</span>
              <span>Products: {category.productCount}</span>
              <span>Sort: {category.sortOrder}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateCategory(category.id, { isActive: !category.isActive })}
              className={`p-2 rounded-lg transition-colors ${
                category.isActive 
                  ? 'text-green-600 hover:bg-green-50' 
                  : 'text-gray-400 hover:bg-gray-50'
              }`}
            >
              {category.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => handleEdit(category)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDelete(category.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Render children if expanded */}
        {category.children && 
         category.children.length > 0 && 
         expandedCategories.has(category.id) && (
          <div className="space-y-2">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCategories.map((category) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
        >
          <div 
            className="h-32 flex items-center justify-center text-4xl text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.icon}
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">{category.name}</h3>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                L{category.level}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{category.productCount} products</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateCategory(category.id, { isActive: !category.isActive })}
                  className={`p-2 rounded-lg transition-colors ${
                    category.isActive 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {category.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleEdit(category)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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

  const getParentOptions = () => {
    return categories.filter(cat => cat.level < 2); // Only allow up to 2 levels deep
  };

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
                  <FolderTree className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
                  <p className="text-sm text-gray-500">{categories.length} categories • {categories.filter(c => c.isActive).length} active</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('tree')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'tree' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <FolderTree className="h-4 w-4" />
                </button>
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

              {/* Add Category Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Category</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Display */}
        <div className="space-y-6">
          {viewMode === 'tree' && (
            <div className="space-y-4">
              {categoryTree.length > 0 ? (
                renderCategoryTree(categoryTree)
              ) : (
                <div className="text-center py-12">
                  <FolderTree className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
                  <p className="text-gray-600">Create your first category to get started</p>
                </div>
              )}
            </div>
          )}

          {viewMode === 'grid' && renderGridView()}

          {viewMode === 'list' && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Level</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Products</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                              style={{ backgroundColor: category.color }}
                            >
                              {category.icon}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{category.name}</h4>
                              <p className="text-sm text-gray-600">{category.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            Level {category.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{category.productCount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            category.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCategory(category.id, { isActive: !category.isActive })}
                              className={`p-2 rounded-lg transition-colors ${
                                category.isActive 
                                  ? 'text-green-600 hover:bg-green-50' 
                                  : 'text-gray-400 hover:bg-gray-50'
                              }`}
                            >
                              {category.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
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
          )}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
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
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Category (Optional)
                  </label>
                  <select
                    value={selectedParent}
                    onChange={(e) => {
                      setSelectedParent(e.target.value);
                      setFormData({ ...formData, parentId: e.target.value || undefined });
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Main Category</option>
                    {getParentOptions().map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {'  '.repeat(cat.level)} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="e.g., Cotton Sarees"
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
                      placeholder="cotton-sarees"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Brief description of this category"
                    required
                  />
                </div>

                {/* Auto Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-fill Product Description
                  </label>
                  <textarea
                    value={formData.autoDescription}
                    onChange={(e) => setFormData({ ...formData, autoDescription: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="This description will be automatically used for products in this category"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This description will be automatically applied to new products in this category
                  </p>
                </div>

                {/* Visual Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon/Emoji
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-2xl"
                      placeholder="👗"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

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
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Status */}
                <div className="flex items-center space-x-3">
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

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-6 border-t">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
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

export default CategoriesManagementPage;