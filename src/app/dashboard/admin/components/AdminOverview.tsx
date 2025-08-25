"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Award
} from 'lucide-react';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { adminDataService } from '../../../../lib/adminDataService';
import { RealTimeIndicator } from '../../../../components/RealTimeIndicator';

export function AdminOverview() {
  const { formatCurrency } = useCurrency();
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats from Firebase
        const statsData = await adminDataService.getStats();
        setStats(statsData);

        // Get recent activities
        const activities = await adminDataService.getRecentActivity();
        setRecentActivity(activities);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError('Failed to load admin data. Please check your Firebase configuration.');
        setIsConnected(false);
        
        // Fallback to mock data if Firebase fails
        setStats({
          totalUsers: 1247,
          totalArtisans: 89,
          totalOrders: 342,
          totalRevenue: 45678,
          pendingVerifications: 12,
          activeOrders: 45,
          averageRating: 4.6,
          newUsersThisWeek: 23,
          revenueGrowth: 12.5,
          orderGrowth: 8.2,
          userGrowth: 15.3
        });
        setRecentActivity([
          {
            id: 1,
            type: 'user_registration',
            message: 'New artisan registered: Maria Rodriguez',
            time: '2 hours ago',
            status: 'pending'
          },
          {
            id: 2,
            type: 'order_completed',
            message: 'Order #1234 completed successfully',
            time: '4 hours ago',
            status: 'completed'
          },
          {
            id: 3,
            type: 'verification_approved',
            message: 'Artisan verification approved: John Smith',
            time: '6 hours ago',
            status: 'approved'
          },
          {
            id: 4,
            type: 'dispute_reported',
            message: 'Dispute reported for Order #1230',
            time: '8 hours ago',
            status: 'warning'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const statsData = await adminDataService.getStats();
      setStats(statsData);
      setLastUpdate(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again.');
      setIsConnected(false);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-accent-gold" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-wine-red" />;
      default:
        return <Clock className="w-4 h-4 text-slate-gray" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
            <p className="text-slate-gray mt-2">Platform statistics and recent activity</p>
          </div>
          <RealTimeIndicator isConnected={false} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card/50 rounded-2xl p-6 border border-border/20 animate-pulse">
              <div className="h-4 bg-slate-gray/20 rounded mb-2"></div>
              <div className="h-8 bg-slate-gray/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
            <p className="text-slate-gray mt-2">Platform statistics and recent activity</p>
          </div>
          <RealTimeIndicator isConnected={false} />
        </div>
        
        <div className="bg-wine-red/10 border border-wine-red/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-wine-red" />
            <h3 className="text-lg font-semibold text-wine-red">Configuration Error</h3>
          </div>
          <p className="text-wine-red/80 mb-4">{error}</p>
          <div className="bg-card/30 rounded-xl p-4">
            <h4 className="text-white font-medium mb-2">To fix this issue:</h4>
            <ol className="text-slate-gray text-sm space-y-1">
              <li>1. Create a <code className="bg-slate-gray/20 px-1 rounded">.env.local</code> file in your project root</li>
              <li>2. Add your Firebase configuration variables (see <code className="bg-slate-gray/20 px-1 rounded">env.example</code>)</li>
              <li>3. Restart your development server</li>
            </ol>
          </div>
        </div>
        
        {/* Show mock data for development */}
        <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-2xl p-4">
          <p className="text-accent-gold text-sm">Showing mock data for development purposes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
          <p className="text-slate-gray mt-2">Platform statistics and recent activity</p>
        </div>
        <div className="flex items-center gap-4">
                     <button
             onClick={handleRefresh}
             disabled={refreshing}
             className="flex items-center gap-2 px-4 py-2 bg-accent-gold/10 hover:bg-accent-gold/20 text-accent-gold hover:text-white rounded-xl transition-colors disabled:opacity-50"
           >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
          <RealTimeIndicator isConnected={isConnected} lastUpdate={lastUpdate || undefined} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl p-6 border border-blue-500/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400/60" />
            </div>
            <div className="flex items-center gap-1 text-green-400/60">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">{stats?.userGrowth || 0}%</span>
            </div>
          </div>
          <div>
            <p className="text-slate-gray/40 text-sm mb-1">Total Users</p>
            <p className="text-2xl font-bold text-white mb-2">{stats?.totalUsers?.toLocaleString() || '0'}</p>
            <div className="flex items-center text-blue-400/60 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{stats?.newUsersThisWeek || 0} this week
            </div>
          </div>
        </div>

        {/* Total Artisans */}
        <div className="bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-2xl p-6 border border-green-500/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-400/60" />
            </div>
            <div className="flex items-center gap-1 text-wine-red/60">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">{stats?.pendingVerifications || 0}</span>
            </div>
          </div>
          <div>
            <p className="text-slate-gray/40 text-sm mb-1">Total Artisans</p>
            <p className="text-2xl font-bold text-white mb-2">{stats?.totalArtisans || '0'}</p>
            <div className="flex items-center text-green-400/60 text-sm">
              <Target className="w-4 h-4 mr-1" />
              {stats?.pendingVerifications || 0} pending verification
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-purple-500/5 to-purple-600/5 rounded-2xl p-6 border border-purple-500/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400/60" />
            </div>
            <div className="flex items-center gap-1 text-green-400/60">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">{stats?.orderGrowth || 0}%</span>
            </div>
          </div>
          <div>
            <p className="text-slate-gray/40 text-sm mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-white mb-2">{stats?.totalOrders || '0'}</p>
            <div className="flex items-center text-purple-400/60 text-sm">
              <Activity className="w-4 h-4 mr-1" />
              {stats?.activeOrders || 0} active orders
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-accent-gold/5 to-wine-red/5 rounded-2xl p-6 border border-accent-gold/10 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-accent-gold/10 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent-gold/60" />
            </div>
            <div className="flex items-center gap-1 text-green-400/60">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">{stats?.revenueGrowth || 0}%</span>
            </div>
          </div>
          <div>
            <p className="text-slate-gray/40 text-sm mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-white mb-2 truncate" title={formatCurrency(stats?.totalRevenue || 0)}>
              {formatCurrency(stats?.totalRevenue || 0)}
            </p>
            <div className="flex items-center text-accent-gold/60 text-sm">
              <Award className="w-4 h-4 mr-1" />
              {stats?.averageRating || '0.0'} avg rating
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card/20 rounded-2xl p-6 border border-border/5 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-gray" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity?.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-gray/3 rounded-xl border border-slate-gray/5 hover:bg-slate-gray/5 transition-colors">
                <div className="flex items-center gap-3">
                  {getStatusIcon(activity.status)}
                  <div>
                    <p className="text-white font-medium">{activity.message}</p>
                    <p className="text-slate-gray/40 text-sm">{activity.time}</p>
                  </div>
                </div>
                <div className="text-slate-gray/40 text-xs font-medium bg-slate-gray/5 px-2 py-1 rounded-full">
                  {activity.type.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          
          <button 
            onClick={() => window.location.href = '/dashboard/admin?tab=artisans'}
            className="w-full bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/15 hover:to-blue-600/15 text-white p-4 rounded-xl transition-all duration-200 flex items-start gap-3 border border-blue-500/10 hover:border-blue-500/20"
          >
            <Shield className="w-6 h-6 mt-1 text-blue-400/60" />
            <div className="text-left">
              <p className="font-semibold">Review Verifications</p>
              <p className="text-sm text-slate-gray/60">{stats?.pendingVerifications || 0} pending</p>
            </div>
          </button>
          
          <button 
            onClick={() => window.location.href = '/dashboard/admin?tab=orders'}
            className="w-full bg-gradient-to-r from-green-500/10 to-green-600/10 hover:from-green-500/15 hover:to-green-600/15 text-white p-4 rounded-xl transition-all duration-200 flex items-start gap-3 border border-green-500/10 hover:border-green-500/20"
          >
            <Package className="w-6 h-6 mt-1 text-green-400/60" />
            <div className="text-left">
              <p className="font-semibold">Monitor Orders</p>
              <p className="text-sm text-slate-gray/60">{stats?.activeOrders || 0} active</p>
            </div>
          </button>
          
          <button 
            onClick={() => window.location.href = '/dashboard/admin?tab=users'}
            className="w-full bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/15 hover:to-purple-600/15 text-white p-4 rounded-xl transition-all duration-200 flex items-start gap-3 border border-purple-500/10 hover:border-purple-500/20"
          >
            <Users className="w-6 h-6 mt-1 text-purple-400/60" />
            <div className="text-left">
              <p className="font-semibold">Manage Users</p>
              <p className="text-sm text-slate-gray/60">{stats?.totalUsers || 0} total</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
