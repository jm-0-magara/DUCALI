import { db } from './firebase';
import { collection, getDocs, getDoc, query, where, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData, addDoc, updateDoc, doc } from 'firebase/firestore';
import { cloudinaryService, CloudinaryUploadResult } from './cloudinary';

export interface Artisan {
  id: string;
  name: string;
  email: string;
  specialty: string;
  category: string;
  rating: number;
  averageRating: number;
  totalOrders: number;
  totalReviews: number;
  location: string;
  profileImage: string;
  profileImageCloudinary?: CloudinaryUploadResult;
  priceRange: string;
  responseTime: string;
  description: string;
  experience: string;
  skills: string[];
  verified: boolean;
  featured: boolean;
  portfolio: PortfolioItem[];
  services: Service[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  videos?: string[];
  imagesCloudinary?: CloudinaryUploadResult[];
  category: string;
  createdAt: Date;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  active: boolean;
}

export interface SearchFilters {
  category?: string;
  location?: string;
  minRating?: number;
  maxPrice?: number;
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  searchTerm?: string;
}

export interface SearchResult {
  artisans: Artisan[];
  total: number;
  hasMore: boolean;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

class ArtisanService {
  /**
   * Upload profile image for an artisan using Cloudinary
   */
  async uploadProfileImage(artisanId: string, file: File): Promise<CloudinaryUploadResult> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    if (!cloudinaryService.isConfigured()) {
      throw new Error('Cloudinary is not properly configured');
    }

    try {
      // Upload to Cloudinary
      const uploadResult = await cloudinaryService.uploadImage(file, {
        folder: 'ducali/profiles',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Update artisan document with new profile image
      const artisanRef = doc(db, 'users', artisanId);
      await updateDoc(artisanRef, {
        profileImage: uploadResult.secure_url,
        profileImageCloudinary: uploadResult,
        updatedAt: new Date()
      });

      return uploadResult;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw new Error('Failed to upload profile image');
    }
  }

  /**
   * Upload portfolio media (images/videos) for an artisan using Cloudinary
   */
  async uploadPortfolioMedia(
    artisanId: string, 
    files: File[], 
    portfolioItemId: string
  ): Promise<CloudinaryUploadResult[]> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    if (!cloudinaryService.isConfigured()) {
      throw new Error('Cloudinary is not properly configured');
    }

    try {
      const uploadResults: CloudinaryUploadResult[] = [];

      // Upload each file to Cloudinary
      for (const file of files) {
        const isVideo = file.type.startsWith('video/');
        
        const uploadResult = isVideo 
          ? await cloudinaryService.uploadVideo(file, {
              folder: 'ducali/portfolio',
              transformation: [
                { quality: 'auto', fetch_format: 'auto' }
              ]
            })
          : await cloudinaryService.uploadImage(file, {
              folder: 'ducali/portfolio',
              transformation: [
                { width: 800, height: 600, crop: 'fill' },
                { quality: 'auto', fetch_format: 'auto' }
              ]
            });

        uploadResults.push(uploadResult);
      }

      // Update portfolio item with new media
      const artisanRef = doc(db, 'users', artisanId);
      // Note: This is a simplified update - in a real app you'd need to update the specific portfolio item
      await updateDoc(artisanRef, {
        updatedAt: new Date()
      });

      return uploadResults;
    } catch (error) {
      console.error('Error uploading portfolio media:', error);
      throw new Error('Failed to upload portfolio media');
    }
  }



  async getArtisans(filters: SearchFilters = {}, pageSize: number = 20, lastDoc?: QueryDocumentSnapshot<DocumentData>): Promise<SearchResult> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      // Use the simplest possible query to avoid any index requirements
      let q = query(
        collection(db, 'users'),
        where('role', '==', 'artisan')
      );

      // Apply pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      q = query(q, limit(pageSize));

