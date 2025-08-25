import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { uploadService, UploadProgress } from '../../lib/uploadService';
import Image from 'next/image';

interface ImageUploadProps {
  onImageUpload?: (imageUrl: string) => void;
  onImageRemove?: (imageUrl: string) => void;
  currentImages?: string[];
  maxImages?: number;
  aspectRatio?: 'square' | '16/9' | '4/3' | '3/2';
  className?: string;
  disabled?: boolean;
  uploadPath?: string;
  userId?: string;
}

export function ImageUpload({
  onImageUpload,
  onImageRemove,
  currentImages = [],
  maxImages = 5,
  aspectRatio = 'square',
  className = '',
  disabled = false,
  uploadPath = 'general',
  userId
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: UploadProgress }>({});
  const [previewUrls, setPreviewUrls] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-square',
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '3/2': 'aspect-[3/2]'
  };

  const aspectClass = aspectRatioClasses[aspectRatio];

  const handleFileSelect = useCallback(async (file: File) => {
    if (!userId) {
      setError('User ID is required for upload');
      return;
    }

    if (currentImages.length >= maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      setError(null);
      const fileId = `${Date.now()}-${Math.random()}`;
      setUploadProgress(prev => ({ ...prev, [fileId]: { progress: 0, status: 'uploading' } }));

      // Generate preview
      const preview = uploadService.generatePreviewURL(file);
      setPreviewUrls(prev => ({ ...prev, [fileId]: preview }));

      // Upload to Firebase
      const downloadURL = await uploadService.uploadFile(file, uploadPath, {
        onProgress: (progress) => {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
      });

      // Call callback
      if (onImageUpload) {
        onImageUpload(downloadURL);
      }

      // Clean up
      uploadService.revokePreviewURL(preview);
      setPreviewUrls(prev => {
        const newUrls = { ...prev };
        delete newUrls[fileId];
        return newUrls;
      });
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });

    } catch (error: any) {
      console.error('Image upload error:', error);
      setError(error.message || 'Failed to upload image');
      
      // Clean up on error
      const fileIds = Object.keys(previewUrls);
      if (fileIds.length > 0) {
        const lastFileId = fileIds[fileIds.length - 1];
        uploadService.revokePreviewURL(previewUrls[lastFileId]);
        setPreviewUrls(prev => {
          const newUrls = { ...prev };
          delete newUrls[lastFileId];
          return newUrls;
        });
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[lastFileId];
          return newProgress;
        });
      }
    }
  }, [userId, currentImages.length, maxImages, onImageUpload, uploadPath, previewUrls]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (uploadService.isImageFile(file)) {
        handleFileSelect(file);
      } else {
        setError('Please select an image file (JPEG, PNG, WebP, GIF)');
      }
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleRemoveImage = useCallback((imageUrl: string) => {
    if (onImageRemove) {
      onImageRemove(imageUrl);
    }
  }, [onImageRemove]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const canUpload = currentImages.length < maxImages && !disabled;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Current Images Grid */}
      {(currentImages.length > 0 || Object.keys(previewUrls).length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Existing images */}
          {currentImages.map((imageUrl, index) => (
            <div key={index} className={`relative ${aspectClass} rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700`}>
              <Image
                src={imageUrl}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              
              {/* Remove button */}
              {!disabled && (
                <button
                  onClick={() => handleRemoveImage(imageUrl)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full 
                           flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* Preview images */}
          {Object.entries(previewUrls).map(([fileId, previewUrl]) => (
            <div key={fileId} className={`relative ${aspectClass} rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700`}>
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              
              {/* Upload progress overlay */}
              {uploadProgress[fileId] && uploadProgress[fileId].status === 'uploading' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin mx-auto mb-2" />
                    <p className="text-white text-sm">
                      {uploadProgress[fileId].progress}%
                    </p>
                  </div>
                </div>
              )}

              {/* Success indicator */}
              {uploadProgress[fileId] && uploadProgress[fileId].status === 'completed' && (
                <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 text-white rounded-full 
                             flex items-center justify-center">
                  <CheckCircle className="w-3 h-3" />
                </div>
              )}

              {/* Error indicator */}
              {uploadProgress[fileId] && uploadProgress[fileId].status === 'error' && (
                <div className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full 
                             flex items-center justify-center">
                  <AlertCircle className="w-3 h-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canUpload && (
        <div
          className={`
            relative ${aspectClass} rounded-lg border-2 border-dashed
            transition-all duration-200 ease-in-out cursor-pointer
            ${isDragging 
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center mb-2">
              Click or drag to upload images
            </p>
            <p className="text-gray-400 text-sm text-center">
              {currentImages.length} of {maxImages} images uploaded
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Upload instructions */}
      {canUpload && (
        <p className="text-gray-500 text-xs text-center">
          JPG, PNG, WebP, GIF up to 5MB each
        </p>
      )}
    </div>
  );
}
