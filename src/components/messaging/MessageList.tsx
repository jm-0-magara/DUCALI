"use client";

import React, { useRef, useEffect, useState } from 'react';
import { MoreVertical, Edit, Trash2, Check, CheckCheck, Image as ImageIcon, File, Download, Reply, Forward, Copy, Flag, MessageCircle, Paperclip } from 'lucide-react';
import { useMessaging } from '../../contexts/MessagingContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { type Message } from '../../lib/messagingService';

interface MessageListProps {
  conversationId: string;
}

export default function MessageList({ conversationId }: MessageListProps) {
  const { messages, markMessagesAsRead, editMessage, deleteMessage, currentConversation } = useMessaging();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is active
  useEffect(() => {
    if (conversationId && user) {
      markMessagesAsRead(conversationId);
    }
  }, [conversationId, messages, user, markMessagesAsRead]);

  const formatTime = (date: Date | any) => {
    let actualDate: Date;
    
    // Handle Firebase Timestamp objects
    if (date && typeof date === 'object' && 'toDate' in date) {
      actualDate = date.toDate();
    } else if (date instanceof Date) {
      actualDate = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      actualDate = new Date(date);
    } else {
      return '--:--';
    }
    
    // Check if the date is valid
    if (isNaN(actualDate.getTime())) {
      return '--:--';
    }
    
    return actualDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date | any) => {
    let actualDate: Date;
    
    // Handle Firebase Timestamp objects
    if (date && typeof date === 'object' && 'toDate' in date) {
      actualDate = date.toDate();
    } else if (date instanceof Date) {
      actualDate = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      actualDate = new Date(date);
    } else {
      return 'Unknown';
    }
    
    // Check if the date is valid
    if (isNaN(actualDate.getTime())) {
      return 'Unknown';
    }
    
    const now = new Date();
    const messageDate = new Date(actualDate);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  const handleEdit = (message: Message) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
    setShowMenuFor(null);
  };

  const handleSaveEdit = async () => {
    if (editingMessageId && editContent.trim()) {
      try {
        await editMessage(editingMessageId, editContent.trim());
        setEditingMessageId(null);
        setEditContent('');
      } catch (error) {
        console.error('Error editing message:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
      setShowMenuFor(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setShowMenuFor(null);
  };

  const renderMessageContent = (message: Message) => {
    switch (message.messageType) {
      case 'image':
        return (
          <div className="space-y-3">
            <div className="relative group">
              <img
                src={message.fileUrl}
                alt="Shared image"
                className="max-w-xs rounded-2xl cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg"
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  Click to view
                </div>
              </div>
            </div>
            {message.content && (
              <p className="text-sm leading-relaxed">{message.content}</p>
            )}
          </div>
        );
      
      case 'file':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-600/50 to-slate-700/50 rounded-2xl border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <File className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{message.fileName}</p>
                {message.fileSize && (
                  <p className="text-xs text-slate-400 mt-1">
                    {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
              <button
                onClick={() => window.open(message.fileUrl, '_blank')}
                className="p-2 hover:bg-slate-600/50 rounded-xl transition-all duration-200 hover:scale-105"
                title="Download file"
              >
                <Download className="w-5 h-5 text-slate-300" />
              </button>
            </div>
            {message.content && (
              <p className="text-sm leading-relaxed">{message.content}</p>
            )}
          </div>
        );
      
      default:
        return <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>;
    }
  };

  const renderMessageStatus = (message: Message) => {
    if (message.senderId !== user?.id) return null;

    return (
      <div className="flex items-center gap-1 ml-2">
        {message.read ? (
          <CheckCheck className="w-3 h-3 text-blue-400" />
        ) : (
          <Check className="w-3 h-3 text-slate-400" />
        )}
      </div>
    );
  };

  if (!currentConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-400 font-medium">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Messages Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium">
              {currentConversation?.artisanImage ? (
                <img 
                  src={currentConversation.artisanImage} 
                  alt={currentConversation.artisanName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                currentConversation?.artisanName.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {currentConversation?.artisanName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentConversation?.projectTitle || 'Direct message'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === user?.id;
            const isEditing = editingMessageId === message.id;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {/* Message Bubble */}
                  <div className="relative group">
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-blue-500 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:border-blue-300 dark:focus:border-blue-500"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingMessageId(null);
                                setEditContent('');
                              }}
                              className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-xs hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          {message.fileUrl && (
                            <div className="mt-2">
                              {message.messageType === 'image' ? (
                                <img
                                  src={message.fileUrl}
                                  alt="Shared image"
                                  className="max-w-full rounded-md"
                                />
                              ) : (
                                <a
                                  href={message.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                >
                                  <Paperclip className="w-4 h-4" />
                                  {message.fileName || 'Download file'}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Message Info */}
                    <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                      {isOwnMessage && (
                        <div className="flex items-center gap-1">
                          {message.read ? (
                            <CheckCheck className="w-3 h-3 text-blue-500" />
                          ) : (
                            <Check className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Message Actions */}
                    {!isEditing && (
                      <div className={`absolute top-0 ${isOwnMessage ? '-left-12' : '-right-12'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <div className="flex gap-1">
                          {isOwnMessage && (
                            <>
                              <button
                                onClick={() => handleEdit(message)}
                                className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                title="Edit message"
                              >
                                <Edit className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                              </button>
                              <button
                                onClick={() => deleteMessage(message.id)}
                                className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Delete message"
                              >
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setReplyToMessage(message)}
                            className="p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            title="Reply to message"
                          >
                            <Reply className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reply Preview */}
                  {replyToMessage?.id === message.id && (
                    <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md border-l-2 border-blue-500">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Replying to {replyToMessage.senderName}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                        {replyToMessage.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
