import { db } from './firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { type Artisan } from './artisanService';

export interface FavoriteArtisan {
  id: string;
  addedAt: Date;
  artisan: Artisan;
}

class FavoritesService {
  async getFavorites(userId: string): Promise<FavoriteArtisan[]> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return [];
      }

      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      
      return favorites.map((fav: any) => ({
        id: fav.id,
        addedAt: fav.addedAt?.toDate() || new Date(),
        artisan: fav.artisan
      }));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }

  async addToFavorites(userId: string, artisan: Artisan): Promise<boolean> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          favorites: [{
            id: artisan.id,
            addedAt: new Date(),
            artisan: artisan
          }]
        });
      } else {
        // Add to existing favorites
        await updateDoc(userRef, {
          favorites: arrayUnion({
            id: artisan.id,
            addedAt: new Date(),
            artisan: artisan
          })
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  }

  async removeFromFavorites(userId: string, artisanId: string): Promise<boolean> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return false;
      }

      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      
      // Find the favorite to remove
      const favoriteToRemove = favorites.find((fav: any) => fav.id === artisanId);
      
      if (!favoriteToRemove) {
        return false;
      }

      // Remove from favorites array
      await updateDoc(userRef, {
        favorites: arrayRemove(favoriteToRemove)
      });
      
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  }

  async isFavorite(userId: string, artisanId: string): Promise<boolean> {
    if (!db) {
      return false;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return false;
      }

      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      
      return favorites.some((fav: any) => fav.id === artisanId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  }

  async getFavoritesCount(userId: string): Promise<number> {
    if (!db) {
      return 0;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return 0;
      }

      const userData = userDoc.data();
      const favorites = userData.favorites || [];
      
      return favorites.length;
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return 0;
    }
  }
}

export const favoritesService = new FavoritesService();
