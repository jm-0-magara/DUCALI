import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, Loader2, User } from 'lucide-react';
import { type Artisan } from '../../../lib/artisanService';
import FavoriteButton from '../../../components/FavoriteButton';
import ComparisonButton from '../../../components/ComparisonButton';
import { useComparison } from '../../../contexts/ComparisonContext';
import { ProfileImage } from '../../../components/OptimizedImage';

interface ArtisanGridProps {
  artisans: Artisan[];
  viewMode: 'grid' | 'list';
  searchTerm: string;
  clearFilters: () => void;
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function ArtisanGrid({ 
  artisans, 
  viewMode, 
  searchTerm, 
  clearFilters, 
  loading = false,
  hasMore = false,
  onLoadMore 
}: ArtisanGridProps) {
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-slate-300 text-sm sm:text-base">
          Showing {artisans.length} artisan{artisans.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Artisan Grid/List - Mobile Optimized */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' 
          : 'space-y-4'
      }`}>
        {artisans.map((artisan) => (
          <div
            key={artisan.id}
            className={`bg-slate-800 rounded-xl shadow-lg border border-slate-700 hover:shadow-xl hover:shadow-[#A4B465]/20 transition-all relative ${
              viewMode === 'list' ? 'flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-6' : 'p-4 sm:p-6'
            }`}
          >
            {/* Action Buttons - Mobile Optimized */}
            <div className={`absolute top-3 right-3 z-10 flex items-center gap-2 ${
              viewMode === 'list' ? 'sm:relative sm:top-0 sm:right-0 sm:ml-auto' : ''
            }`}>
              <ComparisonButton
                artisan={artisan}
                isSelected={isInComparison(artisan.id)}
                onToggle={(artisanId) => {
                  if (isInComparison(artisanId)) {
                    removeFromComparison(artisanId);
                  } else {
                    addToComparison(artisan);
                  }
                }}
              />
              <FavoriteButton 
                artisan={artisan} 
                size="sm"
                onToggle={(isFavorite) => {
                  console.log(`${artisan.name} ${isFavorite ? 'added to' : 'removed from'} favorites`);
                }}
              />
            </div>

            {/* Artisan Image and Basic Info */}
            <div className={`${viewMode === 'list' ? 'flex-shrink-0 flex items-center gap-4' : 'mb-4'}`}>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  {artisan.profileImage ? (
                    <ProfileImage 
                      src={artisan.profileImage} 
                      alt={artisan.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-600"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
                    </div>
                  )}
                </div>
                {viewMode === 'grid' && (
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mb-1">
                      <span className="truncate">{artisan.name}</span>
                      {artisan.verified && <span className="text-[#A4B465] text-sm flex-shrink-0">✓</span>}
                    </h3>
                    {artisan.featured && (
                      <span className="bg-[#F0BB78] text-slate-900 text-xs px-2 py-1 rounded-full inline-block mb-1">
                        Featured
                      </span>
                    )}
                    <p className="text-slate-300 text-sm truncate">{artisan.specialty}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Artisan Details */}
            <div className="flex-grow">
              {viewMode === 'list' && (
                <div className="mb-3">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 mb-1">
                    <span className="truncate">{artisan.name}</span>
                    {artisan.verified && <span className="text-[#A4B465] text-sm flex-shrink-0">✓</span>}
                  </h3>
                  {artisan.featured && (
                    <span className="bg-[#F0BB78] text-slate-900 text-xs px-2 py-1 rounded-full inline-block mb-1">
                      Featured
                    </span>
                  )}
                  <p className="text-slate-300 text-sm truncate">{artisan.specialty}</p>
                </div>
              )}

              {/* Rating and Stats */}
              <div className="flex items-center gap-4 mb-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#F0BB78]" />
                  <span className="text-white font-medium">{artisan.averageRating || 0}</span>
                  <span className="text-slate-400">({artisan.totalReviews || 0})</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{artisan.location}</span>
                </div>
              </div>

              {/* Additional Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="truncate">{artisan.responseTime || 'Within 24 hours'}</span>
                </div>
                <div className="text-slate-400">
                  <span className="font-medium text-white">{artisan.totalOrders || 0}</span> orders
                </div>
                <div className="text-slate-400 sm:col-span-1 col-span-2">
                  <span className="font-medium text-[#A4B465]">{artisan.priceRange || 'Contact for quote'}</span>
                </div>
              </div>

              {/* Description - Mobile Optimized */}
              <p className="text-slate-400 text-sm mb-4 line-clamp-2 sm:line-clamp-3">
                {artisan.description || 'No description available.'}
              </p>

              {/* Action Buttons - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  href={`/artisan/${artisan.id}`}
                  className="flex-1 sm:flex-none bg-[#A4B465] text-white px-4 py-3 sm:py-2 rounded-lg hover:bg-[#626F47] transition-colors text-center font-medium touch-manipulation"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    // Handle contact action
                    console.log(`Contact ${artisan.name}`);
                  }}
                  className="flex-1 sm:flex-none border border-[#A4B465] text-[#A4B465] px-4 py-3 sm:py-2 rounded-lg hover:bg-[#A4B465] hover:text-white transition-colors text-center font-medium touch-manipulation"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading artisans...</span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && artisans.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-white mb-2">No artisans found</h3>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {searchTerm 
              ? `No artisans match your search for "${searchTerm}". Try adjusting your filters.`
              : 'No artisans match your current filters. Try adjusting your search criteria.'
            }
          </p>
          <button
            onClick={clearFilters}
            className="bg-[#A4B465] text-white px-6 py-3 rounded-lg hover:bg-[#626F47] transition-colors touch-manipulation"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Load More Button - Mobile Optimized */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={onLoadMore}
            className="bg-slate-700 text-white px-8 py-4 rounded-lg hover:bg-slate-600 transition-colors touch-manipulation font-medium"
          >
            Load More Artisans
          </button>
        </div>
      )}
    </div>
  );
}
