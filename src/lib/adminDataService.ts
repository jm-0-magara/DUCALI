import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';

export interface AdminStats {
  totalUsers: number;
  totalArtisans: number;
  totalOrders: number;
  totalRevenue: number;
  pendingVerifications: number;
  activeOrders: number;
  averageRating: number;
  newUsersThisWeek: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  time: string;
  status: string;
  userId?: string;
  orderId?: string;
  timestamp?: Timestamp;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'artisan' | 'admin';
  isVerified: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  status: 'active' | 'suspended' | 'pending';
}

export interface Order {
  id: string;
  customerId: string;
  artisanId: string;
  totalAmount: number;
  status: 'pending' | 'active' | 'processing' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class AdminDataService {
  private db = db;

  async getStats(): Promise<AdminStats> {
    if (!this.db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      // Fetch users count
      const usersSnapshot = await getDocs(collection(this.db, 'users'));
      const totalUsers = usersSnapshot.size;

      // Fetch artisans count
      const artisansSnapshot = await getDocs(
        query(collection(this.db, 'users'), where('role', '==', 'artisan'))
      );
      const totalArtisans = artisansSnapshot.size;

      // Fetch orders count and revenue
      const ordersSnapshot = await getDocs(collection(this.db, 'orders'));
      const totalOrders = ordersSnapshot.size;
      let totalRevenue = 0;
      let activeOrders = 0;
      
      ordersSnapshot.forEach(doc => {
        const order = doc.data() as Order;
        totalRevenue += order.totalAmount || 0;
        if (order.status === 'active' || order.status === 'processing') {
          activeOrders++;
        }
      });

      // Fetch pending verifications
      const pendingVerificationsSnapshot = await getDocs(
        query(
          collection(this.db, 'users'), 
          where('role', '==', 'artisan'), 
          where('isVerified', '==', false)
        )
      );
      const pendingVerifications = pendingVerificationsSnapshot.size;

      // Calculate new users this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const newUsersSnapshot = await getDocs(
        query(
          collection(this.db, 'users'), 
          where('createdAt', '>=', Timestamp.fromDate(oneWeekAgo))
        )
      );
      const newUsersThisWeek = newUsersSnapshot.size;

      return {
        totalUsers,
        totalArtisans,
        totalOrders,
        totalRevenue,
        pendingVerifications,
        activeOrders,
        averageRating: 4.6, // TODO: Calculate from reviews
        newUsersThisWeek
      };
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      throw error;
    }
  }

  subscribeToActivities(callback: (activities: ActivityItem[]) => void) {
    if (!this.db) {
      console.error('Firebase database not initialized');
      return () => {};
    }

    const activityQuery = query(
      collection(this.db, 'activities'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    return onSnapshot(activityQuery, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: this.formatTimeAgo(doc.data().timestamp?.toDate())
      })) as ActivityItem[];
      
      callback(activities);
    });
  }

  async getUsers(): Promise<User[]> {
    if (!this.db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const usersSnapshot = await getDocs(collection(this.db, 'users'));
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getOrders(): Promise<Order[]> {
    if (!this.db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const ordersSnapshot = await getDocs(collection(this.db, 'orders'));
      return ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, status: 'active' | 'suspended' | 'pending'): Promise<void> {
    if (!this.db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, { status });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async verifyArtisan(userId: string): Promise<void> {
    if (!this.db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const userRef = doc(this.db, 'users', userId);
      await updateDoc(userRef, { isVerified: true });
    } catch (error) {
      console.error('Error verifying artisan:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    if (!this.db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const userRef = doc(this.db, 'users', userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  private formatTimeAgo(date: Date | undefined): string {
    if (!date) return 'Unknown time';
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
}

export const adminDataService = new AdminDataService();
