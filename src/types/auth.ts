// src/types/auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'artisan';
  profileImage?: string;
  verified?: boolean;
  joinDate: string;
  
  // Artisan-specific fields
  specialty?: string;
  location?: string;
  portfolio?: PortfolioItem[];
  
  // Customer-specific fields
  orders?: Order[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (userData: SignupData) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  isArtisan: boolean;
  isCustomer: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'artisan';
  specialty?: string;
  location?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

// Re-export from other type files for convenience
export type { Order } from './dashboard';
export type { PortfolioItem } from './artisan';