"use client";

import React, { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  Star,
  Tag,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { adminDataService } from '../../../../lib/adminDataService';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  artisanId: string;
  artisanName: string;
  price: number;
  status: 'active' | 'inactive' | 'pending' | 'rejected' | 'draft';
  rating: number;
  sales: number;
  stock: number;
  images: string[];
  createdAt: any;
  updatedAt: any;
}

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
  createdAt: any;
}

export function AdminProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement real Firebase methods for product data
      // For now, use empty arrays to avoid build errors
      setProducts([]);
      setCategories([]);
    } catch (error) {
      console.error('Error fetching product data:', error);
      setError('Failed to load product data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleUpdateProductStatus = async (productId: string, status: 'active' | 'pending' | 'rejected' | 'draft') => {
    try {
      // Update local state only for now
      setProducts(prev => prev.map(product => 
        product.id === productId ? { ...product, status } : product
      ));
    } catch (error) {
      console.error('Error updating product status:', error);
      setError('Failed to update product status');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // Update local state only for now
        setProducts(prev => prev.filter(product => product.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product');
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesFilter = selectedFilter === 'all' || product.status === selectedFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artisanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    pendingApproval: products.filter(p => p.status === 'pending').length,
    totalCategories: categories.length,
    totalSales: products.reduce((sum, p) => sum + p.sales, 0),
    averageRating: products.filter(p => p.rating > 0).reduce((sum, p) => sum + p.rating, 0) /
                   products.filter(p => p.rating > 0).length || 0
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Management</h1>
          <p className="text-slate-400 mt-2">Manage products, categories, and quality control</p>
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
          <h1 className="text-3xl font-bold text-white">Product Management</h1>
          <p className="text-slate-400 mt-2">Manage products, categories, and quality control</p>
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +12% from last month
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Products</p>
              <p className="text-2xl font-bold text-white">{stats.activeProducts}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-green-400 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            {((stats.activeProducts / stats.totalProducts) * 100).toFixed(1)}% active rate
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending Approval</p>
              <p className="text-2xl font-bold text-white">{stats.pendingApproval}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-yellow-400 text-sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Needs review
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Avg Rating</p>
              <p className="text-2xl font-bold text-white">{stats.averageRating.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-purple-400 text-sm">
            <Star className="w-4 h-4 mr-1" />
            {stats.totalSales} total sales
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
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
              <option value="all">All Products</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button className="bg-[#B08D57] hover:bg-[#B08D57]/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Artisan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Sales</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center mr-3">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{product.name}</div>
                        <div className="text-sm text-slate-400">ID: {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.artisanName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(product.status)}`}>
                      {getStatusIcon(product.status)}
                      <span className="ml-1">{product.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-white">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{product.sales}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-400 hover:text-blue-300" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-400 hover:text-green-300" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-400 hover:text-red-300" 
                        title="Delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Categories</h2>
            <button className="bg-[#B08D57] hover:bg-[#B08D57]/90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-medium">{category.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    category.status === 'active'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {category.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-3">{category.productCount} products</p>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                  <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
