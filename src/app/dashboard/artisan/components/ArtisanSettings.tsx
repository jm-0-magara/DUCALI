// src/app/dashboard/artisan/components/ArtisanSettings.tsx
import React, { useState } from 'react';
import { User } from '../../../../types';

interface ArtisanSettingsProps {
  user: User;
}

export function ArtisanSettings({ user }: ArtisanSettingsProps) {
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    specialty: user.specialty || '',
    location: user.location || '',
    responseTime: '2 hours',
    startingPrice: 'From $200',
    bio: 'Experienced artisan specializing in custom creations with attention to detail and quality craftsmanship.'
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    messages: true,
    reviews: true,
    marketing: false
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const locations = [
    'Nairobi', 'Mombasa', 'Nakuru', 'Kisumu', 'Eldoret', 'Thika', 'Machakos', 'Nyeri'
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Specialty</label>
              <input
                type="text"
                value={profileData.specialty}
                onChange={(e) => handleProfileChange('specialty', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465]"
                placeholder="e.g., Custom Wedding Dresses"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <select
                value={profileData.location}
                onChange={(e) => handleProfileChange('location', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465]"
              >
                <option value="">Select your location</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="mt-4 bg-[#626F47] text-white px-4 py-2 rounded-lg hover:bg-[#A4B465] transition-colors">
            Update Profile
          </button>
        </div>

        {/* Business Settings */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Business Settings</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Response Time</label>
                <select
                  value={profileData.responseTime}
                  onChange={(e) => handleProfileChange('responseTime', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465]"
                >
                  <option value="Within 1 hour">Within 1 hour</option>
                  <option value="2 hours">Within 2 hours</option>
                  <option value="4 hours">Within 4 hours</option>
                  <option value="24 hours">Within 24 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Starting Price</label>
                <input
                  type="text"
                  value={profileData.startingPrice}
                  onChange={(e) => handleProfileChange('startingPrice', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465]"
                  placeholder="From $200"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Professional Bio</label>
              <textarea
                rows={4}
                value={profileData.bio}
                onChange={(e) => handleProfileChange('bio', e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:border-[#A4B465]"
                placeholder="Tell customers about your experience and specialties..."
              />
            </div>
          </div>
          <button className="mt-4 bg-[#626F47] text-white px-4 py-2 rounded-lg hover:bg-[#A4B465] transition-colors">
            Save Business Settings
          </button>
        </div>

        {/* Portfolio Settings */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Portfolio Visibility</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]" 
                defaultChecked 
              />
              <div>
                <span className="text-slate-300">Public Portfolio</span>
                <p className="text-slate-500 text-sm">Allow your portfolio to be visible to all visitors</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]" 
                defaultChecked 
              />
              <div>
                <span className="text-slate-300">Show Pricing</span>
                <p className="text-slate-500 text-sm">Display pricing information on portfolio items</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]" 
                defaultChecked 
              />
              <div>
                <span className="text-slate-300">Accept New Orders</span>
                <p className="text-slate-500 text-sm">Allow customers to send new order requests</p>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={notifications.newOrders}
                onChange={(e) => handleNotificationChange('newOrders', e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
              />
              <div>
                <span className="text-slate-300">New Order Notifications</span>
                <p className="text-slate-500 text-sm">Get notified when you receive new orders</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={notifications.messages}
                onChange={(e) => handleNotificationChange('messages', e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
              />
              <div>
                <span className="text-slate-300">Message Notifications</span>
                <p className="text-slate-500 text-sm">Get notified when customers send you messages</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={notifications.reviews}
                onChange={(e) => handleNotificationChange('reviews', e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
              />
              <div>
                <span className="text-slate-300">Review Notifications</span>
                <p className="text-slate-500 text-sm">Get notified when customers leave reviews</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={notifications.marketing}
                onChange={(e) => handleNotificationChange('marketing', e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
              />
              <div>
                <span className="text-slate-300">Marketing Emails</span>
                <p className="text-slate-500 text-sm">Receive updates about platform features and tips</p>
              </div>
            </label>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Account Actions</h3>
          <div className="space-y-3">
            <button className="block text-left text-slate-300 hover:text-[#A4B465] transition-colors">
              Change Password
            </button>
            <button className="block text-left text-slate-300 hover:text-[#A4B465] transition-colors">
              Download My Data
            </button>
            <button className="block text-left text-slate-300 hover:text-[#A4B465] transition-colors">
              Export Portfolio
            </button>
            <hr className="border-slate-700" />
            <button className="block text-left text-red-400 hover:text-red-300 transition-colors">
              Temporarily Disable Account
            </button>
            <button className="block text-left text-red-400 hover:text-red-300 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}