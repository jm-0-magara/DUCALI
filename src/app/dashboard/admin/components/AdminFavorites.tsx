"use client";

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Search, 
  Filter, 
  Star, 
  User, 
  MapPin, 
  Calendar,
  Eye,
  Trash2,
  MoreVertical,
  Download,
  Share2
} from 'lucide-react';

interface FavoriteItem {
  id: string;
  userId: string;
  userName: string;
  userRole: 'customer' | 'artisan' | 'admin';
  itemId: string;
  itemType: 'artisan' | 'service' | 'product';
  itemName: string;
  itemDescription: string;
  itemImage?: string;
  itemRating?: number;
  itemLocation?: string;
  createdAt: Date;
  lastViewed?: Date;
}

export function AdminFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'artisan' | 'service' | 'product'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'customer' | 'artisan' | 'admin'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'rating'>('date');

  // Mock data for demonstration
  useEffect(() => {
    const mockFavorites: FavoriteItem[] = [
      {
        id: '1',
        userId: '',
        userName: '',
        userRole: 'customer',
        itemId: 'artisan1',
        itemType: 'artisan',
        itemName: 'Sarah Johnson',
        itemDescription: 'Professional Interior Designer',
        itemRating: 4.8,
        itemLocation: 'Nairobi, Kenya',
        createdAt: new Date('2024-01-15'),
        lastViewed: new Date('2024-01-20')
      },
      {
        id: '2',
        userId: '',
        userName: '',
        userRole: 'customer',
        itemId: 'service1',
        itemType: 'service',
        itemName: 'Custom Furniture Design',
        itemDescription: 'Handcrafted wooden furniture',
        itemRating: 4.9,
        itemLocation: 'Mombasa, Kenya',
        createdAt: new Date('2024-01-10'),
        lastViewed: new Date('2024-01-18')
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Mike Wilson',
        userRole: 'artisan',
        itemId: 'product1',
        itemType: 'product',
        itemName: 'Traditional Beaded Necklace',
        itemDescription: 'Handmade Maasai jewelry',
        itemRating: 4.7,
        itemLocation: 'Kisumu, Kenya',
        createdAt: new Date('2024-01-12'),
        lastViewed: new Date('2024-01-19')
      }
    ];

    setFavorites(mockFavorites);
    setLoading(false);
  }, []);

  const filteredFavorites = favorites.filter(favorite => {
    const matchesSearch = favorite.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         favorite.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || favorite.itemType === filterType;
    const matchesRole = filterRole === 'all' || favorite.userRole === filterRole;
    
    return matchesSearch && matchesType && matchesRole;
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        const aDate = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const bDate = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return bDate.getTime() - aDate.getTime();
      case 'name':
        return a.itemName.localeCompare(b.itemName);
      case 'rating':
        return (b.itemRating || 0) - (a.itemRating || 0);
      default:
        return 0;
    }
  });

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'artisan':
        return <User className="w-4 h-4" />;
      case 'service':
        return <Star className="w-4 h-4" />;
      case 'product':
        return <Heart className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'artisan':
        return 'text-blue-500 bg-blue-500/10';
      case 'service':
        return 'text-green-500 bg-green-500/10';
      case 'product':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer':
        return 'text-blue-500 bg-blue-500/10';
      case 'artisan':
        return 'text-green-500 bg-green-500/10';
      case 'admin':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Favorites Management</h1>
          <p className="text-slate-400">Monitor and manage user favorites across the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Favorites</p>
              <p className="text-2xl font-bold text-white">{favorites.length}</p>
            </div>
            <Heart className="w-8 h-8 text-red-500" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Artisan Favorites</p>
              <p className="text-2xl font-bold text-white">
                {favorites.filter(f => f.itemType === 'artisan').length}
              </p>
            </div>
            <User className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Service Favorites</p>
              <p className="text-2xl font-bold text-white">
                {favorites.filter(f => f.itemType === 'service').length}
              </p>
            </div>
            <Star className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Product Favorites</p>
              <p className="text-2xl font-bold text-white">
                {favorites.filter(f => f.itemType === 'product').length}
              </p>
            </div>
            <Heart className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-accent-gold"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
          >
            <option value="all">All Types</option>
            <option value="artisan">Artisans</option>
            <option value="service">Services</option>
            <option value="product">Products</option>
          </select>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as any)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
          >
            <option value="all">All Users</option>
            <option value="customer">Customers</option>
            <option value="artisan">Artisans</option>
            <option value="admin">Admins</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-accent-gold"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Favorites List */}
      <div className="space-y-4">
        {sortedFavorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No favorites found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          sortedFavorites.map((favorite) => (
            <div key={favorite.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Item Image */}
                  <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    {favorite.itemImage ? (
                      <img 
                        src={favorite.itemImage} 
                        alt={favorite.itemName}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      getItemTypeIcon(favorite.itemType)
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getItemTypeColor(favorite.itemType)}`}>
                        {favorite.itemType}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(favorite.userRole)}`}>
                        {favorite.userRole}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-1">{favorite.itemName}</h3>
                    <p className="text-slate-400 text-sm mb-2">{favorite.itemDescription}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      {favorite.itemRating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{favorite.itemRating}</span>
                        </div>
                      )}
                      {favorite.itemLocation && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{favorite.itemLocation}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Added {favorite.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* User Info */}
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">Favorited by:</span>
                    <span className="text-white font-medium">{favorite.userName}</span>
                  </div>
                  {favorite.lastViewed && (
                    <span className="text-slate-400 text-sm">
                      Last viewed: {favorite.lastViewed.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
