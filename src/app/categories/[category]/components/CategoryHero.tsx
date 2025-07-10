import React from 'react';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { CategoryInfo } from '../data/categoryData';

interface CategoryHeroProps {
  category: CategoryInfo;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  totalArtisans: number;
}

export default function CategoryHero({ category, searchTerm, setSearchTerm, totalArtisans }: CategoryHeroProps) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-slate-400 mb-6">
          <Link href="/" className="hover:text-[#A4B465] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-[#A4B465] transition-colors">Browse</Link>
          <span>/</span>
          <span className="text-[#A4B465]">{category.displayName}</span>
        </div>

        {/* Back Button */}
        <Link 
          href="/browse"
          className="inline-flex items-center gap-2 text-slate-300 hover:text-[#A4B465] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Artisans
        </Link>

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">{category.icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {category.displayName}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
            {category.description}
          </p>
          <div className="text-slate-400 mb-8">
            {totalArtisans} skilled artisan{totalArtisans !== 1 ? 's' : ''} available
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${category.displayName.toLowerCase()} artisans...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#A4B465] focus:ring-1 focus:ring-[#A4B465]"
            />
          </div>
        </div>

        {/* Popular Services */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Popular Services</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {category.popularServices.map((service, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-full text-slate-300 text-sm hover:border-[#A4B465] hover:text-[#A4B465] transition-colors cursor-pointer"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}