      const snapshot = await getDocs(q);
      const artisans: Artisan[] = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const artisan: Artisan = {
          id: doc.id,
          name: data.name || 'Unknown Artisan',
          email: data.email || '',
          specialty: data.specialty || 'Custom Crafts',
          category: data.category || 'General',
          rating: data.rating || 0,
          averageRating: data.averageRating || data.rating || 0,
          totalOrders: data.totalOrders || 0,
          totalReviews: data.totalReviews || 0,
          location: data.location || 'Unknown Location',
          profileImage: data.profileImage || 'https://res.cloudinary.com/de3qsj9qa/image/upload/v1755470693/blank_av3gia.jpg',
          priceRange: data.priceRange || 'Contact for quote',
          responseTime: data.responseTime || '24 hours',
          description: data.description || 'Skilled artisan with years of experience.',
          experience: data.experience || 'Professional',
          skills: data.skills || [],
          verified: data.verified || false,
          featured: data.featured || false,
          portfolio: data.portfolio || [],
          services: data.services || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
        artisans.push(artisan);
      }

      // Sort by createdAt descending (newest first)
      artisans.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      // Apply all filters client-side to avoid composite index requirements
      let filteredArtisans = artisans;

      // Apply search term filter
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filteredArtisans = filteredArtisans.filter(artisan => 
          artisan.name.toLowerCase().includes(searchTerm) ||
          artisan.specialty.toLowerCase().includes(searchTerm) ||
          artisan.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
          artisan.description.toLowerCase().includes(searchTerm)
        );
      }

      // Apply category filter
      if (filters.category && filters.category !== 'All Categories') {
        filteredArtisans = filteredArtisans.filter(artisan => 
          artisan.category === filters.category
        );
      }

      // Apply location filter
      if (filters.location && filters.location !== 'All Locations') {
        filteredArtisans = filteredArtisans.filter(artisan => 
          artisan.location === filters.location
        );
      }

      // Apply rating filter
      if (filters.minRating) {
        filteredArtisans = filteredArtisans.filter(artisan => 
          artisan.rating >= filters.minRating!
        );
      }

      // Apply verified filter
      if (filters.verifiedOnly) {
        filteredArtisans = filteredArtisans.filter(artisan => 
          artisan.verified
        );
      }

      // Apply featured filter
      if (filters.featuredOnly) {
        filteredArtisans = filteredArtisans.filter(artisan => 
          artisan.featured
        );
      }

