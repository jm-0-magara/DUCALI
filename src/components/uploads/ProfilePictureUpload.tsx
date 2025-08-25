import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadService, UploadProgress } from '../../lib/uploadService';
import { updateUserProfile } from '../../lib/firebase-auth';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';

interface ProfilePictureUploadProps {
  currentImageUrl?: string;
  onImageUpdate?: (imageUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function ProfilePictureUpload({
  currentImageUrl,
  onImageUpdate,
  size = 'md',
  className = '',
  disabled = false
}: ProfilePictureUploadProps) {
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-20 h-20', icon: 'w-8 h-8', text: 'text-xs' },
    md: { container: 'w-32 h-32', icon: 'w-12 h-12', text: 'text-sm' },
    lg: { container: 'w-40 h-40', icon: 'w-16 h-16', text: 'text-base' }
  };

  const config = sizeConfig[size];

  const handleFileSelect = useCallback(async (file: File) => {
    if (!user) {
      setError('You must be logged in to upload a profile picture');
      return;
    }

    try {
      setError(null);
      setUploadProgress({ progress: 0, status: 'uploading' });

      // Generate preview
      const preview = uploadService.generatePreviewURL(file);
      setPreviewUrl(preview);

      // Upload to Firebase
      const downloadURL = await uploadService.uploadProfilePicture(file, user.id, {
        onProgress: (progress) => {
          setUploadProgress(progress);
        }
      });

      // Update user profile in Firebase
      await updateUserProfile(user.id, { profileImage: downloadURL });

      // Call callback if provided
      if (onImageUpdate) {
        onImageUpdate(downloadURL);
      }

      // Clean up preview URL
      uploadService.revokePreviewURL(preview);
      setPreviewUrl(null);

    } catch (error: any) {
      console.error('Profile picture upload error:', error);
      setError(error.message || 'Failed to upload profile picture');
      setUploadProgress({ progress: 0, status: 'error', error: error.message });
      
      // Clean up preview URL on error
      if (previewUrl) {
        uploadService.revokePreviewURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [user, onImageUpdate, previewUrl]);

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

  const handleRemoveImage = useCallback(async () => {
    if (!user) return;

    try {
      // Remove from Firebase Storage
      await uploadService.deleteProfilePicture(user.id);
      
      // Update user profile
      await updateUserProfile(user.id, { profileImage: undefined });
      
      // Call callback if provided
      if (onImageUpdate) {
        onImageUpdate('');
      }
    } catch (error: any) {
      console.error('Error removing profile picture:', error);
      setError('Failed to remove profile picture');
    }
  }, [user, onImageUpdate]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const displayImage = previewUrl || currentImageUrl;

  return (
    <div className={`relative ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload container */}
      <div
        className={`
          relative ${config.container} rounded-full border-2 border-dashed
          transition-all duration-200 ease-in-out cursor-pointer
          ${isDragging 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${displayImage ? 'border-solid' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!disabled ? openFileDialog : undefined}
      >
        {/* Current/Preview Image */}
        {displayImage && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <Image
              src={displayImage}
              alt="Profile picture"
              fill
              className="object-cover"
              sizes={`(max-width: 768px) ${size === 'sm' ? '80px' : size === 'md' ? '128px' : '160px'}`}
            />
            
            {/* Remove button */}
            {!disabled && currentImageUrl && !uploadProgress && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full 
                         flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Upload overlay */}
        {!displayImage && !disabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Camera className={`${config.icon} text-gray-400 mb-2`} />
            <p className={`${config.text} text-gray-500 text-center px-2`}>
              Click or drag to upload
            </p>
          </div>
        )}

        {/* Upload progress */}
        {uploadProgress && uploadProgress.status === 'uploading' && (
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className={`${config.icon} text-white animate-spin mx-auto mb-2`} />
              <p className={`${config.text} text-white`}>
                {uploadProgress.progress}%
              </p>
            </div>
          </div>
        )}

        {/* Success indicator */}
        {uploadProgress && uploadProgress.status === 'completed' && (
          <div className="absolute top-1 left-1 w-6 h-6 bg-green-500 text-white rounded-full 
                       flex items-center justify-center">
            <CheckCircle className="w-3 h-3" />
          </div>
        )}

        {/* Error indicator */}
        {uploadProgress && uploadProgress.status === 'error' && (
          <div className="absolute top-1 left-1 w-6 h-6 bg-red-500 text-white rounded-full 
                       flex items-center justify-center">
            <AlertCircle className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
      )}

      {/* Upload instructions */}
      {!displayImage && !disabled && (
        <p className="text-gray-500 text-xs mt-2 text-center">
          JPG, PNG, WebP, GIF up to 5MB
        </p>
      )}
    </div>
  );
}
