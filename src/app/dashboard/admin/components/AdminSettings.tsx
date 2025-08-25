import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  Globe,
  Save,
  AlertTriangle,
  CheckCircle,
  Loader2,
  User,
  Camera,
  X,
  Check,
  Upload,
  Trash2
} from 'lucide-react';
import { CurrencySettings } from './CurrencySettings';
import { adminSettingsService, AdminSettings as AdminSettingsType } from '../../../../lib/adminSettingsService';
import { useAuth } from '../../../../contexts/AuthContext';
import ImageUpload from '../../../../components/ImageUpload';

export function AdminSettings() {
  const { user, updateProfileImage } = useAuth();
  const [settings, setSettings] = useState<AdminSettingsType>({
    platformName: 'Ducali',
    platformDescription: 'Connecting artisans with customers worldwide',
    contactEmail: 'admin@ducali.com',
    supportPhone: '+1234567890',
    commissionRate: 10,
    maxFileSize: 10,
    autoApproveArtisans: false,
    requireVerification: true,
    enableNotifications: true,
    maintenanceMode: false,
    currency: 'USD',
    timezone: 'UTC',
    language: 'English'
  });

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  
  // Profile picture states
  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const [showProfileConfirm, setShowProfileConfirm] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileNotification, setProfileNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const platformSettings = await adminSettingsService.getPlatformSettings();
        setSettings(platformSettings);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings. Using default values.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      await adminSettingsService.updatePlatformSettings(settings);
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileImageUpload = (uploadResult: any) => {
    setNewProfileImage(uploadResult.secure_url);
    setShowProfileConfirm(true);
  };

  const handleConfirmProfileUpdate = async () => {
    if (!newProfileImage) return;

    try {
      setUpdatingProfile(true);
      setError(null);

      // Update the user's profile image using AuthContext
      const result = await updateProfileImage(newProfileImage);
      
      if (result.success) {
        setProfileImage(newProfileImage);
        setNewProfileImage(null);
        setShowProfileConfirm(false);
        
        // Show success notification
        setProfileNotification({
          type: 'success',
          message: 'Profile picture updated successfully!'
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setProfileNotification({ type: null, message: '' });
        }, 3000);

        console.log('Profile image updated:', newProfileImage);
      } else {
        throw new Error(result.error || 'Failed to update profile image');
      }
    } catch (error) {
      console.error('Error updating profile image:', error);
      setProfileNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update profile picture. Please try again.'
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleCancelProfileUpdate = () => {
    setNewProfileImage(null);
    setShowProfileConfirm(false);
  };

  const handleRemoveProfileImage = async () => {
    try {
      setUpdatingProfile(true);
      setError(null);

      // Here you would remove the profile image from the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setProfileImage('');
      setNewProfileImage(null);
      setShowProfileConfirm(false);
      
      // Show success notification
      setProfileNotification({
        type: 'success',
        message: 'Profile picture removed successfully!'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setProfileNotification({ type: null, message: '' });
      }, 3000);

      console.log('Profile image removed');
    } catch (error) {
      console.error('Error removing profile image:', error);
      setProfileNotification({
        type: 'error',
        message: 'Failed to remove profile picture. Please try again.'
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-accent-gold" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Success/Error Messages */}
      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center text-green-400">
            <CheckCircle className="w-5 h-5 mr-2" />
            Settings saved successfully!
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Profile Picture Notification */}
      {profileNotification.type && (
        <div className={`${
          profileNotification.type === 'success' 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        } border rounded-lg p-4`}>
          <div className="flex items-center">
            {profileNotification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertTriangle className="w-5 h-5 mr-2" />
            )}
            {profileNotification.message}
          </div>
        </div>
      )}

      {/* Profile Picture Section */}
      <div className="bg-card/20 rounded-xl p-6 border border-border/5 backdrop-blur-sm">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-accent-gold mr-3" />
          <h2 className="text-xl font-semibold text-white">Profile Picture</h2>
        </div>
        
        <div className="flex items-start space-x-6">
          {/* Current Profile Picture */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-accent-gold to-wine-red rounded-full flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'A'
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-card flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="flex-1">
            <h3 className="text-white font-medium mb-2">Update Profile Picture</h3>
            <p className="text-slate-gray text-sm mb-4">Upload a new profile picture to personalize your admin account</p>
            
            {!showProfileConfirm ? (
              <div className="space-y-4">
                <ImageUpload
                  onUpload={handleProfileImageUpload}
                  accept="image"
                  maxSize={5}
                  className="max-w-xs"
                  placeholder="Choose profile image"
                />
                
                {profileImage && (
                  <button
                    onClick={handleRemoveProfileImage}
                    disabled={updatingProfile}
                    className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Profile Picture
                  </button>
                )}
              </div>
            ) : (
              /* Confirmation Section */
              <div className="space-y-4">
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <h4 className="text-white font-medium mb-2">Preview New Profile Picture</h4>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-gold to-wine-red rounded-full flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                      {newProfileImage && (
                        <img 
                          src={newProfileImage} 
                          alt="New Profile" 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-300 text-sm">This will replace your current profile picture</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleConfirmProfileUpdate}
                    disabled={updatingProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {updatingProfile ? 'Updating...' : 'Confirm Update'}
                  </button>
                  
                  <button
                    onClick={handleCancelProfileUpdate}
                    disabled={updatingProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Settings */}
      <div className="bg-card/20 rounded-xl p-6 border border-border/5 backdrop-blur-sm">
        <div className="flex items-center mb-6">
          <Settings className="w-6 h-6 text-accent-gold mr-3" />
          <h2 className="text-xl font-semibold text-white">Platform Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-medium mb-2">Platform Name</label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => handleChange('platformName', e.target.value)}
              className="w-full px-4 py-3 bg-slate-gray/10 border border-slate-gray/20 rounded-lg text-white placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/50"
              placeholder="Enter platform name"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Contact Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              className="w-full px-4 py-3 bg-slate-gray/10 border border-slate-gray/20 rounded-lg text-white placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/50"
              placeholder="Enter contact email"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Support Phone</label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => handleChange('supportPhone', e.target.value)}
              className="w-full px-4 py-3 bg-slate-gray/10 border border-slate-gray/20 rounded-lg text-white placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/50"
              placeholder="Enter support phone"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Commission Rate (%)</label>
            <input
              type="number"
              value={settings.commissionRate}
              onChange={(e) => handleChange('commissionRate', parseFloat(e.target.value))}
              className="w-full px-4 py-3 bg-slate-gray/10 border border-slate-gray/20 rounded-lg text-white placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/50"
              placeholder="Enter commission rate"
              min="0"
              max="100"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Max File Size (MB)</label>
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => handleChange('maxFileSize', parseInt(e.target.value))}
              className="w-full px-4 py-3 bg-slate-gray/10 border border-slate-gray/20 rounded-lg text-white placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/50"
              placeholder="Enter max file size"
              min="1"
              max="100"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Default Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="w-full px-4 py-3 bg-slate-gray/10 border border-slate-gray/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/50"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="KES">KES - Kenyan Shilling</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-white font-medium mb-2">Platform Description</label>
          <textarea
            value={settings.platformDescription}
            onChange={(e) => handleChange('platformDescription', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-slate-gray/10 border border-slate-gray/20 rounded-lg text-white placeholder-slate-gray focus:outline-none focus:ring-2 focus:ring-accent-gold/20 focus:border-accent-gold/50"
            placeholder="Enter platform description"
          />
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-card/20 rounded-xl p-6 border border-border/5 backdrop-blur-sm">
        <div className="flex items-center mb-6">
          <Shield className="w-6 h-6 text-accent-gold mr-3" />
          <h2 className="text-xl font-semibold text-white">Feature Toggles</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Auto Approve Artisans</h3>
              <p className="text-slate-gray text-sm">Automatically approve new artisan registrations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoApproveArtisans}
                onChange={(e) => handleChange('autoApproveArtisans', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-gray/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Require Verification</h3>
              <p className="text-slate-gray text-sm">Require manual verification for artisans</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireVerification}
                onChange={(e) => handleChange('requireVerification', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-gray/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Maintenance Mode</h3>
              <p className="text-slate-gray text-sm">Put the platform in maintenance mode</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-gray/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card/20 rounded-xl p-6 border border-border/5 backdrop-blur-sm">
        <div className="flex items-center mb-6">
          <Bell className="w-6 h-6 text-accent-gold mr-3" />
          <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Enable Notifications</h3>
              <p className="text-slate-gray text-sm">Send email and push notifications to users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-gray/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-gold"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Currency Settings */}
      <CurrencySettings />

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-accent-gold text-white font-semibold rounded-lg hover:bg-accent-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
