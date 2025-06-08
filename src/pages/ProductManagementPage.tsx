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
  FolderTree,
  Upload,
  Download,
  Copy,
  Check,
  AlertCircle,
  Loader,
  FileText,
  Image as ImageIcon,
  Layers,
  Grid,
  List,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Star,
  Tag,
  Zap,
  Archive,
  RefreshCw,
  Settings,
  Database,
  UploadCloud,
  Files
} from 'lucide-react';
import { useStore } from '../store/useStore';
import DragDropImageUpload from '../components/ImageUpload/DragDropImageUpload';
import type { Category, Product } from '../types';

interface ProductManagementPageProps {
  onBack: () => void;
}

interface ProductFormData {
  name: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  subcategoryId?: string;
  subSubcategoryId?: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  tags: string[];
  sku?: string;
  stockQuantity?: number;
  // Stitched dress specific
  availableSizes?: {
    S: boolean;
    M: boolean;
    L: boolean;
    XL: boolean;
    XXL: boolean;
  };
  supportsFeedingFriendly?: boolean;
  isStitchedDress?: boolean;
}

interface BulkUploadData {
  templateCategoryId: string;
  templateSubcategoryId?: string;
  templateSubSubcategoryId?: string;
  templateName: string;
  templatePrice: number;
  templateOriginalPrice?: number;
  templateSizes: string[];
  templateColors: string[];
  templateTags: string[];
  templateStockQuantity?: number;
  templateAvailableSizes?: {
    S: boolean;
    M: boolean;
    L: boolean;
    XL: boolean;
    XXL: boolean;
  };
  templateSupportsFeedingFriendly?: boolean;
  templateIsStitchedDress?: boolean;
  images: string[];
  productVariations: Array<{
    name?: string;
    price?: number;
    originalPrice?: number;
    images: string[];
    sku?: string;
  }>;
}

