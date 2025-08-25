"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { messagingService, type Message, type Conversation, type MessageNotification } from '../lib/messagingService';
import { useAuth } from './AuthContext';

interface MessagingContextType {
  // State
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  notifications: MessageNotification[];
  loading: boolean;
  error: string | null;
  
  // Actions
  setCurrentConversation: (conversation: Conversation | null) => void;
  sendMessage: (content: string, messageType?: 'text' | 'image' | 'file', fileUrl?: string, fileName?: string, fileSize?: number) => Promise<void>;
  markMessagesAsRead: (conversationId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  createConversation: (artisanId: string, artisanName: string, artisanImage: string, initialMessage: string, orderId?: string, projectTitle?: string) => Promise<string>;
  archiveConversation: (conversationId: string) => Promise<void>;
  blockConversation: (conversationId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  clearError: () => void;
  getConversationById: (conversationId: string) => Promise<Conversation | null>;
  
  // Real-time subscriptions
  subscribeToConversation: (conversationId: string) => void;
  unsubscribeFromConversation: () => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function MessagingProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Subscription cleanup functions
  const [conversationUnsubscribe, setConversationUnsubscribe] = useState<(() => void) | null>(null);
  const [conversationsUnsubscribe, setConversationsUnsubscribe] = useState<(() => void) | null>(null);
  const [notificationsUnsubscribe, setNotificationsUnsubscribe] = useState<(() => void) | null>(null);

  // Load user conversations when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setConversations([]);
      setNotifications([]);
      return;
    }

    const userRole = user.role as 'customer' | 'artisan';
    
    // Subscribe to conversations
    const unsubscribe = messagingService.subscribeToUserConversations(
      user.id,
      userRole,
      (conversations) => {
        setConversations(conversations);
      }
    );

    setConversationsUnsubscribe(() => unsubscribe);

    // Subscribe to notifications
    const notificationsUnsub = messagingService.subscribeToNotifications(
      user.id,
      (notifications) => {
        setNotifications(notifications);
      }
    );

    setNotificationsUnsubscribe(() => notificationsUnsub);

    return () => {
      unsubscribe();
      notificationsUnsub();
    };
  }, [isAuthenticated, user]);

  // Subscribe to current conversation messages
  const subscribeToConversation = (conversationId: string) => {
    // Cleanup previous subscription
    if (conversationUnsubscribe) {
      conversationUnsubscribe();
    }

    const unsubscribe = messagingService.subscribeToConversation(
      conversationId,
      (messages) => {
        setMessages(messages);
      }
    );

    setConversationUnsubscribe(() => unsubscribe);
  };

  // Unsubscribe from current conversation
  const unsubscribeFromConversation = () => {
    if (conversationUnsubscribe) {
      conversationUnsubscribe();
      setConversationUnsubscribe(null);
    }
    setMessages([]);
  };

  // Update current conversation and subscribe to messages
  const handleSetCurrentConversation = (conversation: Conversation | null) => {
    setCurrentConversation(conversation);
    
    if (conversation) {
      subscribeToConversation(conversation.id);
    } else {
      unsubscribeFromConversation();
    }
  };

  // Send message
  const sendMessage = async (
    content: string, 
    messageType: 'text' | 'image' | 'file' = 'text',
    fileUrl?: string,
    fileName?: string,
    fileSize?: number
  ) => {
    if (!currentConversation || !user) {
      setError('No active conversation or user not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await messagingService.sendMessage(
        currentConversation.id,
        user.id,
        user.name,
        user.role as 'customer' | 'artisan',
        content,
        messageType,
        fileUrl,
        fileName,
        fileSize
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      await messagingService.markMessagesAsRead(conversationId, user.id);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  // Edit message
  const editMessage = async (messageId: string, newContent: string) => {
    try {
      setError(null);
      await messagingService.editMessage(messageId, newContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit message');
    }
  };

  // Delete message
  const deleteMessage = async (messageId: string) => {
    try {
      setError(null);
      await messagingService.deleteMessage(messageId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message');
    }
  };

  // Create new conversation
  const createConversation = async (
    artisanId: string,
    artisanName: string,
    artisanImage: string,
    initialMessage: string,
    orderId?: string,
    projectTitle?: string
  ): Promise<string> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setLoading(true);
      setError(null);

      const conversationId = await messagingService.createConversation(
        user.id,
        user.name,
        user.profileImage || '',
        artisanId,
        artisanName,
        artisanImage,
        initialMessage,
        orderId,
        projectTitle
      );

      return conversationId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create conversation';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Archive conversation
  const archiveConversation = async (conversationId: string) => {
    try {
      setError(null);
      await messagingService.archiveConversation(conversationId);
      
      // If this was the current conversation, clear it
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        unsubscribeFromConversation();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive conversation');
    }
  };

  // Block conversation
  const blockConversation = async (conversationId: string) => {
    try {
      setError(null);
      await messagingService.blockConversation(conversationId);
      
      // If this was the current conversation, clear it
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        unsubscribeFromConversation();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to block conversation');
    }
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await messagingService.markNotificationAsRead(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Get conversation by ID
  const getConversationById = async (conversationId: string): Promise<Conversation | null> => {
    try {
      return await messagingService.getConversationById(conversationId);
    } catch (err) {
      console.error('Error getting conversation by ID:', err);
      return null;
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationUnsubscribe) conversationUnsubscribe();
      if (conversationsUnsubscribe) conversationsUnsubscribe();
      if (notificationsUnsubscribe) notificationsUnsubscribe();
    };
  }, []);

  const value: MessagingContextType = {
    // State
    conversations,
    currentConversation,
    messages,
    notifications,
    loading,
    error,
    
    // Actions
    setCurrentConversation: handleSetCurrentConversation,
    sendMessage,
    markMessagesAsRead,
    editMessage,
    deleteMessage,
    createConversation,
    archiveConversation,
    blockConversation,
    markNotificationAsRead,
    clearError,
    getConversationById,
    
    // Real-time subscriptions
    subscribeToConversation,
    unsubscribeFromConversation,
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}
