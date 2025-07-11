// src/app/dashboard/customer/components/CustomerFavorites.tsx
import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Heart } from 'lucide-react';
import { mockFavoriteArtisans } from '../../../../data/mockDashboardData';

export function CustomerFavorites() {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-[#F0BB78] fill-current' : 'text-slate-500'
        }`}
      />
    ));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Favorite Artisans</h2>
      
      {mockFavoriteArtisans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockFavoriteArtisans.map((artisan) => (
            <div key={artisan.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{artisan.image}</div>
                <div>
                  <h3 className="text-white font-semibold">{artisan.name}</h3>
                  <p className="text-slate-400">{artisan.specialty}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 text-sm">{artisan.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {renderStars(Math.floor(artisan.rating))}
                  <span className="text-slate-400 ml-1">{artisan.rating}</span>
                </div>
                <div className="flex gap-2">
                  <button className="text-red-400 hover:text-red-300 transition-colors">
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                  <Link
                    href={`/artisan/${artisan.id}`}
                    className="text-[#A4B465] hover:text-white transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
          <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">No Favorites Yet</h3>
          <p className="text-slate-400 mb-4">
            Discover amazing artisans and save your favorites for easy access.
          </p>
          <Link
            href="/browse"
            className="bg-[#626F47] text-white px-6 py-2 rounded-lg hover:bg-[#A4B465] transition-colors inline-block"
          >
            Browse Artisans
          </Link>
        </div>
      )}
    </div>
  );
}