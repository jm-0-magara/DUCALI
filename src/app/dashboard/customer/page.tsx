// src/app/dashboard/customer/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, Heart, MessageCircle, Settings } from 'lucide-react';
import { DashboardHeader, DashboardSidebar } from '../../../components/dashboard';
import { CustomerOrders } from './components/CustomerOrders';
import { CustomerFavorites } from './components/CustomerFavorites';
import { CustomerMessages } from './components/CustomerMessages';
import { CustomerSettings } from './components/CustomerSettings';

export default function CustomerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('orders');

  // Redirect if not authenticated or not a customer
  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user.role !== 'customer') {
      router.push('/dashboard/artisan');
    }
  }, [user, router]);

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['orders', 'favorites', 'messages', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (!user || user.role !== 'customer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A4B465] mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders': return <CustomerOrders />;
      case 'favorites': return <CustomerFavorites />;
      case 'messages': return <CustomerMessages />;
      case 'settings': return <CustomerSettings user={user} />;
      default: return <CustomerOrders />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
      <DashboardHeader user={user} logout={logout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <DashboardSidebar 
              user={user}
              menuItems={menuItems}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
          
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}