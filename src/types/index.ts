// src/types/index.ts
// Export all types from a single entry point for clean imports

// Authentication types
export type {
  User,
  AuthContextType,
  SignupData,
  AuthResponse
} from './auth';

// Dashboard types
export type {
  Order,
  FavoriteArtisan,
  Message,
  DashboardStats,
  MenuItem
} from './dashboard';

// Artisan types
export type {
  PortfolioItem,
  Service,
  Review,
  ArtisanProfile,
  Category,
  CategoryInfo
} from './artisan';