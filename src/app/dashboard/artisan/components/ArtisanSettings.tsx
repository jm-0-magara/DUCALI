// src/app/dashboard/artisan/components/ArtisanSettings.tsx
"use client";

import React, { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { updateUserProfile } from '../../../../lib/firebase-auth';
import { User } from '../../../../types/auth';

interface ArtisanSettingsProps {
  user: User;
}

export default function ArtisanSettings({ user }: ArtisanSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [profileData, setProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    location: user.location || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Update user profile in Firebase
      await updateUserProfile(user.id, {
        name: profileData.name,
        email: profileData.email,
        location: profileData.location
      });

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="px-6 py-2 bg-[#626F47] text-white rounded-lg hover:bg-[#A4B465] transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Save Status */}
      {saveStatus === 'success' && (
        <div className="bg-green-600 text-white p-3 rounded-lg">
          Settings saved successfully!
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="bg-red-600 text-white p-3 rounded-lg">
          Error saving settings. Please try again.
        </div>
      )}

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
              placeholder="City, Country"
            />
          </div>


        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Account Status</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Verification Status</h4>
              <p className="text-slate-400 text-sm">Your account verification status</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.verified 
                  ? 'bg-green-600 text-white' 
                  : 'bg-yellow-600 text-white'
              }`}>
                {user.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Account Type</h4>
              <p className="text-slate-400 text-sm">Your account role</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
