import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot, 
  Timestamp,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  writeBatch,
  FieldValue
} from 'firebase/firestore';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'artisan';
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  timestamp: Date | FieldValue;
  read: boolean;
  readAt?: Date | FieldValue;
  edited: boolean;
  editedAt?: Date | FieldValue;
  deleted: boolean;
  deletedAt?: Date | FieldValue;
}



export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  artisanId: string;
  artisanName: string;
  artisanImage?: string;
  lastMessage?: string;
  lastMessageTime?: Date | FieldValue;
  lastMessageSenderId?: string;
  unreadCount: number;
  status: 'active' | 'archived' | 'blocked';
  createdAt: Date | FieldValue;
  updatedAt: Date | FieldValue;
  orderId?: string;
  projectTitle?: string;
}

export interface MessageNotification {
  id: string;
  userId: string;
  conversationId: string;
  messageId: string;
  senderId: string;
  senderName: string;
  content: string;
  read: boolean;
  timestamp: Date | FieldValue;
}

class MessagingService {
  private conversationsCollection = 'conversations';
  private messagesCollection = 'messages';
  private notificationsCollection = 'messageNotifications';

  // Create a new conversation
  async createConversation(
    customerId: string,
    customerName: string,
    customerImage: string,
    artisanId: string,
    artisanName: string,
    artisanImage: string,
    initialMessage: string,
    orderId?: string,
    projectTitle?: string
  ): Promise<string> {
    try {
      if (!db) throw new Error('Database not initialized');

      // Check if conversation already exists
      const existingConversation = await this.getConversationByParticipants(customerId, artisanId);
      if (existingConversation) {
        return existingConversation.id;
      }

      // Create conversation
      const conversationData: any = {
        customerId,
        customerName,
        customerImage,
        artisanId,
        artisanName,
        artisanImage,
        lastMessage: initialMessage,
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: customerId,
        unreadCount: 1,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Only add optional fields if they have values
      if (orderId) {
        conversationData.orderId = orderId;
      }
      if (projectTitle) {
        conversationData.projectTitle = projectTitle;
      }

      const conversationRef = await addDoc(
        collection(db, this.conversationsCollection),
        conversationData
      );

      // Send initial message
      await this.sendMessage(
        conversationRef.id,
        customerId,
        customerName,
        'customer',
        initialMessage,
        'text'
      );

      return conversationRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  // Create or get existing conversation (returns full conversation object)
  async createOrGetConversation(participants: {
    customerId: string;
    customerName: string;
    customerImage: string;
    artisanId: string;
    artisanName: string;
    artisanImage: string;
  }): Promise<Conversation> {
    try {
      if (!db) throw new Error('Database not initialized');

      const { customerId, customerName, customerImage, artisanId, artisanName, artisanImage } = participants;

      // Check if conversation already exists
      const existingConversation = await this.getConversationByParticipants(customerId, artisanId);
      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const conversationData: any = {
        customerId,
        customerName,
        customerImage,
        artisanId,
        artisanName,
        artisanImage,
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: customerId,
        unreadCount: 0,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const conversationRef = await addDoc(
        collection(db, this.conversationsCollection),
        conversationData
      );

      // Return the created conversation
      return {
        id: conversationRef.id,
        customerId,
        customerName,
        customerImage,
        artisanId,
        artisanName,
        artisanImage,
        lastMessage: '',
        lastMessageTime: new Date(),
        lastMessageSenderId: customerId,
        unreadCount: 0,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error creating or getting conversation:', error);
      throw error;
    }
  }

  // Get conversation by ID
  async getConversationById(conversationId: string): Promise<Conversation | null> {
    try {
      if (!db) throw new Error('Database not initialized');

      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      const conversationDoc = await getDoc(conversationRef);

      if (conversationDoc.exists()) {
        return {
          id: conversationDoc.id,
          ...conversationDoc.data()
        } as Conversation;
      }

      return null;
    } catch (error) {
      console.error('Error getting conversation by ID:', error);
      throw error;
    }
  }

  // Get conversation by participants
  async getConversationByParticipants(customerId: string, artisanId: string): Promise<Conversation | null> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.conversationsCollection),
        where('customerId', '==', customerId),
        where('artisanId', '==', artisanId),
        where('status', '==', 'active')
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Conversation;
    } catch (error) {
      console.error('Error getting conversation by participants:', error);
      throw error;
    }
  }

  // Get user conversations
  async getUserConversations(userId: string, userRole: 'customer' | 'artisan'): Promise<Conversation[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const field = userRole === 'customer' ? 'customerId' : 'artisanId';
      const q = query(
        collection(db, this.conversationsCollection),
        where(field, '==', userId),
        where('status', '==', 'active')
        // Temporarily removed orderBy to avoid index requirement
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Conversation[];
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw error;
    }
  }

  // Get conversation messages
  async getConversationMessages(conversationId: string, limitCount: number = 50): Promise<Message[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        where('deleted', '==', false)
        // Temporarily removed orderBy to avoid index requirement
      );

      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      // Return messages in chronological order
      return messages.reverse();
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw error;
    }
  }

