"use client";

import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Shield,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { adminDataService } from '../../../../lib/adminDataService';
import { Review } from '../../../../lib/reviewsService';

export function AdminReviewsQuality() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [qualityStats, setQualityStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'reviews' | 'disputes'>('reviews');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement these methods in adminDataService
      // For now, using mock data
      setReviews([]);
      setDisputes([]);
      setQualityStats(null);
    } catch (error) {
      console.error('Error fetching reviews and disputes data:', error);
      setError('Failed to load reviews and disputes data. Please check your Firebase configuration.');
      
      // Fallback to mock data if Firebase fails
      setReviews([
        {
          id: '1',
          customerId: 'customer1',
          customerName: 'David Kimani',
          artisanId: 'artisan1',
          orderId: 'order1',
          rating: 5,
          title: 'Excellent Quality',
          comment: 'Excellent quality! The craftsmanship is outstanding. Highly recommend this artisan.',
          createdAt: new Date(),
          helpful: 12,
          reported: false,
          verified: true
        },
        {
          id: '2',
          customerId: 'customer2',
          customerName: 'Sarah Wanjiku',
          artisanId: 'artisan2',
          orderId: 'order2',
          rating: 2,
          title: 'Poor Quality',
          comment: 'Product arrived damaged. Very disappointed with the quality.',
          createdAt: new Date(),
          helpful: 3,
          reported: true,
          verified: false
        }
      ]);
      setDisputes([
        {
          id: '1',
          reviewId: 'review1',
          reportedBy: 'customer1',
          reportedByType: 'customer',
          reason: 'Product arrived damaged and doesn\'t match description',
          status: 'investigating',
          adminNotes: 'Customer claims product arrived damaged',
          createdAt: new Date() as any,
          updatedAt: new Date() as any,
          resolution: ''
        }
      ]);
      setQualityStats({
        totalReviews: 4,
        averageRating: 3.0,
        flaggedReviews: 1,
        pendingDisputes: 1,
        resolvedDisputes: 0,
        qualityScore: 85,
        recentActivity: 2
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleUpdateReviewStatus = async (reviewId: string, status: 'active' | 'flagged' | 'removed') => {
    try {
      // TODO: Implement updateReviewStatus in adminDataService
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? { ...review, status } : review
      ));
    } catch (error) {
      console.error('Error updating review status:', error);
      setError('Failed to update review status');
    }
  };

  const handleUpdateDisputeStatus = async (disputeId: string, status: 'pending' | 'investigating' | 'resolved' | 'dismissed', resolution?: string) => {
    try {
      // TODO: Implement updateDisputeStatus in adminDataService
      // Update local state
      setDisputes(prev => prev.map(dispute => 
        dispute.id === disputeId ? { ...dispute, status, resolution: resolution || '' } : dispute
      ));
    } catch (error) {
      console.error('Error updating dispute status:', error);
      setError('Failed to update dispute status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'removed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'flagged':
        return <Flag className="w-4 h-4 text-orange-500" />;
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
      case 'removed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'flagged':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating ? 'text-yellow-500 fill-current' : 'text-gray-400'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-slate-400">({rating})</span>
      </div>
    );
  };

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'flagged' && review.reported) ||
                         (selectedFilter === 'active' && !review.reported);
    const matchesSearch = (review.customerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (review.comment?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Reviews & Quality Management</h1>
          <p className="text-slate-400 mt-2">Moderate reviews and manage quality assurance</p>
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
          <h1 className="text-3xl font-bold text-white">Reviews & Quality Management</h1>
          <p className="text-slate-400 mt-2">Moderate reviews and manage quality assurance</p>
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
              <p className="text-slate-400 text-sm">Total Reviews</p>
              <p className="text-2xl font-bold text-white">{qualityStats?.totalReviews || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-400 text-sm">
            <Star className="w-4 h-4 mr-1" />
            Avg: {qualityStats?.averageRating.toFixed(1) || '0.0'}/5
          </div>
        </div>

                 <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-slate-400 text-sm">Pending Disputes</p>
               <p className="text-2xl font-bold text-white">{qualityStats?.pendingDisputes || 0}</p>
             </div>
             <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
               <Clock className="w-6 h-6 text-yellow-500" />
             </div>
           </div>
           <div className="mt-4 flex items-center text-yellow-400 text-sm">
             <AlertTriangle className="w-4 h-4 mr-1" />
             Needs attention
           </div>
         </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Flagged Reviews</p>
              <p className="text-2xl font-bold text-white">{qualityStats?.flaggedReviews || 0}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Flag className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-orange-400 text-sm">
            <Shield className="w-4 h-4 mr-1" />
            Requires attention
          </div>
        </div>

                 <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-slate-400 text-sm">Quality Score</p>
               <p className="text-2xl font-bold text-white">{qualityStats?.qualityScore || 0}%</p>
             </div>
             <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
               <TrendingUp className="w-6 h-6 text-green-500" />
             </div>
           </div>
           <div className="mt-4 flex items-center text-green-400 text-sm">
             <TrendingUp className="w-4 h-4 mr-1" />
             {qualityStats?.recentActivity || 0} recent
           </div>
         </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="border-b border-slate-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reviews'
                  ? 'border-[#B08D57] text-[#B08D57]'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('disputes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'disputes'
                  ? 'border-[#B08D57] text-[#B08D57]'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Disputes
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'reviews' ? (
            <div className="space-y-6">
              {/* Reviews Filters */}
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search reviews..."
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
                                         <option value="all">All Reviews</option>
                     <option value="active">Active</option>
                     <option value="flagged">Flagged</option>
                     <option value="removed">Removed</option>
                  </select>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                                                 <div className="flex items-center justify-between mb-2">
                           <h3 className="text-white font-medium">Review #{review.id}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(review.reported ? 'flagged' : 'active')}`}>
                            {getStatusIcon(review.reported ? 'flagged' : 'active')}
                            <span className="ml-1">{review.reported ? 'Flagged' : 'Active'}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                          <span>By {review.customerName}</span>
                          <span>•</span>
                          <span>Artisan ID: {review.artisanId}</span>
                          <span>•</span>
                          <span>{review.createdAt instanceof Date ? review.createdAt.toLocaleDateString() : 'N/A'}</span>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-white">{review.comment}</p>
                    </div>

                    

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                                                 <span className="flex items-center">
                           <ThumbsUp className="w-4 h-4 mr-1" />
                                                       {review.helpful} helpful
                         </span>
                                                 {review.reported && (
                           <span className="flex items-center text-red-400">
                             <Flag className="w-4 h-4 mr-1" />
                                                           Reported
                           </span>
                         )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="text-blue-400 hover:text-blue-300 p-2" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                                                 <button 
                           className="text-green-400 hover:text-green-300 p-2" 
                           title="Activate"
                           onClick={() => handleUpdateReviewStatus(review.id, 'active')}
                         >
                           <CheckCircle className="w-4 h-4" />
                         </button>
                         <button 
                           className="text-red-400 hover:text-red-300 p-2" 
                           title="Remove"
                           onClick={() => handleUpdateReviewStatus(review.id, 'removed')}
                         >
                           <XCircle className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Disputes List */}
              <div className="space-y-4">
                {disputes.map((dispute) => (
                  <div key={dispute.id} className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">Dispute #{dispute.id}</h3>
                                                     <div className="flex items-center space-x-2">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(dispute.status)}`}>
                               {dispute.status}
                             </span>
                           </div>
                        </div>
                                                 <div className="flex items-center space-x-4 text-sm text-slate-400 mb-3">
                           <span>Reported by: {dispute.reportedBy}</span>
                           <span>•</span>
                           <span>Type: {dispute.reportedByType}</span>
                         </div>
                         <div className="flex items-center space-x-4 text-sm text-slate-400">
                           <span>Review ID: {dispute.reviewId}</span>
                          <span>•</span>
                          <span>Opened: {dispute.createdAt instanceof Date ? dispute.createdAt.toLocaleDateString() : 'N/A'}</span>
                          <span>•</span>
                          <span>Updated: {dispute.updatedAt instanceof Date ? dispute.updatedAt.toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                                         <div className="mb-4">
                       <p className="text-white">{dispute.reason}</p>
                     </div>

                    {dispute.resolution && (
                      <div className="mb-4 p-3 bg-slate-600/50 rounded-lg">
                        <p className="text-sm text-slate-300">
                          <span className="font-medium">Resolution:</span> {dispute.resolution}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 p-2" title="View Details">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-400 hover:text-green-300 p-2" 
                        title="Resolve"
                        onClick={() => handleUpdateDisputeStatus(dispute.id, 'resolved', 'Dispute resolved successfully')}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-yellow-400 hover:text-yellow-300 p-2" 
                        title="Investigate"
                        onClick={() => handleUpdateDisputeStatus(dispute.id, 'investigating')}
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors flex items-start gap-3">
          <Shield className="w-6 h-6 mt-1" />
          <div className="text-left">
            <p className="font-semibold">Quality Guidelines</p>
            <p className="text-sm opacity-90">Review quality standards</p>
          </div>
        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors flex items-start gap-3">
          <MessageSquare className="w-6 h-6 mt-1" />
          <div className="text-left">
            <p className="font-semibold">Dispute Resolution</p>
            <p className="text-sm opacity-90">Handle customer disputes</p>
          </div>
        </button>

        <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors flex items-start gap-3">
          <TrendingUp className="w-6 h-6 mt-1" />
          <div className="text-left">
            <p className="font-semibold">Quality Reports</p>
            <p className="text-sm opacity-90">Generate quality reports</p>
          </div>
        </button>
      </div>
    </div>
  );
}
