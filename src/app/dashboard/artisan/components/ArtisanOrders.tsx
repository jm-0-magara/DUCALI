// src/app/dashboard/artisan/components/ArtisanOrders.tsx (Enhanced)
import React, { useState } from 'react';
import { Calendar, Clock, DollarSign, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../../contexts';
import { useOrders } from '../../../../contexts/OrderContext';
import { StatusBadge } from '../../../../components/dashboard';
import { Order } from '../../../../types';

export function ArtisanOrders() {
  const { user } = useAuth();
  const { getArtisanOrders, sendQuote, updateOrderStatus, completeOrder } = useOrders();
  const [statusFilter, setStatusFilter] = useState('All Orders');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [quoteForm, setQuoteForm] = useState({
    price: '',
    timeline: '',
    notes: ''
  });
  const [progressUpdate, setProgressUpdate] = useState<{ orderId: string; progress: string }>({ orderId: '', progress: '' });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{ orderId: string; success: boolean; message: string } | null>(null);

  const artisanOrders = user ? getArtisanOrders() : [];
  
  const filteredOrders = statusFilter === 'All Orders' 
    ? artisanOrders 
    : artisanOrders.filter((order: Order) => order.status === statusFilter);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-400';
      case 'medium': return 'border-l-yellow-400';
      case 'low': return 'border-l-green-400';
      default: return 'border-l-slate-400';
    }
  };

  const handleSendQuote = async (orderId: string) => {
    if (!quoteForm.price || !quoteForm.timeline) {
      setActionResult({ orderId, success: false, message: 'Please fill in price and timeline' });
      setTimeout(() => setActionResult(null), 3000);
      return;
    }

    setActionLoading(orderId);
    const result = await sendQuote(orderId, quoteForm.price, quoteForm.timeline, quoteForm.notes);
    
    if (result.success) {
      setActionResult({ orderId, success: true, message: 'Quote sent successfully!' });
      setSelectedOrder(null);
      setQuoteForm({ price: '', timeline: '', notes: '' });
    } else {
      setActionResult({ orderId, success: false, message: result.error || 'Failed to send quote' });
    }
    
    setActionLoading(null);
    setTimeout(() => setActionResult(null), 3000);
  };

  const handleUpdateProgress = async (orderId: string) => {
    const progress = parseInt(progressUpdate.progress);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      setActionResult({ orderId, success: false, message: 'Please enter a valid progress percentage (0-100)' });
      setTimeout(() => setActionResult(null), 3000);
      return;
    }

    setActionLoading(orderId);
    const result = await updateOrderStatus(orderId, 'In Progress', progress);
    
    if (result.success) {
      setActionResult({ orderId, success: true, message: `Progress updated to ${progress}%` });
      setProgressUpdate({ orderId: '', progress: '' });
    } else {
      setActionResult({ orderId, success: false, message: result.error || 'Failed to update progress' });
    }
    
    setActionLoading(null);
    setTimeout(() => setActionResult(null), 3000);
  };

  const handleCompleteOrder = async (orderId: string) => {
    setActionLoading(orderId);
    const result = await completeOrder(orderId);
    
    if (result.success) {
      setActionResult({ orderId, success: true, message: 'Order marked as completed!' });
    } else {
      setActionResult({ orderId, success: false, message: result.error || 'Failed to complete order' });
    }
    
    setActionLoading(null);
    setTimeout(() => setActionResult(null), 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Orders Management</h2>
          <p className="text-slate-400">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} {statusFilter !== 'All Orders' ? `with status "${statusFilter}"` : 'total'}</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
          >
            <option>All Orders</option>
            <option>Quote Requested</option>
            <option>Pending Review</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
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
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders
            .sort((a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            .map((order: Order) => (
            <div key={order.id} className={`bg-slate-800 rounded-xl p-6 border border-slate-700 border-l-4 ${getPriorityColor(order.priority)}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold">{order.service}</h3>
                  <p className="text-slate-400">Customer: {order.customer}</p>
                  <p className="text-slate-500 text-sm">Order #{order.id}</p>
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
                      <span>Customer Budget: {order.budget}</span>
                    </div>
                  )}
                  {order.timeline && (
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>Requested Timeline: {order.timeline}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quote Form for Quote Requested Orders */}
              {order.status === 'Quote Requested' && selectedOrder === order.id && (
                <div className="mb-4 p-4 bg-slate-700 rounded-lg">
                  <h4 className="text-white font-medium mb-3">Send Quote</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Price *</label>
                      <input
                        type="text"
                        value={quoteForm.price}
                        onChange={(e) => setQuoteForm({...quoteForm, price: e.target.value})}
                        placeholder="e.g., $450"
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-300 mb-1">Timeline *</label>
                      <input
                        type="text"
                        value={quoteForm.timeline}
                        onChange={(e) => setQuoteForm({...quoteForm, timeline: e.target.value})}
                        placeholder="e.g., 4-6 weeks"
                        className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm text-slate-300 mb-1">Additional Notes</label>
                    <textarea
                      value={quoteForm.notes}
                      onChange={(e) => setQuoteForm({...quoteForm, notes: e.target.value})}
                      placeholder="Any additional information about the project..."
                      rows={3}
                      className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSendQuote(order.id)}
                      disabled={actionLoading === order.id}
                      className="bg-[#626F47] text-white px-4 py-2 rounded-lg hover:bg-[#A4B465] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === order.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Quote
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:border-slate-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Progress Update for In Progress Orders */}
              {order.status === 'In Progress' && (
                <>
                  {order.progress !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-slate-400 mb-2">
                        <span>Current Progress</span>
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
                  
                  {progressUpdate.orderId === order.id ? (
                    <div className="mb-4 p-4 bg-slate-700 rounded-lg">
                      <h4 className="text-white font-medium mb-3">Update Progress</h4>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={progressUpdate.progress}
                          onChange={(e) => setProgressUpdate({...progressUpdate, progress: e.target.value})}
                          placeholder="Progress %"
                          className="w-32 px-3 py-2 bg-slate-600 border border-slate-500 rounded text-white placeholder-slate-400"
                        />
                        <button
                          onClick={() => handleUpdateProgress(order.id)}
                          disabled={actionLoading === order.id}
                          className="bg-[#626F47] text-white px-4 py-2 rounded-lg hover:bg-[#A4B465] transition-colors disabled:opacity-50"
                        >
                          {actionLoading === order.id ? 'Updating...' : 'Update'}
                        </button>
                        <button
                          onClick={() => setProgressUpdate({ orderId: '', progress: '' })}
                          className="border border-slate-600 text-slate-300 px-4 py-2 rounded-lg hover:border-slate-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              )}

              {/* Order Footer */}
              <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-700 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Ordered {new Date(order.orderDate).toLocaleDateString()}</span>
                  </div>
                  {order.deadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Due {new Date(order.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {order.status === 'Quote Requested' && (
                    <button 
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-[#A4B465] hover:text-white transition-colors"
                    >
                      {selectedOrder === order.id ? 'Cancel Quote' : 'Send Quote'}
                    </button>
                  )}
                  {order.status === 'In Progress' && (
                    <>
                      <button 
                        onClick={() => setProgressUpdate(progressUpdate.orderId === order.id ? { orderId: '', progress: '' } : { orderId: order.id, progress: order.progress?.toString() || '0' })}
                        className="text-blue-400 hover:text-white transition-colors"
                      >
                        {progressUpdate.orderId === order.id ? 'Cancel Update' : 'Update Progress'}
                      </button>
                      <button 
                        onClick={() => handleCompleteOrder(order.id)}
                        disabled={actionLoading === order.id}
                        className="text-green-400 hover:text-white transition-colors disabled:opacity-50"
                      >
                        {actionLoading === order.id ? 'Completing...' : 'Mark Complete'}
                      </button>
                    </>
                  )}
                  <button className="text-[#B08D57] hover:text-[#FDF6F0] transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-white font-semibold mb-2">
            {statusFilter === 'All Orders' ? 'No Orders Yet' : `No ${statusFilter}`}
          </h3>
          <p className="text-slate-400">
            {statusFilter === 'All Orders' 
              ? 'Orders will appear here when customers request quotes from you.'
              : `No orders found with status "${statusFilter}".`
            }
          </p>
        </div>
      )}
    </div>
  );
}