// src/app/dashboard/customer/components/CustomerOrders.tsx (Enhanced)
import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import { useAuth } from '../../../../contexts';
import { useOrders } from '../../../../contexts/OrderContext';
import { StatusBadge } from '../../../../components/dashboard';
import { Order } from '../../../../types';

export function CustomerOrders() {
  const { user } = useAuth();
  const { getCustomerOrders, acceptQuote } = useOrders();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{ orderId: string; success: boolean; message: string } | null>(null);

  const customerOrders = user ? getCustomerOrders() : [];

  const handleAcceptQuote = async (orderId: string) => {
    setActionLoading(orderId);
    const result = await acceptQuote(orderId);
    
    if (result.success) {
      setActionResult({ orderId, success: true, message: 'Quote accepted! Your order is now in progress.' });
    } else {
      setActionResult({ orderId, success: false, message: result.error || 'Failed to accept quote' });
    }
    
    setActionLoading(null);
    
    // Clear result after 3 seconds
    setTimeout(() => setActionResult(null), 3000);
  };

  const formatBudget = (budget?: string) => {
    if (!budget) return '';
    
    const budgetMap: { [key: string]: string } = {
      'under-100': 'Under $100',
      '100-300': '$100 - $300',
      '300-500': '$300 - $500',
      '500-1000': '$500 - $1,000',
      '1000-plus': '$1,000+'
    };
    
    return budgetMap[budget] || budget;
  };

  const formatTimeline = (timeline?: string) => {
    if (!timeline) return '';
    
    const timelineMap: { [key: string]: string } = {
      'asap': 'ASAP',
      '1-2-weeks': '1-2 weeks',
      '1-month': 'Within 1 month',
      '2-3-months': '2-3 months',
      'flexible': 'Flexible'
    };
    
    return timelineMap[timeline] || timeline;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Orders</h2>
          <p className="text-slate-400">{customerOrders.length} order{customerOrders.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/browse"
          className="bg-[#626F47] text-white px-4 py-2 rounded-lg hover:bg-[#A4B465] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Order
        </Link>
      </div>

      {/* Action Result Message */}
      {actionResult && (
        <div className={`mb-6 p-4 rounded-lg border ${
          actionResult.success 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            {actionResult.success ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{actionResult.message}</span>
          </div>
        </div>
      )}

      {/* Orders List */}
      {customerOrders.length > 0 ? (
        <div className="space-y-4">
          {customerOrders
            .sort((a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            .map((order: Order) => (
            <div key={order.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{order.artisanImage || '👨‍🎨'}</div>
                  <div>
                    <h3 className="text-white font-semibold">{order.service}</h3>
                    <p className="text-slate-400">by {order.artisan}</p>
                    <p className="text-slate-500 text-sm">Order #{order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={order.status} />
                  <div className="text-[#A4B465] font-semibold mt-2">{order.price}</div>
                </div>
              </div>

              {/* Order Description */}
              <div className="mb-4">
                <p className="text-slate-300 text-sm">{order.description}</p>
              </div>

              {/* Budget and Timeline Info */}
              {(order.budget || order.timeline) && (
                <div className="flex gap-4 mb-4 text-sm">
                  {order.budget && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <DollarSign className="w-4 h-4" />
                      <span>Budget: {formatBudget(order.budget)}</span>
                    </div>
                  )}
                  {order.timeline && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>Timeline: {formatTimeline(order.timeline)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Progress Bar for In Progress Orders */}
              {order.status === 'In Progress' && order.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Progress</span>
                    <span>{order.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-[#A4B465] h-2 rounded-full transition-all"
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Quote Details for Pending Review */}
              {order.status === 'Pending Review' && (
                <div className="mb-4 p-4 bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">Quote Received</h4>
                    <span className="text-[#A4B465] font-semibold text-lg">{order.price}</span>
                  </div>
                  {order.estimatedCompletion && (
                    <p className="text-slate-400 text-sm">Estimated completion: {order.estimatedCompletion}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAcceptQuote(order.id)}
                      disabled={actionLoading === order.id}
                      className="bg-[#626F47] text-white px-4 py-2 rounded-lg hover:bg-[#A4B465] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === order.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Accept Quote
                        </>
                      )}
                    </button>
                    <button className="border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:border-[#A4B465] hover:text-[#A4B465] transition-colors">
                      Request Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Order Footer */}
              <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-700 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Ordered {new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                  {order.estimatedCompletion && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Est. {new Date(order.estimatedCompletion).toLocaleDateString()}</span>
                    </div>
                  )}
                  {order.completedDate && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Completed {new Date(order.completedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="text-[#A4B465] hover:text-white transition-colors">
                    View Details
                  </button>
                  {order.status === 'Completed' && !order.rating && (
                    <button className="text-[#F0BB78] hover:text-white transition-colors">
                      Leave Review
                    </button>
                  )}
                  {order.status === 'In Progress' && (
                    <button className="text-blue-400 hover:text-white transition-colors">
                      Contact Artisan
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-white font-semibold mb-2">No Orders Yet</h3>
          <p className="text-slate-400 mb-6">
            Start by browsing our talented artisans and request a custom quote.
          </p>
          <Link
            href="/browse"
            className="bg-[#6E1414] text-[#FDF6F0] px-6 py-3 rounded-lg hover:bg-[#6E1414]/80 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Browse Artisans
          </Link>
        </div>
      )}
    </div>
  );
}