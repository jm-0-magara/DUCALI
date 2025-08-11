// src/app/dashboard/customer/components/CustomerSettings.tsx
import React, { useState } from 'react';
import { User } from '../../../../types/auth';
import { 
  User as UserIcon, 
  Bell, 
  Shield, 
  CreditCard, 
  Palette, 
  Globe, 
  Save,
  Check,
  AlertTriangle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface CustomerSettingsProps {
  user: User;
}

export function CustomerSettings({ user }: CustomerSettingsProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    location: user.location || '',
    bio: user.bio || '',
    preferences: {
      favoriteCategories: [] as string[],
      budgetRange: '',
      preferredArtisanTypes: [] as string[]
    }
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    newMessages: true,
    orderReminders: true,
    marketingEmails: false,
    promotionalOffers: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    dataSharing: false
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeConnected: false,
    mpesaConnected: false,
    paypalConnected: false,
    defaultPaymentMethod: 'stripe',
    savePaymentInfo: true,
    autoPay: false
  });

  const locations = [
    'Nairobi', 'Mombasa', 'Nakuru', 'Kisumu', 'Eldoret', 'Thika', 'Machakos', 'Nyeri',
    'Kakamega', 'Kisii', 'Kericho', 'Bungoma', 'Busia', 'Vihiga', 'Siaya', 'Homa Bay'
  ];

  const categories = [
    'Fashion & Apparel', 'Jewelry & Accessories', 'Home & Garden', 
    'Art & Collectibles', 'Beauty & Personal Care', 'Electronics & Gadgets',
    'Food & Beverages', 'Sports & Recreation', 'Books & Media'
  ];

  const budgetRanges = [
    'Under $50', '$50 - $100', '$100 - $250', '$250 - $500', 
    '$500 - $1000', '$1000 - $2500', 'Over $2500'
  ];

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: string, value: string | string[]) => {
    setProfileData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: boolean | number) => {
    setSecurity(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: string, value: boolean | string) => {
    setPaymentSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = async (section: string) => {
    setIsLoading(true);
    setSaveStatus('saving');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
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
          : saveStatus === 'error'
          ? 'bg-red-600 text-white'
          : 'bg-[#626F47] text-white hover:bg-[#A4B465]'
      } disabled:opacity-50`}
    >
      {saveStatus === 'saved' ? (
        <Check className="w-4 h-4" />
      ) : saveStatus === 'error' ? (
        <AlertTriangle className="w-4 h-4" />
      ) : isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        <Save className="w-4 h-4" />
      )}
      {saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save Changes'}
    </button>
  );

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'preferences', label: 'Preferences', icon: Palette },
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
                    <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                    <textarea
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:border-[#A4B465] transition-colors"
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>
                </div>
                <div className="mt-6">
                  {renderSaveButton('profile')}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="space-y-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Shopping Preferences
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Favorite Categories</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map(category => (
                        <label key={category} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={profileData.preferences.favoriteCategories.includes(category)}
                            onChange={(e) => {
                              const current = profileData.preferences.favoriteCategories;
                              const updated = e.target.checked
                                ? [...current, category]
                                : current.filter(c => c !== category);
                              handlePreferenceChange('favoriteCategories', updated);
                            }}
                            className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          />
                          <span className="text-slate-300 text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Preferred Budget Range</label>
                    <select
                      value={profileData.preferences.budgetRange}
                      onChange={(e) => handlePreferenceChange('budgetRange', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] transition-colors"
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Preferred Artisan Types</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={profileData.preferences.preferredArtisanTypes.includes('verified')}
                          onChange={(e) => {
                            const current = profileData.preferences.preferredArtisanTypes;
                            const updated = e.target.checked
                              ? [...current, 'verified']
                              : current.filter(t => t !== 'verified');
                            handlePreferenceChange('preferredArtisanTypes', updated);
                          }}
                          className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                        />
                        <span className="text-slate-300">Verified Artisans Only</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={profileData.preferences.preferredArtisanTypes.includes('local')}
                          onChange={(e) => {
                            const current = profileData.preferences.preferredArtisanTypes;
                            const updated = e.target.checked
                              ? [...current, 'local']
                              : current.filter(t => t !== 'local');
                            handlePreferenceChange('preferredArtisanTypes', updated);
                          }}
                          className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                        />
                        <span className="text-slate-300">Local Artisans Only</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={profileData.preferences.preferredArtisanTypes.includes('experienced')}
                          onChange={(e) => {
                            const current = profileData.preferences.preferredArtisanTypes;
                            const updated = e.target.checked
                              ? [...current, 'experienced']
                              : current.filter(t => t !== 'experienced');
                            handlePreferenceChange('preferredArtisanTypes', updated);
                          }}
                          className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                        />
                        <span className="text-slate-300">Experienced Artisans (5+ years)</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  {renderSaveButton('preferences')}
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
                            checked={notifications.orderUpdates}
                            onChange={(e) => handleNotificationChange('orderUpdates', e.target.checked)}
                            className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          />
                          <span className="text-slate-300">Order Updates</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={notifications.orderReminders}
                            onChange={(e) => handleNotificationChange('orderReminders', e.target.checked)}
                            className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          />
                          <span className="text-slate-300">Order Reminders</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-3">Communication</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={notifications.newMessages}
                            onChange={(e) => handleNotificationChange('newMessages', e.target.checked)}
                            className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          />
                          <span className="text-slate-300">New Messages</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={notifications.marketingEmails}
                            onChange={(e) => handleNotificationChange('marketingEmails', e.target.checked)}
                            className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          />
                          <span className="text-slate-300">Marketing Emails</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={notifications.promotionalOffers}
                            onChange={(e) => handleNotificationChange('promotionalOffers', e.target.checked)}
                            className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          />
                          <span className="text-slate-300">Promotional Offers</span>
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
                        checked={security.twoFactorAuth}
                        onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
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
                        checked={security.loginAlerts}
                        onChange={(e) => handleSecurityChange('loginAlerts', e.target.checked)}
                        className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                      />
                      <div>
                        <span className="text-slate-300">Email me when someone logs into my account</span>
                        <p className="text-slate-500 text-sm">Get notified of suspicious login activity</p>
                      </div>
                    </label>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-4">Data Sharing</h4>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={security.dataSharing}
                        onChange={(e) => handleSecurityChange('dataSharing', e.target.checked)}
                        className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                      />
                      <div>
                        <span className="text-slate-300">Allow data sharing for personalized recommendations</span>
                        <p className="text-slate-500 text-sm">Help us provide better product suggestions</p>
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
                    <h4 className="text-white font-medium mb-4">Payment Preferences</h4>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={paymentSettings.savePaymentInfo}
                          onChange={(e) => handlePaymentChange('savePaymentInfo', e.target.checked)}
                          className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                        />
                        <div>
                          <span className="text-slate-300">Save payment information for faster checkout</span>
                          <p className="text-slate-500 text-sm">Securely store your payment methods</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={paymentSettings.autoPay}
                          onChange={(e) => handlePaymentChange('autoPay', e.target.checked)}
                          className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                        />
                        <div>
                          <span className="text-slate-300">Enable auto-pay for recurring orders</span>
                          <p className="text-slate-500 text-sm">Automatically process payments for scheduled orders</p>
                        </div>
                      </label>
                    </div>
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
                    <h4 className="text-white font-medium mb-4">Profile Visibility</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          defaultChecked
                        />
                        <div>
                          <span className="text-slate-300">Public Profile</span>
                          <p className="text-slate-500 text-sm">Allow artisans to see your basic profile information</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                          defaultChecked
                        />
                        <div>
                          <span className="text-slate-300">Show Order History</span>
                          <p className="text-slate-500 text-sm">Display your order history to artisans</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  
                  <hr className="border-slate-700" />
                  
                  <div>
                    <h4 className="text-white font-medium mb-4">Data Management</h4>
                    <div className="space-y-3">
                      <button className="flex items-center gap-2 text-slate-300 hover:text-[#A4B465] transition-colors">
                        Download My Data
                      </button>
                      <button className="flex items-center gap-2 text-slate-300 hover:text-[#A4B465] transition-colors">
                        Export Order History
                      </button>
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