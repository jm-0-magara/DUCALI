import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

export interface QuoteRequest {
  id: string;
  customerId: string;
  artisanId: string;
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  attachments: string[];
  additionalRequirements: string;
  status: 'pending' | 'responded' | 'accepted' | 'declined' | 'expired';
  artisanResponse?: {
    quote: number;
    currency: string;
    message: string;
    timeline: string;
    terms: string;
    respondedAt: Date;
  };
  paymentId?: string;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface CreateQuoteRequestData {
  customerId: string;
  artisanId: string;
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  attachments: string[];
  additionalRequirements: string;
}

export interface QuoteResponseData {
  quote: number;
  currency: string;
  message: string;
  timeline: string;
  terms: string;
}

class QuoteService {
  // Create Quote Request
  async createQuoteRequest(data: CreateQuoteRequestData): Promise<QuoteRequest> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      // Set expiration date (7 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const quoteData = {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiresAt: expiresAt,
      };

      const docRef = await addDoc(collection(db, 'quoteRequests'), quoteData);
      
      return {
        id: docRef.id,
        ...data,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: expiresAt,
      };
    } catch (error) {
      console.error('Error creating quote request:', error);
      throw new Error('Failed to create quote request');
    }
  }

  // Get Quote Request by ID
  async getQuoteRequest(quoteId: string): Promise<QuoteRequest | null> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const docRef = doc(db, 'quoteRequests', quoteId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
          expiresAt: docSnap.data().expiresAt?.toDate() || new Date(),
          artisanResponse: docSnap.data().artisanResponse ? {
            ...docSnap.data().artisanResponse,
            respondedAt: docSnap.data().artisanResponse.respondedAt?.toDate() || new Date(),
          } : undefined,
        } as QuoteRequest;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching quote request:', error);
      throw new Error('Failed to fetch quote request');
    }
  }

  // Get Customer's Quote Requests
  async getCustomerQuoteRequests(customerId: string): Promise<QuoteRequest[]> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      // First, get all quote requests for this customer without ordering
      const q = query(
        collection(db, 'quoteRequests'),
        where('customerId', '==', customerId)
      );

      const snapshot = await getDocs(q);
      const quotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate() || new Date(),
        artisanResponse: doc.data().artisanResponse ? {
          ...doc.data().artisanResponse,
          respondedAt: doc.data().artisanResponse.respondedAt?.toDate() || new Date(),
        } : undefined,
      })) as QuoteRequest[];

      // Sort in memory to avoid index requirement
      return quotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error fetching customer quote requests:', error);
      throw new Error('Failed to fetch customer quote requests');
    }
  }

  // Get Artisan's Quote Requests
  async getArtisanQuoteRequests(artisanId: string): Promise<QuoteRequest[]> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      // First, get all quote requests for this artisan without ordering
      const q = query(
        collection(db, 'quoteRequests'),
        where('artisanId', '==', artisanId)
      );

      const snapshot = await getDocs(q);
      const quotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate() || new Date(),
        artisanResponse: doc.data().artisanResponse ? {
          ...doc.data().artisanResponse,
          respondedAt: doc.data().artisanResponse.respondedAt?.toDate() || new Date(),
        } : undefined,
      })) as QuoteRequest[];

      // Sort in memory to avoid index requirement
      return quotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error fetching artisan quote requests:', error);
      throw new Error('Failed to fetch artisan quote requests');
    }
  }

  // Respond to Quote Request (Artisan)
  async respondToQuoteRequest(quoteId: string, response: QuoteResponseData): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      await updateDoc(doc(db, 'quoteRequests', quoteId), {
        status: 'responded',
        artisanResponse: {
          ...response,
          respondedAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error responding to quote request:', error);
      throw new Error('Failed to respond to quote request');
    }
  }

  // Accept Quote Request (Customer)
  async acceptQuoteRequest(quoteId: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      await updateDoc(doc(db, 'quoteRequests', quoteId), {
        status: 'accepted',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error accepting quote request:', error);
      throw new Error('Failed to accept quote request');
    }
  }

  // Accept Quote (Customer) - Returns updated quote
  async acceptQuote(quoteId: string, customerId: string, paymentId?: string): Promise<QuoteRequest | null> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      console.log('🔧 QuoteService.acceptQuote called:', { quoteId, customerId, paymentId });
      
      const quoteRef = doc(db, 'quoteRequests', quoteId);
      
      // Update the quote status
      await updateDoc(quoteRef, {
        status: 'accepted',
        customerId: customerId,
        paymentId: paymentId || null,
        acceptedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log('✅ Quote status updated to accepted');

      // Get the updated quote
      const updatedDoc = await getDoc(quoteRef);
      if (updatedDoc.exists()) {
        const result = {
          id: updatedDoc.id,
          ...updatedDoc.data(),
          createdAt: updatedDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: updatedDoc.data().updatedAt?.toDate() || new Date(),
          expiresAt: updatedDoc.data().expiresAt?.toDate() || new Date(),
          acceptedAt: updatedDoc.data().acceptedAt?.toDate(),
        } as QuoteRequest;
        
        console.log('✅ Updated quote retrieved:', result.id);
        return result;
      }

      console.log('❌ Updated quote not found');
      return null;
    } catch (error) {
      console.error('❌ Error accepting quote:', error);
      throw new Error('Failed to accept quote');
    }
  }

  // Decline Quote Request (Customer)
  async declineQuoteRequest(quoteId: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      await updateDoc(doc(db, 'quoteRequests', quoteId), {
        status: 'declined',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error declining quote request:', error);
      throw new Error('Failed to decline quote request');
    }
  }

  // Update Quote Request Status
  async updateQuoteStatus(quoteId: string, status: QuoteRequest['status']): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      await updateDoc(doc(db, 'quoteRequests', quoteId), {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating quote status:', error);
      throw new Error('Failed to update quote status');
    }
  }

  // Get Pending Quote Requests for Artisan
  async getPendingQuoteRequests(artisanId: string): Promise<QuoteRequest[]> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      // First, get all quote requests for this artisan without ordering
      const q = query(
        collection(db, 'quoteRequests'),
        where('artisanId', '==', artisanId),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(q);
      const quotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate() || new Date(),
      })) as QuoteRequest[];

      // Sort in memory to avoid index requirement
      return quotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error fetching pending quote requests:', error);
      throw new Error('Failed to fetch pending quote requests');
    }
  }

  // Check if Quote Request is Expired
  isQuoteExpired(quoteRequest: QuoteRequest): boolean {
    return new Date() > quoteRequest.expiresAt;
  }

  // Get Quote Statistics
  async getQuoteStats(userId: string, role: 'customer' | 'artisan'): Promise<{
    total: number;
    pending: number;
    responded: number;
    accepted: number;
    declined: number;
    expired: number;
  }> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const field = role === 'customer' ? 'customerId' : 'artisanId';
      const q = query(
        collection(db, 'quoteRequests'),
        where(field, '==', userId)
      );

      const snapshot = await getDocs(q);
      const quotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate() || new Date(),
      })) as QuoteRequest[];

      const stats = {
        total: quotes.length,
        pending: quotes.filter(q => q.status === 'pending').length,
        responded: quotes.filter(q => q.status === 'responded').length,
        accepted: quotes.filter(q => q.status === 'accepted').length,
        declined: quotes.filter(q => q.status === 'declined').length,
        expired: quotes.filter(q => this.isQuoteExpired(q)).length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching quote statistics:', error);
      throw new Error('Failed to fetch quote statistics');
    }
  }
}

export const quoteService = new QuoteService();
