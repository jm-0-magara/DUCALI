// src/app/dashboard/customer/orders/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, DollarSign, Package, MessageSquare, CheckCircle, AlertCircle, Star, FileText } from 'lucide-react';
import { useAuth } from '../../../../../contexts';
import { orderService } from '../../../../../lib/orderService';
import { useCurrency } from '../../../../../contexts/CurrencyContext';
import { PDFService } from '../../../../../lib/pdfService';
import Receipt from '../../../../../components/Receipt';
import RemainingPaymentModal from '../../../../../components/payments/RemainingPaymentModal';
import toast from 'react-hot-toast';

export default function CustomerOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customer, setCustomer] = useState<any>(null);
  const [artisan, setArtisan] = useState<any>(null);

  const orderId = params.id as string;

  useEffect(() => {
    const loadOrder = async () => {
      if (!user?.id || !orderId) return;
      
      try {
        setLoading(true);
        const orderData = await orderService.getOrder(orderId);
        
        if (!orderData) {
          toast.error('Order not found');
          router.push('/dashboard/customer');
          return;
        }

        // Verify this order belongs to the current user
        if (orderData.customerId !== user.id) {
          toast.error('Access denied');
          router.push('/dashboard/customer');
          return;
        }

        setOrder(orderData);
        
        // Load customer and artisan data for receipt functionality
        if (orderData) {
          // For now, we'll use the current user as customer and create a mock artisan
          // In a real app, you'd fetch these from the database
          setCustomer({
            name: user.name || 'Customer',
            email: user.email,
            phone: user.phone,
          });
          
          setArtisan({
            name: 'Artisan Name', // This should come from the order or artisan collection
            email: 'artisan@example.com',
            phone: '+254700000000',
          });
        }
      } catch (error) {
        console.error('Error loading order:', error);
        toast.error('Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [user?.id, orderId, router]);

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

  const handleApproveOrder = async () => {
    if (!user?.id || !order) return;
    
    try {
      const response = await fetch(`/api/orders/${order.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.id,
          action: 'approve',
          rating: 5, // Default rating
          review: 'Great work!', // Default review
        }),
      });

      if (response.ok) {
        toast.success('Order approved and completed!');
        // Refresh the order data
        const orderData = await orderService.getOrder(order.id);
        setOrder(orderData);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to approve order');
      }
    } catch (error) {
      console.error('Error approving order:', error);
      toast.error('Failed to approve order');
    }
  };

  const handleRejectOrder = async () => {
    if (!user?.id || !order) return;
    
    try {
      const response = await fetch(`/api/orders/${order.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user.id,
          action: 'reject',
        }),
      });

      if (response.ok) {
        toast.success('Order rejected');
        // Refresh the order data
        const orderData = await orderService.getOrder(order.id);
        setOrder(orderData);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to reject order');
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error('Failed to reject order');
    }
  };

  const handlePayRemaining = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    toast.success('Payment processed successfully!');
    // Refresh the order data
    const orderData = await orderService.getOrder(order.id);
    setOrder(orderData);
  };

  const handlePaymentError = (error: string) => {
    setShowPaymentModal(false);
    toast.error(error);
  };

  const handleShowReceipt = () => {
    setShowReceipt(true);
  };

  const handleDownloadReceipt = () => {
    if (!order || !customer || !artisan) return;

    const receiptData = {
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        description: order.description,
        timeline: order.timeline,
        createdAt: order.createdAt,
        completedAt: order.completedAt,
        paidAmount: order.paidAmount || 0,
      },
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      artisan: {
        name: artisan.name,
        email: artisan.email,
        phone: artisan.phone,
      },
    };

    PDFService.downloadReceipt(receiptData);
  };

  const handlePrintReceipt = () => {
    if (!order || !customer || !artisan) return;

    const receiptData = {
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        description: order.description,
        timeline: order.timeline,
        createdAt: order.createdAt,
        completedAt: order.completedAt,
        paidAmount: order.paidAmount || 0,
      },
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      artisan: {
        name: artisan.name,
        email: artisan.email,
        phone: artisan.phone,
      },
    };

    PDFService.printReceipt(receiptData);
  };

   if (loading) {
     return (
       <div className="flex justify-center items-center h-64">
         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
       </div>
     );
   }

   if (!order) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Order Not Found</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          The order you're looking for doesn't exist or you don't have access to it.
        </p>
        <button
          onClick={() => router.push('/dashboard/customer')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard/customer')}
          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Order Details</h1>
          <p className="text-slate-600 dark:text-slate-400">Order #{order.id.slice(-8)}</p>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {order.description || 'Project Order'}
          </h2>
          <span className={`px-4 py-2 rounded-full text-sm font-medium text-white ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Amount</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {formatCurrency(order.amount)} {order.currency}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Timeline</p>
                <p className="font-medium text-slate-900 dark:text-white">{order.timeline}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Created</p>
                <p className="text-slate-900 dark:text-white">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Project ID</p>
                <p className="font-mono text-sm text-slate-900 dark:text-white">
                  {order.projectId?.slice(-8) || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Messages</p>
                <p className="text-slate-900 dark:text-white">
                  {order.messages?.length || 0} messages
                </p>
              </div>
            </div>

            {order.completedAt && (
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Completed</p>
                  <p className="text-slate-900 dark:text-white">
                    {new Date(order.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Description */}
      {order.description && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Project Description</h3>
          <p className="text-slate-700 dark:text-slate-300">{order.description}</p>
        </div>
      )}

      {/* Messages Section */}
      {order.messages && order.messages.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Messages</h3>
          <div className="space-y-3">
            {order.messages.map((message: any, index: number) => (
              <div key={index} className="flex gap-3">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    {message.senderType === 'customer' ? 'C' : 'A'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {message.senderType === 'customer' ? 'You' : 'Artisan'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => router.push('/dashboard/customer')}
          className="bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
                 {order.status === 'review' && (
           <div className="flex gap-3">
             <button 
               onClick={() => handleApproveOrder()}
               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
             >
               <CheckCircle className="w-4 h-4" />
               Approve & Complete
             </button>
             <button 
               onClick={() => handleRejectOrder()}
               className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
             >
               <AlertCircle className="w-4 h-4" />
               Reject Work
             </button>
           </div>
         )}
         
         {['accepted', 'in_progress'].includes(order.status) && (
           <button 
             onClick={() => handlePayRemaining()}
             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
           >
             <DollarSign className="w-4 h-4" />
             Pay Remaining Amount
           </button>
         )}
         
         {order.status === 'completed' && (
           <button 
             onClick={() => handleShowReceipt()}
             className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
           >
             <FileText className="w-4 h-4" />
             View Receipt
           </button>
         )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && order && customer && artisan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Order Receipt</h2>
              <button
                onClick={() => setShowReceipt(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <Receipt
                order={order}
                customer={customer}
                artisan={artisan}
                onDownload={handleDownloadReceipt}
                onPrint={handlePrintReceipt}
              />
            </div>
          </div>
        </div>
      )}

      {/* Remaining Payment Modal */}
      {showPaymentModal && order && (
        <RemainingPaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          order={order}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </div>
  );
}
