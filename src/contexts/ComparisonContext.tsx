"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Artisan } from '../lib/artisanService';

interface ComparisonContextType {
  selectedArtisans: Artisan[];
  addToComparison: (artisan: Artisan) => void;
  removeFromComparison: (artisanId: string) => void;
  clearComparison: () => void;
  isInComparison: (artisanId: string) => boolean;
  comparisonCount: number;
  maxComparisonItems: number;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

interface ComparisonProviderProps {
  children: ReactNode;
}

export function ComparisonProvider({ children }: ComparisonProviderProps) {
  const [selectedArtisans, setSelectedArtisans] = useState<Artisan[]>([]);
  const maxComparisonItems = 4;

  // Load comparison data from localStorage on mount
  useEffect(() => {
    const savedComparison = localStorage.getItem('ducali-comparison');
    if (savedComparison) {
      try {
        const parsed = JSON.parse(savedComparison);
        if (Array.isArray(parsed) && parsed.length <= maxComparisonItems) {
          setSelectedArtisans(parsed);
        }
      } catch (error) {
        console.error('Error loading comparison data:', error);
      }
    }
  }, []);

  // Save comparison data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ducali-comparison', JSON.stringify(selectedArtisans));
  }, [selectedArtisans]);

  const addToComparison = (artisan: Artisan) => {
    setSelectedArtisans(prev => {
      // Check if artisan is already in comparison
      if (prev.some(a => a.id === artisan.id)) {
        return prev;
      }
      
      // Check if we've reached the maximum limit
      if (prev.length >= maxComparisonItems) {
        // Remove the oldest item and add the new one
        return [...prev.slice(1), artisan];
      }
      
      return [...prev, artisan];
    });
  };

  const removeFromComparison = (artisanId: string) => {
    setSelectedArtisans(prev => prev.filter(artisan => artisan.id !== artisanId));
  };

  const clearComparison = () => {
    setSelectedArtisans([]);
  };

  const isInComparison = (artisanId: string) => {
    return selectedArtisans.some(artisan => artisan.id === artisanId);
  };

  const value: ComparisonContextType = {
    selectedArtisans,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount: selectedArtisans.length,
    maxComparisonItems
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}
