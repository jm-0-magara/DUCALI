import React, { useState } from 'react';
import { 
  Package, 
  Eye, 
  DollarSign, 
  Calendar,
  User,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

export function AdminOrderMonitoring() {
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - in real app, this would come from Firebase
  const orders = [
    {
      id: '1234',
      customer: 'John Doe',
      artisan: 'Maria Rodriguez',
      service: 'Custom Jewelry',
      amount: 250,
      status: 'completed',
      createdAt: '2024-01-15',
      completedAt: '2024-01-20',
      location: 'New York, NY'
    },
    {
      id: '1235',
      customer: 'Sarah Johnson',
      artisan: 'Michael Chen',
      service: 'Wooden Furniture',
      amount: 800,
      status: 'in_progress',
      createdAt: '2024-01-18',
      completedAt: null,
      location: 'Los Angeles, CA'
    },
    {
      id: '1236',
      customer: 'David Wilson',
      artisan: 'John Smith',
      service: 'Textile Design',
      amount: 150,
      status: 'disputed',
      createdAt: '2024-01-10',
      completedAt: null,
      location: 'Miami, FL'
    }
  ];

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </span>
        );
      case 'disputed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Disputed
          </span>
        );
      default:
        return null;
    }
  };

  const handleViewOrder = (orderId: string) => {
    console.log('View order:', orderId);
    // In real app, this would open order details
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Order Monitoring</h1>
        <p className="text-slate-400 mt-2">Monitor all platform orders and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-500">
                ${orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-500">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Disputed</p>
              <p className="text-2xl font-bold text-red-500">
                {orders.filter(o => o.status === 'disputed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setStatusFilter('in_progress')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'in_progress' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter('disputed')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'disputed' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Disputed
            </button>
          </div>
          <div className="text-slate-400">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                    <p className="text-slate-400">{order.service}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(order.status)}
                    <span className="text-xl font-bold text-green-500">${order.amount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-slate-300">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium">Customer:</span> {order.customer}
                    </div>
                    <div className="flex items-center text-slate-300">
                      <User className="w-4 h-4 mr-2" />
                      <span className="font-medium">Artisan:</span> {order.artisan}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-slate-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      {order.location}
                    </div>
                    <div className="flex items-center text-slate-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created: {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {order.completedAt && (
                      <div className="flex items-center text-slate-300">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed: {new Date(order.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="ml-6">
                <button
                  onClick={() => handleViewOrder(order.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
