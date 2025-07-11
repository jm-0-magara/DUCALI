// src/app/dashboard/artisan/components/ArtisanOverview.tsx
import React from 'react';
import Link from 'next/link';
import { Package, DollarSign, Star, Clock, Plus, Edit3, MessageCircle, TrendingUp } from 'lucide-react';
import { DashboardStats, Order } from '../../../../types';

// Mock stats - in real app, this would come from props or API
const mockStats: DashboardStats = {
  totalOrders: 47,
  activeOrders: 8,
  totalEarnings: 12450,
  avgRating: 4.8,
  completionRate: 96,
  responseTime: '2 hours'
};

const mockRecentOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Jane Smith',
    service: 'Custom Wedding Dress',
    status: 'In Progress',
    orderDate: '2024-11-10',
    deadline: '2024-12-15',
    price: '$450',
    progress: 60,
    priority: 'high'
  },
  {
    id: 'ORD-002',
    customer: 'Michael Johnson',
    service: 'Evening Gown Alteration',
    status: 'Pending Review',
    orderDate: '2024-11-18',
    deadline: '2024-11-25',
    price: '$120',
    priority: 'medium'
  },
  {
    id: 'ORD-003',
    customer: 'Sarah Wilson',
    service: 'Bridesmaid Dress',
    status: 'Quote Requested',
    orderDate: '2024-11-20',
    price: 'TBD',
    priority: 'low'
  }
];

export function ArtisanOverview() {
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
      case 'In Progress': return 'text-blue-400 bg-blue-400/10';
      case 'Pending Review': return 'text-yellow-400 bg-yellow-400/10';
      case 'Quote Requested': return 'text-purple-400 bg-purple-400/10';
      case 'Completed': return 'text-green-400 bg-green-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{mockStats.totalOrders}</p>
            </div>
            <Package className="w-8 h-8 text-[#A4B465]" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Orders</p>
              <p className="text-2xl font-bold text-white">{mockStats.activeOrders}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-white">${mockStats.totalEarnings.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Rating</p>
              <p className="text-2xl font-bold text-white">{mockStats.avgRating}</p>
            </div>
            <Star className="w-8 h-8 text-[#F0BB78]" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
          <Link href="#" className="text-[#A4B465] hover:text-white transition-colors">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {mockRecentOrders.slice(0, 3).map((order) => (
            <div key={order.id} className={`p-4 rounded-lg border-l-4 bg-slate-700 ${getPriorityColor(order.priority)}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium">{order.service}</h4>
                  <p className="text-slate-400 text-sm">Customer: {order.customer}</p>
                </div>
                <div className="text-right">
                  <div className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                  <p className="text-[#A4B465] font-medium mt-1">{order.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <Plus className="w-5 h-5 text-[#A4B465]" />
            <span className="text-white">Add Portfolio Item</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <Edit3 className="w-5 h-5 text-[#A4B465]" />
            <span className="text-white">Update Profile</span>
          </button>
          <button className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
            <MessageCircle className="w-5 h-5 text-[#A4B465]" />
            <span className="text-white">Check Messages</span>
          </button>
        </div>
      </div>
    </div>
  );
}