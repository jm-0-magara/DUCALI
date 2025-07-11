// src/types/artisan.ts
export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  price: string;
  timeframe: string;
  placeholder: string; // Will be replaced with actual image URLs later
  category?: string;
  views?: number;
  likes?: number;
}

export interface Service {
  name: string;
  description: string;
  price: string;
  timeframe: string;
}

export interface Review {
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  projectType?: string;
  helpful: number;
}

export interface ArtisanProfile {
  id: number;
  name: string;
  specialty: string;
  category: string;
  rating: number;
  orders: number;
  location: string;
  image: string;
  price: string;
  responseTime: string;
  description: string;
  fullDescription: string;
  skills: string[];
  verified: boolean;
  featured: boolean;
  experience: string;
  totalReviews: number;
  portfolio: PortfolioItem[];
  services: Service[];
  reviews: Review[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

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