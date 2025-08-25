// src/app/dashboard/artisan/components/ArtisanOverview.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, DollarSign, Star, Clock, Plus, Edit3, MessageCircle, TrendingUp, Users, Award } from 'lucide-react';
import { artisanDataService, ArtisanStats, ArtisanOrder } from '../../../../lib/artisanDataService';
import { useAuth } from '../../../../contexts/AuthContext';

export function ArtisanOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ArtisanStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<ArtisanOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, ordersData] = await Promise.all([
          artisanDataService.getArtisanStats(user.id),
          artisanDataService.getArtisanOrders(user.id, 5)
        ]);
        
        setStats(statsData);
        setRecentOrders(ordersData);
        setError(null);
      } catch (err) {
        console.error('Error loading artisan data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribeStats = artisanDataService.subscribeToArtisanStats(user.id, setStats);
    const unsubscribeOrders = artisanDataService.subscribeToOrders(user.id, (orders) => {
      setRecentOrders(orders.slice(0, 5));
    });

    return () => {
      unsubscribeStats();
      unsubscribeOrders();
    };
  }, [user?.id]);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-400';
      case 'medium': return 'border-l-yellow-400';
      case 'low': return 'border-l-green-400';
      default: return 'border-l-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'cancelled': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B08D57]"></div>
          <span className="ml-3 text-white">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats?.totalOrders || 0}</p>
            </div>
            <Package className="w-8 h-8 text-[#A4B465]" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Orders</p>
              <p className="text-2xl font-bold text-white">{stats?.activeOrders || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-white">${(stats?.totalEarnings || 0).toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Rating</p>
              <p className="text-2xl font-bold text-white">{stats?.avgRating || 0}</p>
            </div>
            <Star className="w-8 h-8 text-[#F0BB78]" />
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{stats?.completionRate || 0}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Reviews</p>
              <p className="text-2xl font-bold text-white">{stats?.totalReviews || 0}</p>
            </div>
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Portfolio Items</p>
              <p className="text-2xl font-bold text-white">{stats?.portfolioCount || 0}</p>
            </div>
            <Award className="w-8 h-8 text-[#B08D57]" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
          <Link href="/dashboard/artisan?tab=orders" className="text-[#A4B465] hover:text-white transition-colors">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No orders yet</p>
              <p className="text-slate-500 text-sm">Your orders will appear here</p>
            </div>
          ) : (
            recentOrders.slice(0, 3).map((order) => (
              <div key={order.id} className={`p-4 rounded-lg border-l-4 bg-slate-700 ${getPriorityColor(order.priority)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium">{order.service}</h4>
                    <p className="text-slate-400 text-sm">Customer: {order.customerName}</p>
                    <p className="text-slate-500 text-xs">
                      {order.orderDate.toLocaleDateString()} - {order.deadline.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </div>
                    <p className="text-[#A4B465] font-medium mt-1">${order.price}</p>
                    {order.progress && (
                      <div className="mt-2">
                        <div className="w-20 bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-[#A4B465] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                        <p className="text-slate-400 text-xs mt-1">{order.progress}%</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/artisan?tab=portfolio" className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <Plus className="w-5 h-5 text-[#A4B465]" />
            <span className="text-white">Add Portfolio Item</span>
          </Link>
          <Link href="/dashboard/artisan?tab=settings" className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <Edit3 className="w-5 h-5 text-[#A4B465]" />
            <span className="text-white">Update Profile</span>
          </Link>
          <Link href="/dashboard/artisan?tab=messages" className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <MessageCircle className="w-5 h-5 text-[#A4B465]" />
            <span className="text-white">Check Messages</span>
          </Link>
        </div>
      </div>
    </div>
  );
}