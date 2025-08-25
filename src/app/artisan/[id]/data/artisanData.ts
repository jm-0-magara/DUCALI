import { db } from '../../../../lib/firebase';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// Type definitions for Firebase data
interface FirebaseUser {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ARTISAN' | 'ADMIN';
  verified?: boolean;
  location?: string;
  bio?: string;
  artisanProfile?: {
    specialty: string;
    category: string;
    rating?: number;
    totalOrders?: number;
    completedOrders?: number;
    skills?: string[];
    languages?: string[];
    availabilityStatus?: string;
    startingPrice?: number;
  };
}

interface FirebasePortfolioItem {
  id: string;
  artisanId: string;
  title: string;
  description?: string;
  images: string[];
  price?: number;
  category?: string;
}

export interface ArtisanProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  profileImage: string;
  portfolio: string[];
  specialties: string[];
  experience: number;
  priceRange: string;
  availability: string;
  languages: string[];
  certifications: string[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

// Function to get all artisans from Firebase
export async function getAllArtisans(): Promise<ArtisanProfile[]> {
  try {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    const usersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'ARTISAN'),
      where('verified', '==', true)
    );
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseUser[];

    // Get portfolio items for all artisans
    const portfolioSnapshot = await getDocs(collection(db, 'portfolio_items'));
    const portfolioItems = portfolioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebasePortfolioItem[];

    return users.map(user => ({
      id: user.id,
      name: user.name,
      category: user.artisanProfile?.category || 'General',
      description: user.bio || 'Skilled artisan with years of experience',
      location: user.location || 'Kenya',
      rating: user.artisanProfile?.rating || 0,
      reviewCount: 0, // You can add reviews collection if needed
      profileImage: '/images/artisans/default.jpg', // You can add profileImage field to user
      portfolio: portfolioItems
        .filter(item => item.artisanId === user.id)
        .map(item => item.images[0] || '/images/portfolio/default.jpg')
        .slice(0, 3),
      specialties: user.artisanProfile?.skills || [],
      experience: 0, // You can add experienceYears field to artisanProfile
      priceRange: getPriceRange(user.artisanProfile?.startingPrice || 0),
      availability: user.artisanProfile?.availabilityStatus === 'available' ? 'Available' : 'Busy',
      languages: user.artisanProfile?.languages || ['English'],
      certifications: [], // You can add certifications to the schema if needed
      socialLinks: {
        instagram: '',
        facebook: '',
        website: '',
      },
    }));
  } catch (error) {
    console.error('Error fetching artisans:', error);
    return [];
  }
}

// Function to get artisan by ID from Firebase
export async function getArtisanById(id: string): Promise<ArtisanProfile | null> {
  try {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    const userQuery = query(
      collection(db, 'users'),
      where('id', '==', id),
      where('role', '==', 'ARTISAN')
    );
    const userSnapshot = await getDocs(userQuery);
    
    if (userSnapshot.empty) return null;

    const user = { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() } as FirebaseUser;

    // Get portfolio items for this artisan
    const portfolioQuery = query(
      collection(db, 'portfolio_items'),
      where('artisanId', '==', id)
    );
    const portfolioSnapshot = await getDocs(portfolioQuery);
    const portfolioItems = portfolioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebasePortfolioItem[];

    return {
      id: user.id,
      name: user.name,
      category: user.artisanProfile?.category || 'General',
      description: user.bio || 'Skilled artisan with years of experience',
      location: user.location || 'Kenya',
      rating: user.artisanProfile?.rating || 0,
      reviewCount: 0, // You can add reviews collection if needed
      profileImage: '/images/artisans/default.jpg',
      portfolio: portfolioItems.map(item => item.images[0] || '/images/portfolio/default.jpg'),
      specialties: user.artisanProfile?.skills || [],
      experience: 0, // You can add experienceYears field to artisanProfile
      priceRange: getPriceRange(user.artisanProfile?.startingPrice || 0),
      availability: user.artisanProfile?.availabilityStatus === 'available' ? 'Available' : 'Busy',
      languages: user.artisanProfile?.languages || ['English'],
      certifications: [],
      socialLinks: {
        instagram: '',
        facebook: '',
        website: '',
      },
    };
  } catch (error) {
    console.error('Error fetching artisan by ID:', error);
    return null;
  }
}

