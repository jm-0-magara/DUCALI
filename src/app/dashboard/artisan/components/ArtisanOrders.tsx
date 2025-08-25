// src/app/dashboard/artisan/components/ArtisanOrders.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Package, MessageSquare, Play, CheckCircle, AlertCircle, DollarSign, User } from 'lucide-react';
import { useAuth } from '../../../../contexts';
import { orderService } from '../../../../lib/orderService';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import toast from 'react-hot-toast';

export function ArtisanOrders() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load orders from Firebase
  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const userOrders = await orderService.getUserOrders(user.id, 'artisan');
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.id]);

  const handleStartWork = async (orderId: string) => {
    setActionLoading(orderId);
    
    try {
      await orderService.updateOrderStatus(orderId, 'in_progress');
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'in_progress' }
          : order
      ));
      
      toast.success('Work started successfully!');
    } catch (error) {
      console.error('Error starting work:', error);
      toast.error('Failed to start work');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    setActionLoading(orderId);
    
    try {
      await orderService.updateOrderStatus(orderId, 'review');
      
      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'review' }
          : order
      ));
      
      toast.success('Order completed! Waiting for customer review.');
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Failed to complete order');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': return 'bg-blue-500';
      case 'in_progress': return 'bg-orange-500';
      case 'review': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in_progress': return 'In Progress';
      case 'review': return 'Under Review';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Orders</h2>
        <div className="text-sm text-slate-600 dark:text-slate-400">
          {orders.length} active order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No Orders Yet</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              When customers accept your quotes, their orders will appear here.
            </p>
            <Link
              href="/dashboard/artisan/quotes"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              View Quote Requests
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {order.description || 'Project Order'}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Order #{order.id.slice(-8)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(order.amount)} {order.currency}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Timeline:</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {order.timeline}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Created:</span>
                  <span className="text-slate-900 dark:text-white">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MessageSquare className="w-4 h-4" />
                  <span>{order.messages?.length || 0} messages</span>
                </div>
                
                <div className="flex gap-2">
                  {order.status === 'accepted' && (
                    <button
                      onClick={() => handleStartWork(order.id)}
                      disabled={actionLoading === order.id}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === order.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Start Work
                        </>
                      )}
                    </button>
                  )}
                  
                  {order.status === 'in_progress' && (
                    <button
                      onClick={() => handleCompleteOrder(order.id)}
                      disabled={actionLoading === order.id}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === order.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Completing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Complete Order
                        </>
                      )}
                    </button>
                  )}
                  
                  <Link
                    href={`/dashboard/artisan/orders/${order.id}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}