"use client";

import React, { useState } from 'react';
import { MessageCircle, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useMessaging } from '../../contexts/MessagingContext';
import MessagingInterface from './index';

interface MessageButtonProps {
  artisanId?: string;
  artisanName?: string;
  artisanImage?: string;
  initialMessage?: string;
  orderId?: string;
  projectTitle?: string;
  variant?: 'button' | 'icon' | 'floating';
  className?: string;
  children?: React.ReactNode;
}

export default function MessageButton({
  artisanId,
  artisanName,
  artisanImage,
  initialMessage,
  orderId,
  projectTitle,
  variant = 'button',
  className = '',
  children
}: MessageButtonProps) {
  const { isAuthenticated } = useAuth();
  const { notifications } = useMessaging();
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  const unreadCount = notifications.length;

  const handleClick = () => {
    if (!isAuthenticated) {
      // You could trigger a sign-in modal here
      alert('Please sign in to send messages');
      return;
    }
    setIsMessagingOpen(true);
  };

  const renderButton = () => {
    switch (variant) {
      case 'icon':
        return (
          <button
            onClick={handleClick}
            className={`relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors ${className}`}
            title="Messages"
          >
            <MessageCircle className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        );

      case 'floating':
        return (
          <button
            onClick={handleClick}
            className={`fixed bottom-6 right-6 w-14 h-14 bg-[#A4B465] text-white rounded-full shadow-lg hover:bg-[#626F47] transition-colors z-40 ${className}`}
            title="Messages"
          >
            <div className="relative">
              <MessageCircle className="w-6 h-6 mx-auto" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </button>
        );

      default:
        return (
          <button
            onClick={handleClick}
            className={`relative inline-flex items-center gap-2 px-4 py-2 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors ${className}`}
          >
            <MessageCircle className="w-4 h-4" />
            {children || 'Message'}
            {unreadCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        );
    }
  };

  return (
    <>
      {renderButton()}
      
      <MessagingInterface
        isOpen={isMessagingOpen}
        onClose={() => setIsMessagingOpen(false)}
        initialArtisanId={artisanId}
        initialArtisanName={artisanName}
        initialArtisanImage={artisanImage}
        initialMessage={initialMessage}
        orderId={orderId}
        projectTitle={projectTitle}
      />
    </>
  );
}
