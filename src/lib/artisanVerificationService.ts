import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

export interface VerificationRequest {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  specialty: string;
  experience: string;
  portfolio: string[];
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  rating: number;
  totalOrders: number;
  bio?: string;
  skills?: string[];
  certifications?: string[];
}

export interface VerificationUpdateData {
  status: 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedBy: string;
}

class ArtisanVerificationService {
  // Get all verification requests
  async getVerificationRequests(status?: 'pending' | 'approved' | 'rejected'): Promise<VerificationRequest[]> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      let q = query(
        collection(db, 'verification_requests'),
        orderBy('submittedAt', 'desc')
      );

      if (status) {
        q = query(q, where('status', '==', status));
      }

      const snapshot = await getDocs(q);
      const requests: VerificationRequest[] = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();
        
        // Get user data for additional info
        const userDoc = await getDocs(query(
          collection(db, 'users'),
          where('id', '==', data.userId)
        ));

        let userData = null;
        if (!userDoc.empty) {
          userData = userDoc.docs[0].data();
        }

        // Get order count
        const ordersSnapshot = await getDocs(query(
          collection(db, 'orders'),
          where('artisanId', '==', data.userId)
        ));

        requests.push({
          id: doc.id,
          userId: data.userId,
          name: data.name || userData?.name || 'Unknown',
          email: data.email || userData?.email || '',
          phone: data.phone || userData?.phone || '',
          location: data.location || userData?.location || '',
          specialty: data.specialty || userData?.artisanProfile?.category || 'General',
          experience: data.experience || userData?.artisanProfile?.experienceYears + ' years' || 'Unknown',
          portfolio: data.portfolio || [],
          documents: data.documents || [],
          status: data.status,
          submittedAt: data.submittedAt?.toDate() || new Date(),
          reviewedAt: data.reviewedAt?.toDate(),
          reviewedBy: data.reviewedBy,
          reviewNotes: data.reviewNotes,
          rating: userData?.artisanProfile?.rating || 0,
          totalOrders: ordersSnapshot.size,
          bio: userData?.bio,
          skills: userData?.artisanProfile?.skills || [],
          certifications: data.certifications || []
        });
      }

      return requests;
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      throw new Error('Failed to fetch verification requests');
    }
  }

  // Get verification request by ID
  async getVerificationRequest(requestId: string): Promise<VerificationRequest | null> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const docRef = doc(db, 'verification_requests', requestId);
      const docSnap = await getDocs(query(collection(db, 'verification_requests'), where('__name__', '==', requestId)));
      
      if (docSnap.empty) {
        return null;
      }

      const data = docSnap.docs[0].data();
      
      // Get user data
      const userDoc = await getDocs(query(
        collection(db, 'users'),
        where('id', '==', data.userId)
      ));

      let userData = null;
      if (!userDoc.empty) {
        userData = userDoc.docs[0].data();
      }

      // Get order count
      const ordersSnapshot = await getDocs(query(
        collection(db, 'orders'),
        where('artisanId', '==', data.userId)
      ));

      return {
        id: docSnap.docs[0].id,
        userId: data.userId,
        name: data.name || userData?.name || 'Unknown',
        email: data.email || userData?.email || '',
        phone: data.phone || userData?.phone || '',
        location: data.location || userData?.location || '',
        specialty: data.specialty || userData?.artisanProfile?.category || 'General',
        experience: data.experience || userData?.artisanProfile?.experienceYears + ' years' || 'Unknown',
        portfolio: data.portfolio || [],
        documents: data.documents || [],
        status: data.status,
        submittedAt: data.submittedAt?.toDate() || new Date(),
        reviewedAt: data.reviewedAt?.toDate(),
        reviewedBy: data.reviewedBy,
        reviewNotes: data.reviewNotes,
        rating: userData?.artisanProfile?.rating || 0,
        totalOrders: ordersSnapshot.size,
        bio: userData?.bio,
        skills: userData?.artisanProfile?.skills || [],
        certifications: data.certifications || []
      };
    } catch (error) {
      console.error('Error fetching verification request:', error);
      throw new Error('Failed to fetch verification request');
    }
  }

  // Update verification status
  async updateVerificationStatus(requestId: string, updateData: VerificationUpdateData): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const docRef = doc(db, 'verification_requests', requestId);
      
      await updateDoc(docRef, {
        status: updateData.status,
        reviewedAt: serverTimestamp(),
        reviewedBy: updateData.reviewedBy,
        reviewNotes: updateData.reviewNotes || '',
        updatedAt: serverTimestamp()
      });

      // If approved, update user verification status
      if (updateData.status === 'approved') {
        const request = await this.getVerificationRequest(requestId);
        if (request) {
          const userRef = doc(db, 'users', request.userId);
          await updateDoc(userRef, {
            verified: true,
            verificationStatus: 'approved',
            updatedAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error updating verification status:', error);
      throw new Error('Failed to update verification status');
    }
  }

  // Get verification statistics
  async getVerificationStats(): Promise<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  }> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const snapshot = await getDocs(collection(db, 'verification_requests'));
      
      const stats = {
        total: snapshot.size,
        pending: 0,
        approved: 0,
        rejected: 0
      };

      snapshot.docs.forEach(doc => {
        const status = doc.data().status;
        if (status === 'pending') stats.pending++;
        else if (status === 'approved') stats.approved++;
        else if (status === 'rejected') stats.rejected++;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching verification stats:', error);
      throw new Error('Failed to fetch verification statistics');
    }
  }
}

export const artisanVerificationService = new ArtisanVerificationService();