  // Send a message
  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: 'customer' | 'artisan',
    content: string,
    messageType: 'text' | 'image' | 'file' = 'text',
    fileUrl?: string,
    fileName?: string,
    fileSize?: number
  ): Promise<string> {
    try {
      if (!db) throw new Error('Database not initialized');

      const messageData: any = {
        conversationId,
        senderId,
        senderName,
        senderRole,
        content,
        messageType,
        timestamp: serverTimestamp(),
        read: false,
        edited: false,
        deleted: false
      };

      // Only add file-related fields if they have values
      if (fileUrl) {
        messageData.fileUrl = fileUrl;
      }
      if (fileName) {
        messageData.fileName = fileName;
      }
      if (fileSize) {
        messageData.fileSize = fileSize;
      }

      const messageRef = await addDoc(
        collection(db, this.messagesCollection),
        messageData
      );

      // Update conversation
      await this.updateConversation(conversationId, {
        lastMessage: content,
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: senderId,
        updatedAt: serverTimestamp()
      });

      // Create notification for recipient
      await this.createMessageNotification(conversationId, messageRef.id, senderId, senderName, content);

      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Update conversation
  async updateConversation(conversationId: string, updates: Partial<Conversation>): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      await updateDoc(conversationRef, updates);
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  // Get all messages for admin purposes
  async getAllMessages(limitCount: number = 100): Promise<Message[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.messagesCollection),
        where('deleted', '==', false),
        limit(limitCount)
        // Temporarily removed orderBy to avoid index requirement
      );

      const querySnapshot = await getDocs(q);
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];

      // Return messages in chronological order
      return messages.reverse();
    } catch (error) {
      console.error('Error getting all messages:', error);
      throw error;
    }
  }

  // Get all conversations for admin purposes
  async getAllConversations(limitCount: number = 100): Promise<Conversation[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.conversationsCollection),
        limit(limitCount)
        // Temporarily removed orderBy to avoid index requirement
      );

      const querySnapshot = await getDocs(q);
      const conversations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Conversation[];

      // Return conversations in chronological order (newest first)
      return conversations.sort((a, b) => {
        const aTime = a.updatedAt instanceof Date ? a.updatedAt.getTime() : 0;
        const bTime = b.updatedAt instanceof Date ? b.updatedAt.getTime() : 0;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error getting all conversations:', error);
      throw error;
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        where('senderId', '!=', userId),
        where('read', '==', false)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);

      querySnapshot.docs.forEach(doc => {
        batch.update(doc.ref, {
          read: true,
          readAt: serverTimestamp()
        });
      });

      await batch.commit();

      // Reset unread count
      await this.updateConversation(conversationId, {
        unreadCount: 0
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw error;
    }
  }

  // Edit message
  async editMessage(messageId: string, newContent: string): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      const messageRef = doc(db, this.messagesCollection, messageId);
      await updateDoc(messageRef, {
        content: newContent,
        edited: true,
        editedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  // Delete message (soft delete)
  async deleteMessage(messageId: string): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      const messageRef = doc(db, this.messagesCollection, messageId);
      await updateDoc(messageRef, {
        deleted: true,
        deletedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // Create message notification
  async createMessageNotification(
    conversationId: string,
    messageId: string,
    senderId: string,
    senderName: string,
    content: string
  ): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      // Get conversation to determine recipient
      const conversationRef = doc(db, this.conversationsCollection, conversationId);
      const conversationDoc = await getDoc(conversationRef);
      
      if (!conversationDoc.exists()) return;

      const conversation = conversationDoc.data() as Conversation;
      const recipientId = senderId === conversation.customerId ? conversation.artisanId : conversation.customerId;

      const notificationData = {
        userId: recipientId,
        conversationId,
        messageId,
        senderId,
        senderName,
        content: content.length > 100 ? content.substring(0, 100) + '...' : content,
        read: false,
        timestamp: serverTimestamp()
      };

      await addDoc(collection(db, this.notificationsCollection), notificationData);
    } catch (error) {
      console.error('Error creating message notification:', error);
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(userId: string): Promise<MessageNotification[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.notificationsCollection),
        where('userId', '==', userId),
        where('read', '==', false)
        // Temporarily removed orderBy to avoid index requirement
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MessageNotification[];
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      const notificationRef = doc(db, this.notificationsCollection, notificationId);
      await updateDoc(notificationRef, {
        read: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Real-time conversation listener
  subscribeToConversation(conversationId: string, callback: (messages: Message[]) => void): () => void {
    if (!db) {
      console.error('Database not initialized');
      return () => {};
    }

    const q = query(
      collection(db, this.messagesCollection),
      where('conversationId', '==', conversationId),
      where('deleted', '==', false)
      // Temporarily removed orderBy to avoid index requirement
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      callback(messages);
    });

    return unsubscribe;
  }

  // Real-time conversation list listener
  subscribeToUserConversations(
    userId: string, 
    userRole: 'customer' | 'artisan', 
    callback: (conversations: Conversation[]) => void
  ): () => void {
    if (!db) {
      console.error('Database not initialized');
      return () => {};
    }

    const field = userRole === 'customer' ? 'customerId' : 'artisanId';
    const q = query(
      collection(db, this.conversationsCollection),
      where(field, '==', userId),
      where('status', '==', 'active')
      // Temporarily removed orderBy to avoid index requirement
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const conversations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Conversation[];
      callback(conversations);
    });

    return unsubscribe;
  }

  // Real-time notifications listener
  subscribeToNotifications(userId: string, callback: (notifications: MessageNotification[]) => void): () => void {
    if (!db) {
      console.error('Database not initialized');
      return () => {};
    }

    const q = query(
      collection(db, this.notificationsCollection),
      where('userId', '==', userId),
      where('read', '==', false)
      // Temporarily removed orderBy to avoid index requirement
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MessageNotification[];
      callback(notifications);
    });

    return unsubscribe;
  }

  // Archive conversation
  async archiveConversation(conversationId: string): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      await this.updateConversation(conversationId, {
        status: 'archived',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error archiving conversation:', error);
      throw error;
    }
  }

  // Block conversation
  async blockConversation(conversationId: string): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      await this.updateConversation(conversationId, {
        status: 'blocked',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error blocking conversation:', error);
      throw error;
    }
  }

  // Get conversation statistics
  async getConversationStats(conversationId: string): Promise<{
    totalMessages: number;
    unreadMessages: number;
    lastActivity: Date | null;
  }> {
    try {
      if (!db) throw new Error('Database not initialized');

      const messagesQuery = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        where('deleted', '==', false)
      );

      const unreadQuery = query(
        collection(db, this.messagesCollection),
        where('conversationId', '==', conversationId),
        where('deleted', '==', false),
        where('read', '==', false)
      );

      const [messagesSnapshot, unreadSnapshot] = await Promise.all([
        getDocs(messagesQuery),
        getDocs(unreadQuery)
      ]);

      let lastActivity: Date | null = null;
      if (!messagesSnapshot.empty) {
        const lastMessage = messagesSnapshot.docs[messagesSnapshot.docs.length - 1];
        lastActivity = lastMessage.data().timestamp?.toDate() || null;
      }

      return {
        totalMessages: messagesSnapshot.size,
        unreadMessages: unreadSnapshot.size,
        lastActivity
      };
    } catch (error) {
      console.error('Error getting conversation stats:', error);
      throw error;
    }
  }
}

export const messagingService = new MessagingService();
