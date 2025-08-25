import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

export interface Project {
  id: string;
  customerId: string;
  artisanId?: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string; // "1-2 weeks", "1 month", etc.
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  attachments?: string[];
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  deadline?: Date;
  tags?: string[];
}

export interface Order {
  id: string;
  projectId: string;
  customerId: string;
  artisanId: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  amount: number;
  currency: string;
  description: string;
  timeline: string;
  milestones?: Milestone[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  rating?: number;
  review?: string;
  paidAmount?: number;
  paymentHistory?: {
    amount: number;
    method: string;
    date: Date;
    transactionId?: string;
  }[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'completed';
  completedAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderType: 'customer' | 'artisan';
  content: string;
  attachments?: string[];
  timestamp: Date;
  read: boolean;
}

export interface CreateProjectData {
  customerId: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  location?: string;
  attachments?: string[];
  tags?: string[];
}

export interface CreateOrderData {
  projectId: string;
  customerId: string;
  artisanId: string;
  amount: number;
  currency: string;
  description: string;
  timeline: string;
  milestones?: Omit<Milestone, 'id' | 'status' | 'completedAt'>[];
}

class OrderService {
  // Create a new project
  async createProject(data: CreateProjectData): Promise<Project> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const projectData = {
        ...data,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'projects'), projectData);
      
      return {
        id: docRef.id,
        ...data,
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
  }

  // Get projects by customer
  async getCustomerProjects(customerId: string, status?: string): Promise<Project[]> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      let q = query(
        collection(db, 'projects'),
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );

      if (status) {
        q = query(q, where('status', '==', status));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Project[];
    } catch (error) {
      console.error('Error fetching customer projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  // Get available projects for artisans
  async getAvailableProjects(category?: string, limitCount = 20): Promise<Project[]> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      let q = query(
        collection(db, 'projects'),
        where('status', '==', 'published'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );

      if (category) {
        q = query(q, where('category', '==', category));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Project[];
    } catch (error) {
      console.error('Error fetching available projects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  // Create an order
  async createOrder(data: CreateOrderData): Promise<Order> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const orderData = {
        ...data,
        status: 'pending',
        messages: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      
      // Update project status
      await updateDoc(doc(db, 'projects', data.projectId), {
        status: 'in_progress',
        artisanId: data.artisanId,
        updatedAt: serverTimestamp(),
      });

      // Convert milestones to proper format
      const milestones = data.milestones?.map(milestone => ({
        ...milestone,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        status: 'pending' as const,
      })) || [];

      return {
        id: docRef.id,
        ...data,
        status: 'pending',
        messages: [],
        milestones,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  // Get orders by user
  async getUserOrders(userId: string, role: 'customer' | 'artisan'): Promise<Order[]> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const field = role === 'customer' ? 'customerId' : 'artisanId';
      
      // Simple query without orderBy to avoid index requirement
      const q = query(
        collection(db, 'orders'),
        where(field, '==', userId)
      );

      const snapshot = await getDocs(q);
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as Order[];

      // Sort in JavaScript instead of using orderBy
      return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status,
        updatedAt: serverTimestamp(),
        ...(status === 'completed' && { completedAt: serverTimestamp() }),
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  // Update order with custom data
  async updateOrder(orderId: string, updateData: Partial<Order>): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw new Error('Failed to update order');
    }
  }

  // Add message to order
  async addMessage(orderId: string, message: Omit<Message, 'id' | 'timestamp'>): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }

      const order = orderDoc.data() as Order;
      const newMessage: Message = {
        id: Date.now().toString(),
        ...message,
        timestamp: new Date(),
      };

      await updateDoc(orderRef, {
        messages: [...order.messages, newMessage],
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding message:', error);
      throw new Error('Failed to add message');
    }
  }

  // Get project by ID
  async getProject(projectId: string): Promise<Project | null> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const docRef = doc(db, 'projects', projectId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
        } as Project;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
          completedAt: docSnap.data().completedAt?.toDate(),
        } as Order;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }
  }

  // Create order from accepted quote
  async createOrderFromQuote(quote: any, paymentId?: string): Promise<Order | null> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      console.log('🔧 Starting order creation from quote:', {
        quoteId: quote.id,
        customerId: quote.customerId,
        artisanId: quote.artisanId,
        projectTitle: quote.projectTitle,
        amount: quote.artisanResponse?.quote || 0
      });

      // Create a project first (if it doesn't exist)
      const projectData = {
        customerId: quote.customerId,
        title: quote.projectTitle,
        description: quote.projectDescription,
        category: quote.projectType,
        budget: quote.budget,
        timeline: quote.timeline,
        location: quote.location,
        attachments: quote.attachments || [],
        status: 'in_progress' as const,
        artisanId: quote.artisanId,
      };

      console.log('🏗️ Creating project with data:', projectData);

      const projectRef = await addDoc(collection(db, 'projects'), {
        ...projectData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log('✅ Project created with ID:', projectRef.id);

      // Create the order
      const orderData = {
        projectId: projectRef.id,
        customerId: quote.customerId,
        artisanId: quote.artisanId,
        amount: quote.artisanResponse?.quote || 0,
        currency: quote.artisanResponse?.currency || 'KES',
        description: quote.projectDescription,
        timeline: quote.artisanResponse?.timeline || quote.timeline,
        status: 'accepted' as const,
        paymentId: paymentId || null,
        messages: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log('📦 Creating order with data:', orderData);

      const orderRef = await addDoc(collection(db, 'orders'), orderData);

      console.log('✅ Order created with ID:', orderRef.id);

      const result = {
        id: orderRef.id,
        projectId: projectRef.id,
        customerId: quote.customerId,
        artisanId: quote.artisanId,
        amount: quote.artisanResponse?.quote || 0,
        currency: quote.artisanResponse?.currency || 'KES',
        description: quote.projectDescription,
        timeline: quote.artisanResponse?.timeline || quote.timeline,
        status: 'accepted' as const,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('🎉 Order creation completed successfully:', result.id);
      return result;
    } catch (error) {
      console.error('❌ Error creating order from quote:', error);
      throw new Error('Failed to create order from quote');
    }
  }
}

export const orderService = new OrderService();
