"use client";

import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../components/Footer';
import BrowseHero from './components/BrowseHero';
import SearchFilters from './components/SearchFilters';
import ArtisanGrid from './components/ArtisanGrid';
import { mockArtisans } from './data/artisans';
import { useArtisanFilters } from './hooks/useArtisanFilters';

export default function BrowseArtisans() {
  const [darkMode, setDarkMode] = useState(false);

  const {
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
  } = useArtisanFilters(mockArtisans);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-[#1C1C1C] via-[#1D2D50] to-[#1C1C1C]' 
        : 'bg-gradient-to-br from-[#1D2D50] via-[#B08D57] to-[#6E1414]'
    }`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
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
      />
      
      <ArtisanGrid 
        artisans={filteredAndSortedArtisans}
        viewMode={viewMode}
        searchTerm={searchTerm}
        clearFilters={clearFilters}
      />

      <Footer />
    </div>
  );
}