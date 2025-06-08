import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Package,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Upload,
  Download,
  Copy,
  Star,
  Heart,
  ShoppingBag,
  MoreVertical,
  CheckSquare,
  Square,
  Zap,
  TrendingUp,
  DollarSign,
  BarChart3,
  Settings,
  Image as ImageIcon,
  Tag,
  Palette,
  Ruler,
  Info,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import DragDropImageUpload from '../components/ImageUpload/DragDropImageUpload';
import BulkUploadModal from '../components/BulkUpload/BulkUploadModal';
import type { Product } from '../types';

interface ProductManagementPageProps {
  onBack: () => void;
}

const ProductManagementPage: React.FC<ProductManagementPageProps> = ({ onBack }) => {
  const { 
    products, 
    categories,
    setProducts,
    addToCart
  } = useStore();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    originalPrice: 0,
    category: '',
    description: '',
    images: [],
    sizes: [],
    colors: [],
    inStock: true,
    featured: false,
    rating: 4.5,
    reviewCount: 0,
    tags: [],
    supportsFeedingFriendly: false,
    isStitchedDress: false
  });

  // Filter products based on search, category, and stock status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'in-stock' && product.inStock) ||
                        (stockFilter === 'out-of-stock' && !product.inStock);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Quick toggle stock status
  const toggleProductStock = (productId: string) => {
    const updatedProducts = products.map(product =>
      product.id === productId 
        ? { ...product, inStock: !product.inStock, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
  };

  // Delete single product
  const deleteProduct = (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    setShowDeleteConfirm(null);
  };

  // Bulk delete selected products
  const bulkDeleteProducts = () => {
    if (selectedProducts.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.size} selected products? This action cannot be undone.`)) {
      const updatedProducts = products.filter(product => !selectedProducts.has(product.id));
      setProducts(updatedProducts);
      setSelectedProducts(new Set());
    }
  };

  // Bulk toggle stock status
  const bulkToggleStock = (inStock: boolean) => {
    if (selectedProducts.size === 0) return;
    
    const updatedProducts = products.map(product =>
      selectedProducts.has(product.id)
        ? { ...product, inStock, updatedAt: new Date().toISOString() }
        : product
    );
    setProducts(updatedProducts);
    setSelectedProducts(new Set());
  };

  // Toggle product selection
  const toggleProductSelection = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  // Select all filtered products
  const selectAllProducts = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      return;
    }

    const productData: Product = {
      id: editingProduct?.id || `prod_${Date.now()}`,
      name: formData.name!,
      price: formData.price!,
      originalPrice: formData.originalPrice || undefined,
      category: formData.category!,
      description: formData.description || '',
      images: formData.images || [],
      sizes: formData.sizes || [],
      colors: formData.colors || [],
      inStock: formData.inStock ?? true,
      featured: formData.featured ?? false,
      rating: formData.rating || 4.5,
      reviewCount: formData.reviewCount || 0,
      tags: formData.tags || [],
      supportsFeedingFriendly: formData.supportsFeedingFriendly || false,
      isStitchedDress: formData.isStitchedDress || false,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingProduct) {
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? productData : p
      );
      setProducts(updatedProducts);
    } else {
      setProducts([...products, productData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      originalPrice: 0,
      category: '',
      description: '',
      images: [],
      sizes: [],
      colors: [],
      inStock: true,
      featured: false,
      rating: 4.5,
      reviewCount: 0,
      tags: [],
      supportsFeedingFriendly: false,
      isStitchedDress: false
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingProduct(product);
    setShowForm(true);
  };

  const getStockStatusColor = (inStock: boolean) => {
    return inStock 
      ? 'text-green-600 bg-green-100 border-green-200' 
      : 'text-red-600 bg-red-100 border-red-200';
  };

  const renderProductGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
        >
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.images[0] || 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3">
              <button
                onClick={() => toggleProductSelection(product.id)}
                className="p-1 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              >
                {selectedProducts.has(product.id) ? (
                  <CheckSquare className="h-4 w-4 text-purple-600" />
                ) : (
                  <Square className="h-4 w-4 text-gray-600" />
                )}
              </button>
            </div>

            {/* Stock Status Badge */}
            <div className="absolute top-3 right-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleProductStock(product.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${getStockStatusColor(product.inStock)}`}
              >
                {product.inStock ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Available</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Out of Stock</span>
                  </div>
                )}
              </motion.button>
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEdit(product)}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-5 w-5 text-gray-700" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDeleteConfirm(product.id)}
                className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
              </motion.button>
            </div>

            {/* Product Badges */}
            <div className="absolute bottom-3 left-3 flex flex-col space-y-1">
              {product.featured && (
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Featured
                </span>
              )}
              {product.supportsFeedingFriendly && (
                <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Feeding Friendly
                </span>
              )}
              {product.isStitchedDress && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Stitched
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
            
            {/* Rating */}
            <div className="flex items-center space-x-1 mb-3">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating}</span>
              <span className="text-xs text-gray-400">({product.reviewCount})</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Category & Variants */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{product.category}</span>
              <span>{product.colors.length} colors • {product.sizes.length} sizes</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEdit(product)}
                className="flex-1 bg-purple-600 text-white font-semibold py-2 px-3 rounded-xl hover:bg-purple-700 transition-colors text-sm"
              >
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 px-3 rounded-xl hover:bg-gray-200 transition-colors text-sm"
              >
                Preview
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderProductList = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={selectAllProducts}
                  className="flex items-center space-x-2"
                >
                  {selectedProducts.size === filteredProducts.length && filteredProducts.length > 0 ? (
                    <CheckSquare className="h-4 w-4 text-purple-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-600" />
                  )}
                  <span className="text-sm font-semibold text-gray-900">Product</span>
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleProductSelection(product.id)}
                      className="flex-shrink-0"
                    >
                      {selectedProducts.has(product.id) ? (
                        <CheckSquare className="h-4 w-4 text-purple-600" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                    <img
                      src={product.images[0] || 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'}
                      alt={product.name}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        {product.featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                        {product.supportsFeedingFriendly && (
                          <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2 py-1 rounded-full">
                            Feeding Friendly
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleProductStock(product.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${getStockStatusColor(product.inStock)}`}
                  >
                    {product.inStock ? (
                      <div className="flex items-center space-x-1">
                        <ToggleRight className="h-3 w-3" />
                        <span>Available</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <ToggleLeft className="h-3 w-3" />
                        <span>Out of Stock</span>
                      </div>
                    )}
                  </motion.button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviewCount})</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(product.id)}
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
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                  <p className="text-sm text-gray-500">
                    {products.length} products • {products.filter(p => p.inStock).length} in stock • {selectedProducts.size} selected
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Bulk Actions */}
              {selectedProducts.size > 0 && (
                <div className="flex items-center space-x-2 bg-purple-50 border border-purple-200 rounded-xl px-4 py-2">
                  <span className="text-sm font-medium text-purple-700">
                    {selectedProducts.size} selected
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => bulkToggleStock(true)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as Available"
                    >
                      <ToggleRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => bulkToggleStock(false)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Mark as Out of Stock"
                    >
                      <ToggleLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={bulkDeleteProducts}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Selected"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add Product Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </motion.button>

              {/* Bulk Upload Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBulkUpload(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Bulk Upload</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Stock Status</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="h-4 w-4 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
              >
                <List className="h-4 w-4 mx-auto" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Display */}
        <div className="space-y-6">
          {filteredProducts.length > 0 ? (
            viewMode === 'grid' ? renderProductGrid() : renderProductList()
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || selectedCategory || stockFilter !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Create your first product to get started'
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Add First Product
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Upload Modal */}
      <BulkUploadModal 
        isOpen={showBulkUpload} 
        onClose={() => setShowBulkUpload(false)} 
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteProduct(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Product Form Modal */}
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
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-purple-600" />
                    Basic Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Traditional Ikkat Silk Saree"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Describe your product..."
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Pricing
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selling Price (₹) *
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="2500"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="3000"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Product Images
                  </h4>
                  
                  <DragDropImageUpload
                    images={formData.images || []}
                    onImagesChange={(images) => setFormData({ ...formData, images })}
                    maxImages={10}
                    maxSizePerImage={5}
                  />
                </div>

                {/* Variants */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-pink-600" />
                    Product Variants
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Sizes (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.sizes?.join(', ')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="S, M, L, XL, XXL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Colors (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.colors?.join(', ')}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Red, Blue, Green, Yellow"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Tags & Features */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-orange-600" />
                    Tags & Features
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags?.join(', ')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="handwoven, traditional, silk, festival"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="supportsFeedingFriendly"
                        checked={formData.supportsFeedingFriendly}
                        onChange={(e) => setFormData({ ...formData, supportsFeedingFriendly: e.target.checked })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="supportsFeedingFriendly" className="text-sm font-medium text-gray-700">
                        Feeding Friendly
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isStitchedDress"
                        checked={formData.isStitchedDress}
                        onChange={(e) => setFormData({ ...formData, isStitchedDress: e.target.checked })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="isStitchedDress" className="text-sm font-medium text-gray-700">
                        Stitched Dress
                      </label>
                    </div>
                  </div>
                </div>

                {/* Status & Settings */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-600" />
                    Status & Settings
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="inStock"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                        In Stock / Available
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                        Featured Product
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <input
                        type="number"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-6 border-t">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="flex items-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                  </motion.button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
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

export default ProductManagementPage;