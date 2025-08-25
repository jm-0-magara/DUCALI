"use client";

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Calendar,
  Users,
  Package,
  RefreshCw
} from 'lucide-react';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { MaximizableChart } from '../../../../components/charts';
import { adminDataService } from '../../../../lib/adminDataService';

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'commission' | 'withdrawal';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  customerId: string;
  customerName: string;
  artisanId: string;
  artisanName: string;
  orderId: string;
  description: string;
  createdAt: any;
  updatedAt: any;
}

interface FinancialStats {
  totalRevenue: number;
  totalCommissions: number;
  pendingPayments: number;
  totalRefunds: number;
  netRevenue: number;
  transactionCount: number;
  averageOrderValue: number;
  monthlyGrowth: number;
}

export function AdminFinancialManagement() {
  const { formatCurrency } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [financialStats, setFinancialStats] = useState<FinancialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement real Firebase methods for financial data
      // For now, use empty arrays to avoid build errors
      setTransactions([]);
      setFinancialStats({
        totalRevenue: 0,
        totalCommissions: 0,
        pendingPayments: 0,
        totalRefunds: 0,
        netRevenue: 0,
        transactionCount: 0,
        averageOrderValue: 0,
        monthlyGrowth: 0
      });
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setError('Failed to load financial data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="w-4 h-4 text-blue-500" />;
      case 'refund':
        return <Receipt className="w-4 h-4 text-red-500" />;
      case 'commission':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'fee':
        return <DollarSign className="w-4 h-4 text-yellow-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = selectedFilter === 'all' || transaction.status === selectedFilter;
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.artisanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Management</h1>
          <p className="text-slate-400 mt-2">Monitor payments, commissions, and financial performance</p>
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
          <h1 className="text-3xl font-bold text-white">Financial Management</h1>
          <p className="text-slate-400 mt-2">Monitor payments, commissions, and financial performance</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(financialStats?.totalRevenue || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{financialStats?.monthlyGrowth || 0}% from last month
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Net Revenue</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(financialStats?.netRevenue || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-400 text-sm">
            <DollarSign className="w-4 h-4 mr-1" />
            After refunds & fees
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Platform Commissions</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(financialStats?.totalCommissions || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +8.5% from last month
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Payments</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(financialStats?.pendingPayments || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-yellow-400 text-sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            {transactions.filter(t => t.status === 'pending').length} transactions
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <MaximizableChart title="Revenue Trend">
        <div className="h-64 flex items-center justify-center text-slate-400">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4" />
            <p>Revenue chart will be displayed here</p>
            <p className="text-sm">Integration with chart library needed</p>
          </div>
        </div>
      </MaximizableChart>

      {/* Filters and Search */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            >
              <option value="all">All Transactions</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#B08D57]"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <button className="bg-[#B08D57] hover:bg-[#B08D57]/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Transaction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Artisan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center mr-3">
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{transaction.orderId}</div>
                        <div className="text-sm text-slate-400">{transaction.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-white">{transaction.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      transaction.type === 'refund' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {transaction.type === 'refund' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{transaction.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{transaction.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{transaction.artisanName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {transaction.createdAt instanceof Date ? transaction.createdAt.toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-400 hover:text-blue-300" title="View Details">
                      <Receipt className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors flex items-start gap-3">
          <CreditCard className="w-6 h-6 mt-1" />
          <div className="text-left">
            <p className="font-semibold">Payment Processing</p>
            <p className="text-sm opacity-90">Monitor payment gateways</p>
          </div>
        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors flex items-start gap-3">
          <Receipt className="w-6 h-6 mt-1" />
          <div className="text-left">
            <p className="font-semibold">Commission Reports</p>
            <p className="text-sm opacity-90">Generate commission reports</p>
          </div>
        </button>

        <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors flex items-start gap-3">
          <Download className="w-6 h-6 mt-1" />
          <div className="text-left">
            <p className="font-semibold">Financial Reports</p>
            <p className="text-sm opacity-90">Export financial data</p>
          </div>
        </button>
      </div>
    </div>
  );
}
