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
  addDoc,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';

export interface Violation {
  id: string;
  userId: string;
  userName: string;
  userRole: 'customer' | 'artisan' | 'admin';
  violationType: 'spam' | 'harassment' | 'fraud' | 'inappropriate_content' | 'fake_reviews' | 'payment_issues' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence?: string[];
  reportedBy: string;
  reportedAt: Date;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminNotes?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface Punishment {
  id: string;
  userId: string;
  userName: string;
  violationId: string;
  punishmentType: 'warning' | 'suspension' | 'ban' | 'fine' | 'restriction';
  duration?: number; // in days, 0 for permanent
  reason: string;
  adminNotes: string;
  issuedBy: string;
  issuedAt: Date;
  expiresAt?: Date;
  status: 'active' | 'expired' | 'revoked';
  revokedBy?: string;
  revokedAt?: Date;
  revokedReason?: string;
}

class PunishmentService {
  private violationsCollection = 'violations';
  private punishmentsCollection = 'punishments';

  // Get all violations
  async getViolations(limitCount: number = 50): Promise<Violation[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.violationsCollection),
        orderBy('reportedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reportedAt: doc.data().reportedAt?.toDate() || new Date(),
        resolvedAt: doc.data().resolvedAt?.toDate()
      })) as Violation[];
    } catch (error) {
      console.error('Error getting violations:', error);
      throw error;
    }
  }

  // Get violations by status
  async getViolationsByStatus(status: string): Promise<Violation[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.violationsCollection),
        where('status', '==', status),
        orderBy('reportedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reportedAt: doc.data().reportedAt?.toDate() || new Date(),
        resolvedAt: doc.data().resolvedAt?.toDate()
      })) as Violation[];
    } catch (error) {
      console.error('Error getting violations by status:', error);
      throw error;
    }
  }

  // Get violations by user
  async getViolationsByUser(userId: string): Promise<Violation[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.violationsCollection),
        where('userId', '==', userId),
        orderBy('reportedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reportedAt: doc.data().reportedAt?.toDate() || new Date(),
        resolvedAt: doc.data().resolvedAt?.toDate()
      })) as Violation[];
    } catch (error) {
      console.error('Error getting violations by user:', error);
      throw error;
    }
  }

  // Create violation
  async createViolation(violationData: Omit<Violation, 'id' | 'reportedAt'>): Promise<string> {
    try {
      if (!db) throw new Error('Database not initialized');

      const violation = {
        ...violationData,
        reportedAt: serverTimestamp(),
        status: 'pending'
      };

      const docRef = await addDoc(collection(db, this.violationsCollection), violation);
      return docRef.id;
    } catch (error) {
      console.error('Error creating violation:', error);
      throw error;
    }
  }

  // Update violation status
  async updateViolationStatus(violationId: string, status: string, adminNotes?: string, resolvedBy?: string): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      const violationRef = doc(db, this.violationsCollection, violationId);
      const updateData: any = { status };

      if (adminNotes) updateData.adminNotes = adminNotes;
      if (resolvedBy) updateData.resolvedBy = resolvedBy;
      if (status === 'resolved' || status === 'dismissed') {
        updateData.resolvedAt = serverTimestamp();
      }

      await updateDoc(violationRef, updateData);
    } catch (error) {
      console.error('Error updating violation status:', error);
      throw error;
    }
  }

  // Get all punishments
  async getPunishments(limitCount: number = 50): Promise<Punishment[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.punishmentsCollection),
        orderBy('issuedAt', 'desc'),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        issuedAt: doc.data().issuedAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate(),
        revokedAt: doc.data().revokedAt?.toDate()
      })) as Punishment[];
    } catch (error) {
      console.error('Error getting punishments:', error);
      throw error;
    }
  }

  // Get active punishments
  async getActivePunishments(): Promise<Punishment[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.punishmentsCollection),
        where('status', '==', 'active'),
        orderBy('issuedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        issuedAt: doc.data().issuedAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate(),
        revokedAt: doc.data().revokedAt?.toDate()
      })) as Punishment[];
    } catch (error) {
      console.error('Error getting active punishments:', error);
      throw error;
    }
  }

  // Get punishments by user
  async getPunishmentsByUser(userId: string): Promise<Punishment[]> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.punishmentsCollection),
        where('userId', '==', userId),
        orderBy('issuedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        issuedAt: doc.data().issuedAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate(),
        revokedAt: doc.data().revokedAt?.toDate()
      })) as Punishment[];
    } catch (error) {
      console.error('Error getting punishments by user:', error);
      throw error;
    }
  }

  // Create punishment
  async createPunishment(punishmentData: Omit<Punishment, 'id' | 'issuedAt'>): Promise<string> {
    try {
      if (!db) throw new Error('Database not initialized');

      const punishment = {
        ...punishmentData,
        issuedAt: serverTimestamp(),
        status: 'active'
      };

      // Calculate expiration date if duration is provided
      if (punishmentData.duration && punishmentData.duration > 0) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + punishmentData.duration);
        punishment.expiresAt = expiresAt;
      }

      const docRef = await addDoc(collection(db, this.punishmentsCollection), punishment);
      return docRef.id;
    } catch (error) {
      console.error('Error creating punishment:', error);
      throw error;
    }
  }

  // Revoke punishment
  async revokePunishment(punishmentId: string, revokedBy: string, revokedReason: string): Promise<void> {
    try {
      if (!db) throw new Error('Database not initialized');

      const punishmentRef = doc(db, this.punishmentsCollection, punishmentId);
      await updateDoc(punishmentRef, {
        status: 'revoked',
        revokedBy,
        revokedReason,
        revokedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error revoking punishment:', error);
      throw error;
    }
  }

  // Check if user has active punishments
  async hasActivePunishments(userId: string): Promise<boolean> {
    try {
      if (!db) throw new Error('Database not initialized');

      const q = query(
        collection(db, this.punishmentsCollection),
        where('userId', '==', userId),
        where('status', '==', 'active')
      );

      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Error checking active punishments:', error);
      throw error;
    }
  }

  // Get punishment statistics
  async getPunishmentStats(): Promise<{
    totalViolations: number;
    totalPunishments: number;
    activePunishments: number;
    bannedUsers: number;
    pendingViolations: number;
  }> {
    try {
      if (!db) throw new Error('Database not initialized');

      const [violationsSnapshot, punishmentsSnapshot, activePunishmentsSnapshot, bannedUsersSnapshot, pendingViolationsSnapshot] = await Promise.all([
        getDocs(collection(db, this.violationsCollection)),
        getDocs(collection(db, this.punishmentsCollection)),
        getDocs(query(collection(db, this.punishmentsCollection), where('status', '==', 'active'))),
        getDocs(query(collection(db, this.punishmentsCollection), where('punishmentType', '==', 'ban'), where('status', '==', 'active'))),
        getDocs(query(collection(db, this.violationsCollection), where('status', '==', 'pending')))
      ]);

      return {
        totalViolations: violationsSnapshot.size,
        totalPunishments: punishmentsSnapshot.size,
        activePunishments: activePunishmentsSnapshot.size,
        bannedUsers: bannedUsersSnapshot.size,
        pendingViolations: pendingViolationsSnapshot.size
      };
    } catch (error) {
      console.error('Error getting punishment stats:', error);
      throw error;
    }
  }

  // Real-time violations listener
  subscribeToViolations(callback: (violations: Violation[]) => void): () => void {
    if (!db) {
      console.error('Database not initialized');
      return () => {};
    }

    const q = query(
      collection(db, this.violationsCollection),
      orderBy('reportedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const violations = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reportedAt: doc.data().reportedAt?.toDate() || new Date(),
        resolvedAt: doc.data().resolvedAt?.toDate()
      })) as Violation[];

      callback(violations);
    });

    return unsubscribe;
  }

  // Real-time punishments listener
  subscribeToPunishments(callback: (punishments: Punishment[]) => void): () => void {
    if (!db) {
      console.error('Database not initialized');
      return () => {};
    }

    const q = query(
      collection(db, this.punishmentsCollection),
      orderBy('issuedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const punishments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        issuedAt: doc.data().issuedAt?.toDate() || new Date(),
        expiresAt: doc.data().expiresAt?.toDate(),
        revokedAt: doc.data().revokedAt?.toDate()
      })) as Punishment[];

      callback(punishments);
    });

    return unsubscribe;
  }
}

export const punishmentService = new PunishmentService();
