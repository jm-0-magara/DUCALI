// src/types/auth.ts
import { PortfolioItem } from './artisan';
import { Order } from './dashboard';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'artisan' | 'admin';
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
  isAdmin: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'artisan' | 'admin';
  specialty?: string;
  location?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}