// Function to get artisans by category from Firebase
export async function getArtisansByCategory(category: string): Promise<ArtisanProfile[]> {
  try {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    const usersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'ARTISAN'),
      where('verified', '==', true)
    );
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseUser[];

    // Filter by category
    const artisansInCategory = users.filter(user => 
      user.artisanProfile?.category?.toLowerCase() === category.toLowerCase()
    );

    // Get portfolio items for these artisans
    const portfolioSnapshot = await getDocs(collection(db, 'portfolio_items'));
    const portfolioItems = portfolioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebasePortfolioItem[];

    return artisansInCategory.map(user => ({
      id: user.id,
      name: user.name,
      category: user.artisanProfile?.category || 'General',
      description: user.bio || 'Skilled artisan with years of experience',
      location: user.location || 'Kenya',
      rating: user.artisanProfile?.rating || 0,
      reviewCount: 0,
      profileImage: '/images/artisans/default.jpg',
      portfolio: portfolioItems
        .filter(item => item.artisanId === user.id)
        .map(item => item.images[0] || '/images/portfolio/default.jpg')
        .slice(0, 3),
      specialties: user.artisanProfile?.skills || [],
      experience: 0,
      priceRange: getPriceRange(user.artisanProfile?.startingPrice || 0),
      availability: user.artisanProfile?.availabilityStatus === 'available' ? 'Available' : 'Busy',
      languages: user.artisanProfile?.languages || ['English'],
      certifications: [],
      socialLinks: {
        instagram: '',
        facebook: '',
        website: '',
      },
    }));
  } catch (error) {
    console.error('Error fetching artisans by category:', error);
    return [];
  }
}

// Function to search artisans from Firebase
export async function searchArtisans(searchQuery: string): Promise<ArtisanProfile[]> {
  try {
    if (!db) {
      throw new Error('Firebase database not initialized');
    }

    const usersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'ARTISAN'),
      where('verified', '==', true)
    );
    const usersSnapshot = await getDocs(usersQuery);
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebaseUser[];

    // Filter by search query
    const lowercaseQuery = searchQuery.toLowerCase();
    const matchingArtisans = users.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) ||
      user.bio?.toLowerCase().includes(lowercaseQuery) ||
      user.artisanProfile?.skills?.some(skill => 
        skill.toLowerCase().includes(lowercaseQuery)
      )
    );

    // Get portfolio items for these artisans
    const portfolioSnapshot = await getDocs(collection(db, 'portfolio_items'));
    const portfolioItems = portfolioSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FirebasePortfolioItem[];

    return matchingArtisans.map(user => ({
      id: user.id,
      name: user.name,
      category: user.artisanProfile?.category || 'General',
      description: user.bio || 'Skilled artisan with years of experience',
      location: user.location || 'Kenya',
      rating: user.artisanProfile?.rating || 0,
      reviewCount: 0,
      profileImage: '/images/artisans/default.jpg',
      portfolio: portfolioItems
        .filter(item => item.artisanId === user.id)
        .map(item => item.images[0] || '/images/portfolio/default.jpg')
        .slice(0, 3),
      specialties: user.artisanProfile?.skills || [],
      experience: 0,
      priceRange: getPriceRange(user.artisanProfile?.startingPrice || 0),
      availability: user.artisanProfile?.availabilityStatus === 'available' ? 'Available' : 'Busy',
      languages: user.artisanProfile?.languages || ['English'],
      certifications: [],
      socialLinks: {
        instagram: '',
        facebook: '',
        website: '',
      },
    }));
  } catch (error) {
    console.error('Error searching artisans:', error);
    return [];
  }
}

// Helper function to determine price range based on starting price
function getPriceRange(startingPrice: number): string {
  if (startingPrice < 1000) return 'KSH';
  if (startingPrice < 5000) return 'KKSH';
  if (startingPrice < 15000) return 'KKKSH';
  return 'KKKKSH';
}





