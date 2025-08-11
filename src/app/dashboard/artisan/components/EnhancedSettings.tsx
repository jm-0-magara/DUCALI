// src/app/dashboard/artisan/components/EnhancedSettings.tsx
import React, { useState } from 'react';
import { User } from '../../../../types';
import { 
  User as UserIcon, 
  Bell, 
  Shield, 
  CreditCard, 
  Palette, 
  Globe, 
  Save,
  Check
} from 'lucide-react';

interface EnhancedSettingsProps {
  user: User;
}

export function EnhancedSettings({ user }: EnhancedSettingsProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    specialty: user.specialty || '',
    location: user.location || '',
    bio: user.bio || 'Experienced artisan specializing in custom creations.',
    website: '',
    instagram: '',
    facebook: ''
  });

  const [businessSettings, setBusinessSettings] = useState({
    responseTime: '2 hours',
    startingPrice: 'From $200',
    currency: 'USD',
    availability: 'available',
    autoAcceptOrders: false,
    requireDeposit: true,
    depositPercentage: 25
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    messages: true,
    reviews: true,
    marketing: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  });

  const locations = [
    'Nairobi', 'Mombasa', 'Nakuru', 'Kisumu', 'Eldoret', 'Thika', 'Machakos', 'Nyeri'
  ];

  const currencies = ['USD', 'KES', 'EUR', 'GBP'];

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleBusinessChange = (field: string, value: string | boolean | number) => {
    setBusinessSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = async (section: string) => {
    setIsLoading(true);
    setSaveStatus('saving');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSaveButton = (section: string) => (
    <button
      onClick={() => saveSettings(section)}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        saveStatus === 'saved' 
          ? 'bg-green-600 text-white' 
          : 'bg-[#626F47] text-white hover:bg-[#A4B465]'
      } disabled:opacity-50`}
    >
      {saveStatus === 'saved' ? (
        <Check className="w-4 h-4" />
      ) : isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <Save className="w-4 h-4" />
      )}
      {saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
    </button>
  );

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'business', label: 'Business', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Globe }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">Account Settings</h2>
        <div className="text-slate-400 text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-[#626F47] text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
                    <select
                      value={profileData.location}
                      onChange={(e) => handleProfileChange('location', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                    >
                      <option value="">Select your location</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Specialty</label>
                    <input
                      type="text"
                      value={profileData.specialty}
                      onChange={(e) => handleProfileChange('specialty', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                      placeholder="e.g., Custom Wedding Dresses, Leather Craft, Pottery"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Professional Bio</label>
                    <textarea
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:border-[#A4B465] transition-colors"
                      placeholder="Tell customers about your experience, specialties, and what makes your work unique..."
                    />
                  </div>
                </div>
                <div className="mt-6">
                  {renderSaveButton('profile')}
                </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-6">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Instagram</label>
                    <input
                      type="url"
                      value={profileData.instagram}
                      onChange={(e) => handleProfileChange('instagram', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                      placeholder="https://instagram.com/yourusername"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Facebook</label>
                    <input
                      type="url"
                      value={profileData.facebook}
                      onChange={(e) => handleProfileChange('facebook', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                    <input
                      type="url"
                      value={profileData.website}
                      onChange={(e) => handleProfileChange('website', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  {renderSaveButton('social')}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'business' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Business Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Response Time</label>
                    <select
                      value={businessSettings.responseTime}
                      onChange={(e) => handleBusinessChange('responseTime', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
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
                      value={businessSettings.startingPrice}
                      onChange={(e) => handleBusinessChange('startingPrice', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                      placeholder="From $200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Currency</label>
                    <select
                      value={businessSettings.currency}
                      onChange={(e) => handleBusinessChange('currency', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Availability Status</label>
                    <select
                      value={businessSettings.availability}
                      onChange={(e) => handleBusinessChange('availability', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                    >
                      <option value="available">Available for Orders</option>
                      <option value="limited">Limited Availability</option>
                      <option value="unavailable">Not Taking Orders</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={businessSettings.autoAcceptOrders}
                      onChange={(e) => handleBusinessChange('autoAcceptOrders', e.target.checked)}
                      className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                    />
                    <div>
                      <span className="text-slate-300">Auto-accept Orders</span>
                      <p className="text-slate-500 text-sm">Automatically accept orders within your price range</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={businessSettings.requireDeposit}
                      onChange={(e) => handleBusinessChange('requireDeposit', e.target.checked)}
                      className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                    />
                    <div>
                      <span className="text-slate-300">Require Deposit</span>
                      <p className="text-slate-500 text-sm">Require a deposit before starting work</p>
                    </div>
                  </label>
                  {businessSettings.requireDeposit && (
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Deposit Percentage</label>
                      <input
                        type="number"
                        value={businessSettings.depositPercentage}
                        onChange={(e) => handleBusinessChange('depositPercentage', parseInt(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                        min="10"
                        max="100"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  {renderSaveButton('business')}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-3">Order Notifications</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={notifications.newOrders}
                            onChange={(e) => handleNotificationChange('newOrders', e.target.checked)}
                            className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          />
                          <span className="text-slate-300">New Order Requests</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={notifications.reviews}
                            onChange={(e) => handleNotificationChange('reviews', e.target.checked)}
                            className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          />
                          <span className="text-slate-300">New Reviews</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-3">Communication</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={notifications.messages}
                            onChange={(e) => handleNotificationChange('messages', e.target.checked)}
                            className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          />
                          <span className="text-slate-300">Customer Messages</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={notifications.marketing}
                            onChange={(e) => handleNotificationChange('marketing', e.target.checked)}
                            className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          />
                          <span className="text-slate-300">Marketing Updates</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <hr className="border-slate-700" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-white font-medium mb-3">Email Notifications</h4>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={notifications.emailNotifications}
                          onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                          className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                        />
                        <span className="text-slate-300">Enable Email</span>
                      </label>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-3">Push Notifications</h4>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={notifications.pushNotifications}
                          onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                          className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                        />
                        <span className="text-slate-300">Enable Push</span>
                      </label>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-3">SMS Notifications</h4>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={notifications.smsNotifications}
                          onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                          className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                        />
                        <span className="text-slate-300">Enable SMS</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  {renderSaveButton('notifications')}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-4">Change Password</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>
                    <button className="mt-4 bg-[#626F47] text-white px-4 py-2 rounded-lg hover:bg-[#A4B465] transition-colors">
                      Update Password
                    </button>
                  </div>
                  
                  <hr className="border-slate-700" />
                  
                  <div>
                    <h4 className="text-white font-medium mb-4">Two-Factor Authentication</h4>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                      />
                      <div>
                        <span className="text-slate-300">Enable Two-Factor Authentication</span>
                        <p className="text-slate-500 text-sm">Add an extra layer of security to your account</p>
                      </div>
                    </label>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-4">Login Alerts</h4>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                        defaultChecked
                      />
                      <div>
                        <span className="text-slate-300">Email me when someone logs into my account</span>
                        <p className="text-slate-500 text-sm">Get notified of suspicious login activity</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="mt-6">
                  {renderSaveButton('security')}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'payments' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-4">Payment Methods</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg border-2 border-slate-600 bg-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">Stripe</span>
                          <span className="text-xs px-2 py-1 rounded bg-slate-600 text-slate-300">
                            Not Connected
                          </span>
                        </div>
                        <button className="w-full px-3 py-2 rounded text-sm bg-[#626F47] text-white hover:bg-[#A4B465] transition-colors">
                          Connect
                        </button>
                      </div>
                      
                      <div className="p-4 rounded-lg border-2 border-slate-600 bg-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">M-Pesa</span>
                          <span className="text-xs px-2 py-1 rounded bg-slate-600 text-slate-300">
                            Not Connected
                          </span>
                        </div>
                        <button className="w-full px-3 py-2 rounded text-sm bg-[#626F47] text-white hover:bg-[#A4B465] transition-colors">
                          Connect
                        </button>
                      </div>
                      
                      <div className="p-4 rounded-lg border-2 border-slate-600 bg-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">PayPal</span>
                          <span className="text-xs px-2 py-1 rounded bg-slate-600 text-slate-300">
                            Not Connected
                          </span>
                        </div>
                        <button className="w-full px-3 py-2 rounded text-sm bg-[#626F47] text-white hover:bg-[#A4B465] transition-colors">
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="border-slate-700" />
                  
                  <div>
                    <h4 className="text-white font-medium mb-4">Default Payment Method</h4>
                    <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors">
                      <option value="stripe">Stripe</option>
                      <option value="mpesa">M-Pesa</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6">
                  {renderSaveButton('payments')}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Privacy & Data
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-white font-medium mb-4">Portfolio Visibility</h4>
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
                  
                  <hr className="border-slate-700" />
                  
                  <div>
                    <h4 className="text-white font-medium mb-4">Account Actions</h4>
                    <div className="space-y-3">
                      <button className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors">
                        Temporarily Disable Account
                      </button>
                      <button className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  {renderSaveButton('privacy')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
