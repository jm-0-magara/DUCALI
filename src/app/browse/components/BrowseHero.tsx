import React from 'react';
import { Search } from 'lucide-react';

interface BrowseHeroProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function BrowseHero({ searchTerm, setSearchTerm }: BrowseHeroProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Browse <span style={{ color: '#A4B465' }}>Artisans</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Discover talented creators and skilled artisans ready to bring your vision to life
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search artisans, specialties, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}