// src/data/mockDashboardData.ts
import { Order, FavoriteArtisan, Message, DashboardStats } from '../types';

// Customer Orders
export const mockCustomerOrders: Order[] = [
  {
    id: 'ORD-001',
    artisan: 'Sarah Kimani',
    artisanImage: '👩‍🎨',
    service: 'Custom Wedding Dress',
    status: 'In Progress',
    orderDate: '2024-11-15',
    estimatedCompletion: '2024-12-20',
    price: '$450',
    image: '👰‍♀️',
    progress: 65,
    description: 'Elegant mermaid-style wedding dress with intricate beadwork'
  },
  {
    id: 'ORD-002',
    artisan: 'David Ochieng',
    artisanImage: '👨‍🔨',
    service: 'Dining Table Set',
    status: 'Completed',
    orderDate: '2024-10-01',
    completedDate: '2024-11-10',
    price: '$650',
    image: '🪑',
    rating: 5,
    description: 'Custom mahogany dining table with 6 matching chairs'
  },
  {
    id: 'ORD-003',
    artisan: 'Grace Wanjiku',
    artisanImage: '👩‍🍳',
    service: 'Birthday Cake',
    status: 'Pending Quote',
    orderDate: '2024-11-20',
    price: 'TBD',
    image: '🎂',
    description: '3-tier chocolate birthday cake with custom decorations'
  }
];

// Artisan Orders
export const mockArtisanOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Jane Smith',
    service: 'Custom Wedding Dress',
    status: 'In Progress',
    orderDate: '2024-11-10',
    deadline: '2024-12-15',
    price: '$450',
    progress: 60,
    priority: 'high',
    description: 'Mermaid-style dress with pearl detailing'
  },
  {
    id: 'ORD-002',
    customer: 'Michael Johnson',
    service: 'Evening Gown Alteration',
    status: 'Pending Review',
    orderDate: '2024-11-18',
    deadline: '2024-11-25',
    price: '$120',
    priority: 'medium',
    description: 'Hemming and waist adjustments'
  },
  {
    id: 'ORD-003',
    customer: 'Sarah Wilson',
    service: 'Bridesmaid Dress',
    status: 'Quote Requested',
    orderDate: '2024-11-20',
    price: 'TBD',
    priority: 'low',
    description: 'Navy blue bridesmaid dress, size 8'
  },
  {
    id: 'ORD-004',
    customer: 'Emma Davis',
    service: 'Cocktail Dress',
    status: 'Completed',
    orderDate: '2024-10-15',
    completedDate: '2024-11-01',
    price: '$280',
    priority: 'medium',
    rating: 5,
    description: 'Black cocktail dress with lace sleeves'
  }
];

// Favorite Artisans
export const mockFavoriteArtisans: FavoriteArtisan[] = [
  {
    id: 1,
    name: 'Peter Kamau',
    specialty: 'Jewelry Designer',
    location: 'Nairobi',
    rating: 4.9,
    image: '👨‍💍',
    orders: 89,
    verified: true
  },
  {
    id: 2,
    name: 'Mary Achieng',
    specialty: 'Ceramic Artist',
    location: 'Eldoret',
    rating: 4.6,
    image: '👩‍🎨',
    orders: 45,
    verified: false
  },
  {
    id: 3,
    name: 'James Mwangi',
    specialty: 'Leather Craftsman',
    location: 'Kisumu',
    rating: 4.7,
    image: '👨‍🎨',
    orders: 73,
    verified: true
  }
];

// Messages
export const mockMessages: Message[] = [
  {
    id: '1',
    customer: 'Jane Smith',
    artisan: 'Sarah Kimani',
    lastMessage: 'Hi! Can we discuss the dress design details? I have some specific requirements for the beadwork.',
    timestamp: '2 hours ago',
    unread: true,
    orderId: 'ORD-001'
  },
  {
    id: '2',
    customer: 'Michael Johnson',
    artisan: 'Sarah Kimani',
    lastMessage: 'Thank you for the update on the alterations! The progress looks great so far.',
    timestamp: '1 day ago',
    unread: false,
    orderId: 'ORD-002'
  },
  {
    id: '3',
    customer: 'Sarah Wilson',
    artisan: 'Sarah Kimani',
    lastMessage: 'I would like to get a quote for a bridesmaid dress. When can we schedule a consultation?',
    timestamp: '2 days ago',
    unread: true,
    orderId: 'ORD-003'
  },
  {
    id: '4',
    customer: 'Emma Davis',
    artisan: 'Sarah Kimani',
    lastMessage: 'The cocktail dress turned out absolutely perfect! Thank you so much for your amazing work.',
    timestamp: '1 week ago',
    unread: false,
    orderId: 'ORD-004'
  }
];

// Dashboard Stats
export const mockArtisanStats: DashboardStats = {
  totalOrders: 47,
  activeOrders: 8,
  totalEarnings: 12450,
  avgRating: 4.8,
  completionRate: 96,
  responseTime: '2 hours'
};

export const mockCustomerStats: DashboardStats = {
  totalOrders: 12,
  activeOrders: 2,
  totalEarnings: 0, // Not applicable for customers
  avgRating: 0, // Not applicable for customers
  completionRate: 0, // Not applicable for customers
  responseTime: '' // Not applicable for customers
};