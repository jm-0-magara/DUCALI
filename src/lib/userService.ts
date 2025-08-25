import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  doc,
  getDoc
} from 'firebase/firestore';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'artisan' | 'admin';
  profileImage?: string;
  phone?: string;
  location?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified?: boolean;
  status?: 'active' | 'suspended' | 'banned';
}

class UserService {
  private usersCollection = 'users';

  // Get all users
  async getUsers(limitCount: number = 100): Promise<User[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.usersCollection),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as User[];
    } catch (error) {
      console.error('Error getting users:', error);
      // Fallback to getting users without ordering
      try {
        if (!db) throw new Error('Database not initialized');
        const q = query(
          collection(db, this.usersCollection),
          limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as User[];
      } catch (fallbackError) {
        console.error('Fallback error getting users:', fallbackError);
        return [];
      }
    }
  }

  // Get users by role
  async getUsersByRole(role: 'customer' | 'artisan' | 'admin'): Promise<User[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      // Get all users and filter by role client-side to avoid index issues
      const q = query(
        collection(db, this.usersCollection),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const allUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as User[];

      // Filter by role client-side
      return allUsers.filter(user => user.role === role);
    } catch (error) {
      console.error('Error getting users by role:', error);
      // Fallback to getting all users without filtering
      try {
        if (!db) throw new Error('Database not initialized');
        const q = query(collection(db, this.usersCollection));
        const querySnapshot = await getDocs(q);
        const allUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as User[];
        return allUsers.filter(user => user.role === role);
      } catch (fallbackError) {
        console.error('Fallback error getting users by role:', fallbackError);
        return [];
      }
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<User | null> {
    try {
      if (!db) throw new Error('Database not initialized');

      const userDoc = await getDoc(doc(db, this.usersCollection, userId));
      
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();
      return {
        id: userDoc.id,
        ...userData,
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date()
      } as User;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Search users by name or email
  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      // Get all users and filter client-side since Firestore doesn't support full-text search
      const users = await this.getUsers(1000);
      
      return users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Get active users only
  async getActiveUsers(): Promise<User[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      // First try to get all users and filter client-side to avoid index issues
      const q = query(
        collection(db, this.usersCollection),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const allUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as User[];

      // Filter for active users client-side
      return allUsers.filter(user => 
        user.status === 'active' || user.status === undefined || user.status === null
      );
    } catch (error) {
      console.error('Error getting active users:', error);
      // Fallback to getting all users without filtering
      try {
        if (!db) throw new Error('Database not initialized');
        const q = query(collection(db, this.usersCollection));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date()
        })) as User[];
      } catch (fallbackError) {
        console.error('Fallback error getting users:', fallbackError);
        return [];
      }
    }
  }
}

export const userService = new UserService();
