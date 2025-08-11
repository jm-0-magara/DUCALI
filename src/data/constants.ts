// src/data/constants.ts

// App Configuration
export const APP_CONFIG = {
  name: 'Ducali',
  tagline: 'Bespoke Marketplace',
  description: 'Connect with skilled artisans and creators to get custom-made products that are uniquely yours.',
  version: '1.0.0'
};

// Color Palette
export const COLORS = {
  primary: '#1D2D50',      // Navy Blue
  secondary: '#6E1414',    // Wine Red
  accent: '#B08D57',       // Muted Gold
  background: '#FDF6F0',   // Cream
  dark: '#1C1C1C',         // Charcoal Black
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A'
  }
};

// Locations
export const KENYAN_CITIES = [
  'Nairobi',
  'Mombasa', 
  'Nakuru',
  'Kisumu',
  'Eldoret',
  'Thika',
  'Machakos',
  'Nyeri',
  'Kericho',
  'Malindi'
];

// Categories
export const ARTISAN_CATEGORIES = [
  { id: 'fashion', name: 'Fashion & Clothing', icon: '👗' },
  { id: 'home-decor', name: 'Home & Decor', icon: '🏠' },
  { id: 'jewelry', name: 'Jewelry & Accessories', icon: '💍' },
  { id: 'art-design', name: 'Art & Design', icon: '🎨' },
  { id: 'food-catering', name: 'Food & Catering', icon: '🍰' },
  { id: 'digital-services', name: 'Digital Services', icon: '💻' }
];

// Order Statuses
export const ORDER_STATUSES = {
  QUOTE_REQUESTED: 'Quote Requested',
  PENDING_QUOTE: 'Pending Quote', 
  IN_PROGRESS: 'In Progress',
  PENDING_REVIEW: 'Pending Review',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
} as const;

// Response Times
export const RESPONSE_TIMES = [
  'Within 1 hour',
  'Within 2 hours', 
  'Within 4 hours',
  'Within 8 hours',
  'Within 24 hours'
];

// Budget Ranges
export const BUDGET_RANGES = [
  { value: 'under-100', label: 'Under $100' },
  { value: '100-300', label: '$100 - $300' },
  { value: '300-500', label: '$300 - $500' },
  { value: '500-1000', label: '$500 - $1,000' },
  { value: '1000-plus', label: '$1,000+' }
];

// Project Timelines
export const PROJECT_TIMELINES = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-2-weeks', label: '1-2 weeks' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: 'flexible', label: 'Flexible' }
];

// Popular Specialties
export const POPULAR_SPECIALTIES = [
  'Wedding Dresses',
  'Furniture Making',
  'Jewelry Design',
  'Cake Making',
  'Portrait Art',
  'Interior Design',
  'Leather Crafts',
  'Ceramic Art',
  'Web Design',
  'Photography'
];

// Platform Settings
export const PLATFORM_SETTINGS = {
  maxFileSize: 10, // MB
  supportedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  supportedDocTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  minPasswordLength: 6,
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  localStorageKeys: {
    user: 'ducali_user',
    theme: 'ducali_theme',
    cart: 'ducali_cart',
    orders: 'ducali_orders'  // ← Added orders storage key
  }
};