// src/app/dashboard/artisan/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Package, 
  Image as ImageIcon, 
  MessageCircle, 
  Settings 
} from 'lucide-react';
import { DashboardHeader, DashboardSidebar } from '../../../components/dashboard';
import { 
  ArtisanOverview,
  ArtisanOrders,
  ArtisanPortfolioManager,
  ArtisanMessages,
  ArtisanSettings
} from './components';

export default function ArtisanDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not authenticated or not an artisan
  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user.role !== 'artisan') {
      router.push('/dashboard/customer');
    }
  }, [user, router]);

  // Loading state while checking authentication
  if (!user || user.role !== 'artisan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A4B465] mx-auto mb-4"></div>
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
        return <ArtisanOverview />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
      {/* Header */}
      <DashboardHeader user={user} logout={logout} />
      
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