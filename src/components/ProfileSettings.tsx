"use client";

import React, { useState, useEffect } from 'react';
import { User, Camera, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ProfilePictureUpload } from './uploads/ProfilePictureUpload';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../lib/firebase-auth';

interface ProfileSettingsProps {
  className?: string;
}

export function ProfileSettings({ className = '' }: ProfileSettingsProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await updateUserProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio
      });

      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Profile update error:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpdate = (imageUrl: string) => {
    setMessage({
      type: 'success',
      text: 'Profile picture updated successfully!'
    });

    // Clear success message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  if (!user) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Please log in to view profile settings</p>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update your profile information and picture
          </p>
        </div>

        <div className="p-6">
          {/* Profile Picture Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Profile Picture
            </h3>
            <div className="flex items-center space-x-6">
              <ProfilePictureUpload
                currentImageUrl={user.profileImage || undefined}
                onImageUpdate={handleImageUpdate}
                size="lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Upload a new profile picture
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose a clear, professional photo. Supported formats: JPG, PNG, WebP, GIF (max 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Profile Information Form */}
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Profile Information
            </h3>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-gray-50 dark:bg-slate-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                placeholder="Email address"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Email address cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="Enter your location"
              />
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
                placeholder="Tell us about yourself..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum 500 characters
              </p>
            </div>

            {/* Message */}
            {message && (
              <div className={`flex items-center space-x-2 p-3 rounded-md ${
                message.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md 
                         hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
