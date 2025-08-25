import { db } from './firebase';
import { collection, getDocs, query, where, orderBy, limit, Timestamp, doc, updateDoc, addDoc } from 'firebase/firestore';

// Type definitions for Firebase data
interface FirebaseUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ARTISAN' | 'ADMIN';
  verified?: boolean;
  createdAt: any; // Firestore Timestamp
  lastActive: any; // Firestore Timestamp
  location?: string;
  phone?: string;
  bio?: string;
  artisanProfile?: {
    specialty: string;
    category: string;
    rating?: number;
    totalOrders?: number;
    completedOrders?: number;
  };
}

interface FirebaseOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  artisanId: string;
  title: string;
  status: string;
  quotedPrice?: number;
  finalPrice?: number;
  currency?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

interface FirebaseReview {
  id: string;
  orderId: string;
  customerId: string;
  orderTitle?: string;
  createdAt: any; // Firestore Timestamp
}

export interface AdminStats {
  totalUsers: number;
  totalArtisans: number;
  totalCustomers: number;
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
  verifiedArtisans: number;
  unverifiedArtisans: number;
  recentActivity: any[];
  monthlyGrowth: {
    users: number;
    orders: number;
    revenue: number;
  };
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ARTISAN' | 'ADMIN';
  verified: boolean;
  createdAt: Date;
  lastActive: Date;
  location?: string;
  phone?: string;
  artisanProfile?: {
    specialty: string;
    category: string;
    rating: number;
    totalOrders: number;
    completedOrders: number;
  };
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  artisanName: string;
  title: string;
  status: string;
  quotedPrice: number;
  finalPrice: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminActivity {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  orderId?: string;
  status: string;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'customers' | 'artisans' | 'admins';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

class AdminDataService {
  async getStats(): Promise<AdminStats> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      // Get user statistics
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseUser[];
      
      const artisans = users.filter(user => user.role === 'ARTISAN');
      const customers = users.filter(user => user.role === 'CUSTOMER');
      const verifiedArtisans = artisans.filter(artisan => artisan.verified);
      const unverifiedArtisans = artisans.filter(artisan => !artisan.verified);

      // Get order statistics
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseOrder[];
      
      const activeOrders = orders.filter(order => 
        ['QUOTE_ACCEPTED', 'IN_PROGRESS', 'PENDING_REVIEW'].includes(order.status)
      );
      const completedOrders = orders.filter(order => order.status === 'COMPLETED');

      // Calculate total revenue in KSH
      const totalRevenue = orders
        .filter(order => order.finalPrice && order.status === 'COMPLETED')
        .reduce((sum, order) => {
          // Convert to KSH if not already in KSH
          const amountInKSH = this.convertToKSH(order.finalPrice!, order.currency || 'KES');
          return sum + amountInKSH;
        }, 0);

      // Get recent activity
      const recentActivity = await this.getRecentActivity();

      // Calculate monthly growth (simplified - you can enhance this)
      const currentMonth = new Date().getMonth();
      const lastMonth = new Date().getMonth() - 1;
      
      const currentMonthUsers = users.filter(user => {
        const userDate = user.createdAt?.toDate?.() || new Date(user.createdAt);
        return userDate.getMonth() === currentMonth;
      }).length;
      
      const lastMonthUsers = users.filter(user => {
        const userDate = user.createdAt?.toDate?.() || new Date(user.createdAt);
        return userDate.getMonth() === lastMonth;
      }).length;

      const currentMonthOrders = orders.filter(order => {
        const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth;
      }).length;
      
      const lastMonthOrders = orders.filter(order => {
        const orderDate = order.createdAt?.toDate?.() || new Date(order.createdAt);
        return orderDate.getMonth() === lastMonth;
      }).length;

      return {
        totalUsers: users.length,
        totalArtisans: artisans.length,
        totalCustomers: customers.length,
        totalOrders: orders.length,
        activeOrders: activeOrders.length,
        completedOrders: completedOrders.length,
        totalRevenue,
        pendingVerifications: unverifiedArtisans.length,
        verifiedArtisans: verifiedArtisans.length,
        unverifiedArtisans: unverifiedArtisans.length,
        recentActivity,
        monthlyGrowth: {
          users: currentMonthUsers - lastMonthUsers,
          orders: currentMonthOrders - lastMonthOrders,
          revenue: totalRevenue * 0.1, // Simplified growth calculation
        }
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  async getUsers(): Promise<AdminUser[]> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseUser[];

      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified || false,
        createdAt: user.createdAt?.toDate?.() || new Date(user.createdAt),
        lastActive: user.lastActive?.toDate?.() || new Date(user.lastActive),
        location: user.location || undefined,
        phone: user.phone || undefined,
        artisanProfile: user.artisanProfile ? {
          specialty: user.artisanProfile.specialty,
          category: user.artisanProfile.category,
          rating: user.artisanProfile.rating || 0,
          totalOrders: user.artisanProfile.totalOrders || 0,
          completedOrders: user.artisanProfile.completedOrders || 0,
        } : undefined,
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getOrders(): Promise<AdminOrder[]> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseOrder[];

      // Get user data for customer and artisan names
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseUser[];
      const userMap = new Map(users.map(user => [user.id, user]));

      return orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: userMap.get(order.customerId)?.name || 'Unknown Customer',
        artisanName: userMap.get(order.artisanId)?.name || 'Unknown Artisan',
        title: order.title,
        status: order.status,
        quotedPrice: order.quotedPrice || 0,
        finalPrice: order.finalPrice || 0,
        currency: order.currency || 'KES',
        createdAt: order.createdAt?.toDate?.() || new Date(order.createdAt),
        updatedAt: order.updatedAt?.toDate?.() || new Date(order.updatedAt),
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async getRecentActivity(): Promise<AdminActivity[]> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      // Get recent user registrations
      const recentUsersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentUsersSnapshot = await getDocs(recentUsersQuery);
      const recentUsers = recentUsersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseUser[];

      // Get recent orders
      const recentOrdersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
      const recentOrders = recentOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseOrder[];

      // Get recent reviews
      const recentReviewsQuery = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const recentReviewsSnapshot = await getDocs(recentReviewsQuery);
      const recentReviews = recentReviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseReview[];

      // Get user data for names
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseUser[];
      const userMap = new Map(users.map(user => [user.id, user]));

      const activities: AdminActivity[] = [];

      // Add user registrations
      recentUsers.forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user_registration',
          message: `New ${user.role?.toLowerCase() || 'user'} registered: ${user.name}`,
          userId: user.id,
          userName: user.name,
          timestamp: user.createdAt?.toDate?.() || new Date(user.createdAt),
          status: user.verified ? 'verified' : 'pending',
        });
      });

      // Add order activities
      recentOrders.forEach(order => {
        const customer = userMap.get(order.customerId);
        activities.push({
          id: `order-${order.id}`,
          type: 'order_created',
          message: `New order created: ${order.title}`,
          orderId: order.id,
          userName: customer?.name || 'Unknown Customer',
          timestamp: order.createdAt?.toDate?.() || new Date(order.createdAt),
          status: order.status?.toLowerCase() || 'pending',
        });
      });

      // Add review activities
      recentReviews.forEach(review => {
        const customer = userMap.get(review.customerId);
        activities.push({
          id: `review-${review.id}`,
          type: 'review_submitted',
          message: `Review submitted for order: ${review.orderTitle || 'Order'}`,
          orderId: review.orderId,
          userName: customer?.name || 'Unknown Customer',
          timestamp: review.createdAt?.toDate?.() || new Date(review.createdAt),
          status: 'completed',
        });
      });

      // Sort by timestamp and return top 10
      return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  async getPendingVerifications(): Promise<AdminUser[]> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      const unverifiedArtisansQuery = query(
        collection(db, 'users'),
        where('role', '==', 'ARTISAN'),
        where('verified', '==', false)
      );
      const unverifiedArtisansSnapshot = await getDocs(unverifiedArtisansQuery);
      const unverifiedArtisans = unverifiedArtisansSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseUser[];

      return unverifiedArtisans.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        verified: user.verified || false,
        createdAt: user.createdAt?.toDate?.() || new Date(user.createdAt),
        lastActive: user.lastActive?.toDate?.() || new Date(user.lastActive),
        location: user.location || undefined,
        phone: user.phone || undefined,
        artisanProfile: user.artisanProfile ? {
          specialty: user.artisanProfile.specialty,
          category: user.artisanProfile.category,
          rating: user.artisanProfile.rating || 0,
          totalOrders: user.artisanProfile.totalOrders || 0,
          completedOrders: user.artisanProfile.completedOrders || 0,
        } : undefined,
      }));
    } catch (error) {
      console.error('Error fetching pending verifications:', error);
      throw error;
    }
  }

  async verifyArtisan(artisanId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      await updateDoc(doc(db, 'users', artisanId), {
        verified: true,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error verifying artisan:', error);
      throw error;
    }
  }

  async rejectArtisan(artisanId: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      await updateDoc(doc(db, 'users', artisanId), {
        verified: false,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error rejecting artisan:', error);
      throw error;
    }
  }

  private convertToKSH(amount: number, currency: string): number {
    const exchangeRates: { [key: string]: number } = {
      'KES': 1,
      'USD': 150, // 1 USD = 150 KSH (approximate)
      'EUR': 165, // 1 EUR = 165 KSH (approximate)
      'GBP': 190, // 1 GBP = 190 KSH (approximate)
      'UGX': 0.04, // 1 KSH = 25 UGX
      'TZS': 0.06, // 1 KSH = 17.2 TZS
      'NGN': 0.09, // 1 KSH = 10.8 NGN
      'GHS': 11.8, // 1 KSH = 0.085 GHS
    };

    const rate = exchangeRates[currency] || 1;
    return amount * rate;
  }

  async getAnnouncements(): Promise<AdminAnnouncement[]> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      const announcementsQuery = query(
        collection(db, 'announcements'),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      const announcementsSnapshot = await getDocs(announcementsQuery);
      
      const announcements = announcementsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          type: data.type || 'info',
          priority: data.priority || 'medium',
          targetAudience: data.targetAudience || 'all',
          isActive: data.isActive,
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
          updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
          createdBy: data.createdBy || 'Admin'
        } as AdminAnnouncement;
      });

      return announcements;
    } catch (error) {
      console.error('Error fetching announcements:', error);
      // Return empty array if no announcements collection exists
      return [];
    }
  }

  async createAnnouncement(announcementData: {
    title: string;
    content: string;
    author: string;
    authorId: string;
    isPublished: boolean;
    priority: 'low' | 'medium' | 'high';
    targetAudience: 'all' | 'customers' | 'artisans' | 'admins';
  }): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      await addDoc(collection(db, 'announcements'), {
        title: announcementData.title,
        content: announcementData.content,
        type: 'info',
        priority: announcementData.priority,
        targetAudience: announcementData.targetAudience,
        isActive: announcementData.isPublished,
        isPublished: announcementData.isPublished,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: announcementData.author,
        authorId: announcementData.authorId
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  }

  async updateAnnouncement(id: string, updates: Partial<AdminAnnouncement>): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      await updateDoc(doc(db, 'announcements', id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  }

  async deleteAnnouncement(id: string): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      await updateDoc(doc(db, 'announcements', id), {
        isActive: false,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  }

  async getRevenueStats(timeRange: string = '30d'): Promise<any> {
    try {
      if (!db) {
        throw new Error('Firebase database not initialized');
      }

      const now = new Date();
      let startDate: Date;

      switch (timeRange) {
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      const ordersQuery = query(
        collection(db, 'orders'),
        where('status', '==', 'COMPLETED'),
        where('createdAt', '>=', Timestamp.fromDate(startDate))
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseOrder[];

      const totalRevenue = orders.reduce((sum, order) => {
        if (order.finalPrice) {
          const amountInKSH = this.convertToKSH(order.finalPrice, order.currency || 'KES');
          return sum + amountInKSH;
        }
        return sum;
      }, 0);

      const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

      return {
        totalRevenue,
        averageOrderValue,
        orderCount: orders.length,
        currency: 'KES',
      };
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      throw error;
    }
  }
}

export const adminDataService = new AdminDataService();
