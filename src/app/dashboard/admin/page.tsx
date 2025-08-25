"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { DashboardHeader } from '../../../components/dashboard/DashboardHeader';
import { DashboardSidebar } from '../../../components/dashboard/DashboardSidebar';
import { AdminOverview } from './components/AdminOverview';
import { AdminUserManagement } from './components/AdminUserManagement';
import { AdminAnnouncements } from './components/AdminAnnouncements';
import { AdminNotifications } from './components/AdminNotifications';
import { AdminSettings } from './components/AdminSettings';
import { AdminArtisanVerification } from './components/AdminArtisanVerification';
import { AdminMessages } from './components/AdminMessages';
import { AdminFavorites } from './components/AdminFavorites';
import { AdminPunishments } from './components/AdminPunishments';
import { adminDataService } from '../../../lib/adminDataService';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { 
  BarChart3, 
  Users, 
  Shield, 
  Settings, 
  Activity,
  Bell,
  Megaphone,
  User,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Package,
  Star,
  DollarSign,
  UserCheck,
  UserX,
  FileText,
  Heart,
  Gavel,
  ArrowRight,
  Sparkles,
  Crown,
  AlertTriangle
} from 'lucide-react';
import { MenuItem } from '../../../types/dashboard';
import { useTheme } from '../../../contexts/ThemeContext';

