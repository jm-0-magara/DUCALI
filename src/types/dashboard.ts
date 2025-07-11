// src/types/dashboard.ts
export interface Order {
  id: string;
  artisan?: string;
  artisanImage?: string;
  customer?: string;
  service: string;
  status: 'In Progress' | 'Completed' | 'Pending Quote' | 'Quote Requested' | 'Pending Review' | 'Cancelled';
  orderDate: string;
  estimatedCompletion?: string;
  completedDate?: string;
  deadline?: string;
  price: string;
  image?: string;
  progress?: number;
  rating?: number;
  priority?: 'high' | 'medium' | 'low';
  description?: string;
  // Additional fields for order creation and quotes
  budget?: string;
  timeline?: string;
  attachments?: string;
}

export interface FavoriteArtisan {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  image: string;
  orders?: number;
  verified?: boolean;
}

export interface Message {
  id: string;
  customer?: string;
  artisan?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  orderId?: string;
}

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  totalEarnings: number;
  avgRating: number;
  completionRate?: number;
  responseTime?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}