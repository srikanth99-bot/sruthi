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
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  maxImages?: number;
  maxSizePerImage?: number; // in MB
  acceptedFormats?: string[];
}

const DragDropImageUpload: React.FC<DragDropImageUploadProps> = ({
  onImageUpload,
  currentImage,
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
      } else {
        validFiles.push(file);
      }
    }

    setErrors(newErrors);

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Just process the first file
      const file = validFiles[0];
      
      // Simulate upload progress
      await simulateUpload(file.name);
      
      // Convert to base64 for demo (in production, upload to your server/cloud)
      const imageUrl = await convertFileToBase64(file);
      
      // Call the callback with the new image URL
      onImageUpload(imageUrl);

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
  }, []);

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
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
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
              {isUploading ? 'Uploading Image...' : 'Drop image here or click to browse'}
            </h3>
            <p className="text-gray-600 mt-2">
              Support for JPG, PNG, WebP up to {maxSizePerImage}MB each
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
      {currentImage && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Current Image</h4>
          </div>

          <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img
              src={currentImage}
              alt="Banner image"
              className="w-full h-full object-cover"
            />
            
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                {/* Change Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Image Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <h5 className="font-semibold mb-1">Image Tips:</h5>
                <ul className="space-y-1">
                  <li>• Use high-quality images with good lighting</li>
                  <li>• Banner images should be at least 1200×400 pixels</li>
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