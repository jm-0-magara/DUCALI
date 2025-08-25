"use client";

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../components/Footer';
import BrowseHero from './components/BrowseHero';
import SearchFilters from './components/SearchFilters';
import ArtisanGrid from './components/ArtisanGrid';
import ComparisonTool from '../../components/ComparisonTool';
import { artisanService, type Artisan, type SearchFilters as ArtisanSearchFilters } from '../../lib/artisanService';

export default function BrowseArtisans() {
  const [darkMode, setDarkMode] = useState(false);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Fetch artisans from Firebase
  const fetchArtisans = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const filters: ArtisanSearchFilters = {
        category: selectedCategory !== 'All Categories' ? selectedCategory : undefined,
        location: selectedLocation !== 'All Locations' ? selectedLocation : undefined,
        minRating: minRating > 0 ? minRating : undefined,
        verifiedOnly: verifiedOnly,
        searchTerm: searchTerm.trim() || undefined,
      };

      const result = await artisanService.getArtisans(filters, 20, isRefresh ? null : lastDoc);
      
      if (isRefresh) {
        setArtisans(result.artisans);
        setLastDoc(result.lastDoc);
      } else {
        setArtisans(prev => [...prev, ...result.artisans]);
        setLastDoc(result.lastDoc);
      }
      
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error fetching artisans:', err);
      setError('Failed to load artisans. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchArtisans(true);
  }, []);

  // Refresh data when filters change
  useEffect(() => {
    if (!loading) {
      fetchArtisans(true);
    }
  }, [selectedCategory, selectedLocation, minRating, verifiedOnly, searchTerm]);

  // Sort artisans based on selected sort option
  const sortedArtisans = React.useMemo(() => {
    const sorted = [...artisans];
    
    switch (sortBy) {
      case 'featured':
        sorted.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'orders':
        sorted.sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case 'price-low':
        sorted.sort((a, b) => {
          const aPrice = parseFloat(a.priceRange.replace(/[^0-9.]/g, '')) || 0;
          const bPrice = parseFloat(b.priceRange.replace(/[^0-9.]/g, '')) || 0;
          return aPrice - bPrice;
        });
        break;
      case 'price-high':
        sorted.sort((a, b) => {
          const aPrice = parseFloat(a.priceRange.replace(/[^0-9.]/g, '')) || 0;
          const bPrice = parseFloat(b.priceRange.replace(/[^0-9.]/g, '')) || 0;
          return bPrice - aPrice;
        });
        break;
      case 'response':
        sorted.sort((a, b) => {
          const aTime = parseInt(a.responseTime.replace(/[^0-9]/g, '')) || 24;
          const bTime = parseInt(b.responseTime.replace(/[^0-9]/g, '')) || 24;
          return aTime - bTime;
        });
        break;
      default:
        break;
    }
    
    return sorted;
  }, [artisans, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedLocation('All Locations');
    setMinRating(0);
    setVerifiedOnly(false);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchArtisans(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-[#1C1C1C] via-[#1D2D50] to-[#1C1C1C]' 
        : 'bg-gradient-to-br from-[#1D2D50] via-[#B08D57] to-[#6E1414]'
    }`}>
      <Header />
      
      <BrowseHero 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <SearchFilters 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        minRating={minRating}
        setMinRating={setMinRating}
        verifiedOnly={verifiedOnly}
        setVerifiedOnly={setVerifiedOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        onCompareClick={() => setShowComparison(true)}
      />
      
      {/* Comparison Tool Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-2xl font-bold text-white">Compare Artisans</h2>
              <button
                onClick={() => setShowComparison(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <ComparisonTool />
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !refreshing && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B08D57] mx-auto mb-4"></div>
            <p className="text-[#FDF6F0] text-lg">Loading artisans...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-[#FDF6F0] text-xl font-semibold mb-2">Something went wrong</h3>
            <p className="text-[#FDF6F0]/80 mb-6">{error}</p>
            <button
              onClick={() => fetchArtisans(true)}
              disabled={refreshing}
              className="bg-[#6E1414] text-[#FDF6F0] px-6 py-3 rounded-lg hover:bg-[#6E1414]/80 transition-colors disabled:opacity-50"
            >
              {refreshing ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        </div>
      )}

      {/* Artisan Grid */}
      {!loading && !error && (
        <ArtisanGrid 
          artisans={sortedArtisans}
          viewMode={viewMode}
          searchTerm={searchTerm}
          clearFilters={clearFilters}
          loading={refreshing}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      )}

      <Footer />
    </div>
  );
}