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
  Clock
} from 'lucide-react';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { adminDataService } from '../../../../lib/adminDataService';
import { RealTimeIndicator } from '../../../../components/RealTimeIndicator';

export function AdminOverview() {
  const { formatCurrency } = useCurrency();
  const [stats, setStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats from Firebase
        const statsData = await adminDataService.getStats();
        setStats(statsData);

        // Subscribe to recent activities
        const unsubscribe = adminDataService.subscribeToActivities((activities) => {
          setRecentActivity(activities);
          setLastUpdate(new Date());
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Fallback to mock data if Firebase fails
        setStats({
          totalUsers: 1247,
          totalArtisans: 89,
          totalOrders: 342,
          totalRevenue: 45678,
          pendingVerifications: 12,
          activeOrders: 45,
          averageRating: 4.6,
          newUsersThisWeek: 23
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





  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
            <p className="text-slate-400 mt-2">Platform statistics and recent activity</p>
          </div>
          <RealTimeIndicator isConnected={false} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700 animate-pulse">
              <div className="h-4 bg-slate-700 rounded mb-2"></div>
              <div className="h-8 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Overview</h1>
          <p className="text-slate-400 mt-2">Platform statistics and recent activity</p>
        </div>
        <RealTimeIndicator isConnected={isConnected} lastUpdate={lastUpdate || undefined} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats?.totalUsers?.toLocaleString() || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{stats?.newUsersThisWeek || 0} this week
          </div>
        </div>

        {/* Total Artisans */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Artisans</p>
              <p className="text-2xl font-bold text-white">{stats?.totalArtisans || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-yellow-400 text-sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            {stats?.pendingVerifications || 0} pending
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats?.totalOrders || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-400 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {stats?.activeOrders || 0} active
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats?.totalRevenue || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <Star className="w-4 h-4 mr-1" />
            {stats?.averageRating || '0.0'} avg rating
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity?.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(activity.status)}
                <div>
                  <p className="text-white font-medium">{activity.message}</p>
                  <p className="text-slate-400 text-sm">{activity.time}</p>
                </div>
              </div>
              <div className="text-slate-400 text-sm">
                {activity.type.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors">
          <Shield className="w-6 h-6 mb-2" />
          <div className="text-left">
            <p className="font-semibold">Review Verifications</p>
            <p className="text-sm opacity-90">{stats?.pendingVerifications || 0} pending</p>
          </div>
        </button>
        
        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors">
          <Package className="w-6 h-6 mb-2" />
          <div className="text-left">
            <p className="font-semibold">Monitor Orders</p>
            <p className="text-sm opacity-90">{stats?.activeOrders || 0} active</p>
          </div>
        </button>
        
        <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors">
          <Users className="w-6 h-6 mb-2" />
          <div className="text-left">
            <p className="font-semibold">Manage Users</p>
            <p className="text-sm opacity-90">{stats?.totalUsers || 0} total</p>
          </div>
        </button>
      </div>
    </div>
  );
}