// Component that uses useSearchParams - needs to be wrapped in Suspense
function AdminDashboardContent() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { formatCurrency } = useCurrency();
  const isDark = theme === 'dark';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState(user?.profileImage || '');
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'users', 'announcements', 'verifications', 'notifications', 'settings', 'messages', 'favorites', 'punishments'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Fetch admin stats and data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, activityData] = await Promise.all([
          adminDataService.getStats(),
          adminDataService.getRecentActivity()
        ]);
        setStats(statsData);
        setRecentActivity(activityData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch unread notifications count
  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
      try {
        // Mock unread notifications for now
        setUnreadNotifications(Math.floor(Math.random() * 5));
      } catch (error) {
        console.error('Error fetching unread notifications:', error);
      }
    };

    fetchUnreadCount();

    // Set up real-time listener for notifications
    // const unsubscribe = notificationService.subscribeToNotifications(user.id, (notifications) => {
    //   const unreadCount = notifications.filter(n => !n.read).length;
    //   setUnreadNotifications(unreadCount);
    // });

    return () => {
      // unsubscribe(); // No unsubscribe needed for mock
    };
  }, [user]);

  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      description: 'Platform statistics and analytics'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      description: 'Manage users and permissions'
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
      description: 'Create and manage announcements'
    },
    {
      id: 'verifications',
      label: 'Verifications',
      icon: Shield,
      description: 'Review artisan verifications'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Manage system notifications',
      badge: unreadNotifications > 0 ? unreadNotifications.toString() : undefined
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Platform configuration'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      description: 'Manage user messages'
    },
    {
      id: 'favorites',
      label: 'Favorites',
      icon: Heart,
      description: 'Monitor user favorites'
    },
    {
      id: 'punishments',
      label: 'Punishments',
      icon: Gavel,
      description: 'Manage violations and punishments'
    }
  ];

  const handleProfileImageUpdate = (imageUrl: string) => {
    setUserProfileImage(imageUrl);
    // Update the user object in context if needed
    if (user) {
      user.profileImage = imageUrl;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Welcome back, {user?.name || 'Admin'}! 👑
              </h1>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Manage and monitor the Ducali platform
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Users</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {loading ? '...' : stats?.totalUsers?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    <Users className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats?.monthlyGrowth?.users || 0} this month
                </div>
              </div>

              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Active Orders</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {loading ? '...' : stats?.activeOrders || '0'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                    <Package className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{stats?.monthlyGrowth?.orders || 0} this month
                </div>
              </div>

              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Pending Verifications</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {loading ? '...' : stats?.pendingVerifications || '0'}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                    <Shield className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-yellow-500">
                  <Clock className="w-4 h-4 mr-1" />
                  Requires attention
                </div>
              </div>

              <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Platform Revenue</p>
                    <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {loading ? '...' : formatCurrency(stats?.totalRevenue || 0)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                    <DollarSign className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{Math.round((stats?.monthlyGrowth?.revenue || 0) / 1000)}k this month
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`${isDark ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50' : 'bg-gradient-to-br from-white to-slate-50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer`} onClick={() => setActiveTab('users')}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'} group-hover:scale-110 transition-transform duration-300`}>
                    <Users className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <ArrowRight className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'} group-hover:text-[#A4B465] transition-colors duration-300`} />
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl mb-2`}>User Management</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>Manage users, permissions, and roles</p>
                <div className="flex items-center text-sm text-[#A4B465] font-medium">
                  Manage Users
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50' : 'bg-gradient-to-br from-white to-slate-50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer`} onClick={() => setActiveTab('verifications')}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'} group-hover:scale-110 transition-transform duration-300`}>
                    <Shield className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </div>
                  <ArrowRight className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'} group-hover:text-[#A4B465] transition-colors duration-300`} />
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl mb-2`}>Verifications</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>Review and approve artisan verifications</p>
                <div className="flex items-center text-sm text-[#A4B465] font-medium">
                  Review Verifications
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
              
              <div className={`${isDark ? 'bg-gradient-to-br from-slate-800/50 to-slate-700/50' : 'bg-gradient-to-br from-white to-slate-50'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer`} onClick={() => setActiveTab('announcements')}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'} group-hover:scale-110 transition-transform duration-300`}>
                    <Megaphone className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <ArrowRight className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'} group-hover:text-[#A4B465] transition-colors duration-300`} />
                </div>
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl mb-2`}>Announcements</h3>
                <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>Create and manage platform announcements</p>
                <div className="flex items-center text-sm text-[#A4B465] font-medium">
                  Manage Announcements
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`${isDark ? 'text-white' : 'text-slate-900'} font-bold text-xl`}>Recent Activity</h3>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-[#A4B465]' : 'text-[#626F47]'}`} />
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A4B465] mx-auto mb-4"></div>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading recent activity...</p>
                  </div>
                ) : recentActivity.length > 0 ? (
                  recentActivity.slice(0, 3).map((activity, index) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center">
                        {activity.type === 'user_registration' && <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />}
                        {activity.type === 'order_created' && <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                        {activity.type === 'review_submitted' && <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
                        {!['user_registration', 'order_created', 'review_submitted'].includes(activity.type) && <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <div className="flex-1">
                        <p className={`${isDark ? 'text-white' : 'text-slate-900'} font-medium`}>{activity.message}</p>
                        <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} text-sm`}>
                          {activity.userName && `by ${activity.userName}`}
                        </p>
                      </div>
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'users':
        return <AdminUserManagement />;
      case 'announcements':
        return <AdminAnnouncements />;
      case 'verifications':
        return <AdminArtisanVerification />;
      case 'notifications':
        return <AdminNotifications />;
      case 'settings':
        return <AdminSettings />;
      case 'messages':
        return <AdminMessages />;
      case 'favorites':
        return <AdminFavorites />;
      case 'punishments':
        return <AdminPunishments />;
      default:
        return <AdminOverview />;
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Access Denied</h1>
          <p className={isDark ? 'text-slate-gray' : 'text-slate-600'}>You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className={`fixed inset-0 ${isDark ? 'bg-gradient-to-br from-slate-900/10 via-slate-800 to-slate-900/10' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'} pointer-events-none`}></div>
      
      {/* Header */}
      <DashboardHeader 
        user={user} 
        logout={logout}
        onMenuClick={() => setMobileSidebarOpen(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block lg:w-80 p-6">
          <DashboardSidebar
            user={user}
            menuItems={menuItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)}></div>
            <div className="fixed left-0 top-0 h-full w-80 p-6">
              <DashboardSidebar
                user={user}
                menuItems={menuItems}
                activeTab={activeTab}
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setMobileSidebarOpen(false);
                }}
                onClose={() => setMobileSidebarOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 relative p-4 sm:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function AdminDashboardLoading() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'} flex items-center justify-center`}>
      <div className={`${isDark ? 'text-white' : 'text-slate-900'} text-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A4B465] mx-auto mb-4"></div>
        <p>Loading admin dashboard...</p>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
export default function AdminDashboard() {
  return (
    <Suspense fallback={<AdminDashboardLoading />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
