// src/data/mockUsers.ts
import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'sarah@example.com',
    name: 'Sarah Kimani',
    role: 'artisan',
    verified: true,
    joinDate: '2024-01-15',
    specialty: 'Custom Wedding Dresses',
    location: 'Nairobi',
    profileImage: '👩‍🎨',
    portfolio: []
  },
  {
    id: '2',
    email: 'john@example.com',
    name: 'John Doe',
    role: 'customer',
    joinDate: '2024-03-20',
    orders: []
  },
  {
    id: '3',
    email: 'david@example.com',
    name: 'David Ochieng',
    role: 'artisan',
    verified: true,
    joinDate: '2023-08-10',
    specialty: 'Handcrafted Furniture',
    location: 'Mombasa',
    profileImage: '👨‍🔨',
    portfolio: []
  },
  {
    id: '4',
    email: 'grace@example.com',
    name: 'Grace Wanjiku',
    role: 'artisan',
    verified: true,
    joinDate: '2023-12-05',
    specialty: 'Custom Cakes & Pastries',
    location: 'Nakuru',
    profileImage: '👩‍🍳',
    portfolio: []
  },
  {
    id: '5',
    email: 'mary@example.com',
    name: 'Mary Customer',
    role: 'customer',
    joinDate: '2024-02-10',
    orders: []
  }
];