import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  EyeOff,
  Image as ImageIcon,
  Type,
  Link,
  Palette,
  Upload
} from 'lucide-react';
import { useStore } from '../store/useStore';
import DragDropImageUpload from '../components/ImageUpload/DragDropImageUpload';
import type { Banner } from '../types';

interface BannersManagementPageProps {
  onBack: () => void;
}

const BannersManagementPage: React.FC<BannersManagementPageProps> = ({ onBack }) => {
  const { banners, addBanner, updateBanner, deleteBanner } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    isActive: true,
    order: 0,
    backgroundColor: '#000000',
    textColor: '#ffffff'
  });

  useEffect(() => {
    if (editingBanner) {
      setFormData({
        title: editingBanner.title,
        subtitle: editingBanner.subtitle,
        image: editingBanner.image,
        buttonText: editingBanner.buttonText,
        buttonLink: editingBanner.buttonLink,
        isActive: editingBanner.isActive,
        order: editingBanner.order,
        backgroundColor: editingBanner.backgroundColor || '#000000',
        textColor: editingBanner.textColor || '#ffffff'
      });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        image: '',
        buttonText: '',
        buttonLink: '',
        isActive: true,
        order: banners.length,
        backgroundColor: '#000000',
        textColor: '#ffffff'
      });
    }
  }, [editingBanner, banners.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBanner) {
      updateBanner(editingBanner.id, formData);
    } else {
      addBanner({
        id: Date.now().toString(),
        ...formData
      });
    }
    
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      deleteBanner(id);
    }
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const toggleBannerStatus = (banner: Banner) => {
    updateBanner(banner.id, { ...banner, isActive: !banner.isActive });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Banner Management</h1>
            <button
              onClick={handleAddNew}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Banner
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {banners.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No banners yet</h3>
            <p className="text-gray-500 mb-4">Create your first banner to get started</p>
            <button
              onClick={handleAddNew}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Banner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners
              .sort((a, b) => a.order - b.order)
              .map((banner) => (
                <motion.div
                  key={banner.id}
                  layout
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  {/* Banner Preview */}
                  <div 
                    className="relative h-48 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${banner.image})`,
                      backgroundColor: banner.backgroundColor 
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-start p-6">
                      <h3 
                        className="text-xl font-bold mb-2"
                        style={{ color: banner.textColor }}
                      >
                        {banner.title}
                      </h3>
                      <p 
                        className="text-sm mb-4"
                        style={{ color: banner.textColor }}
                      >
                        {banner.subtitle}
                      </p>
                      {banner.buttonText && (
                        <button 
                          className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium"
                        >
                          {banner.buttonText}
                        </button>
                      )}
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Banner Controls */}
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{banner.title}</h4>
                        <p className="text-sm text-gray-500">Order: {banner.order}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleBannerStatus(banner)}
                          className={`p-2 rounded-lg transition-colors ${
                            banner.isActive
                              ? 'text-green-600 hover:bg-green-50'
                              : 'text-gray-400 hover:bg-gray-50'
                          }`}
                        >
                          {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingBanner ? 'Edit Banner' : 'Create New Banner'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Banner Preview */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div 
                    className="relative h-32 bg-cover bg-center rounded-lg overflow-hidden"
                    style={{ 
                      backgroundImage: formData.image ? `url(${formData.image})` : 'none',
                      backgroundColor: formData.backgroundColor 
                    }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-start p-4">
                      <h3 
                        className="text-lg font-bold mb-1"
                        style={{ color: formData.textColor }}
                      >
                        {formData.title || 'Banner Title'}
                      </h3>
                      <p 
                        className="text-sm mb-2"
                        style={{ color: formData.textColor }}
                      >
                        {formData.subtitle || 'Banner subtitle'}
                      </p>
                      {formData.buttonText && (
                        <button 
                          type="button"
                          className="bg-white text-black px-3 py-1 rounded text-sm font-medium"
                        >
                          {formData.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Type className="w-4 h-4 inline mr-1" />
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter banner title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Type className="w-4 h-4 inline mr-1 opacity-50" />
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter banner subtitle"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Type className="w-4 h-4 inline mr-1 opacity-50" />
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={formData.buttonText}
                        onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., Shop Now"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Link className="w-4 h-4 inline mr-1" />
                        Button Link
                      </label>
                      <input
                        type="text"
                        value={formData.buttonLink}
                        onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="e.g., /collection"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Upload className="w-4 h-4 inline mr-1" />
                        Banner Image
                      </label>
                      <div className="space-y-4">
                        <DragDropImageUpload 
                          onImageUpload={(url) => setFormData({ ...formData, image: url })}
                          currentImage={formData.image}
                        />
                        <div className="flex items-center space-x-2">
                          <div className="h-px bg-gray-200 flex-grow"></div>
                          <span className="text-sm text-gray-500">OR</span>
                          <div className="h-px bg-gray-200 flex-grow"></div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter Image URL
                          </label>
                          <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Palette className="w-4 h-4 inline mr-1" />
                          Background Color
                        </label>
                        <input
                          type="color"
                          value={formData.backgroundColor}
                          onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={formData.textColor}
                          onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                          className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active (visible on website)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
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