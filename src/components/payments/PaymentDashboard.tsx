"use client";

import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, Smartphone, Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { paymentService, Payment } from '../../lib/paymentService';

interface PaymentDashboardProps {
  darkMode?: boolean;
}

export default function PaymentDashboard({ darkMode = true }: PaymentDashboardProps) {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const userPayments = await paymentService.getUserPayments(user!.id, user!.role as 'customer' | 'artisan');
      setPayments(userPayments);
    } catch (err: any) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPaymentMethodIcon = (method: Payment['paymentMethod']) => {
    switch (method) {
      case 'stripe':
        return <CreditCard className="w-4 h-4" />;
      case 'mpesa':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const totalAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending' || p.status === 'processing')
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className={`p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg border ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white mb-2">Payment History</h2>
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Track your payment transactions and earnings
        </p>
      </div>

      {/* Stats */}
      <div className="p-6 border-b border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Total Completed
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalAmount)}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Pending
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(pendingAmount)}
            </p>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              <span className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Total Transactions
              </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {payments.length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex flex-wrap gap-2">
          {(['all', 'completed', 'pending', 'failed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Payments List */}
      <div className="p-6">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 mx-auto text-slate-400 mb-4" />
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              No payments found
            </h3>
            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {filter === 'all' 
                ? 'You haven\'t made any payments yet.'
                : `No ${filter} payments found.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className={`p-4 rounded-lg border ${darkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-200 bg-slate-50'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {payment.paymentType === 'full' ? 'Full Payment' : `Milestone ${payment.milestoneNumber}`}
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Order #{payment.orderId.slice(-8)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {formatCurrency(payment.amount)} {payment.currency}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {getPaymentMethodIcon(payment.paymentMethod)}
                      <span className={`capitalize ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {payment.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {payment.transactionId && (
                    <span className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                      ID: {payment.transactionId.slice(-8)}
                    </span>
                  )}
                </div>

                {payment.escrowStatus === 'held' && (
                  <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded">
                    <p className="text-xs text-blue-400">
                      💰 Payment held in escrow until order completion
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
