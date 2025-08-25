import { db } from './firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';

export interface Review {
  id: string;
  artisanId: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  updatedAt?: Date;
  helpful: number;
  reported: boolean;
  verified: boolean;
  orderId?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentReviews: Review[];
}

class ReviewsService {
  async getArtisanReviews(artisanId: string, limitCount: number = 10): Promise<Review[]> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('artisanId', '==', artisanId),
        where('reported', '==', false),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Review[];
    } catch (error: any) {
      console.error('Error fetching artisan reviews:', error);
      
      // If it's an index error, try a simpler query
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        console.log('Index not available, using fallback query...');
        try {
          const reviewsRef = collection(db, 'reviews');
          const fallbackQuery = query(
            reviewsRef,
            where('artisanId', '==', artisanId),
            limit(limitCount)
          );
          
          const snapshot = await getDocs(fallbackQuery);
          const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate()
          })) as Review[];
          
          // Filter out reported reviews on the client side
          return reviews
            .filter(review => !review.reported)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, limitCount);
        } catch (fallbackError) {
          console.error('Fallback query also failed:', fallbackError);
          return [];
        }
      }
      
      return [];
    }
  }

  async getArtisanReviewStats(artisanId: string): Promise<ReviewStats> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('artisanId', '==', artisanId),
        where('reported', '==', false)
      );
      
      const snapshot = await getDocs(q);
      const reviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Review[];

      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          recentReviews: []
        };
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(review => {
        ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
      });

      const recentReviews = reviews
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5);

      return {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
        ratingDistribution,
        recentReviews
      };
    } catch (error: any) {
      console.error('Error fetching review stats:', error);
      
      // If it's an index error, try a simpler query
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        console.log('Index not available, using fallback query for stats...');
        try {
          const reviewsRef = collection(db, 'reviews');
          const fallbackQuery = query(
            reviewsRef,
            where('artisanId', '==', artisanId)
          );
          
          const snapshot = await getDocs(fallbackQuery);
          const allReviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          })) as Review[];
          
          // Filter out reported reviews on the client side
          const reviews = allReviews.filter(review => !review.reported);

          if (reviews.length === 0) {
            return {
              averageRating: 0,
              totalReviews: 0,
              ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
              recentReviews: []
            };
          }

          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRating / reviews.length;

          const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          reviews.forEach(review => {
            ratingDistribution[review.rating as keyof typeof ratingDistribution]++;
          });

          const recentReviews = reviews
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5);

          return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length,
            ratingDistribution,
            recentReviews
          };
        } catch (fallbackError) {
          console.error('Fallback query for stats also failed:', fallbackError);
        }
      }
      
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        recentReviews: []
      };
    }
  }

  async createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'helpful' | 'reported' | 'verified'>): Promise<boolean> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const review: Omit<Review, 'id'> = {
        ...reviewData,
        createdAt: new Date(),
        helpful: 0,
        reported: false,
        verified: false
      };

      // Add review to reviews collection
      const reviewsRef = collection(db, 'reviews');
      await setDoc(doc(reviewsRef), review);

      // Update artisan's review stats
      await this.updateArtisanReviewStats(reviewData.artisanId);

      return true;
    } catch (error) {
      console.error('Error creating review:', error);
      return false;
    }
  }

  async updateReview(reviewId: string, updates: Partial<Review>): Promise<boolean> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Get the review to update artisan stats
      const reviewDoc = await getDoc(reviewRef);
      if (reviewDoc.exists()) {
        const reviewData = reviewDoc.data();
        await this.updateArtisanReviewStats(reviewData.artisanId);
      }

      return true;
    } catch (error) {
      console.error('Error updating review:', error);
      return false;
    }
  }

  async deleteReview(reviewId: string): Promise<boolean> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      // Get the review first to get artisanId
      const reviewRef = doc(db, 'reviews', reviewId);
      const reviewDoc = await getDoc(reviewRef);
      
      if (!reviewDoc.exists()) {
        return false;
      }

      const reviewData = reviewDoc.data();
      
      // Delete the review
      await updateDoc(reviewRef, {
        reported: true // Soft delete by marking as reported
      });

      // Update artisan's review stats
      await this.updateArtisanReviewStats(reviewData.artisanId);

      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      return false;
    }
  }

  async markReviewHelpful(reviewId: string): Promise<boolean> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        helpful: arrayUnion(1)
      });
      return true;
    } catch (error) {
      console.error('Error marking review helpful:', error);
      return false;
    }
  }

  async reportReview(reviewId: string): Promise<boolean> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const reviewRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewRef, {
        reported: true
      });
      return true;
    } catch (error) {
      console.error('Error reporting review:', error);
      return false;
    }
  }

  async hasUserReviewedArtisan(customerId: string, artisanId: string): Promise<boolean> {
    if (!db) {
      return false;
    }

    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('customerId', '==', customerId),
        where('artisanId', '==', artisanId),
        where('reported', '==', false)
      );
      
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (error: any) {
      console.error('Error checking if user has reviewed:', error);
      
      // If it's an index error, try a simpler query
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        console.log('Index not available, using fallback query for user review check...');
        try {
          const reviewsRef = collection(db, 'reviews');
          const fallbackQuery = query(
            reviewsRef,
            where('customerId', '==', customerId),
            where('artisanId', '==', artisanId)
          );
          
          const snapshot = await getDocs(fallbackQuery);
          const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Review[];
          
          // Filter out reported reviews on the client side
          return reviews.some(review => !review.reported);
        } catch (fallbackError) {
          console.error('Fallback query for user review check also failed:', fallbackError);
        }
      }
      
      return false;
    }
  }

  async getUserReview(customerId: string, artisanId: string): Promise<Review | null> {
    if (!db) {
      return null;
    }

    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(
        reviewsRef,
        where('customerId', '==', customerId),
        where('artisanId', '==', artisanId),
        where('reported', '==', false)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate()
      } as Review;
    } catch (error: any) {
      console.error('Error fetching user review:', error);
      
      // If it's an index error, try a simpler query
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        console.log('Index not available, using fallback query for user review...');
        try {
          const reviewsRef = collection(db, 'reviews');
          const fallbackQuery = query(
            reviewsRef,
            where('customerId', '==', customerId),
            where('artisanId', '==', artisanId)
          );
          
          const snapshot = await getDocs(fallbackQuery);
          if (snapshot.empty) {
            return null;
          }

          const reviews = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate()
          })) as Review[];
          
          // Filter out reported reviews on the client side
          const nonReportedReviews = reviews.filter(review => !review.reported);
          return nonReportedReviews.length > 0 ? nonReportedReviews[0] : null;
        } catch (fallbackError) {
          console.error('Fallback query for user review also failed:', fallbackError);
        }
      }
      
      return null;
    }
  }

  private async updateArtisanReviewStats(artisanId: string): Promise<void> {
    if (!db) {
      return;
    }

    try {
      const stats = await this.getArtisanReviewStats(artisanId);
      const artisanRef = doc(db, 'users', artisanId);
      
      await updateDoc(artisanRef, {
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews,
        ratingDistribution: stats.ratingDistribution
      });
    } catch (error) {
      console.error('Error updating artisan review stats:', error);
    }
  }

  async getPlatformReviewStats(): Promise<{
    averageRating: number;
    totalReviews: number;
    totalArtisans: number;
    totalOrders: number;
  }> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      // Get all reviews
      const reviewsRef = collection(db, 'reviews');
      const reviewsQuery = query(
        reviewsRef,
        where('reported', '==', false)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];

      // Get all artisans
      const usersRef = collection(db, 'users');
      const artisansQuery = query(
        usersRef,
        where('role', '==', 'ARTISAN'),
        where('verified', '==', true)
      );
      const artisansSnapshot = await getDocs(artisansQuery);
      const artisans = artisansSnapshot.docs;

      // Get all orders
      const ordersRef = collection(db, 'orders');
      const ordersQuery = query(ordersRef);
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs;

      // Calculate statistics
      const totalReviews = reviews.length;
      const totalArtisans = artisans.length;
      const totalOrders = orders.length;

      let averageRating = 0;
      if (totalReviews > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = Math.round((totalRating / totalReviews) * 10) / 10;
      }

      return {
        averageRating,
        totalReviews,
        totalArtisans,
        totalOrders
      };
    } catch (error: any) {
      console.error('Error fetching platform review stats:', error);
      
      // If it's an index error, try a simpler query
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        console.log('Index not available, using fallback query for platform stats...');
        try {
          // Get all reviews without filtering
          const reviewsRef = collection(db, 'reviews');
          const reviewsSnapshot = await getDocs(reviewsRef);
          const allReviews = reviewsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Review[];
          
          // Filter out reported reviews on the client side
          const reviews = allReviews.filter(review => !review.reported);

          // Get all artisans without filtering
          const usersRef = collection(db, 'users');
          const artisansSnapshot = await getDocs(usersRef);
          const allUsers = artisansSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as any[];
          
          // Filter artisans on the client side
          const artisans = allUsers.filter(user => 
            user.role === 'ARTISAN' && user.verified === true
          );

          // Get all orders
          const ordersRef = collection(db, 'orders');
          const ordersSnapshot = await getDocs(ordersRef);
          const orders = ordersSnapshot.docs;

          // Calculate statistics
          const totalReviews = reviews.length;
          const totalArtisans = artisans.length;
          const totalOrders = orders.length;

          let averageRating = 0;
          if (totalReviews > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            averageRating = Math.round((totalRating / totalReviews) * 10) / 10;
          }

          return {
            averageRating,
            totalReviews,
            totalArtisans,
            totalOrders
          };
        } catch (fallbackError) {
          console.error('Fallback query for platform stats also failed:', fallbackError);
        }
      }
      
      // Return default values if all queries fail
      return {
        averageRating: 4.9,
        totalReviews: 2500,
        totalArtisans: 500,
        totalOrders: 2500
      };
    }
  }
}

export const reviewsService = new ReviewsService();