const ProductManagementPage: React.FC<ProductManagementPageProps> = ({ onBack }) => {
  const { categories, products, setProducts } = useStore();
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'manage'>('single');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Single Product Form State
  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    price: 0,
    originalPrice: undefined,
    categoryId: '',
    subcategoryId: '',
    subSubcategoryId: '',
    images: [],
    sizes: [],
    colors: [],
    inStock: true,
    featured: false,
    tags: [],
    sku: '',
    stockQuantity: 0,
    availableSizes: {
      S: false,
      M: false,
      L: false,
      XL: false,
      XXL: false,
    },
    supportsFeedingFriendly: false,
    isStitchedDress: false,
  });

  // Bulk Upload Form State
  const [bulkForm, setBulkForm] = useState<BulkUploadData>({
    templateCategoryId: '',
    templateSubcategoryId: '',
    templateSubSubcategoryId: '',
    templateName: '',
    templatePrice: 0,
    templateOriginalPrice: undefined,
    templateSizes: [],
    templateColors: [],
    templateTags: [],
    templateStockQuantity: 0,
    templateAvailableSizes: {
      S: false,
      M: false,
      L: false,
      XL: false,
      XXL: false,
    },
    templateSupportsFeedingFriendly: false,
    templateIsStitchedDress: false,
    images: [],
    productVariations: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Get category hierarchy
  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId && cat.level === 1);
  };

  const getSubSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId && cat.level === 2);
  };

  const getMainCategories = () => {
    return categories.filter(cat => cat.level === 0);
  };

  const getCategoryDescription = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.autoDescription || category?.description || '';
  };

  // Handle single product form
  const handleSingleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const categoryDescription = getCategoryDescription(
        productForm.subSubcategoryId || productForm.subcategoryId || productForm.categoryId
      );

      const newProduct: Product = {
        id: editingProduct?.id || 'prod_' + Date.now(),
        name: productForm.name,
        price: productForm.price,
        originalPrice: productForm.originalPrice,
        category: categories.find(cat => cat.id === productForm.categoryId)?.name || '',
        subcategory: categories.find(cat => cat.id === productForm.subcategoryId)?.name,
        subSubcategory: categories.find(cat => cat.id === productForm.subSubcategoryId)?.name,
        images: productForm.images,
        description: categoryDescription,
        sizes: productForm.isStitchedDress 
          ? Object.entries(productForm.availableSizes || {})
              .filter(([_, available]) => available)
              .map(([size, _]) => size)
          : productForm.sizes,
        colors: productForm.colors,
        inStock: productForm.inStock,
        featured: productForm.featured,
        rating: 4.5,
        reviewCount: 0,
        tags: [
          ...productForm.tags,
          ...(productForm.supportsFeedingFriendly ? ['feeding-friendly'] : []),
          ...(productForm.isStitchedDress ? ['stitched-dress'] : [])
        ],
        sku: productForm.sku,
        availableSizes: productForm.isStitchedDress ? productForm.availableSizes : undefined,
        supportsFeedingFriendly: productForm.supportsFeedingFriendly,
        isStitchedDress: productForm.isStitchedDress,
        stockQuantity: productForm.stockQuantity,
        lowStockThreshold: 5,
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingProduct) {
        // Update existing product
        setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
        setSubmitMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        // Add new product
        setProducts([...products, newProduct]);
        setSubmitMessage({ type: 'success', text: 'Product added successfully!' });
      }

      // Reset form
      setProductForm({
        name: '',
        price: 0,
        originalPrice: undefined,
        categoryId: '',
        subcategoryId: '',
        subSubcategoryId: '',
        images: [],
        sizes: [],
        colors: [],
        inStock: true,
        featured: false,
        tags: [],
        sku: '',
        stockQuantity: 0,
        availableSizes: {
          S: false,
          M: false,
          L: false,
          XL: false,
          XXL: false,
        },
        supportsFeedingFriendly: false,
        isStitchedDress: false,
      });
      setEditingProduct(null);
      setShowProductForm(false);

    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to save product. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle bulk upload
  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const categoryDescription = getCategoryDescription(
        bulkForm.templateSubSubcategoryId || bulkForm.templateSubcategoryId || bulkForm.templateCategoryId
      );

      const newProducts: Product[] = [];

      // If no variations specified, create products from images
      if (bulkForm.productVariations.length === 0 && bulkForm.images.length > 0) {
        bulkForm.images.forEach((image, index) => {
          const product: Product = {
            id: 'prod_bulk_' + Date.now() + '_' + index,
            name: `${bulkForm.templateName} - Variant ${index + 1}`,
            price: bulkForm.templatePrice,
            originalPrice: bulkForm.templateOriginalPrice,
            category: categories.find(cat => cat.id === bulkForm.templateCategoryId)?.name || '',
            subcategory: categories.find(cat => cat.id === bulkForm.templateSubcategoryId)?.name,
            subSubcategory: categories.find(cat => cat.id === bulkForm.templateSubSubcategoryId)?.name,
            images: [image],
            description: categoryDescription,
            sizes: bulkForm.templateIsStitchedDress 
              ? Object.entries(bulkForm.templateAvailableSizes || {})
                  .filter(([_, available]) => available)
                  .map(([size, _]) => size)
              : bulkForm.templateSizes,
            colors: bulkForm.templateColors,
            inStock: true,
            featured: false,
            rating: 4.5,
            reviewCount: 0,
            tags: [
              ...bulkForm.templateTags,
              ...(bulkForm.templateSupportsFeedingFriendly ? ['feeding-friendly'] : []),
              ...(bulkForm.templateIsStitchedDress ? ['stitched-dress'] : [])
            ],
            sku: `BULK_${Date.now()}_${index}`,
            availableSizes: bulkForm.templateIsStitchedDress ? bulkForm.templateAvailableSizes : undefined,
            supportsFeedingFriendly: bulkForm.templateSupportsFeedingFriendly,
            isStitchedDress: bulkForm.templateIsStitchedDress,
            stockQuantity: bulkForm.templateStockQuantity,
            lowStockThreshold: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          newProducts.push(product);
        });
      } else {
        // Create products from variations
        bulkForm.productVariations.forEach((variation, index) => {
          const product: Product = {
            id: 'prod_bulk_' + Date.now() + '_' + index,
            name: variation.name || `${bulkForm.templateName} - Variant ${index + 1}`,
            price: variation.price || bulkForm.templatePrice,
            originalPrice: variation.originalPrice || bulkForm.templateOriginalPrice,
            category: categories.find(cat => cat.id === bulkForm.templateCategoryId)?.name || '',
            subcategory: categories.find(cat => cat.id === bulkForm.templateSubcategoryId)?.name,
            subSubcategory: categories.find(cat => cat.id === bulkForm.templateSubSubcategoryId)?.name,
            images: variation.images.length > 0 ? variation.images : bulkForm.images,
            description: categoryDescription,
            sizes: bulkForm.templateIsStitchedDress 
              ? Object.entries(bulkForm.templateAvailableSizes || {})
                  .filter(([_, available]) => available)
                  .map(([size, _]) => size)
              : bulkForm.templateSizes,
            colors: bulkForm.templateColors,
            inStock: true,
            featured: false,
            rating: 4.5,
            reviewCount: 0,
            tags: [
              ...bulkForm.templateTags,
              ...(bulkForm.templateSupportsFeedingFriendly ? ['feeding-friendly'] : []),
              ...(bulkForm.templateIsStitchedDress ? ['stitched-dress'] : [])
            ],
            sku: variation.sku || `BULK_${Date.now()}_${index}`,
            availableSizes: bulkForm.templateIsStitchedDress ? bulkForm.templateAvailableSizes : undefined,
            supportsFeedingFriendly: bulkForm.templateSupportsFeedingFriendly,
            isStitchedDress: bulkForm.templateIsStitchedDress,
            stockQuantity: bulkForm.templateStockQuantity,
            lowStockThreshold: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          newProducts.push(product);
        });
      }

      setProducts([...products, ...newProducts]);
      setSubmitMessage({ type: 'success', text: `${newProducts.length} products uploaded successfully!` });

      // Reset bulk form
      setBulkForm({
        templateCategoryId: '',
        templateSubcategoryId: '',
        templateSubSubcategoryId: '',
        templateName: '',
        templatePrice: 0,
        templateOriginalPrice: undefined,
        templateSizes: [],
        templateColors: [],
        templateTags: [],
        templateStockQuantity: 0,
        templateAvailableSizes: {
          S: false,
          M: false,
          L: false,
          XL: false,
          XXL: false,
        },
        templateSupportsFeedingFriendly: false,
        templateIsStitchedDress: false,
        images: [],
        productVariations: [],
      });

    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'Failed to upload products. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add variation to bulk upload
  const addBulkVariation = () => {
    setBulkForm({
      ...bulkForm,
      productVariations: [
        ...bulkForm.productVariations,
        {
          name: '',
          price: undefined,
          originalPrice: undefined,
          images: [],
          sku: '',
        }
      ]
    });
  };

  // Remove variation from bulk upload
  const removeBulkVariation = (index: number) => {
    setBulkForm({
      ...bulkForm,
      productVariations: bulkForm.productVariations.filter((_, i) => i !== index)
    });
  };

  // Update variation
  const updateBulkVariation = (index: number, field: string, value: any) => {
    const updatedVariations = [...bulkForm.productVariations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      [field]: value
    };
    setBulkForm({
      ...bulkForm,
      productVariations: updatedVariations
    });
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Clear messages after 5 seconds
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => setSubmitMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  const tabs = [
    { id: 'single', label: 'Single Product', icon: Package, description: 'Add one product at a time' },
    { id: 'bulk', label: 'Bulk Upload', icon: UploadCloud, description: 'Upload multiple products with same details' },
    { id: 'manage', label: 'Manage Products', icon: Database, description: 'View and edit existing products' },
  ];

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
                <p className="text-sm text-gray-500">Manage your product catalog</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{products.length} products</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <div className="text-left">
                    <div>{tab.label}</div>
                    <div className="text-xs text-gray-400">{tab.description}</div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {submitMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl border flex items-center space-x-3 ${
                submitMessage.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {submitMessage.type === 'success' ? (
                <Check className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">{submitMessage.text}</span>
              <button
                onClick={() => setSubmitMessage(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Single Product Upload */}
            {activeTab === 'single' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Add Single Product</h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>Single Upload</span>
                  </div>
                </div>

                <form onSubmit={handleSingleProductSubmit} className="space-y-6">
                  {/* Basic Information */}
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
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU (Optional)
                      </label>
                      <input
                        type="text"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter SKU"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Category *
                      </label>
                      <select
                        value={productForm.categoryId}
                        onChange={(e) => {
                          setProductForm({ 
                            ...productForm, 
                            categoryId: e.target.value,
                            subcategoryId: '',
                            subSubcategoryId: ''
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Category</option>
                        {getMainCategories().map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {productForm.categoryId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subcategory
                        </label>
                        <select
                          value={productForm.subcategoryId}
                          onChange={(e) => {
                            setProductForm({ 
                              ...productForm, 
                              subcategoryId: e.target.value,
                              subSubcategoryId: ''
                            });
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select Subcategory</option>
                          {getSubcategories(productForm.categoryId).map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {productForm.subcategoryId && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sub-subcategory
                        </label>
                        <select
                          value={productForm.subSubcategoryId}
                          onChange={(e) => setProductForm({ ...productForm, subSubcategoryId: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select Sub-subcategory</option>
                          {getSubSubcategories(productForm.subcategoryId).map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price (Optional)
                      </label>
                      <input
                        type="number"
                        value={productForm.originalPrice || ''}
                        onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
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
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Product Type Toggle */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Product Type</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={productForm.isStitchedDress}
                          onChange={(e) => setProductForm({ ...productForm, isStitchedDress: e.target.checked })}
                          className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="font-medium text-gray-900">Stitched Dress</span>
                      </label>

                      {productForm.isStitchedDress && (
                        <div className="ml-8 space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Available Sizes</h4>
                            <div className="grid grid-cols-5 gap-3">
                              {Object.entries(productForm.availableSizes || {}).map(([size, available]) => (
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
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                  />
                                  <span className="text-sm font-medium text-gray-700">{size}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={productForm.supportsFeedingFriendly}
                              onChange={(e) => setProductForm({ ...productForm, supportsFeedingFriendly: e.target.checked })}
                              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="font-medium text-gray-900">Feeding Friendly</span>
                            <span className="text-sm text-gray-500">(For nursing mothers)</span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Regular Sizes and Colors (for non-stitched items) */}
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
                            colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Red, Blue, Green"
                        />
                      </div>
                    </div>
                  )}

                  {/* Colors for stitched dresses */}
                  {productForm.isStitchedDress && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colors (comma separated)
                      </label>
                      <input
                        type="text"
                        value={productForm.colors.join(', ')}
                        onChange={(e) => setProductForm({ 
                          ...productForm, 
                          colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Red, Blue, Green"
                      />
                    </div>
                  )}

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={productForm.tags.join(', ')}
                      onChange={(e) => setProductForm({ 
                        ...productForm, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="handwoven, traditional, premium"
                    />
                  </div>

                  {/* Product Images */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Product Images *
                    </label>
                    <DragDropImageUpload
                      images={productForm.images}
                      onImagesChange={(images) => setProductForm({ ...productForm, images })}
                      maxImages={10}
                    />
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={productForm.inStock}
                        onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="font-medium text-gray-900">In Stock</span>
                    </label>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="font-medium text-gray-900">Featured Product</span>
                    </label>
                  </div>

                  {/* Auto-filled Description Preview */}
                  {(productForm.categoryId || productForm.subcategoryId || productForm.subSubcategoryId) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Auto-Generated Description</h4>
                      <p className="text-blue-800 text-sm">
                        {getCategoryDescription(
                          productForm.subSubcategoryId || productForm.subcategoryId || productForm.categoryId
                        )}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting || productForm.images.length === 0}
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
                          <span>Save Product</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            )}

            {/* Bulk Upload */}
            {activeTab === 'bulk' && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Bulk Product Upload</h2>
                    <p className="text-gray-600 mt-1">Upload multiple products with same details, only images differ</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <UploadCloud className="h-4 w-4" />
                    <span>Bulk Upload</span>
                  </div>
                </div>

                <form onSubmit={handleBulkUpload} className="space-y-8">
                  {/* Template Information */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Template Information</h3>
                    <p className="text-gray-600 mb-6">These details will be applied to all products in this bulk upload</p>

                    <div className="space-y-6">
                      {/* Basic Template Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Name Template *
                          </label>
                          <input
                            type="text"
                            value={bulkForm.templateName}
                            onChange={(e) => setBulkForm({ ...bulkForm, templateName: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Cotton Ikkat Saree"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Individual products will be named: "{bulkForm.templateName} - Variant 1", etc.</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Template Price *
                          </label>
                          <input
                            type="number"
                            value={bulkForm.templatePrice}
                            onChange={(e) => setBulkForm({ ...bulkForm, templatePrice: Number(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="0"
                            min="0"
                            required
                          />
                        </div>
                      </div>

                      {/* Category Selection */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Main Category *
                          </label>
                          <select
                            value={bulkForm.templateCategoryId}
                            onChange={(e) => {
                              setBulkForm({ 
                                ...bulkForm, 
                                templateCategoryId: e.target.value,
                                templateSubcategoryId: '',
                                templateSubSubcategoryId: ''
                              });
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                          >
                            <option value="">Select Category</option>
                            {getMainCategories().map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {bulkForm.templateCategoryId && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subcategory
                            </label>
                            <select
                              value={bulkForm.templateSubcategoryId}
                              onChange={(e) => {
                                setBulkForm({ 
                                  ...bulkForm, 
                                  templateSubcategoryId: e.target.value,
                                  templateSubSubcategoryId: ''
                                });
                              }}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="">Select Subcategory</option>
                              {getSubcategories(bulkForm.templateCategoryId).map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {bulkForm.templateSubcategoryId && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sub-subcategory
                            </label>
                            <select
                              value={bulkForm.templateSubSubcategoryId}
                              onChange={(e) => setBulkForm({ ...bulkForm, templateSubSubcategoryId: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                              <option value="">Select Sub-subcategory</option>
                              {getSubSubcategories(bulkForm.templateSubcategoryId).map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Product Type for Bulk */}
                      <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">Product Type</h4>
                        </div>
                        
                        <div className="space-y-4">
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={bulkForm.templateIsStitchedDress}
                              onChange={(e) => setBulkForm({ ...bulkForm, templateIsStitchedDress: e.target.checked })}
                              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <span className="font-medium text-gray-900">Stitched Dress</span>
                          </label>

                          {bulkForm.templateIsStitchedDress && (
                            <div className="ml-8 space-y-4">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-3">Available Sizes</h5>
                                <div className="grid grid-cols-5 gap-3">
                                  {Object.entries(bulkForm.templateAvailableSizes || {}).map(([size, available]) => (
                                    <label key={size} className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={available}
                                        onChange={(e) => setBulkForm({
                                          ...bulkForm,
                                          templateAvailableSizes: {
                                            ...bulkForm.templateAvailableSizes,
                                            [size]: e.target.checked
                                          }
                                        })}
                                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                      />
                                      <span className="text-sm font-medium text-gray-700">{size}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <label className="flex items-center space-x-3">
                                <input
                                  type="checkbox"
                                  checked={bulkForm.templateSupportsFeedingFriendly}
                                  onChange={(e) => setBulkForm({ ...bulkForm, templateSupportsFeedingFriendly: e.target.checked })}
                                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="font-medium text-gray-900">Feeding Friendly</span>
                                <span className="text-sm text-gray-500">(For nursing mothers)</span>
                              </label>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Template Sizes and Colors */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {!bulkForm.templateIsStitchedDress && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sizes (comma separated)
                            </label>
                            <input
                              type="text"
                              value={bulkForm.templateSizes.join(', ')}
                              onChange={(e) => setBulkForm({ 
                                ...bulkForm, 
                                templateSizes: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="S, M, L, XL"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Colors (comma separated)
                          </label>
                          <input
                            type="text"
                            value={bulkForm.templateColors.join(', ')}
                            onChange={(e) => setBulkForm({ 
                              ...bulkForm, 
                              templateColors: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Red, Blue, Green"
                          />
                        </div>
                      </div>

                      {/* Template Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={bulkForm.templateTags.join(', ')}
                          onChange={(e) => setBulkForm({ 
                            ...bulkForm, 
                            templateTags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="handwoven, traditional, premium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Upload Method Selection */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl p-6 border-2 border-purple-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Simple Image Upload</h4>
                        <p className="text-gray-600 text-sm mb-4">Upload multiple images. Each image becomes a separate product with the same details.</p>
                        <div className="text-purple-600 font-medium">✓ Recommended for most cases</div>
                      </div>
                      <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">Advanced Variations</h4>
                        <p className="text-gray-600 text-sm mb-4">Create custom variations with different names, prices, or multiple images per product.</p>
                        <button
                          type="button"
                          onClick={addBulkVariation}
                          className="text-purple-600 font-medium hover:text-purple-700"
                        >
                          + Add Custom Variations
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Simple Image Upload */}
                  {bulkForm.productVariations.length === 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Product Images * (Each image will create a separate product)
                      </label>
                      <DragDropImageUpload
                        images={bulkForm.images}
                        onImagesChange={(images) => setBulkForm({ ...bulkForm, images })}
                        maxImages={50}
                      />
                      {bulkForm.images.length > 0 && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <p className="text-green-800 font-medium">
                            {bulkForm.images.length} products will be created from these images
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Advanced Variations */}
                  {bulkForm.productVariations.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Product Variations</h3>
                        <button
                          type="button"
                          onClick={addBulkVariation}
                          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Variation</span>
                        </button>
                      </div>

                      {bulkForm.productVariations.map((variation, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Variation {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeBulkVariation(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Name (Optional)
                              </label>
                              <input
                                type="text"
                                value={variation.name || ''}
                                onChange={(e) => updateBulkVariation(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={`${bulkForm.templateName} - Variant ${index + 1}`}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Price (Optional)
                              </label>
                              <input
                                type="number"
                                value={variation.price || ''}
                                onChange={(e) => updateBulkVariation(index, 'price', e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={bulkForm.templatePrice.toString()}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                SKU (Optional)
                              </label>
                              <input
                                type="text"
                                value={variation.sku || ''}
                                onChange={(e) => updateBulkVariation(index, 'sku', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder={`BULK_${index + 1}`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Images for this variation
                            </label>
                            <DragDropImageUpload
                              images={variation.images}
                              onImagesChange={(images) => updateBulkVariation(index, 'images', images)}
                              maxImages={10}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Auto-filled Description Preview */}
                  {(bulkForm.templateCategoryId || bulkForm.templateSubcategoryId || bulkForm.templateSubSubcategoryId) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Auto-Generated Description</h4>
                      <p className="text-blue-800 text-sm">
                        {getCategoryDescription(
                          bulkForm.templateSubSubcategoryId || bulkForm.templateSubcategoryId || bulkForm.templateCategoryId
                        )}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting || (bulkForm.images.length === 0 && bulkForm.productVariations.length === 0)}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-5 w-5" />
                          <span>Upload Products</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            )}

            {/* Manage Products */}
            {activeTab === 'manage' && (
              <div className="space-y-6">
                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                        />
                      </div>
                      
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">All Categories</option>
                        {getMainCategories().map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center space-x-4">
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

                      <span className="text-sm text-gray-600">
                        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Products Grid/List */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery || selectedCategory 
                        ? 'Try adjusting your search or filters' 
                        : 'Start by adding your first product'
                      }
                    </p>
                    <button
                      onClick={() => setActiveTab('single')}
                      className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Add First Product
                    </button>
                  </div>
                ) : (
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                          viewMode === 'list' ? 'flex' : ''
                        }`}
                      >
                        {viewMode === 'grid' ? (
                          <>
                            <div className="relative">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute top-3 left-3 flex flex-col space-y-1">
                                {product.featured && (
                                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Featured
                                  </span>
                                )}
                                {!product.inStock && (
                                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Out of Stock
                                  </span>
                                )}
                                {product.isStitchedDress && (
                                  <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Stitched
                                  </span>
                                )}
                                {product.supportsFeedingFriendly && (
                                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    Feeding
                                  </span>
                                )}
                              </div>
                              <div className="absolute top-3 right-3">
                                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                                  <MoreVertical className="h-4 w-4 text-gray-600" />
                                </button>
                              </div>
                            </div>
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
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
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-600">{product.rating}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-32 h-32 flex-shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                                  <div className="flex items-center space-x-4 mb-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg font-bold text-gray-900">
                                        ₹{product.price.toLocaleString()}
                                      </span>
                                      {product.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through">
                                          ₹{product.originalPrice.toLocaleString()}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                      <span className="text-sm text-gray-600">{product.rating}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {product.featured && (
                                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                                        Featured
                                      </span>
                                    )}
                                    {!product.inStock && (
                                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                        Out of Stock
                                      </span>
                                    )}
                                    {product.isStitchedDress && (
                                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                        Stitched Dress
                                      </span>
                                    )}
                                    {product.supportsFeedingFriendly && (
                                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                        Feeding Friendly
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductManagementPage;