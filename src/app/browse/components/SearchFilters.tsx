import React from 'react';
import Link from 'next/link';
import { Filter, ChevronDown, Grid, List } from 'lucide-react';

interface SearchFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (verified: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const categories = [
  'All Categories',
  'Fashion & Clothing',
  'Home & Decor',
  'Jewelry & Accessories',
  'Art & Design',
  'Food & Catering',
  'Digital Services'
];

const categoryLinks = [
  { name: 'Fashion & Clothing', slug: 'fashion', icon: '👗' },
  { name: 'Home & Decor', slug: 'home-decor', icon: '🏠' },
  { name: 'Jewelry & Accessories', slug: 'jewelry', icon: '💍' },
  { name: 'Art & Design', slug: 'art-design', icon: '🎨' },
  { name: 'Food & Catering', slug: 'food-catering', icon: '🍰' },
  { name: 'Digital Services', slug: 'digital-services', icon: '💻' }
];

const locations = [
  'All Locations',
  'Nairobi',
  'Mombasa',
  'Nakuru',
  'Kisumu',
  'Eldoret'
];

const sortOptions = [
  { value: 'featured', label: 'Featured First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'orders', label: 'Most Orders' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'response', label: 'Fastest Response' }
];

export default function SearchFilters({
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  minRating,
  setMinRating,
  verifiedOnly,
  setVerifiedOnly,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters
}: SearchFiltersProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      {/* Quick Category Links */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Browse by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categoryLinks.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-300 hover:border-[#A4B465] hover:text-[#A4B465] transition-colors text-sm"
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white hover:border-[#A4B465] transition-colors"
        >
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465]"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-[#626F47] text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-[#626F47] text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-[#A4B465]"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-[#A4B465]"
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-[#A4B465]"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.0}>4.0+ Stars</option>
                <option value={3.5}>3.5+ Stars</option>
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 text-slate-300">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465]"
                />
                Verified Only
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}