      return {
        artisans: filteredArtisans,
        total: filteredArtisans.length,
        hasMore: snapshot.docs.length === pageSize,
        lastDoc: snapshot.docs[snapshot.docs.length - 1]
      };
    } catch (error) {
      console.error('Error fetching artisans:', error);
      // Return empty result instead of throwing to prevent app crashes
      return {
        artisans: [],
        total: 0,
        hasMore: false
      };
    }
  }

  async createSampleArtisans(): Promise<void> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      // Check if artisans already exist
      const result = await this.getArtisans({}, 1);
      if (result.artisans.length > 0) {
        console.log('Artisans already exist, skipping sample data creation');
        return;
      }

      console.log('Creating sample artisans...');
      
      const sampleArtisans = [
        {
          name: 'Sarah Kimani',
          email: 'sarah.kimani@example.com',
          specialty: 'Custom Wedding Dresses',
          category: 'Fashion & Clothing',
          rating: 4.9,
          totalOrders: 156,
          location: 'Nairobi',
          profileImage: 'https://res.cloudinary.com/de3qsj9qa/image/upload/v1755470693/blank_av3gia.jpg',
          priceRange: 'From KSH 20,000',
          responseTime: '2 hours',
          description: 'Expert wedding dress designer with 8 years of experience creating beautiful custom gowns.',
          experience: '8+ years',
          skills: ['Wedding Dresses', 'Alterations', 'Bridal Wear', 'Custom Design'],
          verified: true,
          featured: true
        },
        {
          name: 'David Ochieng',
          email: 'david.ochieng@example.com',
          specialty: 'Handcrafted Furniture',
          category: 'Home & Decor',
          rating: 4.8,
          totalOrders: 89,
          location: 'Mombasa',
          profileImage: 'https://res.cloudinary.com/de3qsj9qa/image/upload/v1755470693/blank_av3gia.jpg',
          priceRange: 'From KSH 15,000',
          responseTime: '4 hours',
          description: 'Creating unique furniture pieces using sustainable local wood and modern design principles.',
          experience: '12+ years',
          skills: ['Custom Furniture', 'Wood Carving', 'Interior Design', 'Restoration'],
          verified: true,
          featured: true
        },
        {
          name: 'Grace Wanjiku',
          email: 'grace.wanjiku@example.com',
          specialty: 'Custom Jewelry',
          category: 'Jewelry & Accessories',
          rating: 4.7,
          totalOrders: 203,
          location: 'Nakuru',
          profileImage: 'https://res.cloudinary.com/de3qsj9qa/image/upload/v1755470693/blank_av3gia.jpg',
          priceRange: 'From KSH 8,000',
          responseTime: '6 hours',
          description: 'Skilled jewelry designer creating unique pieces with precious metals and gemstones.',
          experience: '10+ years',
          skills: ['Custom Jewelry', 'Engagement Rings', 'Necklaces', 'Bracelets'],
          verified: true,
          featured: false
        },
        {
          name: 'Michael Otieno',
          email: 'michael.otieno@example.com',
          specialty: 'Digital Art & Design',
          category: 'Digital Services',
          rating: 4.6,
          totalOrders: 67,
          location: 'Kisumu',
          profileImage: 'https://res.cloudinary.com/de3qsj9qa/image/upload/v1755470693/blank_av3gia.jpg',
          priceRange: 'From KSH 5,000',
          responseTime: '12 hours',
          description: 'Creative digital artist specializing in logo design, illustrations, and digital marketing materials.',
          experience: '6+ years',
          skills: ['Logo Design', 'Digital Art', 'Illustration', 'Branding'],
          verified: true,
          featured: false
        },
        {
          name: 'Fatima Hassan',
          email: 'fatima.hassan@example.com',
          specialty: 'Custom Cakes & Pastries',
          category: 'Food & Catering',
          rating: 4.9,
          totalOrders: 234,
          location: 'Eldoret',
          profileImage: 'https://res.cloudinary.com/de3qsj9qa/image/upload/v1755470693/blank_av3gia.jpg',
          priceRange: 'From KSH 3,000',
          responseTime: '8 hours',
          description: 'Professional pastry chef creating beautiful custom cakes and delicious pastries for special occasions.',
          experience: '7+ years',
          skills: ['Wedding Cakes', 'Birthday Cakes', 'Pastries', 'Catering'],
          verified: true,
          featured: true
        },
        {
          name: 'James Mwangi',
          email: 'james.mwangi@example.com',
          specialty: 'Traditional Art & Paintings',
          category: 'Art & Design',
          rating: 4.5,
          totalOrders: 45,
          location: 'Nairobi',
          profileImage: 'https://res.cloudinary.com/de3qsj9qa/image/upload/v1755470693/blank_av3gia.jpg',
          priceRange: 'From KSH 10,000',
          responseTime: '24 hours',
          description: 'Traditional artist creating beautiful paintings and murals inspired by Kenyan culture and landscapes.',
          experience: '15+ years',
          skills: ['Oil Painting', 'Murals', 'Portraits', 'Landscape Art'],
          verified: true,
          featured: false
        }
      ];

      // Add artisans to Firestore
      for (const artisanData of sampleArtisans) {
        await addDoc(collection(db, 'users'), {
          ...artisanData,
          role: 'artisan',
          createdAt: new Date(),
          updatedAt: new Date(),
          portfolio: [],
          services: []
        });
      }

      console.log('Sample artisans created successfully');
    } catch (error) {
      console.error('Error creating sample artisans:', error);
    }
  }

  async getArtisansByCategory(category: string, limit: number = 50): Promise<Artisan[]> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      // Get all artisans and filter by category
      const result = await this.getArtisans({}, limit);
      const categoryArtisans = result.artisans.filter(
        artisan => artisan.category.toLowerCase() === category.toLowerCase()
      );
      
      return categoryArtisans;
    } catch (error) {
      console.error('Error fetching artisans by category:', error);
      return [];
    }
  }

  async getFeaturedArtisans(limit: number = 6): Promise<Artisan[]> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      // Get all artisans and filter for featured ones, with fallback to top-rated
      const result = await this.getArtisans({}, 50);
      let featuredArtisans = result.artisans.filter(artisan => artisan.featured);
      
      // If no featured artisans found, use top-rated as fallback
      if (featuredArtisans.length === 0) {
        console.log('No featured artisans found, using top-rated artisans as fallback');
        featuredArtisans = result.artisans
          .sort((a, b) => b.rating - a.rating)
          .slice(0, limit);
      } else {
        // Limit the featured artisans
        featuredArtisans = featuredArtisans.slice(0, limit);
      }

      return featuredArtisans;
    } catch (error) {
      console.error('Error fetching featured artisans:', error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  }

  async getArtisanById(id: string): Promise<Artisan | null> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      // Get artisan data
      const artisanDoc = await getDoc(doc(db, 'users', id));
      
      if (!artisanDoc.exists()) {
        return null;
      }

      const data = artisanDoc.data();

      // Fetch portfolio items from separate collection
      let portfolioItems: PortfolioItem[] = [];
      try {
        const portfolioQuery = query(
          collection(db, 'portfolio'),
          where('artisanId', '==', id),
          orderBy('createdAt', 'desc')
        );
        
        const portfolioSnapshot = await getDocs(portfolioQuery);
        portfolioItems = portfolioSnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || '',
          description: doc.data().description || '',
          category: doc.data().category || '',
          images: doc.data().images || [],
          videos: doc.data().videos || [],
          mediaUrl: doc.data().mediaUrl || '',
          mediaType: doc.data().mediaType || 'image',
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }));
      } catch (portfolioError) {
        console.warn('Error fetching portfolio items, using fallback query:', portfolioError);
        // Fallback: try without orderBy if composite index doesn't exist
        try {
          const portfolioQuery = query(
            collection(db, 'portfolio'),
            where('artisanId', '==', id)
          );
          
          const portfolioSnapshot = await getDocs(portfolioQuery);
          portfolioItems = portfolioSnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title || '',
            description: doc.data().description || '',
            category: doc.data().category || '',
            images: doc.data().images || [],
            videos: doc.data().videos || [],
            mediaUrl: doc.data().mediaUrl || '',
            mediaType: doc.data().mediaType || 'image',
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          }));
        } catch (fallbackError) {
          console.error('Fallback portfolio query also failed:', fallbackError);
          portfolioItems = [];
        }
      }

      return {
        id: artisanDoc.id,
        name: data.name || 'Unknown Artisan',
        email: data.email || '',
        specialty: data.specialty || 'Custom Crafts',
        category: data.category || 'General',
        rating: data.rating || 0,
        averageRating: data.averageRating || data.rating || 0,
        totalOrders: data.totalOrders || 0,
        totalReviews: data.totalReviews || 0,
        location: data.location || 'Unknown Location',
        profileImage: data.profileImage || 'https://res.cloudinary.com/de3qsj9qa/image/upload/v1755470693/blank_av3gia.jpg',
        priceRange: data.priceRange || 'Contact for quote',
        responseTime: data.responseTime || '24 hours',
        description: data.description || 'Skilled artisan with years of experience.',
        experience: data.experience || 'Professional',
        skills: data.skills || [],
        verified: data.verified || false,
        featured: data.featured || false,
        portfolio: portfolioItems,
        services: data.services || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('Error fetching artisan by ID:', error);
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const categories = snapshot.docs.map(doc => doc.data().name).filter(Boolean);
      
      // Add fallback categories if none exist in database
      const fallbackCategories = [
        'Fashion & Clothing',
        'Home & Decor', 
        'Jewelry & Accessories',
        'Art & Design',
        'Food & Catering',
        'Digital Services',
        'Leather & Crafts',
        'Textiles & Fabrics',
        'Wood & Furniture'
      ];
      
      const allCategories = categories.length > 0 ? categories : fallbackCategories;
      return ['All Categories', ...allCategories];
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return fallback categories if database query fails
      return [
        'All Categories',
        'Fashion & Clothing',
        'Home & Decor', 
        'Jewelry & Accessories',
        'Art & Design',
        'Food & Catering',
        'Digital Services',
        'Leather & Crafts',
        'Textiles & Fabrics',
        'Wood & Furniture'
      ];
    }
  }

  async getLocations(): Promise<string[]> {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    try {
      // Use the same simple query as getArtisans to avoid index issues
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'artisan')
      );

      const snapshot = await getDocs(q);
      const locations = new Set<string>();
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.location) {
          locations.add(data.location);
        }
      });

      return ['All Locations', ...Array.from(locations).sort()];
    } catch (error) {
      console.error('Error fetching locations:', error);
      return ['All Locations'];
    }
  }
}

export const artisanService = new ArtisanService();
