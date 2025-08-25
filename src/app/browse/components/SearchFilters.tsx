import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter, ChevronDown, Grid, List, X, BarChart3 } from 'lucide-react';
import { artisanService } from '../../../lib/artisanService';

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
  onCompareClick?: () => void;
}

const categoryLinks = [
  { name: 'Fashion & Clothing', slug: 'fashion', icon: '👗' },
  { name: 'Home & Decor', slug: 'home-decor', icon: '🏠' },
  { name: 'Jewelry & Accessories', slug: 'jewelry', icon: '💍' },
  { name: 'Art & Design', slug: 'art-design', icon: '🎨' },
  { name: 'Food & Catering', slug: 'food-catering', icon: '🍰' },
  { name: 'Digital Services', slug: 'digital-services', icon: '💻' }
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
  setShowFilters,
  onCompareClick
}: SearchFiltersProps) {
  const [categories, setCategories] = useState<string[]>(['All Categories']);
  const [locations, setLocations] = useState<string[]>(['All Locations']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        setLoading(true);
        const [categoriesData, locationsData] = await Promise.all([
          artisanService.getCategories(),
          artisanService.getLocations()
        ]);
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
        // Keep default values if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchFilterData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      {/* Quick Category Links - Mobile Optimized */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Browse by Category</h3>
          {onCompareClick && (
            <button
              onClick={onCompareClick}
              className="flex items-center gap-2 px-3 py-2 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              Compare Artisans
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {categoryLinks.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="inline-flex items-center justify-center gap-2 px-3 py-3 sm:px-4 sm:py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-300 hover:border-[#A4B465] hover:text-[#A4B465] transition-colors text-sm touch-manipulation"
            >
              <span className="text-base sm:text-sm">{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
              <span className="sm:hidden text-xs">{category.name.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter Controls - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Mobile Filter Toggle */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 sm:py-2 bg-slate-800 border border-slate-600 rounded-lg text-white hover:border-[#A4B465] transition-colors touch-manipulation"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            <span className="sm:hidden">Filter</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile Sort Dropdown */}
          <div className="sm:hidden flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-[#A4B465] touch-manipulation"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center gap-4">
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
              className={`p-2 rounded-lg transition-colors touch-manipulation ${
                viewMode === 'grid' 
                  ? 'bg-[#626F47] text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors touch-manipulation ${
                viewMode === 'list' 
                  ? 'bg-[#626F47] text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="sm:hidden flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-colors touch-manipulation ${
                viewMode === 'grid' 
                  ? 'bg-[#626F47] text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-colors touch-manipulation ${
                viewMode === 'list' 
                  ? 'bg-[#626F47] text-white' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filters - Mobile Optimized */}
      {showFilters && (
        <div className="bg-slate-800 rounded-lg p-4 sm:p-6 mb-8 border border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Filters</h4>
            <button
              onClick={() => setShowFilters(false)}
              className="sm:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 sm:py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-[#A4B465] touch-manipulation"
                disabled={loading}
              >
                {loading ? (
                  <option>Loading categories...</option>
                ) : (
                  categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-3 sm:py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-[#A4B465] touch-manipulation"
                disabled={loading}
              >
                {loading ? (
                  <option>Loading locations...</option>
                ) : (
                  locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Rating</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-3 py-3 sm:py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-[#A4B465] touch-manipulation"
              >
                <option value={0}>Any Rating</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.0}>4.0+ Stars</option>
                <option value={3.5}>3.5+ Stars</option>
              </select>
            </div>

            <div className="flex items-center justify-center sm:justify-start">
              <label className="flex items-center gap-3 text-slate-300 touch-manipulation">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-[#A4B465] focus:ring-[#A4B465] focus:ring-2"
                />
                <span className="text-sm sm:text-base">Verified Only</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}