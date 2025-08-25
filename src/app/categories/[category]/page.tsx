"use client";

import React, { useState, use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../components/Footer';
import CategoryHero from './components/CategoryHero';
import CategoryFilters from './components/CategoryFilters';
import CategoryGrid from './components/CategoryGrid';
import { getCategoryData } from './data/categoryData';
import { useArtisanFilters } from '../../browse/hooks/useArtisanFilters';
import { artisanService, type Artisan } from '../../../lib/artisanService';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [categoryArtisans, setCategoryArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Unwrap params using React.use()
  const resolvedParams = use(params);
  
  // Get category data
  const categoryData = getCategoryData(resolvedParams.category);
  
  if (!categoryData) {
    notFound();
  }

  // Fetch artisans for this category from Firebase
  useEffect(() => {
    const fetchCategoryArtisans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get artisans for this category
        const filteredArtisans = await artisanService.getArtisansByCategory(categoryData.name, 100);
        
        setCategoryArtisans(filteredArtisans);
      } catch (err) {
        console.error('Error fetching category artisans:', err);
        setError('Failed to load artisans for this category');
        setCategoryArtisans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryArtisans();
  }, [categoryData.name]);

  // Use the same filtering logic as browse page
  const {
    searchTerm,
    setSearchTerm,
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
  } = useArtisanFilters(categoryArtisans);

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800'
      }`}>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-muted-gold mx-auto mb-4"></div>
            <p className="text-white">Loading {categoryData.name} artisans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
          : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800'
      }`}>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-wine-red text-6xl mb-4">⚠️</div>
            <h3 className="text-white text-xl font-semibold mb-2">Unable to load artisans</h3>
            <p className="text-white/80">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800'
    }`}>
      <Header />
      
      <CategoryHero 
        category={categoryData}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        totalArtisans={categoryArtisans.length}
      />
      
      <CategoryFilters 
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
      />
      
      <CategoryGrid 
        artisans={filteredAndSortedArtisans}
        viewMode={viewMode}
        searchTerm={searchTerm}
        categoryName={categoryData.name}
        clearFilters={clearFilters}
      />

      <Footer />
    </div>
  );
}