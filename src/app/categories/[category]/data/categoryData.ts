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
  },
  {
    slug: 'leather-crafts',
    name: 'Leather & Crafts',
    displayName: 'Leather & Crafts',
    description: 'Handcrafted leather goods, bags, wallets, and custom leather accessories made with traditional techniques.',
    icon: '👜',
    heroImage: '👜',
    subcategories: ['Bags & Purses', 'Wallets', 'Belts', 'Shoes', 'Custom Leather Goods'],
    popularServices: ['Custom Leather Bags', 'Personalized Wallets', 'Leather Belts', 'Shoe Repair']
  },
  {
    slug: 'textiles-fabrics',
    name: 'Textiles & Fabrics',
    displayName: 'Textiles & Fabrics',
    description: 'Handwoven fabrics, traditional textiles, and custom fabric designs for clothing and home decor.',
    icon: '🧵',
    heroImage: '🧵',
    subcategories: ['Handwoven Fabrics', 'Traditional Textiles', 'Custom Prints', 'Fabric Dyeing', 'Textile Art'],
    popularServices: ['Custom Fabric Design', 'Traditional Weaving', 'Fabric Dyeing', 'Textile Artwork']
  },
  {
    slug: 'wood-furniture',
    name: 'Wood & Furniture',
    displayName: 'Wood & Furniture',
    description: 'Handcrafted wooden furniture, custom carpentry, and woodworking services for your home and office.',
    icon: '🪑',
    heroImage: '🪑',
    subcategories: ['Custom Furniture', 'Wood Carving', 'Cabinetry', 'Wooden Decor', 'Furniture Repair'],
    popularServices: ['Custom Wooden Furniture', 'Kitchen Cabinets', 'Wood Carving', 'Furniture Restoration']
  }
];

// Helper functions
export function getCategoryData(slug: string): CategoryInfo | null {
  return categories.find(cat => cat.slug === slug) || null;
}

export async function getArtisansByCategory(categoryName: string): Promise<ArtisanProfile[]> {
  try {
    const allArtisans = getAllArtisans();
    const artisans = await allArtisans;
    return artisans.filter((artisan: ArtisanProfile) => artisan.category === categoryName);
  } catch {
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