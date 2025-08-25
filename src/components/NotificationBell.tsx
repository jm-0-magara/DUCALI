"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'payment_success' | 'payment_failed' | 'quote_accepted' | 'quote_declined' | 'order_started' | 'order_completed';
  title: string;
  message: string;
  data?: {
    orderId?: string;
    quoteId?: string;
    artisanId?: string;
    customerId?: string;
    amount?: number;
    [key: string]: any;
  };
  read: boolean;
  createdAt: Date;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      // Load mock notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'payment_success',
          title: 'Payment Successful',
          message: 'Your payment of KSH 5,000 has been processed successfully.',
          data: { orderId: 'order-123', amount: 5000 },
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 30)
        },
        {
          id: '2',
          type: 'quote_accepted',
          title: 'Quote Accepted',
          message: 'Your quote for "Custom Leather Bag" has been accepted.',
          data: { quoteId: 'quote-456' },
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60)
        },
        {
          id: '3',
          type: 'order_started',
          title: 'Order Started',
          message: 'Work has begun on your order #789.',
          data: { orderId: 'order-789' },
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [user?.id]);

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read first
      if (!notification.read) {
        await markAsRead(notification.id);
      }

      // Close the notification dropdown
      setIsOpen(false);

      // Navigate based on notification type and data
      switch (notification.type) {
        case 'payment_success':
        case 'payment_failed':
          // Navigate to specific order if available
          if (notification.data?.orderId) {
            if (user?.role === 'admin') {
              router.push('/dashboard/admin?tab=overview');
            } else {
              router.push(`/dashboard?tab=orders&orderId=${notification.data.orderId}`);
            }
          } else {
            // Navigate to orders or dashboard
            if (user?.role === 'customer') {
              router.push('/dashboard?tab=orders');
            } else if (user?.role === 'artisan') {
              router.push('/dashboard?tab=orders');
            } else if (user?.role === 'admin') {
              router.push('/dashboard/admin?tab=overview');
            }
          }
          break;

        case 'quote_accepted':
        case 'quote_declined':
          // Navigate to specific quote if available
          if (notification.data?.quoteId) {
            if (user?.role === 'admin') {
              router.push('/dashboard/admin?tab=overview');
            } else {
              router.push(`/quotes?quoteId=${notification.data.quoteId}`);
            }
          } else {
            // Navigate to quotes page
            if (user?.role === 'admin') {
              router.push('/dashboard/admin?tab=overview');
            } else {
              router.push('/quotes');
            }
          }
          break;

        case 'order_started':
        case 'order_completed':
          // Navigate to specific order if available
          if (notification.data?.orderId) {
            if (user?.role === 'admin') {
              router.push('/dashboard/admin?tab=overview');
            } else {
              router.push(`/dashboard?tab=orders&orderId=${notification.data.orderId}`);
            }
          } else {
            // Navigate to orders
            if (user?.role === 'customer') {
              router.push('/dashboard?tab=orders');
            } else if (user?.role === 'artisan') {
              router.push('/dashboard?tab=orders');
            } else if (user?.role === 'admin') {
              router.push('/dashboard/admin?tab=overview');
            }
          }
          break;

        default:
          // Default to dashboard
          if (user?.role === 'admin') {
            router.push('/dashboard/admin?tab=overview');
          } else {
            router.push('/dashboard');
          }
          break;
      }

      // Show success toast
      toast.success('Navigating to relevant page...');
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error('Failed to navigate to notification');
    }
  };

  const handleViewAllNotifications = () => {
    setIsOpen(false);
    router.push('/notifications');
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'payment_success':
        return '💰';
      case 'payment_failed':
        return '❌';
      case 'quote_accepted':
        return '✅';
      case 'quote_declined':
        return '📝';
      case 'order_started':
        return '🚀';
      case 'order_completed':
        return '🎉';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'payment_success':
      case 'quote_accepted':
      case 'order_completed':
        return 'text-green-500';
      case 'payment_failed':
        return 'text-red-500';
      case 'quote_declined':
        return 'text-yellow-500';
      case 'order_started':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 dark:text-slate-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 ${
                      notification.read
                        ? 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                        : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-medium text-sm ${getNotificationColor(notification.type)}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-slate-500 dark:text-slate-500 text-xs mt-2">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleViewAllNotifications}
                className="w-full text-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
