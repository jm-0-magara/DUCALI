import { db } from './firebase';
import { 
  collection, 

  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

export interface Notification {
  id: string;
  userId: string;
  type: 'payment_success' | 'payment_failed' | 'payment_received' | 'quote_accepted' | 'quote_declined' | 'order_started' | 'order_completed' | 'order_rejected';
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
  updatedAt: Date;
}

export interface CreateNotificationData {
  userId: string;
  type: Notification['type'];
  title: string;
  message: string;
  data?: any;
}

class NotificationService {
  // Create a new notification
  async createNotification(data: CreateNotificationData): Promise<string> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const notificationData = {
        ...data,
        read: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'notifications'), notificationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        read: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, {
          read: true,
          updatedAt: serverTimestamp(),
        });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  // Get notification by ID
  async getNotification(notificationId: string): Promise<Notification | null> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const docRef = doc(db, 'notifications', notificationId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Notification;
      }

      return null;
    } catch (error) {
      console.error('Error getting notification:', error);
      throw new Error('Failed to get notification');
    }
  }

  // Get user notifications
  async getUserNotifications(userId: string): Promise<Notification[]> {
    if (!db) {
      console.warn('Firebase not properly initialized, returning empty notifications');
      return [];
    }

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notifications: Notification[] = [];
      
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
        } as Notification);
      });
      
      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  // Get unread notifications count
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    if (!db) {
      console.warn('Firebase not properly initialized, returning empty notifications');
      return [];
    }

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const notifications: Notification[] = [];
      
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
        } as Notification);
      });
      
      return notifications;
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  // Subscribe to notifications
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      return onSnapshot(q, (querySnapshot) => {
        const notifications: Notification[] = [];
        querySnapshot.forEach((doc) => {
          notifications.push({
            id: doc.id,
            ...doc.data(),
          } as Notification);
        });
        callback(notifications);
      }, (error) => {
        console.error('Firestore subscription error:', error);
        // Return empty notifications on error to prevent UI crashes
        callback([]);
      });
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      // Return empty notifications on error to prevent UI crashes
      callback([]);
      return () => {}; // Return empty unsubscribe function
    }
  }

  // Send payment success notification
  async sendPaymentSuccessNotification(userId: string, paymentData: {
    amount: number;
    currency: string;
    paymentMethod: string;
    orderId: string;
  }): Promise<string> {
    return this.createNotification({
      userId,
      type: 'payment_success',
      title: 'Payment Successful!',
      message: `Your payment of ${paymentData.amount} ${paymentData.currency} has been processed successfully. Your order is now confirmed.`,
      data: paymentData,
    });
  }

  // Send payment failed notification
  async sendPaymentFailedNotification(userId: string, paymentData: {
    amount: number;
    currency: string;
    paymentMethod: string;
    error: string;
  }): Promise<string> {
    return this.createNotification({
      userId,
      type: 'payment_failed',
      title: 'Payment Failed',
      message: `Your payment of ${paymentData.amount} ${paymentData.currency} failed. Please try again or contact support.`,
      data: paymentData,
    });
  }

  // Send quote accepted notification to artisan
  async sendQuoteAcceptedNotification(artisanId: string, quoteData: {
    quoteId: string;
    customerName: string;
    projectTitle: string;
    amount: number;
    currency: string;
    orderId?: string;
  }): Promise<string> {
    return this.createNotification({
      userId: artisanId,
      type: 'quote_accepted',
      title: 'Quote Accepted!',
      message: `${quoteData.customerName} has accepted your quote for "${quoteData.projectTitle}" (${quoteData.amount} ${quoteData.currency}). You can now start working on the project.`,
      data: quoteData,
    });
  }

  // Send quote declined notification to artisan
  async sendQuoteDeclinedNotification(artisanId: string, quoteData: {
    quoteId: string;
    customerName: string;
    projectTitle: string;
  }): Promise<string> {
    return this.createNotification({
      userId: artisanId,
      type: 'quote_declined',
      title: 'Quote Declined',
      message: `${quoteData.customerName} has declined your quote for "${quoteData.projectTitle}". Don't worry, you'll get more opportunities!`,
      data: quoteData,
    });
  }

  // Send order started notification to customer
  async sendOrderStartedNotification(customerId: string, orderData: {
    orderId: string;
    artisanName: string;
    projectTitle: string;
  }): Promise<string> {
    return this.createNotification({
      userId: customerId,
      type: 'order_started',
      title: 'Work Started!',
      message: `${orderData.artisanName} has started working on your project "${orderData.projectTitle}". You'll receive updates on the progress.`,
      data: orderData,
    });
  }

  // Send order completed notification to customer
  async sendOrderCompletedNotification(customerId: string, orderData: {
    orderId: string;
    artisanName: string;
    projectTitle: string;
  }): Promise<string> {
    return this.createNotification({
      userId: customerId,
      type: 'order_completed',
      title: 'Project Completed!',
      message: `${orderData.artisanName} has completed your project "${orderData.projectTitle}". Please review and approve the work.`,
      data: orderData,
    });
  }

  // Send order created notification to customer
  async sendOrderCreatedNotification(customerId: string, orderData: {
    orderId: string;
    projectTitle: string;
    amount: number;
    currency: string;
    artisanId: string;
  }): Promise<string> {
    return this.createNotification({
      userId: customerId,
      type: 'order_started',
      title: 'Order Created!',
      message: `Your order for "${orderData.projectTitle}" (${orderData.amount} ${orderData.currency}) has been created successfully. The artisan will start working on your project soon.`,
      data: orderData,
    });
  }

  // Send M-Pesa payment confirmation
  async sendMpesaPaymentConfirmation(userId: string, paymentData: {
    amount: number;
    phoneNumber: string;
    transactionId: string;
    orderId: string;
  }): Promise<string> {
    return this.createNotification({
      userId,
      type: 'payment_success',
      title: 'M-Pesa Payment Confirmed!',
      message: `Your M-Pesa payment of ${paymentData.amount} KES has been confirmed. Transaction ID: ${paymentData.transactionId}. Your order is now active.`,
      data: paymentData,
    });
  }

  // Send Stripe payment confirmation
  async sendStripePaymentConfirmation(userId: string, paymentData: {
    amount: number;
    currency: string;
    paymentIntentId: string;
    orderId: string;
  }): Promise<string> {
    return this.createNotification({
      userId,
      type: 'payment_success',
      title: 'Card Payment Confirmed!',
      message: `Your card payment of ${paymentData.amount} ${paymentData.currency} has been confirmed. Payment Intent: ${paymentData.paymentIntentId}. Your order is now active.`,
      data: paymentData,
    });
  }
}

export const notificationService = new NotificationService();
