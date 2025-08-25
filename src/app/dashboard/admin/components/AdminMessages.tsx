// src/app/dashboard/admin/components/AdminMessages.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  MessageCircle, 
  Search, 
  Filter, 
  MoreVertical, 
  Star, 
  Archive, 
  Trash2, 
  Reply, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  User,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Settings,
  Ban,
  Check,
  X
} from 'lucide-react';
import { adminDataService } from '../../../../lib/adminDataService';
import { messagingService, type Conversation } from '../../../../lib/messagingService';
import MessagingInterface from '../../../../components/messaging/MessagingInterface';
import { useAuth } from '../../../../contexts/AuthContext';
import { useTheme } from '../../../../contexts/ThemeContext';

export function AdminMessages() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [realConversations, setRealConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [showArchived, setShowArchived] = useState(false);
  const [bulkActions, setBulkActions] = useState<string[]>([]);
  const [showConversationDetails, setShowConversationDetails] = useState(false);

  // Fetch conversations from database
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 AdminMessages: Fetching conversations from database...');
      
      const conversations = await messagingService.getAllConversations(100);
      console.log('✅ AdminMessages: Fetched conversations:', conversations);
      
      setRealConversations(conversations);
    } catch (error) {
      console.error('❌ AdminMessages: Error fetching conversations:', error);
      setError('Failed to load conversations. Please try again.');
      setRealConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let filtered = realConversations;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(conversation => 
        conversation.customerName.toLowerCase().includes(searchLower) ||
        conversation.artisanName.toLowerCase().includes(searchLower) ||
        conversation.lastMessage?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(conversation => conversation.status === statusFilter);
    }

    // Filter archived conversations
    if (!showArchived) {
      filtered = filtered.filter(conversation => !(conversation as any).archived);
    }

    // Sort conversations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          const aTime = a.updatedAt instanceof Date ? a.updatedAt.getTime() : 
                       (a.updatedAt && typeof a.updatedAt === 'object' && 'toDate' in a.updatedAt) ? 
                       (a.updatedAt as any).toDate().getTime() : 0;
          const bTime = b.updatedAt instanceof Date ? b.updatedAt.getTime() : 
                       (b.updatedAt && typeof b.updatedAt === 'object' && 'toDate' in b.updatedAt) ? 
                       (b.updatedAt as any).toDate().getTime() : 0;
          return bTime - aTime;
        case 'unread':
          return (b.unreadCount || 0) - (a.unreadCount || 0);
        case 'customer':
          return a.customerName.localeCompare(b.customerName);
        case 'artisan':
          return a.artisanName.localeCompare(b.artisanName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [realConversations, searchTerm, statusFilter, sortBy, showArchived]);

  // Calculate statistics
  const conversationStats = useMemo(() => {
    const total = realConversations.length;
    const active = realConversations.filter(c => c.status === 'active').length;
    const archived = realConversations.filter(c => c.status === 'archived').length;
    const blocked = realConversations.filter(c => c.status === 'blocked').length;
    const totalUnread = realConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    const highPriority = realConversations.filter(c => (c as any).priority === 'high').length;

    return {
      total,
      active,
      archived,
      blocked,
      totalUnread,
      highPriority
    };
  }, [realConversations]);

  const handleReply = useCallback(async (conversationId: string, message: string) => {
    try {
      console.log('🔍 AdminMessages: Sending reply to conversation:', conversationId);
      await messagingService.sendMessage(
        conversationId,
        user?.id || '',
        user?.name || 'Admin',
        'admin' as any,
        message
      );
      
      // Refresh conversations
      await fetchConversations();
    } catch (error) {
      console.error('❌ AdminMessages: Error sending reply:', error);
      setError('Failed to send reply. Please try again.');
    }
  }, [user, fetchConversations]);

  const handleBulkAction = useCallback(async (action: string) => {
    if (bulkActions.length === 0) return;

    try {
      console.log('🔍 AdminMessages: Performing bulk action:', action, 'on conversations:', bulkActions);
      
      const promises = bulkActions.map(conversationId => {
        switch (action) {
          case 'archive':
            return messagingService.updateConversation(conversationId, { status: 'archived' });
          case 'unarchive':
            return messagingService.updateConversation(conversationId, { status: 'active' });
          case 'resolve':
            return messagingService.updateConversation(conversationId, { status: 'active' });
          case 'activate':
            return messagingService.updateConversation(conversationId, { status: 'active' });
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      setBulkActions([]);
      await fetchConversations();
    } catch (error) {
      console.error('❌ AdminMessages: Error performing bulk action:', error);
      setError('Failed to perform bulk action. Please try again.');
    }
  }, [bulkActions, fetchConversations]);

  const toggleStar = useCallback(async (conversationId: string) => {
    try {
      const conversation = realConversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const newStarred = !(conversation as any).starred;
      // Note: starred is not a valid property, so we'll skip this update
      // await messagingService.updateConversation(conversationId, { starred: newStarred });
      
      setRealConversations(prev => 
        prev.map(c => 
          c.id === conversationId 
            ? { ...c, starred: newStarred }
            : c
        )
      );
    } catch (error) {
      console.error('❌ AdminMessages: Error toggling star:', error);
    }
  }, [realConversations]);

  const updateStatus = useCallback(async (conversationId: string, status: string) => {
    try {
      // Only allow valid status values
      if (['active', 'archived', 'blocked'].includes(status)) {
        await messagingService.updateConversation(conversationId, { status: status as 'active' | 'archived' | 'blocked' });
        await fetchConversations();
      }
    } catch (error) {
      console.error('❌ AdminMessages: Error updating status:', error);
      setError('Failed to update conversation status.');
    }
  }, [fetchConversations]);

  const handleRefresh = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Messages</h1>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#A4B465]"></div>
        </div>
        <div className="text-center py-12">
          <RefreshCw className="w-12 h-12 text-slate-400 mx-auto mb-4 animate-spin" />
          <p className="text-slate-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Messages</h1>
          <p className="text-slate-400">Manage and monitor all conversations</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5 text-slate-300" />
          </button>
          <button
            onClick={() => setShowConversationDetails(!showConversationDetails)}
            className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
          >
            {showConversationDetails ? <EyeOff className="w-5 h-5 text-slate-300" /> : <Eye className="w-5 h-5 text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">{conversationStats.total}</span>
          </div>
          <p className="text-slate-400 text-sm">Total</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-semibold">{conversationStats.active}</span>
          </div>
          <p className="text-slate-400 text-sm">Active</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-white font-semibold">{conversationStats.archived}</span>
          </div>
          <p className="text-slate-400 text-sm">Archived</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-white font-semibold">{conversationStats.totalUnread}</span>
          </div>
          <p className="text-slate-400 text-sm">Unread</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">{conversationStats.highPriority}</span>
          </div>
          <p className="text-slate-400 text-sm">Priority</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span className="text-white font-semibold">{conversationStats.blocked}</span>
          </div>
          <p className="text-slate-400 text-sm">Blocked</p>
        </div>
      </div>

      {/* Compact Messaging Interface */}
      <div className="bg-slate-800/20 rounded-xl border border-slate-700/50">
        <MessagingInterface 
          compact={false}
          maxHeight="h-[700px]"
          hideNewMessageButton={true}
          className="w-full"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}
    </div>
  );
}
