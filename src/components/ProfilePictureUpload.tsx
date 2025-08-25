"use client";

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, User } from 'lucide-react';
import { adminDataService } from '../lib/adminDataService';

interface ProfilePictureUploadProps {
  userId: string;
  currentImage?: string;
  onImageUpdate: (imageUrl: string) => void;
  className?: string;
}

export function ProfilePictureUpload({ 
  userId, 
  currentImage, 
  onImageUpdate, 
  className = '' 
}: ProfilePictureUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // TODO: Implement uploadProfilePicture in adminDataService
      const imageUrl = URL.createObjectURL(file);
      onImageUpdate(imageUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className={`relative ${className}`}>
      {/* Profile Picture Display */}
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-muted-gold to-wine-red flex items-center justify-center">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-cream" />
          )}
        </div>

        {/* Upload Overlay */}
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-white/20 rounded-full text-cream hover:bg-white/30 transition-colors"
            disabled={isUploading}
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview Actions */}
      {previewUrl && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-card/95 backdrop-blur-sm rounded-xl p-2 border border-border/20 shadow-lg">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-muted-gold to-wine-red text-charcoal-black text-xs font-medium rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {isUploading ? (
              <div className="w-3 h-3 border-2 border-charcoal-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-3 h-3" />
            )}
            <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
          </button>
          <button
            onClick={handleCancel}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/20 rounded-lg transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload Button (when no preview) */}
      {!previewUrl && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl transition-colors text-sm"
        >
          <Camera className="w-4 h-4" />
          <span>Change Photo</span>
        </button>
      )}
    </div>
  );
}
