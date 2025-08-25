"use client";

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../lib/notificationService';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../components/Footer';

export default function TestNotificationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const testNotification = async (type: string) => {
    if (!user?.id) {
      toast.error('Please log in to test notifications');
      return;
    }

    setLoading(true);
    try {
      switch (type) {
        case 'payment_success':
          await notificationService.sendPaymentSuccessNotification(user.id, {
            amount: 5000,
            currency: 'KES',
            paymentMethod: 'M-Pesa',
            orderId: 'test-order-123'
          });
          toast.success('Payment success notification sent!');
          break;

        case 'quote_accepted':
          await notificationService.sendQuoteAcceptedNotification(user.id, {
            quoteId: 'test-quote-456',
            customerName: 'Test Customer',
            projectTitle: 'Test Project',
            amount: 3000,
            currency: 'KES'
          });
          toast.success('Quote accepted notification sent!');
          break;

        case 'order_started':
          await notificationService.sendOrderStartedNotification(user.id, {
            orderId: 'test-order-789',
            artisanName: 'Test Artisan',
            projectTitle: 'Test Project'
          });
          toast.success('Order started notification sent!');
          break;

        case 'order_completed':
          await notificationService.sendOrderCompletedNotification(user.id, {
            orderId: 'test-order-789',
            artisanName: 'Test Artisan',
            projectTitle: 'Test Project'
          });
          toast.success('Order completed notification sent!');
          break;

        default:
          toast.error('Unknown notification type');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h1 className="text-3xl font-bold text-white mb-6">
              Notification System Test
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Test Notifications</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => testNotification('payment_success')}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Send Payment Success Notification
                  </button>
                  
                  <button
                    onClick={() => testNotification('quote_accepted')}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Send Quote Accepted Notification
                  </button>
                  
                  <button
                    onClick={() => testNotification('order_started')}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Send Order Started Notification
                  </button>
                  
                  <button
                    onClick={() => testNotification('order_completed')}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    Send Order Completed Notification
                  </button>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Instructions</h3>
                <div className="text-slate-300 space-y-2 text-sm">
                  <p>1. Click any button to send a test notification</p>
                  <p>2. Check the notification bell in the header</p>
                  <p>3. You should see the notification appear in real-time</p>
                  <p>4. Try marking notifications as read</p>
                  <p>5. Test the "Mark all as read" functionality</p>
                </div>
                
                <div className="mt-4 p-3 bg-slate-600 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Current User:</h4>
                  <p className="text-slate-300 text-sm">
                    {user ? `${user.name} (${user.email})` : 'Not logged in'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-700 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">System Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300">Firebase Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300">Toast System Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300">Real-time Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-slate-300">Notification Bell</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
