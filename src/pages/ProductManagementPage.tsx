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
  Tag, 
  Image as ImageIcon,
  Palette,
  Ruler,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Eye,
  Copy,
  Upload,
  FolderTree,
  Baby,
  Shirt,
  Check
} from 'lucide-react';
import { useStore } from '../store/useStore';
import DragDropImageUpload from '../components/ImageUpload/DragDropImageUpload';
import type { Product, Category } from '../types';

interface ProductManagementPageProps {
  onBack: () => void;
}

const ProductManagementPage: React.FC<ProductManagementPageProps> = ({ onBack }) => {
  const { 
    products, 
    categories, 
    setProducts,
    addCategory,
    updateCategory,
    deleteCategory
  } = useStore();

  const [activeTab, setActiveTab] = useState('products');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    subcategory: '',
    subSubcategory: '',
    images: [] as string[],
    description: '',
    sizes: [] as string[],
    colors: [] as string[],
    inStock: true,
    featured: false,
    tags: '',
    sku: '',
    stockQuantity: '',
    lowStockThreshold: '',
    // Stitched dress specific fields
    isStitchedDress: false,
    availableSizes: {
      S: false,
      M: false,
      L: false,
      XL: false,
      XXL: false
    },
    supportsFeedingFriendly: false
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    autoDescription: '',
    image: '',
    icon: '',
    color: '#8B5CF6',
    parentId: '',
    level: 0,
    isActive: true
  });

  // Get hierarchical categories for display
  const getHierarchicalCategories = () => {
    const mainCategories = categories.filter(cat => cat.level === 0);
    return mainCategories.map(mainCat => ({
      ...mainCat,
      subcategories: categories.filter(cat => cat.parentId === mainCat.id && cat.level === 1).map(subCat => ({
        ...subCat,
        subSubcategories: categories.filter(cat => cat.parentId === subCat.id && cat.level === 2)
      }))
    }));
  };

  // Get category path for display
  const getCategoryPath = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return '';

    if (category.level === 0) return category.name;
    if (category.level === 1) {
      const parent = categories.find(cat => cat.id === category.parentId);
      return `${parent?.name || ''} > ${category.name}`;
    }
    if (category.level === 2) {
      const parent = categories.find(cat => cat.id === category.parentId);
      const grandParent = parent ? categories.find(cat => cat.id === parent.parentId) : null;
      return `${grandParent?.name || ''} > ${parent?.name || ''} > ${category.name}`;
    }
    return category.name;
  };

  // Auto-fill description based on selected subcategory
  useEffect(() => {
    if (productForm.subSubcategory) {
      const category = categories.find(cat => cat.id === productForm.subSubcategory);
      if (category?.autoDescription) {
        setProductForm(prev => ({ ...prev, description: category.autoDescription }));
      }
    } else if (productForm.subcategory) {
      const category = categories.find(cat => cat.id === productForm.subcategory);
      if (category?.autoDescription) {
        setProductForm(prev => ({ ...prev, description: category.autoDescription }));
      }
    } else if (productForm.category) {
      const category = categories.find(cat => cat.id === productForm.category);
      if (category?.autoDescription) {
        setProductForm(prev => ({ ...prev, description: category.autoDescription }));
      }
    }
  }, [productForm.category, productForm.subcategory, productForm.subSubcategory, categories]);

  const resetProductForm = () => {
    setProductForm({
      name: '',
      price: '',
      originalPrice: '',
      category: '',
      subcategory: '',
      subSubcategory: '',
      images: [],
      description: '',
      sizes: [],
      colors: [],
      inStock: true,
      featured: false,
      tags: '',
      sku: '',
      stockQuantity: '',
      lowStockThreshold: '',
      isStitchedDress: false,
      availableSizes: {
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false
      },
      supportsFeedingFriendly: false
    });
    setEditingProduct(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      autoDescription: '',
      image: '',
      icon: '',
      color: '#8B5CF6',
      parentId: '',
      level: 0,
      isActive: true
    });
    setEditingCategory(null);
  };

  const handleSaveProduct = () => {
    const now = new Date().toISOString();
    
    // Determine final category based on hierarchy
    let finalCategory = productForm.category;
    if (productForm.subSubcategory) {
      finalCategory = productForm.subSubcategory;
    } else if (productForm.subcategory) {
      finalCategory = productForm.subcategory;
    }

    const categoryObj = categories.find(cat => cat.id === finalCategory);
    
    // Get available sizes for stitched dresses
    const availableSizes = productForm.isStitchedDress 
      ? Object.entries(productForm.availableSizes)
          .filter(([_, available]) => available)
          .map(([size, _]) => size)
      : productForm.sizes;

    const productData: Product = {
      id: editingProduct?.id || 'prod_' + Date.now(),
      name: productForm.name,
      price: parseInt(productForm.price),
      originalPrice: productForm.originalPrice ? parseInt(productForm.originalPrice) : undefined,
      category: categoryObj?.name || '',
      images: productForm.images,
      description: productForm.description,
      sizes: availableSizes,
      colors: productForm.colors,
      inStock: productForm.inStock,
      featured: productForm.featured,
      rating: editingProduct?.rating || 4.5,
      reviewCount: editingProduct?.reviewCount || 0,
      tags: productForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      sku: productForm.sku,
      stockQuantity: productForm.stockQuantity ? parseInt(productForm.stockQuantity) : undefined,
      lowStockThreshold: productForm.lowStockThreshold ? parseInt(productForm.lowStockThreshold) : undefined,
      isStitchedDress: productForm.isStitchedDress,
      availableSizes: productForm.isStitchedDress ? productForm.availableSizes : undefined,
      supportsFeedingFriendly: productForm.supportsFeedingFriendly,
      createdAt: editingProduct?.createdAt || now,
      updatedAt: now
    };

    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p => p.id === editingProduct.id ? productData : p);
      setProducts(updatedProducts);
    } else {
      // Add new product
      setProducts([...products, productData]);
    }

    setShowProductForm(false);
    resetProductForm();
  };

  const handleSaveCategory = () => {
    const now = new Date().toISOString();
    
    const categoryData: Category = {
      id: editingCategory?.id || 'cat_' + Date.now(),
      name: categoryForm.name,
      slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      description: categoryForm.description,
      autoDescription: categoryForm.autoDescription,
      image: categoryForm.image,
      icon: categoryForm.icon,
      color: categoryForm.color,
      parentId: categoryForm.parentId || undefined,
      level: categoryForm.level,
      productCount: editingCategory?.productCount || 0,
      isActive: categoryForm.isActive,
      sortOrder: editingCategory?.sortOrder || categories.length + 1,
      createdAt: editingCategory?.createdAt || now,
      updatedAt: now
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }

    setShowCategoryForm(false);
    resetCategoryForm();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    
    // Find category hierarchy
    const categoryObj = categories.find(cat => cat.name === product.category);
    let category = '', subcategory = '', subSubcategory = '';
    
    if (categoryObj) {
      if (categoryObj.level === 0) {
        category = categoryObj.id;
      } else if (categoryObj.level === 1) {
        subcategory = categoryObj.id;
        const parent = categories.find(cat => cat.id === categoryObj.parentId);
        if (parent) category = parent.id;
      } else if (categoryObj.level === 2) {
        subSubcategory = categoryObj.id;
        const parent = categories.find(cat => cat.id === categoryObj.parentId);
        if (parent) {
          subcategory = parent.id;
          const grandParent = categories.find(cat => cat.id === parent.parentId);
          if (grandParent) category = grandParent.id;
        }
      }
    }

    setProductForm({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      category,
      subcategory,
      subSubcategory,
      images: product.images,
      description: product.description,
      sizes: product.sizes,
      colors: product.colors,
      inStock: product.inStock,
      featured: product.featured,
      tags: product.tags.join(', '),
      sku: product.sku || '',
      stockQuantity: product.stockQuantity?.toString() || '',
      lowStockThreshold: product.lowStockThreshold?.toString() || '',
      isStitchedDress: product.isStitchedDress || false,
      availableSizes: product.availableSizes || {
        S: false,
        M: false,
        L: false,
        XL: false,
        XXL: false
      },
      supportsFeedingFriendly: product.supportsFeedingFriendly || false
    });
    setShowProductForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      autoDescription: category.autoDescription || '',
      image: category.image,
      icon: category.icon || '',
      color: category.color || '#8B5CF6',
      parentId: category.parentId || '',
      level: category.level,
      isActive: category.isActive
    });
    setShowCategoryForm(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      deleteCategory(categoryId);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'categories', label: 'Categories', icon: FolderTree, count: categories.length }
  ];

  const renderProductForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={() => {
              setShowProductForm(false);
              resetProductForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
              <input
                type="text"
                value={productForm.sku}
                onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Product SKU"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
              <input
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
              <input
                type="number"
                value={productForm.originalPrice}
                onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Category Selection</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Main Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Category *</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ 
                    ...productForm, 
                    category: e.target.value,
                    subcategory: '',
                    subSubcategory: ''
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select main category</option>
                  {categories.filter(cat => cat.level === 0).map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory */}
              {productForm.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <select
                    value={productForm.subcategory}
                    onChange={(e) => setProductForm({ 
                      ...productForm, 
                      subcategory: e.target.value,
                      subSubcategory: ''
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select subcategory</option>
                    {categories
                      .filter(cat => cat.level === 1 && cat.parentId === productForm.category)
                      .map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                  </select>
                </div>
              )}

              {/* Sub-subcategory */}
              {productForm.subcategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-subcategory</label>
                  <select
                    value={productForm.subSubcategory}
                    onChange={(e) => setProductForm({ ...productForm, subSubcategory: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select sub-subcategory</option>
                    {categories
                      .filter(cat => cat.level === 2 && cat.parentId === productForm.subcategory)
                      .map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Product Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Product Images</label>
            <DragDropImageUpload
              images={productForm.images}
              onImagesChange={(images) => setProductForm({ ...productForm, images })}
              maxImages={10}
              maxSizePerImage={5}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Product description (auto-filled based on category)"
            />
          </div>

          {/* Stitched Dress Options */}
          <div className="border border-gray-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shirt className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Stitched Dress Options</h4>
            </div>

            <div className="space-y-4">
              {/* Is Stitched Dress Toggle */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Is this a stitched dress?</span>
                <button
                  onClick={() => setProductForm({ 
                    ...productForm, 
                    isStitchedDress: !productForm.isStitchedDress 
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    productForm.isStitchedDress ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      productForm.isStitchedDress ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Available Sizes for Stitched Dresses */}
              {productForm.isStitchedDress && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Available Sizes</label>
                  <div className="grid grid-cols-5 gap-3">
                    {Object.entries(productForm.availableSizes).map(([size, available]) => (
                      <label key={size} className="flex items-center space-x-2 cursor-pointer">
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
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-medium text-gray-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Feeding Type Selection */}
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Baby className="h-5 w-5 text-pink-600" />
                  <label className="block text-sm font-medium text-gray-700">Feeding Type</label>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="feedingType"
                      checked={productForm.supportsFeedingFriendly}
                      onChange={() => setProductForm({ ...productForm, supportsFeedingFriendly: true })}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Feeding Friendly</span>
                      <p className="text-sm text-gray-600">Suitable for nursing mothers</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="feedingType"
                      checked={!productForm.supportsFeedingFriendly}
                      onChange={() => setProductForm({ ...productForm, supportsFeedingFriendly: false })}
                      className="text-gray-600 focus:ring-gray-500"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Non-Feeding</span>
                      <p className="text-sm text-gray-600">Regular dress design</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Regular Sizes and Colors (for non-stitched items) */}
          {!productForm.isStitchedDress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sizes (comma separated)</label>
                <input
                  type="text"
                  value={productForm.sizes.join(', ')}
                  onChange={(e) => setProductForm({ 
                    ...productForm, 
                    sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="S, M, L, XL, Free Size"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Colors (comma separated)</label>
                <input
                  type="text"
                  value={productForm.colors.join(', ')}
                  onChange={(e) => setProductForm({ 
                    ...productForm, 
                    colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Red, Blue, Green, Black"
                />
              </div>
            </div>
          )}

          {/* Stock Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                value={productForm.stockQuantity}
                onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
              <input
                type="number"
                value={productForm.lowStockThreshold}
                onChange={(e) => setProductForm({ ...productForm, lowStockThreshold: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="5"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
            <input
              type="text"
              value={productForm.tags}
              onChange={(e) => setProductForm({ ...productForm, tags: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="handwoven, traditional, cotton, silk"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between space-x-6">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-700">In Stock</span>
              <button
                onClick={() => setProductForm({ ...productForm, inStock: !productForm.inStock })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  productForm.inStock ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    productForm.inStock ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <span className="font-medium text-gray-700">Featured</span>
              <button
                onClick={() => setProductForm({ ...productForm, featured: !productForm.featured })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  productForm.featured ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    productForm.featured ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveProduct}
              className="flex-1 bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
            </motion.button>
            <button
              onClick={() => {
                setShowProductForm(false);
                resetProductForm();
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderCategoryForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </h3>
          <button
            onClick={() => {
              setShowCategoryForm(false);
              resetCategoryForm();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter category name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="category-slug"
              />
            </div>
          </div>

          {/* Parent Category and Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Parent Category</label>
              <select
                value={categoryForm.parentId}
                onChange={(e) => {
                  const parentId = e.target.value;
                  const parentCategory = categories.find(cat => cat.id === parentId);
                  setCategoryForm({ 
                    ...categoryForm, 
                    parentId,
                    level: parentCategory ? parentCategory.level + 1 : 0
                  });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">No parent (Main category)</option>
                {categories
                  .filter(cat => cat.level < 2) // Only allow up to 2 levels deep
                  .map(category => (
                    <option key={category.id} value={category.id}>
                      {'  '.repeat(category.level)}
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <input
                type="text"
                value={`Level ${categoryForm.level} (${
                  categoryForm.level === 0 ? 'Main Category' :
                  categoryForm.level === 1 ? 'Subcategory' :
                  'Sub-subcategory'
                })`}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Visual Elements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
              <input
                type="text"
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="👗"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="color"
                value={categoryForm.color}
                onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={categoryForm.image}
              onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Category description"
            />
          </div>

          {/* Auto Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Auto Description for Products</label>
            <textarea
              value={categoryForm.autoDescription}
              onChange={(e) => setCategoryForm({ ...categoryForm, autoDescription: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="This description will be auto-filled for products in this category"
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Active</span>
            <button
              onClick={() => setCategoryForm({ ...categoryForm, isActive: !categoryForm.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                categoryForm.isActive ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  categoryForm.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSaveCategory}
              className="flex-1 bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="h-5 w-5" />
              <span>{editingCategory ? 'Update Category' : 'Save Category'}</span>
            </motion.button>
            <button
              onClick={() => {
                setShowCategoryForm(false);
                resetCategoryForm();
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderProductsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Products</h3>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowProductForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.name}>{category.name}</option>
          ))}
        </select>
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
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">No products found</h4>
          <p className="text-gray-600 mb-6">Get started by adding your first product</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowProductForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
          >
            Add Product
          </motion.button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={viewMode === 'grid' 
                ? 'bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden'
                : 'bg-white rounded-2xl shadow-lg border border-gray-100 p-6'
              }
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="relative">
                    <img
                      src={product.images[0] || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-col space-y-1">
                      {product.featured && (
                        <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      {product.supportsFeedingFriendly && (
                        <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                          <Baby className="h-3 w-3" />
                          <span>Feeding</span>
                        </span>
                      )}
                      {!product.supportsFeedingFriendly && product.isStitchedDress && (
                        <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Non-Feeding
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{getCategoryPath(product.category)}</p>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-6">
                  <img
                    src={product.images[0] || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="h-20 w-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{getCategoryPath(product.category)}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          {product.featured && (
                            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                          {product.supportsFeedingFriendly && (
                            <span className="bg-pink-100 text-pink-800 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                              <Baby className="h-3 w-3" />
                              <span>Feeding</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Categories</h3>
          <p className="text-gray-600">{categories.length} categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCategoryForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Category</span>
        </motion.button>
      </div>

      {/* Categories Tree */}
      <div className="space-y-4">
        {getHierarchicalCategories().map((mainCategory) => (
          <motion.div
            key={mainCategory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            {/* Main Category */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: mainCategory.color }}
                  >
                    {mainCategory.icon || mainCategory.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{mainCategory.name}</h4>
                    <p className="text-gray-600">{mainCategory.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">Level {mainCategory.level}</span>
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        mainCategory.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {mainCategory.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEditCategory(mainCategory)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteCategory(mainCategory.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Subcategories */}
            {mainCategory.subcategories && mainCategory.subcategories.length > 0 && (
              <div className="p-6 space-y-4">
                {mainCategory.subcategories.map((subCategory) => (
                  <div key={subCategory.id} className="ml-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: subCategory.color }}
                        >
                          {subCategory.icon || subCategory.name.charAt(0)}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{subCategory.name}</h5>
                          <p className="text-sm text-gray-600">{subCategory.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">Level {subCategory.level}</span>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              subCategory.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {subCategory.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEditCategory(subCategory)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteCategory(subCategory.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Sub-subcategories */}
                    {subCategory.subSubcategories && subCategory.subSubcategories.length > 0 && (
                      <div className="ml-6 mt-3 space-y-2">
                        {subCategory.subSubcategories.map((subSubCategory) => (
                          <div key={subSubCategory.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                                style={{ backgroundColor: subSubCategory.color }}
                              >
                                {subSubCategory.icon || subSubCategory.name.charAt(0)}
                              </div>
                              <div>
                                <h6 className="font-medium text-gray-900">{subSubCategory.name}</h6>
                                <p className="text-xs text-gray-600">{subSubCategory.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-gray-500">Level {subSubCategory.level}</span>
                                  <span className={`px-1 py-0.5 text-xs font-bold rounded ${
                                    subSubCategory.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {subSubCategory.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEditCategory(subSubCategory)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              >
                                <Edit className="h-3 w-3" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteCategory(subSubCategory.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </motion.button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <FolderTree className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h4>
          <p className="text-gray-600 mb-6">Create your first category to organize products</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCategoryForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
          >
            Add Category
          </motion.button>
        </div>
      )}
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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <p className="text-sm text-gray-500">Manage your products and categories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'products' && renderProductsTab()}
            {activeTab === 'categories' && renderCategoriesTab()}
          </motion.div>
        </AnimatePresence>

        {/* Forms */}
        <AnimatePresence>
          {showProductForm && renderProductForm()}
          {showCategoryForm && renderCategoryForm()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductManagementPage;