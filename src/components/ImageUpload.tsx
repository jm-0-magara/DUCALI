import React, { useState, useRef } from 'react';
import { Upload, X, Image, Video, Loader2 } from 'lucide-react';
import { cloudinaryService, CloudinaryUploadResult } from '../lib/cloudinary';

interface ImageUploadProps {
  onUpload: (result: CloudinaryUploadResult) => void;
  onRemove?: () => void;
  currentImage?: string;
  accept?: 'image' | 'video' | 'both';
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function ImageUpload({
  onUpload,
  onRemove,
  currentImage,
  accept = 'image',
  maxSize = 10,
  className = '',
  disabled = false,
  placeholder = 'Click to upload or drag and drop'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (disabled || isUploading) return;

    // Check if Cloudinary is configured
    if (!cloudinaryService.isConfigured()) {
      setError('Cloudinary is not configured. Please check your environment variables.');
      return;
    }

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (accept === 'image' && !isImage) {
      setError('Please select an image file');
      return;
    }
    
    if (accept === 'video' && !isVideo) {
      setError('Please select a video file');
      return;
    }
    
    if (accept === 'both' && !isImage && !isVideo) {
      setError('Please select an image or video file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      let result: CloudinaryUploadResult;
      
      if (isImage) {
        result = await cloudinaryService.uploadImage(file, {
          folder: 'ducali/images',
          max_file_size: maxSize * 1024 * 1024,
        });
      } else {
        result = await cloudinaryService.uploadVideo(file, {
          folder: 'ducali/videos',
          max_file_size: maxSize * 1024 * 1024,
        });
      }

      onUpload(result);
    } catch (err) {
      console.error('Upload error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to upload file. Please try again.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const getAcceptTypes = () => {
    switch (accept) {
      case 'image':
        return 'image/*';
      case 'video':
        return 'video/*';
      case 'both':
        return 'image/*,video/*';
      default:
        return 'image/*';
    }
  };

  return (
    <div className={className}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload area */}
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${dragActive 
            ? 'border-accent-gold bg-accent-gold/10' 
            : 'border-slate-gray/30 hover:border-accent-gold/50 hover:bg-slate-gray/5'
          }
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-8 h-8 animate-spin text-accent-gold mb-2" />
            <p className="text-white">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {accept === 'image' ? (
              <Image className="w-8 h-8 text-slate-gray mb-2" />
            ) : accept === 'video' ? (
              <Video className="w-8 h-8 text-slate-gray mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-slate-gray mb-2" />
            )}
            <p className="text-white font-medium mb-1">{placeholder}</p>
            <p className="text-slate-gray text-sm">
              {accept === 'image' ? 'PNG, JPG, GIF up to' : 
               accept === 'video' ? 'MP4, MOV up to' : 
               'Images and videos up to'} {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Current image preview */}
      {currentImage && !isUploading && (
        <div className="mt-4 relative">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg"
          />
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
