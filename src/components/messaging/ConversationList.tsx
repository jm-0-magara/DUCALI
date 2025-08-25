"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, MoreVertical, Archive, Trash2, Ban, Pin, MessageCircle, Clock, CheckCheck, Plus } from 'lucide-react';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { type Conversation } from '../../lib/messagingService';

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  onNewMessage?: () => void;
}

export default function ConversationList({ onSelectConversation, onNewMessage }: ConversationListProps) {
  const { conversations, currentConversation, notifications } = useMessaging();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Close filter menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
    }

    if (showFilterMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showFilterMenu]);

  // Close conversation menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showMenuFor) {
        setShowMenuFor(null);
      }
    }

    if (showMenuFor) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenuFor]);

  const handleFilterChange = (newFilter: 'all' | 'unread' | 'archived') => {
    setFilter(newFilter);
    setShowFilterMenu(false);
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.artisanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && conversation.unreadCount > 0) ||
                         (filter === 'archived' && (conversation as any).archived);
    
    return matchesSearch && matchesFilter;
  });

  const formatTime = (date: Date | any) => {
    if (date && typeof date === 'object' && 'toDate' in date) {
      date = date.toDate();
    }
    
    if (!(date instanceof Date)) {
      return '';
    }
    
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else if (diffInHours < 48) {
      return 'yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getUnreadCount = (conversationId: string) => {
    return notifications.filter(n => n.conversationId === conversationId && !n.read).length;
  };

  const handleArchive = async (conversationId: string) => {
    try {
      // TODO: Implement archive functionality in messaging service
      console.log('Archiving conversation:', conversationId);
      // await messagingService.archiveConversation(conversationId);
      setShowMenuFor(null);
    } catch (error) {
      console.error('Error archiving conversation:', error);
    }
  };

  const handleBlock = async (conversationId: string) => {
    try {
      // TODO: Implement block functionality in messaging service
      console.log('Blocking conversation:', conversationId);
      // await messagingService.blockConversation(conversationId);
      setShowMenuFor(null);
    } catch (error) {
      console.error('Error blocking conversation:', error);
    }
  };

  const handleDelete = async (conversationId: string) => {
    try {
      // TODO: Implement delete functionality in messaging service
      console.log('Deleting conversation:', conversationId);
      // await messagingService.deleteConversation(conversationId);
      setShowMenuFor(null);
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Messages</h2>
          <div className="flex items-center gap-2 relative" ref={filterMenuRef}>
            {onNewMessage && (
              <button
                onClick={onNewMessage}
                className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                title="New message"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2 rounded-lg transition-colors ${
                showFilterMenu 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Filter conversations"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-300 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500 transition-colors text-sm"
          />
        </div>

        {/* Filter Menu */}
        {showFilterMenu && (
          <div className="absolute top-full right-4 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50">
            <div className="p-2">
              <button
                onClick={() => handleFilterChange('all')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                All conversations
              </button>
              <button
                onClick={() => handleFilterChange('unread')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filter === 'unread' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Unread only
              </button>
              <button
                onClick={() => handleFilterChange('archived')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filter === 'archived' 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Archived
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </p>
            {!searchTerm && onNewMessage && (
              <button
                onClick={onNewMessage}
                className="mt-3 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm"
              >
                Start a conversation
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className="relative p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
                      {conversation.artisanImage ? (
                        <img 
                          src={conversation.artisanImage} 
                          alt={conversation.artisanName}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        conversation.artisanName.charAt(0).toUpperCase()
                      )}
                    </div>
                    {getUnreadCount(conversation.id) > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {getUnreadCount(conversation.id)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {conversation.artisanName}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                    
                    {conversation.projectTitle && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {conversation.projectTitle}
                      </p>
                    )}
                  </div>

                  {/* Menu */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenuFor(showMenuFor === conversation.id ? null : conversation.id);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                {/* Dropdown Menu */}
                {showMenuFor === conversation.id && (
                  <div className="absolute top-12 right-4 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArchive(conversation.id);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Archive
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBlock(conversation.id);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        Block
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(conversation.id);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
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
