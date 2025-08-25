import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';

export interface ArtisanStats {
  totalOrders: number;
  activeOrders: number;
  totalEarnings: number;
  avgRating: number;
  completionRate: number;
  responseTime: string;
  totalReviews: number;
  portfolioCount: number;
}

export interface ArtisanOrder {
  id: string;
  customerId: string;
  customerName: string;
  service: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  orderDate: Date;
  deadline: Date;
  price: number;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtisanPortfolioItem {
  id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  category: string;
  price?: number | null;
  timeframe?: string | null;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtisanMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'artisan' | 'admin';
  content: string;
  read: boolean;
  createdAt: Date;
  orderId?: string;
}

class ArtisanDataService {
  private ordersCollection = 'orders';
  private portfolioCollection = 'portfolio';
  private messagesCollection = 'messages';
  private reviewsCollection = 'reviews';

  // Get artisan statistics
  async getArtisanStats(artisanId: string): Promise<ArtisanStats> {
    try {
      if (!db) throw new Error('Database not initialized');

      // Get orders for this artisan
      const ordersQuery = query(
        collection(db, this.ordersCollection),
        where('artisanId', '==', artisanId)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      
      let totalOrders = 0;
      let activeOrders = 0;
      let totalEarnings = 0;
      let completedOrders = 0;

      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        totalOrders++;
        if (order.status === 'in_progress' || order.status === 'pending') {
          activeOrders++;
        }
        if (order.status === 'completed') {
          completedOrders++;
        }
        if (order.price) {
          totalEarnings += order.price;
        }
      });

      // Get reviews for this artisan
      const reviewsQuery = query(
        collection(db, this.reviewsCollection),
        where('artisanId', '==', artisanId)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      
      let totalRating = 0;
      let reviewCount = 0;
      reviewsSnapshot.forEach(doc => {
        const review = doc.data();
        if (review.rating) {
          totalRating += review.rating;
          reviewCount++;
        }
      });

      // Get portfolio count
      const portfolioQuery = query(
        collection(db, this.portfolioCollection),
        where('artisanId', '==', artisanId)
      );
      const portfolioSnapshot = await getDocs(portfolioQuery);

      const avgRating = reviewCount > 0 ? totalRating / reviewCount : 0;
      const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

      return {
        totalOrders,
        activeOrders,
        totalEarnings,
        avgRating: Math.round(avgRating * 10) / 10,
        completionRate: Math.round(completionRate),
        responseTime: '2 hours', // This would be calculated from actual response times
        totalReviews: reviewCount,
        portfolioCount: portfolioSnapshot.size
      };
    } catch (error) {
      console.error('Error getting artisan stats:', error);
      // Return fallback data
      return {
        totalOrders: 0,
        activeOrders: 0,
        totalEarnings: 0,
        avgRating: 0,
        completionRate: 0,
        responseTime: 'N/A',
        totalReviews: 0,
        portfolioCount: 0
      };
    }
  }

  // Get artisan orders
  async getArtisanOrders(artisanId: string, limitCount: number = 10): Promise<ArtisanOrder[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      // First try with the composite index
      try {
        const q = query(
          collection(db, this.ordersCollection),
          where('artisanId', '==', artisanId),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          orderDate: doc.data().orderDate?.toDate() || new Date(),
          deadline: doc.data().deadline?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as ArtisanOrder[];
      } catch (indexError) {
        // If index doesn't exist, fall back to client-side filtering
        console.warn('Composite index not found, using client-side filtering:', indexError);
        
        const q = query(
          collection(db, this.ordersCollection),
          where('artisanId', '==', artisanId)
        );

        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          orderDate: doc.data().orderDate?.toDate() || new Date(),
          deadline: doc.data().deadline?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as ArtisanOrder[];
        
        // Sort client-side and limit
        return orders
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limitCount);
      }
    } catch (error) {
      console.error('Error getting artisan orders:', error);
      return [];
    }
  }

