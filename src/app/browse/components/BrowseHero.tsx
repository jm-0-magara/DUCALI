"use client";

import React from 'react';
import SearchWithAutocomplete from '../../../components/search/SearchWithAutocomplete';
import { useTheme } from '../../../contexts/ThemeContext';

interface BrowseHeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function BrowseHero({ searchTerm, setSearchTerm }: BrowseHeroProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDark ? 'text-[#FDF6F0]' : 'text-charcoal-black'
          }`}>
            Browse <span style={{ color: '#B08D57' }}>Artisans</span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDark ? 'text-[#FDF6F0]/80' : 'text-charcoal-black/70'
          }`}>
            Discover talented creators and skilled artisans ready to bring your vision to life
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchWithAutocomplete
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            placeholder="Search artisans, specialties, or skills..."
            className="w-full"
          />
        </div>

        {/* Quick Search Tips */}
        <div className="text-center">
                     <p className={`text-sm mb-4 ${
             isDark ? 'text-[#FDF6F0]/60' : 'text-charcoal-black/60'
           }`}>
            Try searching for: "wedding dress", "wooden furniture", "custom jewelry", "digital art"
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Wedding Dresses', 'Handcrafted Furniture', 'Custom Jewelry', 'Digital Art', 'Custom Cakes'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchTerm(tag);
                  handleSearch(tag);
                }}
                                 className={`px-3 py-1 border rounded-full transition-colors text-sm ${
                   isDark 
                     ? 'bg-slate-800 border-slate-600 text-[#FDF6F0]/80 hover:border-[#B08D57] hover:text-[#B08D57]' 
                     : 'bg-muted border-border text-charcoal-black/80 hover:border-muted-gold hover:text-muted-gold'
                 }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}