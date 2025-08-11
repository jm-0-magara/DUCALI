"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Users, 
  Shield, 
  Package, 
  BarChart3, 
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  FileText
} from 'lucide-react';
import { DashboardHeader, DashboardSidebar } from '../../../components/dashboard';
import { 
  AdminOverview,
  AdminUserManagement,
  AdminArtisanVerification,
  AdminOrderMonitoring,
  AdminAnalytics,
  AdminSettings,
  AdminReports
} from './components';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!user) {
      router.push('/');
    } else if (user.role !== 'admin') {
      // Redirect to appropriate dashboard based on role
      if (user.role === 'artisan') {
        router.push('/dashboard/artisan');
      } else {
        router.push('/dashboard/customer');
      }
    }
  }, [user, router]);

  // Handle tab parameter from URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'users', 'artisans', 'orders', 'analytics', 'reports', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Loading state while checking authentication
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B08D57] mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Menu items for the admin sidebar
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'artisans', label: 'Artisan Verification', icon: Shield },
    { id: 'orders', label: 'Order Monitoring', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  // Render the appropriate component based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <AdminUserManagement />;
      case 'artisans':
        return <AdminArtisanVerification />;
      case 'orders':
        return <AdminOrderMonitoring />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'reports':
        return <AdminReports />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
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
