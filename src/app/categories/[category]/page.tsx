"use client";

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CategoryHero from './components/CategoryHero';
import CategoryFilters from './components/CategoryFilters';
import CategoryGrid from './components/CategoryGrid';
import { getCategoryData, getArtisansByCategory } from './data/categoryData';
import { useArtisanFilters } from '../../browse/hooks/useArtisanFilters';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [darkMode, setDarkMode] = useState(false);

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

  // Get artisans for this category
  const categoryArtisans = getArtisansByCategory(categoryData.name);

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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800'
    }`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
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