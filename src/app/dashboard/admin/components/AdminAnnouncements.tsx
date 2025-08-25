"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Users,
  User,
  Shield,
  Calendar,
  Save,
  X,
  Target,
  Bell,
  TrendingUp,
  MessageSquare,
  Filter,
  Search,
  RefreshCw,
  BarChart3,
  Send,
  Copy,
  Eye as EyeIcon
} from 'lucide-react';
import { adminDataService, type AdminAnnouncement } from '../../../../lib/adminDataService';
import { useAuth } from '../../../../contexts/AuthContext';
import { useTheme } from '../../../../contexts/ThemeContext';

export function AdminAnnouncements() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<AdminAnnouncement | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStats, setShowStats] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<AdminAnnouncement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    targetAudience: 'all' as 'all' | 'artisans' | 'customers' | 'admins',
    isPublished: true,
    type: 'info' as 'info' | 'warning' | 'success' | 'error'
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminDataService.getAnnouncements();
      console.log('🔍 Announcements: Using REAL database data', data);
      setAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Failed to load announcements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!user || !formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await adminDataService.createAnnouncement({
        title: formData.title.trim(),
        content: formData.content.trim(),
        author: user.name || 'Admin',
        authorId: user.id,
        isPublished: formData.isPublished,
        priority: formData.priority,
        targetAudience: formData.targetAudience
      });

      setShowCreateModal(false);
      resetFormData();
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
      setError('Failed to create announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement || !formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      await adminDataService.updateAnnouncement(editingAnnouncement.id, {
        title: formData.title.trim(),
        content: formData.content.trim(),
        isActive: formData.isPublished,
        priority: formData.priority,
        targetAudience: formData.targetAudience,
        type: formData.type
      });

      setEditingAnnouncement(null);
      resetFormData();
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error updating announcement:', error);
      setError('Failed to update announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      setError(null);
      await adminDataService.deleteAnnouncement(id);
      setShowDeleteConfirm(null);
      await fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setError('Failed to delete announcement. Please try again.');
    }
  };

  const resetFormData = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'medium',
      targetAudience: 'all',
      isPublished: true,
      type: 'info'
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handlePreview = (announcement: AdminAnnouncement) => {
    setPreviewData(announcement);
    setShowPreview(true);
  };

  const handleDuplicate = async (announcement: AdminAnnouncement) => {
    setFormData({
      title: `${announcement.title} (Copy)`,
      content: announcement.content,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      isPublished: false,
      type: announcement.type
    });
    setShowCreateModal(true);
  };

  const handleEdit = (announcement: AdminAnnouncement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      isPublished: announcement.isActive,
      type: announcement.type
    });
  };

  const getFilteredAndSortedAnnouncements = () => {
    let filtered = announcements.filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           announcement.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === 'all' || announcement.priority === priorityFilter;
      const matchesAudience = audienceFilter === 'all' || announcement.targetAudience === audienceFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'published' && announcement.isActive) ||
                           (statusFilter === 'draft' && !announcement.isActive);
      
      return matchesSearch && matchesPriority && matchesAudience && matchesStatus;
    });

    // Sort announcements
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];
      
      if (aValue instanceof Date && bValue instanceof Date) {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const filteredAnnouncements = getFilteredAndSortedAnnouncements();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      default: return 'text-slate-500 bg-slate-100 dark:bg-slate-900/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'warning': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'success': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'info': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      default: return 'text-slate-500 bg-slate-100 dark:bg-slate-900/20';
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'all': return <Users className="w-4 h-4" />;
      case 'artisans': return <Shield className="w-4 h-4" />;
      case 'customers': return <User className="w-4 h-4" />;
      case 'admins': return <Shield className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'artisans': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
      case 'customers': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'admins': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'text-slate-500 bg-slate-100 dark:bg-slate-900/20';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <RefreshCw className="w-8 h-8 animate-spin mr-3" />
        <span>Loading announcements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className={`${isDark ? 'bg-red-900/20 border-red-500/50' : 'bg-red-50 border-red-200'} border rounded-xl p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className={`${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className={`p-1 rounded-lg ${isDark ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-700 hover:bg-red-100'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Announcements</h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-2 text-sm sm:text-base`}>
            Manage platform announcements and communications
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowStats(!showStats)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base ${isDark ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} transition-colors flex items-center justify-center gap-2`}
          >
            <BarChart3 className="w-4 h-4" />
            Stats
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#A4B465] to-[#626F47] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4" />
            New Announcement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Total Announcements</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{announcements.length}</p>
              </div>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <MessageSquare className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Published</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {announcements.filter(a => a.isActive).length}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <CheckCircle className={`w-6 h-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>High Priority</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {announcements.filter(a => a.priority === 'high').length}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
                <AlertTriangle className={`w-6 h-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>This Week</p>
                <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {announcements.filter(a => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return a.createdAt > weekAgo;
                  }).length}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                <TrendingUp className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-4 sm:p-6 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl`}>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 text-sm sm:text-base ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50 focus:border-[#A4B465]`}
              />
            </div>
          </div>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={`px-3 sm:px-4 py-3 text-sm sm:text-base ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50`}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className={`px-3 sm:px-4 py-3 text-sm sm:text-base ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50`}
          >
            <option value="all">All Audiences</option>
            <option value="all">All Users</option>
            <option value="artisans">Artisans</option>
            <option value="customers">Customers</option>
            <option value="admins">Admins</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`px-3 sm:px-4 py-3 text-sm sm:text-base ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50`}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {filteredAnnouncements.length === 0 && !loading && (
        <div className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl p-12 border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl text-center`}>
          <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-400' : 'text-slate-300'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {searchTerm || priorityFilter !== 'all' || audienceFilter !== 'all' || statusFilter !== 'all' 
              ? 'No announcements found' 
              : 'No announcements yet'}
          </h3>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
            {searchTerm || priorityFilter !== 'all' || audienceFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first announcement to communicate with users'}
          </p>
          {!searchTerm && priorityFilter === 'all' && audienceFilter === 'all' && statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#A4B465] to-[#626F47] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create First Announcement
            </button>
          )}
        </div>
      )}

      {/* Announcements Grid */}
      {filteredAnnouncements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredAnnouncements.map((announcement) => (
            <div key={announcement.id} className={`${isDark ? 'bg-slate-800/50' : 'bg-white'} rounded-2xl border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} shadow-xl p-6 hover:shadow-2xl transition-all duration-300`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    {announcement.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(announcement.type)}`}>
                      {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAudienceColor(announcement.targetAudience)}`}>
                      {getAudienceIcon(announcement.targetAudience)}
                      <span className="ml-1 capitalize">{announcement.targetAudience}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {announcement.isActive ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-green-500 bg-green-100 dark:bg-green-900/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20">
                      <Clock className="w-3 h-3 mr-1" />
                      Draft
                    </span>
                  )}
                </div>
              </div>
              
              <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} mb-4 line-clamp-3`}>
                {announcement.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <div>By {announcement.createdBy}</div>
                  <div>{formatDate(announcement.createdAt)}</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePreview(announcement)}
                    className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
                    title="Preview Announcement"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(announcement)}
                    className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
                    title="Duplicate Announcement"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(announcement)}
                    className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
                    title="Edit Announcement"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(announcement.id)}
                    className={`p-2 rounded-lg text-red-500 hover:text-red-600 ${isDark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'} transition-colors`}
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingAnnouncement) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingAnnouncement(null);
                  resetFormData();
                }}
                className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50 focus:border-[#A4B465]`}
                  placeholder="Enter announcement title..."
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className={`w-full px-4 py-3 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50 focus:border-[#A4B465]`}
                  placeholder="Enter announcement content..."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'info' | 'warning' | 'success' | 'error' })}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50`}
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Target Audience
                  </label>
                  <select
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as 'all' | 'artisans' | 'customers' | 'admins' })}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A4B465]/50`}
                  >
                    <option value="all">All Users</option>
                    <option value="artisans">Artisans</option>
                    <option value="customers">Customers</option>
                    <option value="admins">Admins</option>
                  </select>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Status
                  </label>
                  <div className="flex items-center h-12 px-4">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded border-slate-300 mr-2"
                    />
                    <span className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {formData.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
                  disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#A4B465] to-[#626F47] text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSubmitting 
                    ? 'Saving...' 
                    : editingAnnouncement 
                      ? 'Update Announcement' 
                      : 'Create Announcement'
                  }
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingAnnouncement(null);
                    resetFormData();
                  }}
                  className={`px-6 py-3 ${isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} rounded-xl transition-colors`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Preview Announcement</h2>
              <button
                onClick={() => setShowPreview(false)}
                className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(previewData.priority)}`}>
                  {previewData.priority.charAt(0).toUpperCase() + previewData.priority.slice(1)} Priority
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(previewData.type)}`}>
                  {previewData.type.charAt(0).toUpperCase() + previewData.type.slice(1)}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAudienceColor(previewData.targetAudience)}`}>
                  {getAudienceIcon(previewData.targetAudience)}
                  <span className="ml-1 capitalize">{previewData.targetAudience}</span>
                </span>
              </div>
              
              <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {previewData.title}
              </h3>
              
              <div className={`${isDark ? 'bg-slate-700' : 'bg-slate-50'} rounded-xl p-4`}>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-700'} whitespace-pre-wrap`}>
                  {previewData.content}
                </p>
              </div>
              
              <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <div>By {previewData.createdBy}</div>
                <div>{formatDate(previewData.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-2xl p-6 max-w-md w-full mx-4`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Delete Announcement</h3>
            </div>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className={`flex-1 px-4 py-2 rounded-xl ${isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAnnouncement(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
