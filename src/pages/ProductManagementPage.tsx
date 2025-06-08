import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FolderTree, 
  Package, 
  Upload, 
  Image as ImageIcon,
  Toggle,
  Check,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Copy,
  Move,
  Settings,
  Tag,
  Layers,
  FileText,
  Camera,
  Shirt,
  Baby,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Category, Product } from '../types';

interface ProductManagementPageProps {
  onBack: () => void;
}

const ProductManagementPage: React.FC<ProductManagementPageProps> = ({ onBack }) => {
  const { 
    categories, 
    products, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    setProducts
  } = useStore();

  const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    autoDescription: '',
    icon: '',
    color: '#8B5CF6',
    parentId: '',
    level: 0
  });

  const [productForm, setProductForm] = useState({
    name: '',
    categoryId: '',
    images: [] as string[],
    price: 0,
    originalPrice: 0,
    sizes: [] as string[],
    colors: [] as string[],
    inStock: true,
    featured: false,
    isStitchedDress: false,
    availableSizes: {
      S: false,
      M: false,
      L: false,
      XL: false,
      XXL: false
    },
    supportsFeedingFriendly: false,
    stockQuantity: 0,
    tags: [] as string[]
  });

  const [imageUpload, setImageUpload] = useState<string>('');

  // Get hierarchical categories
  const getHierarchicalCategories = () => {
    const categoryMap = new Map<string, Category & { children: Category[] }>();
    
    // Initialize all categories
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Build hierarchy
    const rootCategories: (Category & { children: Category[] })[] = [];
    categories.forEach(cat => {
      const categoryWithChildren = categoryMap.get(cat.id)!;
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(categoryWithChildren);
        }
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories.sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategorySubmit = () => {
    if (!categoryForm.name.trim()) return;

    const categoryData: Category = {
      id: editingCategory?.id || `cat_${Date.now()}`,
      name: categoryForm.name,
      slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      image: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
      description: categoryForm.description,
      autoDescription: categoryForm.autoDescription,
      productCount: 0,
      isActive: true,
      createdAt: editingCategory?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      icon: categoryForm.icon,
      color: categoryForm.color,
      sortOrder: editingCategory?.sortOrder || categories.length + 1,
      parentId: categoryForm.parentId || undefined,
      level: categoryForm.level
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }

    resetCategoryForm();
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      autoDescription: '',
      icon: '',
      color: '#8B5CF6',
      parentId: '',
      level: 0
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      description: category.description,
      autoDescription: category.autoDescription || '',
      icon: category.icon || '',
      color: category.color || '#8B5CF6',
      parentId: category.parentId || '',
      level: category.level
    });
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      deleteCategory(categoryId);
    }
  };

  const handleProductSubmit = () => {
    if (!productForm.name.trim() || !productForm.categoryId) return;

    const selectedCat = categories.find(cat => cat.id === productForm.categoryId);
    const productData: Product = {
      id: editingProduct?.id || `prod_${Date.now()}`,
      name: productForm.name,
      price: productForm.price,
      originalPrice: productForm.originalPrice || undefined,
      category: selectedCat?.name || '',
      images: productForm.images,
      description: selectedCat?.autoDescription || productForm.name,
      sizes: productForm.isStitchedDress 
        ? Object.entries(productForm.availableSizes)
            .filter(([_, available]) => available)
            .map(([size, _]) => size)
        : productForm.sizes,
      colors: productForm.colors,
      inStock: productForm.inStock,
      featured: productForm.featured,
      rating: 4.5,
      reviewCount: 0,
      tags: productForm.tags,
      isStitchedDress: productForm.isStitchedDress,
      availableSizes: productForm.isStitchedDress ? productForm.availableSizes : undefined,
      supportsFeedingFriendly: productForm.isStitchedDress ? productForm.supportsFeedingFriendly : undefined,
      stockQuantity: productForm.stockQuantity,
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

    resetProductForm();
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      categoryId: '',
      images: [],
      price: 0,
      originalPrice: 0,
      sizes: [],
      colors: [],
      inStock: true,
      featured: false,
      isStitchedDress: false,
      availableSizes: {
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false
      },
      supportsFeedingFriendly: false,
      stockQuantity: 0,
      tags: []
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      categoryId: categories.find(cat => cat.name === product.category)?.id || '',
      images: product.images,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      sizes: product.sizes,
      colors: product.colors,
      inStock: product.inStock,
      featured: product.featured,
      isStitchedDress: product.isStitchedDress || false,
      availableSizes: product.availableSizes || {
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false
      },
      supportsFeedingFriendly: product.supportsFeedingFriendly || false,
      stockQuantity: product.stockQuantity || 0,
      tags: product.tags
    });
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const addImageToProduct = () => {
    if (imageUpload.trim()) {
      setProductForm({
        ...productForm,
        images: [...productForm.images, imageUpload.trim()]
      });
      setImageUpload('');
    }
  };

  const removeImageFromProduct = (index: number) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index)
    });
  };

  const renderCategoryTree = (categories: (Category & { children: Category[] })[], level = 0) => {
    return categories.map((category) => (
      <div key={category.id} className="mb-2">
        <div 
          className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:shadow-md ${
            selectedCategory?.id === category.id 
              ? 'bg-purple-50 border-purple-200' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex items-center space-x-3">
            {category.children.length > 0 && (
              <button
                onClick={() => toggleCategoryExpansion(category.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: category.color }}
            >
              <span>{category.icon || '📁'}</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{category.name}</h4>
              <p className="text-sm text-gray-500">Level {category.level} • {category.productCount} products</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEditCategory(category)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {expandedCategories.has(category.id) && category.children.length > 0 && (
          <div className="mt-2">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <p className="text-sm text-gray-500">Manage categories and products</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'categories'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FolderTree className="h-4 w-4 inline mr-2" />
                  Categories
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'products'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Package className="h-4 w-4 inline mr-2" />
                  Products
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Categories Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Category Management</h2>
                  <p className="text-gray-600">Organize your products with hierarchical categories</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCategoryForm(true)}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Category</span>
                </motion.button>
              </div>

              {/* Category Tree */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="space-y-4">
                  {getHierarchicalCategories().length === 0 ? (
                    <div className="text-center py-12">
                      <FolderTree className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Yet</h3>
                      <p className="text-gray-600 mb-6">Start by creating your first category</p>
                      <button
                        onClick={() => setShowCategoryForm(true)}
                        className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                      >
                        Create Category
                      </button>
                    </div>
                  ) : (
                    renderCategoryTree(getHierarchicalCategories())
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Products Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Product Management</h2>
                  <p className="text-gray-600">{filteredProducts.length} products found</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex bg-gray-100 rounded-xl p-1">
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowProductForm(true)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Product</span>
                  </motion.button>
                </div>
              </div>

              {/* Products Grid/List */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first product</p>
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Add Product
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'h-48'}`}>
                        <img
                          src={product.images[0] || 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex flex-col space-y-1">
                          {!product.inStock && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              Out of Stock
                            </span>
                          )}
                          {product.featured && (
                            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                          {product.isStitchedDress && (
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              <Shirt className="h-3 w-3 inline mr-1" />
                              Stitched
                            </span>
                          )}
                          {product.supportsFeedingFriendly && (
                            <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              <Baby className="h-3 w-3 inline mr-1" />
                              Feeding
                            </span>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={() => {
                              const updatedProducts = products.map(p =>
                                p.id === product.id ? { ...p, inStock: !p.inStock } : p
                              );
                              setProducts(updatedProducts);
                            }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                          >
                            {product.inStock ? (
                              <ToggleRight className="h-5 w-5 text-green-600" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 line-clamp-2 flex-1">{product.name}</h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                        
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

                        {product.isStitchedDress && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-600 mb-1">Available Sizes:</p>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(product.availableSizes || {}).map(([size, available]) => (
                                <span
                                  key={size}
                                  className={`text-xs px-2 py-1 rounded ${
                                    available 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-400'
                                  }`}
                                >
                                  {size}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className={`w-3 h-3 rounded-full ${
                              product.inStock ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                            <span className="text-xs text-gray-600">
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
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
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Form Modal */}
        <AnimatePresence>
          {showCategoryForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => resetCategoryForm()}
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
                    onClick={resetCategoryForm}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter category name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Category
                      </label>
                      <select
                        value={categoryForm.parentId}
                        onChange={(e) => {
                          const parentId = e.target.value;
                          const parent = categories.find(cat => cat.id === parentId);
                          setCategoryForm({ 
                            ...categoryForm, 
                            parentId,
                            level: parent ? parent.level + 1 : 0
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">No Parent (Main Category)</option>
                        {categories.filter(cat => cat.level < 2).map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {'  '.repeat(cat.level)}
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon (Emoji)
                      </label>
                      <input
                        type="text"
                        value={categoryForm.icon}
                        onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="📁"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <input
                        type="color"
                        value={categoryForm.color}
                        onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                        className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Brief description of this category"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auto-Description for Products
                    </label>
                    <textarea
                      value={categoryForm.autoDescription}
                      onChange={(e) => setCategoryForm({ ...categoryForm, autoDescription: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="This description will be automatically applied to all products in this category"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This description will be automatically used for all products added to this category.
                    </p>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCategorySubmit}
                      className="flex-1 bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <Save className="h-5 w-5 inline mr-2" />
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </motion.button>
                    <button
                      onClick={resetCategoryForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Form Modal */}
        <AnimatePresence>
          {showProductForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => resetProductForm()}
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
                    onClick={resetProductForm}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={productForm.categoryId}
                        onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {'  '.repeat(cat.level)}
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price (Optional)
                      </label>
                      <input
                        type="number"
                        value={productForm.originalPrice}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Product Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images
                    </label>
                    <div className="space-y-4">
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={imageUpload}
                          onChange={(e) => setImageUpload(e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter image URL"
                        />
                        <button
                          onClick={addImageToProduct}
                          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      
                      {productForm.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {productForm.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeImageFromProduct(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stitched Dress Options */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <input
                        type="checkbox"
                        id="isStitchedDress"
                        checked={productForm.isStitchedDress}
                        onChange={(e) => setProductForm({ ...productForm, isStitchedDress: e.target.checked })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <label htmlFor="isStitchedDress" className="font-medium text-gray-900">
                        <Shirt className="h-5 w-5 inline mr-2" />
                        This is a Stitched Dress
                      </label>
                    </div>

                    {productForm.isStitchedDress && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Available Sizes
                          </label>
                          <div className="grid grid-cols-5 gap-3">
                            {Object.entries(productForm.availableSizes).map(([size, available]) => (
                              <label key={size} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={available}
                                  onChange={(e) => setProductForm({
                                    ...productForm,
                                    availableSizes: {
                                      ...productForm.availableSizes,
                                      [size]: e.target.checked
                                    }
                                  })}
                                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm font-medium">{size}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="supportsFeedingFriendly"
                            checked={productForm.supportsFeedingFriendly}
                            onChange={(e) => setProductForm({ ...productForm, supportsFeedingFriendly: e.target.checked })}
                            className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                          />
                          <label htmlFor="supportsFeedingFriendly" className="font-medium text-gray-900">
                            <Baby className="h-5 w-5 inline mr-2" />
                            Feeding Friendly (for nursing mothers)
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Regular Product Options */}
                  {!productForm.isStitchedDress && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sizes (comma separated)
                        </label>
                        <input
                          type="text"
                          value={productForm.sizes.join(', ')}
                          onChange={(e) => setProductForm({ 
                            ...productForm, 
                            sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="S, M, L, XL"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Colors (comma separated)
                        </label>
                        <input
                          type="text"
                          value={productForm.colors.join(', ')}
                          onChange={(e) => setProductForm({ 
                            ...productForm, 
                            colors: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Red, Blue, Green"
                        />
                      </div>
                    </div>
                  )}

                  {/* Product Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="inStock"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <label htmlFor="inStock" className="font-medium text-gray-900">
                        In Stock
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="w-5 h-5 text-yellow-600 rounded focus:ring-yellow-500"
                      />
                      <label htmlFor="featured" className="font-medium text-gray-900">
                        Featured Product
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        value={productForm.stockQuantity}
                        onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleProductSubmit}
                      className="flex-1 bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors"
                    >
                      <Save className="h-5 w-5 inline mr-2" />
                      {editingProduct ? 'Update Product' : 'Create Product'}
                    </motion.button>
                    <button
                      onClick={resetProductForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductManagementPage;