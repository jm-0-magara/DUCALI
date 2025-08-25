import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock, Star, MessageSquare, CreditCard, Shield, Users, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function AdminNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [showRead, setShowRead] = useState(true);

  useEffect(() => {
    // Load mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'New Artisan Registration',
        message: 'Maria Rodriguez has registered as an artisan and requires verification.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        priority: 'high',
        action: {
          label: 'Review',
          onClick: () => console.log('Review artisan')
        }
      },
      {
        id: '2',
        type: 'success',
        title: 'Order Completed',
        message: 'Order #1234 has been completed successfully.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: false,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'info',
        title: 'System Update',
        message: 'Platform maintenance completed successfully.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        read: true,
        priority: 'low'
      },
      {
        id: '4',
        type: 'error',
        title: 'Payment Failed',
        message: 'Payment for order #5678 failed. Please review the transaction.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        read: false,
        priority: 'urgent'
      },
      {
        id: '5',
        type: 'success',
        title: 'New Customer Signup',
        message: 'John Doe has joined the platform as a customer.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        read: true,
        priority: 'low'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
    setLoading(false);
  }, []);

  const handleMarkAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleDeleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    setUnreadCount(prev => {
      const notification = notifications.find(n => n.id === notificationId);
      return notification && !notification.read ? Math.max(0, prev - 1) : prev;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  }).filter(notification => {
    if (!showRead && notification.read) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-slate-gray mt-2">Manage system notifications and alerts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 bg-accent-gold text-charcoal-black rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-gold/90 transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card/20 rounded-xl p-4 border border-border/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-gray text-sm">Total</p>
              <p className="text-white text-2xl font-bold">{notifications.length}</p>
            </div>
            <Bell className="w-8 h-8 text-accent-gold" />
          </div>
        </div>
        
        <div className="bg-card/20 rounded-xl p-4 border border-border/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-gray text-sm">Unread</p>
              <p className="text-white text-2xl font-bold">{unreadCount}</p>
            </div>
            <EyeOff className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-card/20 rounded-xl p-4 border border-border/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-gray text-sm">Read</p>
              <p className="text-white text-2xl font-bold">{notifications.length - unreadCount}</p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-card/20 rounded-xl p-4 border border-border/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-gray text-sm">Urgent</p>
              <p className="text-white text-2xl font-bold">
                {notifications.filter(n => n.priority === 'urgent' && !n.read).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
          className="px-4 py-2 bg-slate-gray/3 border border-slate-gray/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-gold/20"
        >
          <option value="all">All Notifications</option>
          <option value="unread">Unread Only</option>
          <option value="read">Read Only</option>
        </select>
        
        <label className="flex items-center gap-2 text-white">
          <input
            type="checkbox"
            checked={showRead}
            onChange={(e) => setShowRead(e.target.checked)}
            className="w-4 h-4 text-accent-gold bg-slate-gray/3 border-slate-gray/10 rounded focus:ring-accent-gold/20"
          />
          Show Read
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-slate-gray mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No notifications</h3>
            <p className="text-slate-gray">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-card/20 rounded-xl p-4 border border-border/5 transition-all duration-200 ${
                notification.read ? 'opacity-75' : 'ring-2 ring-accent-gold/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{notification.title}</h3>
                      <p className="text-slate-gray mt-1">{notification.message}</p>
                      
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-slate-gray text-sm flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeAgo(notification.timestamp)}
                        </span>
                        
                        <span className={`text-sm font-medium ${getPriorityColor(notification.priority)}`}>
                          {notification.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {notification.action && (
                        <button
                          onClick={notification.action.onClick}
                          className="px-3 py-1 bg-accent-gold text-charcoal-black rounded-lg text-sm font-medium hover:bg-accent-gold/90 transition-colors"
                        >
                          {notification.action.label}
                        </button>
                      )}
                      
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-slate-gray hover:text-white hover:bg-slate-gray/5 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 text-slate-gray hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
                        title="Delete notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
