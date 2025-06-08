import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Plus, 
  AlertCircle,
  Check,
  Loader
} from 'lucide-react';

interface DragDropImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSizePerImage?: number; // in MB
  acceptedFormats?: string[];
}

const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxSizePerImage = 5,
  acceptedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedFormats.includes(file.type)) {
      return `${file.name}: Invalid format. Please use JPG, PNG, or WebP.`;
    }
    if (file.size > maxSizePerImage * 1024 * 1024) {
      return `${file.name}: File too large. Maximum size is ${maxSizePerImage}MB.`;
    }
    return null;
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const simulateUpload = (fileName: string): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[fileName];
              return newProgress;
            });
            resolve();
          }, 500);
        } else {
          setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
        }
      }, 100);
    });
  };

  const processFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newErrors: string[] = [];
    const validFiles: File[] = [];

    // Validate files
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else if (images.length + validFiles.length < maxImages) {
        validFiles.push(file);
      } else {
        newErrors.push(`Maximum ${maxImages} images allowed.`);
        break;
      }
    }

    setErrors(newErrors);

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = validFiles.map(async (file) => {
        // Simulate upload progress
        await simulateUpload(file.name);
        // Convert to base64 for demo (in production, upload to your server/cloud)
        return await convertFileToBase64(file);
      });

      const newImageUrls = await Promise.all(uploadPromises);
      onImagesChange([...images, ...newImageUrls]);
    } catch (error) {
      setErrors(['Upload failed. Please try again.']);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [images, maxImages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-purple-500 bg-purple-50 scale-105'
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
        } ${isUploading ? 'pointer-events-none opacity-75' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <motion.div
            animate={{ scale: isDragOver ? 1.1 : 1 }}
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              isDragOver ? 'bg-purple-500' : 'bg-gray-100'
            }`}
          >
            {isUploading ? (
              <Loader className={`h-8 w-8 animate-spin ${isDragOver ? 'text-white' : 'text-purple-500'}`} />
            ) : (
              <Upload className={`h-8 w-8 ${isDragOver ? 'text-white' : 'text-purple-500'}`} />
            )}
          </motion.div>

          <div>
            <h3 className={`text-lg font-bold ${isDragOver ? 'text-purple-600' : 'text-gray-900'}`}>
              {isUploading ? 'Uploading Images...' : 'Drop images here or click to browse'}
            </h3>
            <p className="text-gray-600 mt-2">
              Support for JPG, PNG, WebP up to {maxSizePerImage}MB each
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Maximum {maxImages} images • {images.length}/{maxImages} uploaded
            </p>
          </div>

          {isUploading && (
            <div className="space-y-2">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName} className="text-left">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span className="truncate max-w-48">{fileName}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="bg-purple-500 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4"
          >
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
              <button
                onClick={() => setErrors([])}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Uploaded Images</h4>
            <span className="text-sm text-gray-500">{images.length} image{images.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                    {/* Remove Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Primary Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Primary
                  </div>
                )}

                {/* Image Number */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {index + 1}
                </div>
              </motion.div>
            ))}

            {/* Add More Button */}
            {images.length < maxImages && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-all duration-200"
              >
                <Plus className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Add More</span>
              </motion.button>
            )}
          </div>

          {/* Image Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <h5 className="font-semibold mb-1">Image Tips:</h5>
                <ul className="space-y-1">
                  <li>• First image will be used as the primary product image</li>
                  <li>• Use high-quality images with good lighting</li>
                  <li>• Show different angles and details of the product</li>
                  <li>• Recommended size: 1000x1000 pixels or higher</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropImageUpload;