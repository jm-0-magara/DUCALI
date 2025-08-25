"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Menu, Search, Filter, MoreVertical, Phone, Video, Info, Plus, User, X, RefreshCw, MessageCircle } from 'lucide-react';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { type Conversation, messagingService } from '../../lib/messagingService';
import { adminDataService } from '../../lib/adminDataService';

interface MessagingInterfaceProps {
  className?: string;
  compact?: boolean;
  maxHeight?: string;
  hideNewMessageButton?: boolean;
}

export default function MessagingInterface({ 
  className = '', 
  compact = false,
  maxHeight = 'h-[700px]',
  hideNewMessageButton = false
}: MessagingInterfaceProps) {
  const { currentConversation, setCurrentConversation } = useMessaging();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [showConversationInfo, setShowConversationInfo] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    if (window.innerWidth < 1024) {
      setShowSidebar(false);
    }
  };

  const handleBackToConversations = () => {
    setCurrentConversation(null);
    setShowSidebar(true);
  };

  const handleNewMessage = async () => {
    setShowNewMessageModal(true);
    await fetchUsers();
  };

  const handleStartConversation = async (selectedUser: any) => {
    try {
      if (!user) {
        console.error('❌ No current user found');
        alert('Please log in to start a conversation.');
        return;
      }

      console.log('🔍 Starting conversation with:', selectedUser);
      console.log('👤 Current user:', user);
      
      // Determine the conversation participants based on current user's role
      let customerId, customerName, customerImage, artisanId, artisanName, artisanImage;
      
      if (user.role === 'customer') {
        customerId = user.id;
        customerName = user.name || 'Unknown Customer';
        customerImage = user.profileImage || '';
        artisanId = selectedUser.id;
        artisanName = selectedUser.name || 'Unknown Artisan';
        artisanImage = selectedUser.profileImage || '';
      } else {
        // Current user is an artisan
        customerId = selectedUser.id;
        customerName = selectedUser.name || 'Unknown Customer';
        customerImage = selectedUser.profileImage || '';
        artisanId = user.id;
        artisanName = user.name || 'Unknown Artisan';
        artisanImage = user.profileImage || '';
      }

      console.log('📝 Conversation parameters:', {
        customerId,
        customerName,
        customerImage,
        artisanId,
        artisanName,
        artisanImage
      });

      // Create or get existing conversation
      const conversation = await messagingService.createOrGetConversation({
        customerId,
        customerName,
        customerImage,
        artisanId,
        artisanName,
        artisanImage
      });

      console.log('✅ Conversation created/retrieved:', conversation);
      
      // Set as current conversation
      setCurrentConversation(conversation);
      setShowNewMessageModal(false);
      setSearchTerm('');
      setSelectedUser(null);
      
      // Close sidebar on mobile
      if (window.innerWidth < 1024) {
        setShowSidebar(false);
      }
      
    } catch (error) {
      console.error('❌ Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      console.log('🔍 Fetching users for new conversation...');
      
      let fetchedUsers: any[] = [];
      
      if (user?.role === 'admin') {
        // Admin can see all users
        const allUsers = await adminDataService.getUsers();
        const customers = allUsers.filter(u => u.role === 'CUSTOMER');
        const artisans = allUsers.filter(u => u.role === 'ARTISAN');
        fetchedUsers = [...customers, ...artisans];
      } else if (user?.role === 'customer') {
        // Customer can see artisans
        const allUsers = await adminDataService.getUsers();
        fetchedUsers = allUsers.filter(u => u.role === 'ARTISAN');
      } else if (user?.role === 'artisan') {
        // Artisan can see customers
        const allUsers = await adminDataService.getUsers();
        fetchedUsers = allUsers.filter(u => u.role === 'CUSTOMER');
      }
      
      console.log('✅ Fetched users:', fetchedUsers);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredUsers = users.filter((u: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower) ||
      (u as any).specialty?.toLowerCase().includes(searchLower)
    );
  });

  // Remove the profile image handling functions that reference undefined variables
  // These should be handled in the parent component or context

  return (
    <div className={`${className} ${maxHeight} flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          {!showSidebar && currentConversation && (
            <button
              onClick={handleBackToConversations}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          )}
          
          {showSidebar && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Messages</h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!hideNewMessageButton && (
            <button
              onClick={handleNewMessage}
              className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              title="New message"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          
          {currentConversation && (
            <button
              onClick={() => setShowConversationInfo(!showConversationInfo)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Conversation info"
            >
              <Info className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-full lg:w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <ConversationList 
              onSelectConversation={handleSelectConversation} 
              onNewMessage={handleNewMessage}
            />
          </div>
        )}

        {/* Main Chat Area */}
        {currentConversation ? (
          <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
            <MessageList conversationId={currentConversation.id} />
            <MessageInput conversationId={currentConversation.id} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No conversation selected</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Choose an existing conversation or start a new one</p>
              {!hideNewMessageButton && (
                <button
                  onClick={handleNewMessage}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Start New Message
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Conversation Info Sidebar */}
      {showConversationInfo && currentConversation && (
        <div className={`${compact ? 'w-80' : 'w-96'} border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Conversation Info</h3>
            <button
              onClick={() => setShowConversationInfo(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Participants</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {currentConversation.customerImage ? (
                      <img 
                        src={currentConversation.customerImage} 
                        alt={currentConversation.customerName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      currentConversation.customerName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">{currentConversation.customerName}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Customer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {currentConversation.artisanImage ? (
                      <img 
                        src={currentConversation.artisanImage} 
                        alt={currentConversation.artisanName}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      currentConversation.artisanName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 text-sm font-medium">{currentConversation.artisanName}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Artisan</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button className="w-full p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 text-left">
                  <Phone className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Voice Call</span>
                </button>
                <button className="w-full p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 text-left">
                  <Video className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Video Call</span>
                </button>
                <button className="w-full p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2 text-left">
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">View Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-sm w-full max-h-[70vh] overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">New Message</h2>
              <button
                onClick={() => {
                  setShowNewMessageModal(false);
                  setSearchTerm('');
                  setSelectedUser(null);
                }}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-300 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-300 dark:focus:ring-blue-500 transition-colors text-sm"
                />
              </div>

              {/* Users List */}
              <div className="max-h-48 overflow-y-auto space-y-1">
                {loadingUsers ? (
                  <div className="text-center py-8">
                    <RefreshCw className="w-6 h-6 text-gray-400 mx-auto mb-2 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Loading users...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-6">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {searchTerm ? 'No users found' : 'No users available'}
                    </p>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleStartConversation(user)}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    >
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium text-sm">
                        {user.profileImage ? (
                          <img 
                            src={user.profileImage} 
                            alt={user.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h3 className="text-gray-900 dark:text-gray-100 font-medium truncate text-sm">{user.name}</h3>
                          {user.isVerified && (
                            <span className="text-blue-500 text-xs">✓</span>
                          )}
                        </div>
                        {/* Email only visible to admins */}
                        {user.role === 'ADMIN' && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{user.email}</p>
                        )}
                        {user.specialty && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{user.specialty}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'ARTISAN' 
                            ? 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' 
                            : user.role === 'ADMIN'
                            ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30'
                            : 'text-blue-600 bg-blue-50 dark:bg-blue-900/30'
                        }`}>
                          {user.role}
                        </span>
                        <button className="p-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Actions */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setShowNewMessageModal(false);
                      setSearchTerm('');
                      setSelectedUser(null);
                    }}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Implement group chat functionality
                      console.log('Create group chat');
                    }}
                    className="px-3 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm"
                  >
                    Group Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