  // Get artisan portfolio items
  async getArtisanPortfolio(artisanId: string): Promise<ArtisanPortfolioItem[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      // First try with the composite index
      try {
        const q = query(
          collection(db, this.portfolioCollection),
          where('artisanId', '==', artisanId),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as ArtisanPortfolioItem[];
      } catch (indexError) {
        // If index doesn't exist, fall back to client-side filtering
        console.warn('Composite index not found for portfolio, using client-side filtering:', indexError);
        
        const q = query(
          collection(db, this.portfolioCollection),
          where('artisanId', '==', artisanId)
        );

        const querySnapshot = await getDocs(q);
        const portfolio = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as ArtisanPortfolioItem[];
        
        // Sort client-side
        return portfolio.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
    } catch (error) {
      console.error('Error getting artisan portfolio:', error);
      return [];
    }
  }

  // Add portfolio item
  async addPortfolioItem(artisanId: string, item: Omit<ArtisanPortfolioItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      if (!db) throw new Error('Database not initialized');

      // Filter out undefined values to prevent Firebase errors
      const cleanItem = Object.fromEntries(
        Object.entries(item).filter(([_, value]) => value !== undefined)
      );

      const docRef = await addDoc(collection(db, this.portfolioCollection), {
        ...cleanItem,
        artisanId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      throw error;
    }
  }

  // Update portfolio item
  async updatePortfolioItem(itemId: string, updates: Partial<ArtisanPortfolioItem>): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      // Filter out undefined values to prevent Firebase errors
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );

      await updateDoc(doc(db, this.portfolioCollection, itemId), {
        ...cleanUpdates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  }

  // Delete portfolio item
  async deletePortfolioItem(itemId: string): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      await deleteDoc(doc(db, this.portfolioCollection, itemId));
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
  }

  // Get artisan messages
  async getArtisanMessages(artisanId: string, limitCount: number = 20): Promise<ArtisanMessage[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      // First try with the composite index
      try {
        const q = query(
          collection(db, this.messagesCollection),
          where('recipientId', '==', artisanId),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as ArtisanMessage[];
      } catch (indexError) {
        // If index doesn't exist, fall back to client-side filtering
        console.warn('Composite index not found for messages, using client-side filtering:', indexError);
        
        const q = query(
          collection(db, this.messagesCollection),
          where('recipientId', '==', artisanId)
        );

        const querySnapshot = await getDocs(q);
        const messages = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as ArtisanMessage[];
        
        // Sort and limit client-side
        return messages
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice(0, limitCount);
      }
    } catch (error) {
      console.error('Error getting artisan messages:', error);
      return [];
    }
  }

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      await updateDoc(doc(db, this.messagesCollection, messageId), {
        read: true,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  // Subscribe to real-time updates for artisan stats
  subscribeToArtisanStats(artisanId: string, callback: (stats: ArtisanStats) => void): () => void {
    if (!db) {
      console.error('Database not initialized');
      return () => {};
    }

    // For now, we'll use a simple interval to simulate real-time updates
    // In a real implementation, you'd use onSnapshot for Firestore
    const interval = setInterval(async () => {
      try {
        const stats = await this.getArtisanStats(artisanId);
        callback(stats);
      } catch (error) {
        console.error('Error in stats subscription:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }

  // Subscribe to real-time updates for orders
  subscribeToOrders(artisanId: string, callback: (orders: ArtisanOrder[]) => void): () => void {
    if (!db) {
      console.error('Database not initialized');
      return () => {};
    }

    // Create query without orderBy first to avoid index errors
    const q = query(
      collection(db, this.ordersCollection),
      where('artisanId', '==', artisanId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        orderDate: doc.data().orderDate?.toDate() || new Date(),
        deadline: doc.data().deadline?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as ArtisanOrder[];
      
      // Sort client-side to avoid index requirements
      orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      callback(orders);
    }, (error) => {
      console.error('Error in orders subscription:', error);
    });

    return unsubscribe;
  }
}

export const artisanDataService = new ArtisanDataService();
