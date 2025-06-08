import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader,
  Plus,
  Trash2,
  Edit,
  Save,
  Copy,
  Image as ImageIcon,
  Package,
  Zap,
  FileSpreadsheet,
  Database,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import DragDropImageUpload from '../ImageUpload/DragDropImageUpload';
import type { Product } from '../../types';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BulkProductData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
  images: string[];
  tags: string[];
  supportsFeedingFriendly: boolean;
  isStitchedDress: boolean;
  inStock: boolean;
  featured: boolean;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
  const { categories, setProducts, products } = useStore();
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'template'>('single');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bulkProducts, setBulkProducts] = useState<BulkProductData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single product form data
  const [singleProduct, setSingleProduct] = useState<Partial<BulkProductData>>({
    name: '',
    price: 0,
    originalPrice: 0,
    category: '',
    description: '',
    sizes: [],
    colors: [],
    images: [],
    tags: [],
    supportsFeedingFriendly: false,
    isStitchedDress: false,
    inStock: true,
    featured: false
  });

  // Template for bulk upload
  const [templateData, setTemplateData] = useState({
    baseProduct: {
      category: '',
      description: '',
      price: 0,
      originalPrice: 0,
      sizes: [] as string[],
      colors: [] as string[],
      tags: [] as string[],
      supportsFeedingFriendly: false,
      isStitchedDress: false,
      inStock: true,
      featured: false
    },
    variations: [] as Array<{
      id: string;
      name: string;
      images: string[];
      priceAdjustment?: number;
    }>
  });

  const resetModal = () => {
    setActiveTab('single');
    setIsProcessing(false);
    setUploadProgress(0);
    setBulkProducts([]);
    setErrors([]);
    setSuccessCount(0);
    setSingleProduct({
      name: '',
      price: 0,
      originalPrice: 0,
      category: '',
      description: '',
      sizes: [],
      colors: [],
      images: [],
      tags: [],
      supportsFeedingFriendly: false,
      isStitchedDress: false,
      inStock: true,
      featured: false
    });
    setTemplateData({
      baseProduct: {
        category: '',
        description: '',
        price: 0,
        originalPrice: 0,
        sizes: [],
        colors: [],
        tags: [],
        supportsFeedingFriendly: false,
        isStitchedDress: false,
        inStock: true,
        featured: false
      },
      variations: []
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Add single product
  const addSingleProduct = () => {
    if (!singleProduct.name || !singleProduct.price || !singleProduct.category) {
      setErrors(['Please fill in all required fields (Name, Price, Category)']);
      return;
    }

    const newProduct: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: singleProduct.name!,
      price: singleProduct.price!,
      originalPrice: singleProduct.originalPrice || undefined,
      category: singleProduct.category!,
      description: singleProduct.description || '',
      images: singleProduct.images || [],
      sizes: singleProduct.sizes || [],
      colors: singleProduct.colors || [],
      inStock: singleProduct.inStock ?? true,
      featured: singleProduct.featured ?? false,
      rating: 4.5,
      reviewCount: 0,
      tags: singleProduct.tags || [],
      supportsFeedingFriendly: singleProduct.supportsFeedingFriendly || false,
      isStitchedDress: singleProduct.isStitchedDress || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProducts([...products, newProduct]);
    setSuccessCount(1);
    setErrors([]);
    
    // Reset form
    setSingleProduct({
      name: '',
      price: 0,
      originalPrice: 0,
      category: singleProduct.category, // Keep category for convenience
      description: '',
      sizes: singleProduct.sizes, // Keep sizes for convenience
      colors: singleProduct.colors, // Keep colors for convenience
      images: [],
      tags: singleProduct.tags, // Keep tags for convenience
      supportsFeedingFriendly: singleProduct.supportsFeedingFriendly,
      isStitchedDress: singleProduct.isStitchedDress,
      inStock: true,
      featured: false
    });
  };

  // Add variation to template
  const addVariation = () => {
    const newVariation = {
      id: `var_${Date.now()}`,
      name: '',
      images: [],
      priceAdjustment: 0
    };
    setTemplateData({
      ...templateData,
      variations: [...templateData.variations, newVariation]
    });
  };

  // Remove variation
  const removeVariation = (variationId: string) => {
    setTemplateData({
      ...templateData,
      variations: templateData.variations.filter(v => v.id !== variationId)
    });
  };

  // Update variation
  const updateVariation = (variationId: string, updates: Partial<typeof templateData.variations[0]>) => {
    setTemplateData({
      ...templateData,
      variations: templateData.variations.map(v =>
        v.id === variationId ? { ...v, ...updates } : v
      )
    });
  };

  // Generate products from template
  const generateFromTemplate = async () => {
    if (!templateData.baseProduct.category || templateData.variations.length === 0) {
      setErrors(['Please fill in base product details and add at least one variation']);
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    const newErrors: string[] = [];
    const newProducts: Product[] = [];

    try {
      for (let i = 0; i < templateData.variations.length; i++) {
        const variation = templateData.variations[i];
        
        if (!variation.name || variation.images.length === 0) {
          newErrors.push(`Variation ${i + 1}: Name and images are required`);
          continue;
        }

        const finalPrice = templateData.baseProduct.price + (variation.priceAdjustment || 0);
        
        const product: Product = {
          id: `prod_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
          name: variation.name,
          price: finalPrice,
          originalPrice: templateData.baseProduct.originalPrice || undefined,
          category: templateData.baseProduct.category,
          description: templateData.baseProduct.description,
          images: variation.images,
          sizes: templateData.baseProduct.sizes,
          colors: templateData.baseProduct.colors,
          inStock: templateData.baseProduct.inStock,
          featured: templateData.baseProduct.featured,
          rating: 4.5,
          reviewCount: 0,
          tags: templateData.baseProduct.tags,
          supportsFeedingFriendly: templateData.baseProduct.supportsFeedingFriendly,
          isStitchedDress: templateData.baseProduct.isStitchedDress,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        newProducts.push(product);
        
        // Update progress
        setUploadProgress(((i + 1) / templateData.variations.length) * 100);
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      if (newProducts.length > 0) {
        setProducts([...products, ...newProducts]);
        setSuccessCount(newProducts.length);
      }
      
      setErrors(newErrors);
    } catch (error) {
      setErrors(['Failed to generate products. Please try again.']);
    } finally {
      setIsProcessing(false);
      setUploadProgress(100);
    }
  };

  // Handle CSV/Excel file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Simulate file processing
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        
        // Simple CSV parsing (in production, use a proper CSV parser)
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const newProducts: Product[] = [];
        const newErrors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.trim());
          
          try {
            const product: Product = {
              id: `prod_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
              name: values[0] || `Product ${i}`,
              price: parseFloat(values[1]) || 0,
              originalPrice: values[2] ? parseFloat(values[2]) : undefined,
              category: values[3] || 'Uncategorized',
              description: values[4] || '',
              images: values[5] ? values[5].split('|') : [],
              sizes: values[6] ? values[6].split('|') : [],
              colors: values[7] ? values[7].split('|') : [],
              inStock: values[8] !== 'false',
              featured: values[9] === 'true',
              rating: 4.5,
              reviewCount: 0,
              tags: values[10] ? values[10].split('|') : [],
              supportsFeedingFriendly: values[11] === 'true',
              isStitchedDress: values[12] === 'true',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            if (product.name && product.price > 0) {
              newProducts.push(product);
            } else {
              newErrors.push(`Row ${i + 1}: Invalid product data`);
            }
          } catch (error) {
            newErrors.push(`Row ${i + 1}: Failed to parse product data`);
          }

          setUploadProgress(((i) / (lines.length - 1)) * 100);
          await new Promise(resolve => setTimeout(resolve, 50));
        }

        if (newProducts.length > 0) {
          setProducts([...products, ...newProducts]);
          setSuccessCount(newProducts.length);
        }
        
        setErrors(newErrors);
        setIsProcessing(false);
      };

      reader.readAsText(file);
    } catch (error) {
      setErrors(['Failed to process file. Please check the format and try again.']);
      setIsProcessing(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download CSV template
  const downloadTemplate = () => {
    const headers = [
      'Name',
      'Price',
      'Original Price',
      'Category',
      'Description',
      'Images (separated by |)',
      'Sizes (separated by |)',
      'Colors (separated by |)',
      'In Stock (true/false)',
      'Featured (true/false)',
      'Tags (separated by |)',
      'Feeding Friendly (true/false)',
      'Stitched Dress (true/false)'
    ];

    const sampleData = [
      'Traditional Ikkat Silk Saree',
      '4500',
      '6000',
      'Sarees',
      'Beautiful handwoven Ikkat silk saree with traditional patterns',
      'https://example.com/image1.jpg|https://example.com/image2.jpg',
      'Free Size',
      'Maroon|Navy Blue|Forest Green',
      'true',
      'true',
      'silk|traditional|handwoven|festival',
      'false',
      'false'
    ];

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Bulk Product Upload</h3>
                <p className="text-gray-600">Add multiple products quickly and efficiently</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'single', label: 'Single Product', icon: Package },
                { id: 'template', label: 'Template Based', icon: Copy },
                { id: 'bulk', label: 'CSV/Excel Upload', icon: FileSpreadsheet }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
            {/* Success/Error Messages */}
            {(successCount > 0 || errors.length > 0) && (
              <div className="mb-6 space-y-4">
                {successCount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      Successfully added {successCount} product{successCount !== 1 ? 's' : ''}!
                    </span>
                  </div>
                )}
                
                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-800">Upload Errors</h4>
                        <ul className="mt-2 space-y-1">
                          {errors.map((error, index) => (
                            <li key={index} className="text-red-700 text-sm">• {error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Processing Progress */}
            {isProcessing && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Loader className="h-5 w-5 text-blue-600 animate-spin" />
                  <span className="text-blue-800 font-medium">Processing products...</span>
                  <span className="text-blue-600">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    className="bg-blue-600 h-2 rounded-full"
                  />
                </div>
              </div>
            )}

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'single' && (
                <motion.div
                  key="single"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Single Product Upload</h4>
                    <p className="text-blue-700 text-sm">
                      Add one product at a time with full control over all details. Perfect for unique items or when you need to carefully configure each product.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-900">Basic Information</h5>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                        <input
                          type="text"
                          value={singleProduct.name}
                          onChange={(e) => setSingleProduct({ ...singleProduct, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="e.g., Traditional Ikkat Silk Saree"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                          <input
                            type="number"
                            value={singleProduct.price}
                            onChange={(e) => setSingleProduct({ ...singleProduct, price: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="2500"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                          <input
                            type="number"
                            value={singleProduct.originalPrice}
                            onChange={(e) => setSingleProduct({ ...singleProduct, originalPrice: parseFloat(e.target.value) || 0 })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="3000"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                        <select
                          value={singleProduct.category}
                          onChange={(e) => setSingleProduct({ ...singleProduct, category: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={singleProduct.description}
                          onChange={(e) => setSingleProduct({ ...singleProduct, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe your product..."
                        />
                      </div>
                    </div>

                    {/* Variants & Features */}
                    <div className="space-y-4">
                      <h5 className="font-semibold text-gray-900">Variants & Features</h5>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sizes (comma separated)</label>
                        <input
                          type="text"
                          value={singleProduct.sizes?.join(', ')}
                          onChange={(e) => setSingleProduct({ 
                            ...singleProduct, 
                            sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="S, M, L, XL, XXL"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Colors (comma separated)</label>
                        <input
                          type="text"
                          value={singleProduct.colors?.join(', ')}
                          onChange={(e) => setSingleProduct({ 
                            ...singleProduct, 
                            colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Red, Blue, Green, Yellow"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={singleProduct.tags?.join(', ')}
                          onChange={(e) => setSingleProduct({ 
                            ...singleProduct, 
                            tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="handwoven, traditional, silk"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="single-feeding"
                            checked={singleProduct.supportsFeedingFriendly}
                            onChange={(e) => setSingleProduct({ ...singleProduct, supportsFeedingFriendly: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="single-feeding" className="text-sm font-medium text-gray-700">
                            Feeding Friendly
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="single-stitched"
                            checked={singleProduct.isStitchedDress}
                            onChange={(e) => setSingleProduct({ ...singleProduct, isStitchedDress: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="single-stitched" className="text-sm font-medium text-gray-700">
                            Stitched Dress
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="single-stock"
                            checked={singleProduct.inStock}
                            onChange={(e) => setSingleProduct({ ...singleProduct, inStock: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="single-stock" className="text-sm font-medium text-gray-700">
                            In Stock
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="single-featured"
                            checked={singleProduct.featured}
                            onChange={(e) => setSingleProduct({ ...singleProduct, featured: e.target.checked })}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="single-featured" className="text-sm font-medium text-gray-700">
                            Featured
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Images */}
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-4">Product Images</h5>
                    <DragDropImageUpload
                      images={singleProduct.images || []}
                      onImagesChange={(images) => setSingleProduct({ ...singleProduct, images })}
                      maxImages={10}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={addSingleProduct}
                      disabled={isProcessing}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Product</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'template' && (
                <motion.div
                  key="template"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Template-Based Upload</h4>
                    <p className="text-purple-700 text-sm">
                      Perfect for products that share the same details but have different names and images. Set up the base product once, then add variations with just names and images.
                    </p>
                  </div>

                  {/* Base Product */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h5 className="font-semibold text-gray-900 mb-4">Base Product Template</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                          <select
                            value={templateData.baseProduct.category}
                            onChange={(e) => setTemplateData({
                              ...templateData,
                              baseProduct: { ...templateData.baseProduct, category: e.target.value }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹) *</label>
                            <input
                              type="number"
                              value={templateData.baseProduct.price}
                              onChange={(e) => setTemplateData({
                                ...templateData,
                                baseProduct: { ...templateData.baseProduct, price: parseFloat(e.target.value) || 0 }
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="2500"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                            <input
                              type="number"
                              value={templateData.baseProduct.originalPrice}
                              onChange={(e) => setTemplateData({
                                ...templateData,
                                baseProduct: { ...templateData.baseProduct, originalPrice: parseFloat(e.target.value) || 0 }
                              })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="3000"
                              min="0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            value={templateData.baseProduct.description}
                            onChange={(e) => setTemplateData({
                              ...templateData,
                              baseProduct: { ...templateData.baseProduct, description: e.target.value }
                            })}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="This description will be used for all variations"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sizes (comma separated)</label>
                          <input
                            type="text"
                            value={templateData.baseProduct.sizes.join(', ')}
                            onChange={(e) => setTemplateData({
                              ...templateData,
                              baseProduct: { 
                                ...templateData.baseProduct, 
                                sizes: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                              }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="S, M, L, XL"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Colors (comma separated)</label>
                          <input
                            type="text"
                            value={templateData.baseProduct.colors.join(', ')}
                            onChange={(e) => setTemplateData({
                              ...templateData,
                              baseProduct: { 
                                ...templateData.baseProduct, 
                                colors: e.target.value.split(',').map(c => c.trim()).filter(c => c) 
                              }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Red, Blue, Green"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                          <input
                            type="text"
                            value={templateData.baseProduct.tags.join(', ')}
                            onChange={(e) => setTemplateData({
                              ...templateData,
                              baseProduct: { 
                                ...templateData.baseProduct, 
                                tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) 
                              }
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="handwoven, traditional"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id="template-feeding"
                              checked={templateData.baseProduct.supportsFeedingFriendly}
                              onChange={(e) => setTemplateData({
                                ...templateData,
                                baseProduct: { ...templateData.baseProduct, supportsFeedingFriendly: e.target.checked }
                              })}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="template-feeding" className="text-sm font-medium text-gray-700">
                              Feeding Friendly
                            </label>
                          </div>

                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id="template-stitched"
                              checked={templateData.baseProduct.isStitchedDress}
                              onChange={(e) => setTemplateData({
                                ...templateData,
                                baseProduct: { ...templateData.baseProduct, isStitchedDress: e.target.checked }
                              })}
                              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="template-stitched" className="text-sm font-medium text-gray-700">
                              Stitched Dress
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Variations */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-semibold text-gray-900">Product Variations</h5>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={addVariation}
                        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Variation</span>
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      {templateData.variations.map((variation, index) => (
                        <div key={variation.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h6 className="font-medium text-gray-900">Variation {index + 1}</h6>
                            <button
                              onClick={() => removeVariation(variation.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                <input
                                  type="text"
                                  value={variation.name}
                                  onChange={(e) => updateVariation(variation.id, { name: e.target.value })}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="e.g., Red Floral Ikkat Saree"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Adjustment (₹)</label>
                                <input
                                  type="number"
                                  value={variation.priceAdjustment}
                                  onChange={(e) => updateVariation(variation.id, { priceAdjustment: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="0"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                  Final price: ₹{(templateData.baseProduct.price + (variation.priceAdjustment || 0)).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Product Images *</label>
                              <DragDropImageUpload
                                images={variation.images}
                                onImagesChange={(images) => updateVariation(variation.id, { images })}
                                maxImages={5}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      {templateData.variations.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No variations added yet</p>
                          <p className="text-sm text-gray-500">Click "Add Variation" to create your first product variation</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generate Button */}
                  {templateData.variations.length > 0 && (
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={generateFromTemplate}
                        disabled={isProcessing}
                        className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
                      >
                        <Zap className="h-4 w-4" />
                        <span>Generate {templateData.variations.length} Products</span>
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'bulk' && (
                <motion.div
                  key="bulk"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-2">CSV/Excel Upload</h4>
                    <p className="text-green-700 text-sm">
                      Upload hundreds of products at once using a CSV or Excel file. Perfect for large inventories or migrating from other systems.
                    </p>
                  </div>

                  {/* Download Template */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h5 className="font-semibold text-gray-900">Step 1: Download Template</h5>
                        <p className="text-gray-600 text-sm">Get the CSV template with the correct format and sample data</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={downloadTemplate}
                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Template</span>
                      </motion.button>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <h6 className="font-medium text-gray-900 mb-2">Template includes:</h6>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Product name, price, and category</li>
                        <li>• Images (multiple URLs separated by |)</li>
                        <li>• Sizes and colors (separated by |)</li>
                        <li>• Feeding friendly and stitched dress options</li>
                        <li>• Stock status and featured flags</li>
                        <li>• Sample data for reference</li>
                      </ul>
                    </div>
                  </div>

                  {/* Upload File */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900">Step 2: Upload Your File</h5>
                      <p className="text-gray-600 text-sm">Upload your completed CSV or Excel file</p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      
                      <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h6 className="font-medium text-gray-900 mb-2">Upload CSV or Excel File</h6>
                      <p className="text-gray-600 text-sm mb-4">
                        Drag and drop your file here, or click to browse
                      </p>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isProcessing}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        Choose File
                      </motion.button>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Supported formats: CSV, XLSX, XLS (Max 10MB)
                      </p>
                    </div>
                  </div>

                  {/* Format Guide */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h5 className="font-semibold text-gray-900 mb-4">Format Guidelines</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Required Fields</h6>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Name (text)</li>
                          <li>• Price (number)</li>
                          <li>• Category (text)</li>
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-gray-900 mb-2">Multiple Values</h6>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Images: URL1|URL2|URL3</li>
                          <li>• Sizes: S|M|L|XL</li>
                          <li>• Colors: Red|Blue|Green</li>
                          <li>• Tags: tag1|tag2|tag3</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {successCount > 0 && (
                  <span className="text-green-600 font-medium">
                    ✓ {successCount} product{successCount !== 1 ? 's' : ''} added successfully
                  </span>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {(successCount > 0 || errors.length > 0) && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSuccessCount(0);
                      setErrors([]);
                    }}
                    className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Reset</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkUploadModal;