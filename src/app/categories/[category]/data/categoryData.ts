import { ArtisanProfile, getAllArtisans } from '../../../artisan/[id]/data/artisanData';

// Re-export the Artisan type for consistency
export type Artisan = ArtisanProfile;

export interface CategoryInfo {
  slug: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  heroImage: string;
  subcategories: string[];
  popularServices: string[];
}

// Category information
export const categories: CategoryInfo[] = [
  {
    slug: 'fashion',
    name: 'Fashion & Clothing',
    displayName: 'Fashion & Clothing',
    description: 'Custom clothing, alterations, and fashion accessories crafted by skilled tailors and designers.',
    icon: '👗',
    heroImage: '👗',
    subcategories: ['Wedding Dresses', 'Casual Wear', 'Formal Wear', 'Alterations', 'Accessories'],
    popularServices: ['Custom Wedding Dresses', 'Dress Alterations', 'Bespoke Suits', 'Traditional Wear']
  },
  {
    slug: 'home-decor',
    name: 'Home & Decor',
    displayName: 'Home & Decor',
    description: 'Handcrafted furniture, home accessories, and interior design services for your perfect space.',
    icon: '🏠',
    heroImage: '🏠',
    subcategories: ['Furniture', 'Wall Art', 'Lighting', 'Textiles', 'Storage Solutions'],
    popularServices: ['Custom Furniture', 'Interior Consultation', 'Wall Murals', 'Handmade Rugs']
  },
  {
    slug: 'jewelry',
    name: 'Jewelry & Accessories',
    displayName: 'Jewelry & Accessories',
    description: 'Unique jewelry pieces, custom designs, and precious accessories made with expert craftsmanship.',
    icon: '💍',
    heroImage: '💍',
    subcategories: ['Engagement Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Custom Pieces'],
    popularServices: ['Custom Engagement Rings', 'Wedding Jewelry Sets', 'Personalized Necklaces', 'Jewelry Repair']
  },
  {
    slug: 'art-design',
    name: 'Art & Design',
    displayName: 'Art & Design',
    description: 'Original artwork, graphic design, and creative services from talented artists and designers.',
    icon: '🎨',
    heroImage: '🎨',
    subcategories: ['Paintings', 'Sculptures', 'Digital Art', 'Portraits', 'Murals'],
    popularServices: ['Custom Portraits', 'Logo Design', 'Wall Murals', 'Ceramic Art']
  },
  {
    slug: 'food-catering',
    name: 'Food & Catering',
    displayName: 'Food & Catering',
    description: 'Custom cakes, catering services, and specialty food items for your special occasions.',
    icon: '🍰',
    heroImage: '🍰',
    subcategories: ['Wedding Cakes', 'Birthday Cakes', 'Catering', 'Pastries', 'Specialty Foods'],
    popularServices: ['Custom Wedding Cakes', 'Event Catering', 'Birthday Cakes', 'Artisan Pastries']
  },
  {
    slug: 'digital-services',
    name: 'Digital Services',
    displayName: 'Digital Services',
    description: 'Web development, graphic design, and digital marketing services for your business needs.',
    icon: '💻',
    heroImage: '💻',
    subcategories: ['Web Development', 'Graphic Design', 'Photography', 'Video Editing', 'Marketing'],
    popularServices: ['Website Development', 'Logo Design', 'Social Media Marketing', 'Product Photography']
  }
];

// Helper functions
export function getCategoryData(slug: string): CategoryInfo | null {
  return categories.find(cat => cat.slug === slug) || null;
}

export function getArtisansByCategory(categoryName: string): ArtisanProfile[] {
  try {
    const allArtisans = getAllArtisans();
    return allArtisans.filter((artisan: ArtisanProfile) => artisan.category === categoryName);
  } catch (error) {
    console.error('Error getting artisans by category:', error);
    return [];
  }
}

export function getAllCategories(): CategoryInfo[] {
  return categories;
}

// Get category slug from category name (for linking)
export function getCategorySlug(categoryName: string): string | null {
  const category = categories.find(cat => cat.name === categoryName);
  return category ? category.slug : null;
}