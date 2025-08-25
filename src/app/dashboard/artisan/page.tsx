// src/app/dashboard/artisan/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardHeader } from '../../../components/dashboard/DashboardHeader';
import { DashboardSidebar } from '../../../components/dashboard/DashboardSidebar';
import { ArtisanOverview } from './components/ArtisanOverview';
import { ArtisanOrders } from './components/ArtisanOrders';
import ArtisanPortfolioManager from './components/ArtisanPortfolioManager';
import { ArtisanMessages } from './components/ArtisanMessages';
import ArtisanSettings from './components/ArtisanSettings';
import { TrendingUp, Package, ImageIcon, MessageCircle, Settings, Star, Clock, Users, ArrowRight, Sparkles, DollarSign, Award } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

// Component that uses useSearchParams - needs to be wrapped in Suspense
function ArtisanDashboardContent() {
  const { user, logout: authLogout, isAuthenticated, isArtisan } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    await authLogout();
    router.push('/');
  };

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'orders', 'portfolio', 'messages', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Redirect if not authenticated or not an artisan
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else if (!isArtisan) {
      router.push('/dashboard/customer');
    }
  }, [isAuthenticated, isArtisan, router]);

  if (!user || !isArtisan) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'} flex items-center justify-center`}>
        <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-center`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B08D57] mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Menu items for the sidebar
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Render the appropriate component based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Welcome back, {user.name}! 🎨
              </h1>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Showcase your talent and grow your business
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active Orders</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>5</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    <Package className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +18% from last month
                </div>
              </div>

              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Portfolio Items</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>24</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                    <ImageIcon className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +3 this week
                </div>
              </div>

              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Messages</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>8</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                    <MessageCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-blue-500">
                  <Clock className="w-4 h-4 mr-1" />
                  2 unread
                </div>
              </div>

              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Earnings</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>$3.2k</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                    <DollarSign className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15% this month
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`${isDark ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50' : 'bg-gradient-to-br from-white to-slate-50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer`} onClick={() => setActiveTab('orders')}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} group-hover:scale-110 transition-transform duration-300`}>
                    <Package className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <ArrowRight className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'} group-hover:text-[#B08D57] transition-colors duration-300`} />
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl mb-2`}>Orders</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>Manage your current orders and track progress</p>
                <div className="flex items-center text-sm text-[#B08D57] font-medium">
                  View Orders
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50' : 'bg-gradient-to-br from-white to-slate-50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer`} onClick={() => setActiveTab('portfolio')}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'} group-hover:scale-110 transition-transform duration-300`}>
                    <ImageIcon className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <ArrowRight className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'} group-hover:text-[#B08D57] transition-colors duration-300`} />
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl mb-2`}>Portfolio</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>Showcase your best work and attract clients</p>
                <div className="flex items-center text-sm text-[#B08D57] font-medium">
                  Manage Portfolio
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50' : 'bg-gradient-to-br from-white to-slate-50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer`} onClick={() => setActiveTab('messages')}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'} group-hover:scale-110 transition-transform duration-300`}>
                    <MessageCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <ArrowRight className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'} group-hover:text-[#B08D57] transition-colors duration-300`} />
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl mb-2`}>Messages</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>Communicate with clients about projects</p>
                <div className="flex items-center text-sm text-[#B08D57] font-medium">
                  View Messages
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl`}>Recent Activity</h3>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-[#B08D57]' : 'text-[#A4B465]'}`} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>New order received</p>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>Order #5678 from Sarah Johnson</p>
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>1 hour ago</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>Message from client</p>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>"Can we discuss the project timeline?"</p>
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>3 hours ago</span>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                  <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>Portfolio item added</p>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>New artwork "Sunset Dreams" uploaded</p>
                  </div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return <ArtisanOrders />;
      case 'portfolio':
        return <ArtisanPortfolioManager />;
      case 'messages':
        return <ArtisanMessages />;
      case 'settings':
        return <ArtisanSettings user={user} />;
      default:
        return <ArtisanOverview />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'}`}>
      {/* Header */}
      <DashboardHeader user={user} logout={handleLogout} />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardSidebar 
              user={user}
              menuItems={menuItems}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function ArtisanDashboardLoading() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'} flex items-center justify-center`}>
      <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B08D57] mx-auto mb-4"></div>
        <p>Loading dashboard...</p>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function ArtisanDashboard() {
  return (
    <Suspense fallback={<ArtisanDashboardLoading />}>
      <ArtisanDashboardContent />
    </Suspense>
  );
}