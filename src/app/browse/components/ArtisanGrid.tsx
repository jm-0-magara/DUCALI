import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';

interface Artisan {
  id: number;
  name: string;
  specialty: string;
  category: string;
  rating: number;
  orders: number;
  location: string;
  image: string;
  price: string;
  responseTime: string;
  description: string;
  skills: string[];
  verified: boolean;
  featured: boolean;
}

interface ArtisanGridProps {
  artisans: Artisan[];
  viewMode: 'grid' | 'list';
  searchTerm: string;
  clearFilters: () => void;
}

export default function ArtisanGrid({ artisans, viewMode, searchTerm, clearFilters }: ArtisanGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-slate-300">
          Showing {artisans.length} artisan{artisans.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Artisan Grid/List */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
      }`}>
        {artisans.map((artisan) => (
          <div
            key={artisan.id}
            className={`bg-slate-800 rounded-xl shadow-lg border border-slate-700 hover:shadow-xl hover:shadow-[#A4B465]/20 transition-all p-6 ${
              viewMode === 'list' ? 'flex items-center gap-6' : ''
            }`}
          >
            <div className={`${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{artisan.image}</div>
                {viewMode === 'grid' && (
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      {artisan.name}
                      {artisan.verified && <span className="text-[#A4B465] text-sm">✓</span>}
                      {artisan.featured && <span className="bg-[#F0BB78] text-slate-900 text-xs px-2 py-1 rounded-full">Featured</span>}
                    </h3>
                    <p className="text-slate-300">{artisan.specialty}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-grow">
              {viewMode === 'list' && (
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {artisan.name}
                    {artisan.verified && <span className="text-[#A4B465] text-sm">✓</span>}
                    {artisan.featured && <span className="bg-[#F0BB78] text-slate-900 text-xs px-2 py-1 rounded-full">Featured</span>}
                  </h3>
                  <p className="text-slate-300">{artisan.specialty}</p>
                </div>
              )}

              <p className="text-slate-400 text-sm mb-4">{artisan.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 fill-current" style={{ color: '#F0BB78' }} />
                  <span className="ml-1 text-slate-300">{artisan.rating}</span>
                  <span className="ml-1 text-slate-400">({artisan.orders} orders)</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{artisan.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold" style={{ color: '#A4B465' }}>{artisan.price}</div>
                <div className="flex items-center text-slate-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{artisan.responseTime}</span>
                </div>
              </div>

              <Link 
                href={`/artisan/${artisan.id}`}
                className="w-full text-white py-3 rounded-lg hover:bg-[#626F47] transition-colors shadow-md inline-block text-center" 
                style={{ backgroundColor: '#626F47' }}
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {artisans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No artisans found matching your criteria.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-[#626F47] text-white rounded-lg hover:bg-[#A4B465] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}