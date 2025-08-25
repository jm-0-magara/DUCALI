"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Plus, Search, User } from 'lucide-react';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../contexts/AuthContext';
import { artisanService } from '../../lib/artisanService';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { type Conversation } from '../../lib/messagingService';
import { type Artisan } from '../../lib/artisanService';
import toast from 'react-hot-toast';

interface MessagingInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  initialArtisanId?: string;
  initialArtisanName?: string;
  initialArtisanImage?: string;
  initialMessage?: string;
  orderId?: string;
  projectTitle?: string;
}

export default function MessagingInterface({
  isOpen,
  onClose,
  initialArtisanId,
  initialArtisanName,
  initialArtisanImage,
  initialMessage,
  orderId,
  projectTitle
}: MessagingInterfaceProps) {
  const { user, isAuthenticated } = useAuth();
  const { 
    conversations, 
    currentConversation, 
    setCurrentConversation, 
    createConversation,
    getConversationById,
    error,
    clearError
  } = useMessaging();
  const [showConversationList, setShowConversationList] = useState(true);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingConversationId, setPendingConversationId] = useState<string | null>(null);
  const [selectingArtisan, setSelectingArtisan] = useState<string | null>(null);

  // Watch for new conversations and auto-select them
  useEffect(() => {
    if (pendingConversationId && conversations.length > 0) {
      const newConversation = conversations.find(conv => conv.id === pendingConversationId);
      if (newConversation) {
        console.log('Auto-selecting new conversation:', newConversation);
        setCurrentConversation(newConversation);
        setShowConversationList(false);
        setShowNewMessageModal(false);
        setSearchTerm('');
        setPendingConversationId(null);
        setSelectingArtisan(null);
      }
    }
  }, [conversations, pendingConversationId, setCurrentConversation]);

  // Timeout for pending conversation selection
  useEffect(() => {
    if (pendingConversationId) {
      const timeout = setTimeout(() => {
        console.log('Timeout reached for pending conversation:', pendingConversationId);
        setPendingConversationId(null);
        // Try to find by artisan ID as fallback
        const existingConversation = conversations.find(conv => 
          conversations.some(c => c.artisanId === pendingConversationId)
        );
        if (existingConversation) {
          setCurrentConversation(existingConversation);
          setShowConversationList(false);
          setShowNewMessageModal(false);
        }
      }, 1000); // 1 second timeout (reduced from 3 seconds)

      return () => clearTimeout(timeout);
    }
  }, [pendingConversationId, conversations, setCurrentConversation]);

  // Load artisans for new message modal
  useEffect(() => {
    if (showNewMessageModal) {
      loadArtisans();
    }
  }, [showNewMessageModal]);

  const loadArtisans = async () => {
    try {
      setLoading(true);
      const result = await artisanService.getArtisans();
      setArtisans(result.artisans);
    } catch (error) {
      console.error('Error loading artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle initial conversation creation
  React.useEffect(() => {
    if (isOpen && initialArtisanId && initialArtisanName && initialMessage && isAuthenticated) {
      const existingConversation = conversations.find(
        conv => conv.artisanId === initialArtisanId
      );

      if (!existingConversation) {
        createConversation(
          initialArtisanId,
          initialArtisanName,
          initialArtisanImage || '',
          initialMessage,
          orderId,
          projectTitle
        ).then((conversationId) => {
          const newConversation = conversations.find(conv => conv.id === conversationId);
          if (newConversation) {
            setCurrentConversation(newConversation);
            setShowConversationList(false);
          }
        }).catch(console.error);
      } else {
        setCurrentConversation(existingConversation);
        setShowConversationList(false);
      }
    }
  }, [isOpen, initialArtisanId, initialArtisanName, initialMessage, isAuthenticated]);

  const handleConversationSelect = (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setShowConversationList(false);
  };

  const handleNewMessage = () => {
    setShowNewMessageModal(true);
  };

  const handleArtisanSelect = async (artisan: Artisan) => {
    try {
      console.log('Creating conversation with artisan:', artisan.name);
      setSelectingArtisan(artisan.id);
      
      // Create a new conversation with this artisan
      const conversationId = await createConversation(
        artisan.id,
        artisan.name,
        artisan.profileImage || '',
        `Hi ${artisan.name}, I'm interested in your services.`
      );
      
      console.log('Conversation created with ID:', conversationId);
      
      // Try to find the conversation immediately in the current list
      let newConversation = conversations.find(conv => conv.id === conversationId);
      
      if (!newConversation) {
        // If not found in current list, try to fetch it directly from Firestore
        console.log('Conversation not found in list, fetching from Firestore...');
        const fetchedConversation = await getConversationById(conversationId);
        
        if (fetchedConversation) {
          newConversation = fetchedConversation;
        } else {
          // If still not found, create a temporary conversation object
          console.log('Creating temporary conversation object...');
          newConversation = {
            id: conversationId,
            customerId: user?.id || '',
            customerName: user?.name || '',
            customerImage: user?.profileImage || '',
            artisanId: artisan.id,
            artisanName: artisan.name,
            artisanImage: artisan.profileImage || '',
            lastMessage: `Hi ${artisan.name}, I'm interested in your services.`,
            lastMessageTime: new Date(),
            lastMessageSenderId: user?.id || '',
            unreadCount: 0,
            status: 'active' as const,
            createdAt: new Date(),
            updatedAt: new Date()
          };
        }
      }
      
      // Select the conversation immediately
      if (newConversation) {
        console.log('Selecting conversation immediately:', newConversation);
        setCurrentConversation(newConversation);
        setShowConversationList(false);
        setShowNewMessageModal(false);
        setSearchTerm('');
        setSelectingArtisan(null);
        setPendingConversationId(null);
        toast.success('Conversation created and selected!');
      } else {
        // Fallback: set pending ID and wait for subscription
        setPendingConversationId(conversationId);
      }
      
    } catch (error) {
      console.error('Error creating conversation:', error);
      setSelectingArtisan(null);
    }
  };

  const handleBackToConversations = () => {
    setCurrentConversation(null);
    setShowConversationList(true);
  };

  const filteredArtisans = artisans.filter(artisan =>
    artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artisan.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Sign in to message</h3>
            <p className="text-slate-400 mb-4">
              You need to be signed in to send messages to artisans.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // New Message Modal
  if (showNewMessageModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-600">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
              <MessageCircle className="w-6 h-6 text-[#A4B465]" />
              <h2 className="text-lg font-semibold text-white">New Message</h2>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search artisans by name, specialty, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] transition-colors"
              />
            </div>
          </div>

          {/* Artisans List */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-400">Loading artisans...</div>
              </div>
            ) : filteredArtisans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <User className="w-12 h-12 text-slate-400 mb-3" />
                <p className="text-slate-400 text-center">
                  {searchTerm ? 'No artisans found' : 'No artisans available'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredArtisans.map((artisan) => (
                  <div
                    key={artisan.id}
                    onClick={() => handleArtisanSelect(artisan)}
                    className={`flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors ${
                      selectingArtisan === artisan.id ? 'bg-slate-800 opacity-75' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                      {artisan.profileImage ? (
                        <img
                          src={artisan.profileImage}
                          alt={artisan.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-slate-300 font-medium">
                          {artisan.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{artisan.name}</h3>
                      <p className="text-slate-400 text-sm">{artisan.specialty}</p>
                      {artisan.location && (
                        <p className="text-slate-500 text-xs">{artisan.location}</p>
                      )}
                    </div>
                    {selectingArtisan === artisan.id && (
                      <div className="text-slate-400">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <div className="flex items-center gap-3">
            {!showConversationList && (
              <button
                onClick={handleBackToConversations}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            )}
            <MessageCircle className="w-6 h-6 text-[#A4B465]" />
            <h2 className="text-lg font-semibold text-white">
              {showConversationList ? 'Messages' : currentConversation?.artisanName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500 text-white p-3 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-white hover:text-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversation List */}
          {showConversationList && (
            <div className="w-80 border-r border-slate-600 flex flex-col">
              <ConversationList
                onSelectConversation={handleConversationSelect}
                onNewMessage={handleNewMessage}
              />
            </div>
          )}

          {/* Message Area */}
          <div className="flex-1 flex flex-col">
            {currentConversation ? (
              <>
                <MessageList conversationId={currentConversation.id} />
                <MessageInput conversationId={currentConversation.id} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                  <p className="text-sm">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
