import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  Plus,
  Trash2,
  Edit,
  Save,
  Copy,
  Eye,
  Package,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Palette,
  Ruler
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Product } from '../../types';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose }) => {
  const { products, setProducts, categories } = useStore();
  const [uploadMethod, setUploadMethod] = useState<'csv' | 'manual'>('manual');
  const [csvData, setCsvData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResults, setUploadResults] = useState<{ success: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Manual bulk upload state
  const [bulkProducts, setBulkProducts] = useState<Partial<Product>[]>([
    {
      name: '',
      price: 0,
      category: '',
      description: '',
      images: [],
      sizes: [],
      colors: [],
      inStock: true,
      featured: false,
      tags: []
    }
  ]);

  const addNewProduct = () => {
    setBulkProducts([...bulkProducts, {
      name: '',
      price: 0,
      category: '',
      description: '',
      images: [],
      sizes: [],
      colors: [],
      inStock: true,
      featured: false,
      tags: []
    }]);
  };

  const removeProduct = (index: number) => {
    if (bulkProducts.length > 1) {
      setBulkProducts(bulkProducts.filter((_, i) => i !== index));
    }
  };

  const updateProduct = (index: number, field: string, value: any) => {
    const updated = [...bulkProducts];
    updated[index] = { ...updated[index], [field]: value };
    setBulkProducts(updated);
  };

  const duplicateProduct = (index: number) => {
    const productToDuplicate = { ...bulkProducts[index] };
    productToDuplicate.name = `${productToDuplicate.name} (Copy)`;
    setBulkProducts([...bulkProducts, productToDuplicate]);
  };

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      }).filter(row => row.name); // Filter out empty rows

      setCsvData(data);
    };
    reader.readAsText(file);
  };

  const processBulkUpload = async () => {
    setIsProcessing(true);
    const errors: string[] = [];
    let successCount = 0;

    try {
      const dataToProcess = uploadMethod === 'csv' ? csvData : bulkProducts;
      const newProducts: Product[] = [];

      for (let i = 0; i < dataToProcess.length; i++) {
        const item = dataToProcess[i];
        
        // Validation
        if (!item.name || !item.price || !item.category) {
          errors.push(`Row ${i + 1}: Missing required fields (name, price, category)`);
          continue;
        }

        // Create product
        const product: Product = {
          id: `prod_${Date.now()}_${i}`,
          name: item.name,
          price: parseFloat(item.price) || 0,
          originalPrice: item.originalPrice ? parseFloat(item.originalPrice) : undefined,
          category: item.category,
          description: item.description || '',
          images: Array.isArray(item.images) ? item.images : 
                  typeof item.images === 'string' ? item.images.split(',').map(s => s.trim()).filter(s => s) : 
                  ['https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg'],
          sizes: Array.isArray(item.sizes) ? item.sizes : 
                 typeof item.sizes === 'string' ? item.sizes.split(',').map(s => s.trim()).filter(s => s) : 
                 ['S', 'M', 'L'],
          colors: Array.isArray(item.colors) ? item.colors : 
                  typeof item.colors === 'string' ? item.colors.split(',').map(s => s.trim()).filter(s => s) : 
                  ['Red', 'Blue', 'Green'],
          inStock: item.inStock !== false && item.inStock !== 'false',
          featured: item.featured === true || item.featured === 'true',
          rating: parseFloat(item.rating) || 4.5,
          reviewCount: parseInt(item.reviewCount) || 0,
          tags: Array.isArray(item.tags) ? item.tags : 
                typeof item.tags === 'string' ? item.tags.split(',').map(s => s.trim()).filter(s => s) : 
                [],
          supportsFeedingFriendly: item.supportsFeedingFriendly === true || item.supportsFeedingFriendly === 'true',
          isStitchedDress: item.isStitchedDress === true || item.isStitchedDress === 'true',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        newProducts.push(product);
        successCount++;
      }

      // Add to existing products
      setProducts([...products, ...newProducts]);
      
      setUploadResults({ success: successCount, errors });
      
      // Reset form if successful
      if (errors.length === 0) {
        setBulkProducts([{
          name: '',
          price: 0,
          category: '',
          description: '',
          images: [],
          sizes: [],
          colors: [],
          inStock: true,
          featured: false,
          tags: []
        }]);
        setCsvData([]);
      }
    } catch (error) {
      errors.push('Failed to process upload. Please check your data format.');
      setUploadResults({ success: successCount, errors });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'name',
      'price',
      'originalPrice',
      'category',
      'description',
      'images',
      'sizes',
      'colors',
      'inStock',
      'featured',
      'tags',
      'supportsFeedingFriendly',
      'isStitchedDress'
    ];
    
    const sampleData = [
      'Traditional Ikkat Silk Saree',
      '4500',
      '6000',
      'Sarees',
      'Handwoven Ikkat silk saree with traditional geometric patterns',
      'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
      'Free Size',
      'Maroon,Navy Blue,Forest Green',
      'true',
      'true',
      'silk,traditional,handwoven,festival',
      'false',
      'false'
    ];

    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_upload_template.csv';
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
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Bulk Product Upload</h2>
                <p className="text-sm text-gray-500">Upload multiple products at once</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Upload Method Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Upload Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUploadMethod('manual')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    uploadMethod === 'manual'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Edit className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">Manual Entry</h4>
                  <p className="text-gray-600 text-sm">Add products one by one with a form interface</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUploadMethod('csv')}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    uploadMethod === 'csv'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">CSV Upload</h4>
                  <p className="text-gray-600 text-sm">Upload products from a CSV file</p>
                </motion.button>
              </div>
            </div>

            {/* CSV Upload Method */}
            {uploadMethod === 'csv' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-3">CSV Upload Instructions</h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>• Download the template below to see the required format</li>
                    <li>• Required fields: name, price, category</li>
                    <li>• Use comma-separated values for arrays (sizes, colors, tags)</li>
                    <li>• Use 'true' or 'false' for boolean fields</li>
                    <li>• Images should be valid URLs</li>
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadTemplate}
                    className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Template</span>
                  </motion.button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload CSV File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900">Click to upload CSV file</p>
                    <p className="text-gray-500">or drag and drop your file here</p>
                  </motion.button>
                </div>

                {csvData.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900">Preview ({csvData.length} products)</h4>
                    </div>
                    <div className="overflow-x-auto max-h-64">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Category</th>
                            <th className="px-4 py-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {csvData.slice(0, 10).map((row, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2">{row.name || '-'}</td>
                              <td className="px-4 py-2">₹{row.price || '-'}</td>
                              <td className="px-4 py-2">{row.category || '-'}</td>
                              <td className="px-4 py-2">
                                {row.name && row.price && row.category ? (
                                  <span className="text-green-600">✓ Valid</span>
                                ) : (
                                  <span className="text-red-600">✗ Missing data</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manual Entry Method */}
            {uploadMethod === 'manual' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Products ({bulkProducts.length})</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addNewProduct}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </motion.button>
                </div>

                <div className="space-y-6">
                  {bulkProducts.map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          <Package className="h-5 w-5 mr-2 text-purple-600" />
                          Product #{index + 1}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => duplicateProduct(index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </motion.button>
                          {bulkProducts.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => removeProduct(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Basic Info */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                          </label>
                          <input
                            type="text"
                            value={product.name}
                            onChange={(e) => updateProduct(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            placeholder="Enter product name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            value={product.price}
                            onChange={(e) => updateProduct(index, 'price', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            placeholder="0"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <select
                            value={product.category}
                            onChange={(e) => updateProduct(index, 'category', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.name}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Original Price (₹)
                          </label>
                          <input
                            type="number"
                            value={product.originalPrice || ''}
                            onChange={(e) => updateProduct(index, 'originalPrice', parseFloat(e.target.value) || undefined)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            placeholder="0"
                            min="0"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sizes (comma separated)
                          </label>
                          <input
                            type="text"
                            value={product.sizes?.join(', ')}
                            onChange={(e) => updateProduct(index, 'sizes', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            placeholder="S, M, L, XL"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Colors (comma separated)
                          </label>
                          <input
                            type="text"
                            value={product.colors?.join(', ')}
                            onChange={(e) => updateProduct(index, 'colors', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            placeholder="Red, Blue, Green"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={product.description}
                          onChange={(e) => updateProduct(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          placeholder="Product description..."
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          value={product.tags?.join(', ')}
                          onChange={(e) => updateProduct(index, 'tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          placeholder="handwoven, traditional, silk"
                        />
                      </div>

                      <div className="mt-4 flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`inStock-${index}`}
                            checked={product.inStock}
                            onChange={(e) => updateProduct(index, 'inStock', e.target.checked)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label htmlFor={`inStock-${index}`} className="text-sm font-medium text-gray-700">
                            In Stock
                          </label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`featured-${index}`}
                            checked={product.featured}
                            onChange={(e) => updateProduct(index, 'featured', e.target.checked)}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <label htmlFor={`featured-${index}`} className="text-sm font-medium text-gray-700">
                            Featured
                          </label>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Results */}
            {uploadResults && (
              <div className="mt-6 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-4">Upload Results</h4>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 font-medium">
                      {uploadResults.success} products uploaded successfully
                    </span>
                  </div>
                  {uploadResults.errors.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="text-red-700 font-medium">
                        {uploadResults.errors.length} errors
                      </span>
                    </div>
                  )}
                </div>
                {uploadResults.errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="font-medium text-red-800 mb-2">Errors:</h5>
                    <ul className="text-red-700 text-sm space-y-1">
                      {uploadResults.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={processBulkUpload}
                disabled={isProcessing || (uploadMethod === 'csv' && csvData.length === 0) || (uploadMethod === 'manual' && bulkProducts.every(p => !p.name))}
                className="flex items-center space-x-2 bg-purple-600 text-white px-8 py-3 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Upload Products</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BulkUploadModal;