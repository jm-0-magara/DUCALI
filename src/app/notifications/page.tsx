"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService, Notification } from '../../lib/notificationService';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../components/Footer';

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const userNotifications = await notificationService.getUserNotifications(user.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(unreadNotifications.map(n => notificationService.markAsRead(n.id)));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read first
      if (!notification.read) {
        await markAsRead(notification.id);
      }

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

      toast.success('Navigating to relevant page...');
    } catch (error) {
      console.error('Error handling notification click:', error);
      toast.error('Failed to navigate to notification');
    }
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

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Sign in to view notifications
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Please sign in to access your notifications.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Notifications
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Stay updated with your latest activities
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
              className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
            
            {/* Mark all as read */}
            {notifications.some(n => !n.read) && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {filter === 'all' 
                  ? "You don't have any notifications yet."
                  : `No ${filter} notifications found.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-500/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-lg ${getNotificationColor(notification.type)}`}>
                            {notification.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mt-2">
                            {notification.message}
                          </p>
                          <p className="text-slate-500 dark:text-slate-500 text-sm mt-3">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
