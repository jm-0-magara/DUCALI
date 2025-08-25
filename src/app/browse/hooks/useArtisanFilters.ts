import { useState, useMemo } from 'react';
import { type Artisan } from '../../../lib/artisanService';

export function useArtisanFilters(artisans: Artisan[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort artisans
  const filteredAndSortedArtisans = useMemo(() => {
    const filtered = artisans.filter(artisan => {
      const matchesSearch = artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artisan.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           artisan.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'All Categories' || artisan.category === selectedCategory;
      const matchesLocation = selectedLocation === 'All Locations' || artisan.location === selectedLocation;
      const matchesRating = artisan.rating >= minRating;
      const matchesVerified = !verifiedOnly || artisan.verified;

      return matchesSearch && matchesCategory && matchesLocation && matchesRating && matchesVerified;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        case 'rating':
          return b.rating - a.rating;
        case 'orders':
          return b.totalOrders - a.totalOrders;
        case 'response':
          // Parse response time strings like "Within 24 hours" to get numeric value
          const aTime = parseInt(a.responseTime.replace(/\D/g, '') || '24');
          const bTime = parseInt(b.responseTime.replace(/\D/g, '') || '24');
          return aTime - bTime;
        default:
          return 0;
      }
    });

    return filtered;
  }, [artisans, searchTerm, selectedCategory, selectedLocation, minRating, verifiedOnly, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedLocation('All Locations');
    setMinRating(0);
    setVerifiedOnly(false);
  };

  return {
    searchTerm,
    setSearchTerm,
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
    filteredAndSortedArtisans,
    clearFilters
  };
}