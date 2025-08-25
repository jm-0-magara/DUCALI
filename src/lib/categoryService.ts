import { db } from './firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount: number;
  artisanCount: number;
  status: 'active' | 'inactive';
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  icon: string;
  description: string;
  featured?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  icon?: string;
  description?: string;
  status?: 'active' | 'inactive';
  featured?: boolean;
  sortOrder?: number;
}

class CategoryService {
  // Get all categories
  async getCategories(status?: 'active' | 'inactive'): Promise<Category[]> {
    if (!db) {
      console.warn('Firebase not properly initialized, returning empty categories');
      return [];
    }

    try {
      // Simplified query to avoid index issues
      let q = query(collection(db, 'categories'));

      if (status) {
        q = query(q, where('status', '==', status));
      }

      const snapshot = await getDocs(q);
      const categories: Category[] = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();
        
        // Get product count for this category
        const productsSnapshot = await getDocs(query(
          collection(db, 'products'),
          where('category', '==', data.name)
        ));

        // Get artisan count for this category
        const artisansSnapshot = await getDocs(query(
          collection(db, 'users'),
          where('role', '==', 'ARTISAN'),
          where('artisanProfile.category', '==', data.name),
          where('verified', '==', true)
        ));

        categories.push({
          id: doc.id,
          name: data.name,
          slug: data.slug,
          icon: data.icon,
          description: data.description,
          productCount: productsSnapshot.size,
          artisanCount: artisansSnapshot.size,
          status: data.status || 'active',
          featured: data.featured || false,
          sortOrder: data.sortOrder || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      }

      // Sort in memory to avoid index requirements
      return categories.sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const q = query(
        collection(db, 'categories'),
        where('slug', '==', slug),
        where('status', '==', 'active')
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const data = snapshot.docs[0].data();
      
      // Get product count
      const productsSnapshot = await getDocs(query(
        collection(db, 'products'),
        where('category', '==', data.name)
      ));

      // Get artisan count
      const artisansSnapshot = await getDocs(query(
        collection(db, 'users'),
        where('role', '==', 'ARTISAN'),
        where('artisanProfile.category', '==', data.name),
        where('verified', '==', true)
      ));

      return {
        id: snapshot.docs[0].id,
        name: data.name,
        slug: data.slug,
        icon: data.icon,
        description: data.description,
        productCount: productsSnapshot.size,
        artisanCount: artisansSnapshot.size,
        status: data.status || 'active',
        featured: data.featured || false,
        sortOrder: data.sortOrder || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
      };
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      throw new Error('Failed to fetch category');
    }
  }

  // Get featured categories
  async getFeaturedCategories(limit: number = 6): Promise<Category[]> {
    if (!db) {
      console.warn('Firebase not properly initialized, returning empty categories');
      return [];
    }

    try {
      // Simplified query to avoid index issues
      const q = query(
        collection(db, 'categories'),
        where('featured', '==', true),
        where('status', '==', 'active')
      );

      const snapshot = await getDocs(q);
      const categories: Category[] = [];

      for (const doc of snapshot.docs.slice(0, limit)) {
        const data = doc.data();
        
        // Get counts
        const productsSnapshot = await getDocs(query(
          collection(db, 'products'),
          where('category', '==', data.name)
        ));

        const artisansSnapshot = await getDocs(query(
          collection(db, 'users'),
          where('role', '==', 'ARTISAN'),
          where('artisanProfile.category', '==', data.name),
          where('verified', '==', true)
        ));

        categories.push({
          id: doc.id,
          name: data.name,
          slug: data.slug,
          icon: data.icon,
          description: data.description,
          productCount: productsSnapshot.size,
          artisanCount: artisansSnapshot.size,
          status: data.status || 'active',
          featured: data.featured || false,
          sortOrder: data.sortOrder || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      }

      // Sort in memory to avoid index requirements
      return categories.sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return a.name.localeCompare(b.name);
      });
    } catch (error) {
      console.error('Error fetching featured categories:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  // Create new category
  async createCategory(categoryData: CreateCategoryData): Promise<Category> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        ...categoryData,
        status: 'active',
        featured: categoryData.featured || false,
        sortOrder: categoryData.sortOrder || 0,
        productCount: 0,
        artisanCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        name: categoryData.name,
        slug: categoryData.slug,
        icon: categoryData.icon,
        description: categoryData.description,
        productCount: 0,
        artisanCount: 0,
        status: 'active',
        featured: categoryData.featured || false,
        sortOrder: categoryData.sortOrder || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Failed to create category');
    }
  }

  // Update category
  async updateCategory(categoryId: string, updateData: UpdateCategoryData): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const docRef = doc(db, 'categories', categoryId);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw new Error('Failed to update category');
    }
  }

  // Delete category
  async deleteCategory(categoryId: string): Promise<void> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const docRef = doc(db, 'categories', categoryId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw new Error('Failed to delete category');
    }
  }

  // Get category statistics
  async getCategoryStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    featured: number;
  }> {
    if (!db) {
      throw new Error('Firebase not properly initialized');
    }

    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      
      const stats = {
        total: snapshot.size,
        active: 0,
        inactive: 0,
        featured: 0
      };

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.status === 'active') stats.active++;
        else if (data.status === 'inactive') stats.inactive++;
        if (data.featured) stats.featured++;
      });

      return stats;
    } catch (error) {
      console.error('Error fetching category stats:', error);
      throw new Error('Failed to fetch category statistics');
    }
  }
}

export const categoryService = new CategoryService();
