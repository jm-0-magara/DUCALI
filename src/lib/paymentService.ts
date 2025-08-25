import Stripe from 'stripe';
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

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-06-30.basil',
    })
  : null;

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface Payment {
  id: string;
  orderId: string;
  customerId: string;
  artisanId: string;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'mpesa' | 'paypal';
  paymentProvider: string;
  transactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentType: 'full' | 'milestone' | 'deposit';
  milestoneNumber?: number;
  escrowStatus: 'held' | 'released' | 'refunded';
  releasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentData {
  orderId: string;
  customerId: string;
  artisanId: string;
  amount: number;
  currency: string;
  paymentMethod: 'stripe' | 'mpesa' | 'paypal';
  paymentType: 'full' | 'milestone' | 'deposit';
  milestoneNumber?: number;
}

export interface MpesaPaymentData {
  phoneNumber: string;
  amount: number;
  orderId: string;
  customerId: string;
  artisanId: string;
}

class PaymentService {
  // Create Stripe Payment Intent
  async createStripePaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntent> {
    if (!stripe) {
      throw new Error('Stripe not configured');
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          integration_check: 'accept_a_payment',
        },
      });

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret!,
      };
    } catch (error) {
      console.error('Error creating Stripe payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Create M-Pesa Payment
  async createMpesaPayment(data: MpesaPaymentData): Promise<any> {
    try {
      console.log('💳 Creating M-Pesa payment with data:', data);
      
      const response = await fetch('/api/payments/mpesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log('💳 M-Pesa payment response:', responseData);

      if (!response.ok) {
        console.error('💳 M-Pesa payment failed:', responseData);
        throw new Error(responseData.error || 'M-Pesa payment failed');
      }

      if (!responseData.success) {
        console.error('💳 M-Pesa payment unsuccessful:', responseData);
        throw new Error(responseData.message || 'M-Pesa payment failed');
      }

      return responseData;
    } catch (error) {
      console.error('Error creating M-Pesa payment:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error('Failed to create M-Pesa payment');
    }
  }

  // Create Payment Record
  async createPayment(data: CreatePaymentData): Promise<Payment> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const paymentData = {
        ...data,
        paymentProvider: data.paymentMethod,
        status: 'pending',
        escrowStatus: 'held',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'payments'), paymentData);
      
      return {
        id: docRef.id,
        ...data,
        paymentProvider: data.paymentMethod,
        status: 'pending',
        escrowStatus: 'held',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new Error('Failed to create payment record');
    }
  }

  // Get Payment by ID
  async getPayment(paymentId: string): Promise<Payment | null> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const docRef = doc(db, 'payments', paymentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate() || new Date(),
          releasedAt: docSnap.data().releasedAt?.toDate(),
        } as Payment;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw new Error('Failed to fetch payment');
    }
  }

  // Get Payments by Order
  async getOrderPayments(orderId: string): Promise<Payment[]> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      // Simple query without orderBy to avoid index requirement
      const q = query(
        collection(db, 'payments'),
        where('orderId', '==', orderId)
      );

      const snapshot = await getDocs(q);
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        releasedAt: doc.data().releasedAt?.toDate(),
      })) as Payment[];
      
      // Sort in memory instead of using orderBy
      return payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error fetching order payments:', error);
      throw new Error('Failed to fetch order payments');
    }
  }

  // Get User Payments
  async getUserPayments(userId: string, role: 'customer' | 'artisan'): Promise<Payment[]> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const field = role === 'customer' ? 'customerId' : 'artisanId';
      const q = query(
        collection(db, 'payments'),
        where(field, '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        releasedAt: doc.data().releasedAt?.toDate(),
      })) as Payment[];
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw new Error('Failed to fetch user payments');
    }
  }

  // Update Payment Status
  async updatePaymentStatus(paymentId: string, status: Payment['status'], transactionId?: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      };

      if (transactionId) {
        updateData.transactionId = transactionId;
      }

      if (status === 'completed') {
        updateData.escrowStatus = 'held'; // Keep in escrow until order completion
      }

      await updateDoc(doc(db, 'payments', paymentId), updateData);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw new Error('Failed to update payment status');
    }
  }

  // Release Payment from Escrow
  async releasePayment(paymentId: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        escrowStatus: 'released',
        releasedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error releasing payment:', error);
      throw new Error('Failed to release payment');
    }
  }

  // Refund Payment
  async refundPayment(paymentId: string, reason?: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      // Get payment details
      const payment = await this.getPayment(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      // If it's a Stripe payment, process refund through Stripe
      if (payment.paymentMethod === 'stripe' && payment.transactionId && stripe) {
        await stripe.refunds.create({
          payment_intent: payment.transactionId,
          reason: 'requested_by_customer',
          metadata: {
            reason: reason || 'Customer requested refund',
          },
        });
      }

      // Update payment status
      await updateDoc(doc(db, 'payments', paymentId), {
        status: 'refunded',
        escrowStatus: 'refunded',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw new Error('Failed to refund payment');
    }
  }

  // Process Payment Webhook
  async processWebhook(event: any): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        case 'charge.refunded':
          await this.handlePaymentRefund(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw new Error('Failed to process webhook');
    }
  }

  private async handlePaymentSuccess(paymentIntent: any): Promise<void> {
    // Find payment by transaction ID and update status
    if (!db) return;

    const q = query(
      collection(db, 'payments'),
      where('transactionId', '==', paymentIntent.id)
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const paymentDoc = snapshot.docs[0];
      await this.updatePaymentStatus(paymentDoc.id, 'completed', paymentIntent.id);
    }
  }

  private async handlePaymentFailure(paymentIntent: any): Promise<void> {
    if (!db) return;

    const q = query(
      collection(db, 'payments'),
      where('transactionId', '==', paymentIntent.id)
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const paymentDoc = snapshot.docs[0];
      await this.updatePaymentStatus(paymentDoc.id, 'failed', paymentIntent.id);
    }
  }

  private async handlePaymentRefund(charge: any): Promise<void> {
    if (!db) return;

    const q = query(
      collection(db, 'payments'),
      where('transactionId', '==', charge.payment_intent)
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const paymentDoc = snapshot.docs[0];
      await this.updatePaymentStatus(paymentDoc.id, 'refunded', charge.payment_intent);
    }
  }
}

export const paymentService = new PaymentService();
