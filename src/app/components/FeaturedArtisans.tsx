"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';
import { artisanService, type Artisan } from '../../lib/artisanService';
import FavoriteButton from '../../components/FavoriteButton';
import ComparisonButton from '../../components/ComparisonButton';
import { useComparison } from '../../contexts/ComparisonContext';
import { ProfileImage } from '../../components/OptimizedImage';
import { useTheme } from '../../contexts/ThemeContext';

export default function FeaturedArtisans() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [featuredArtisans, setFeaturedArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();

  useEffect(() => {
    const fetchFeaturedArtisans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get featured artisans from the database
        const artisans = await artisanService.getFeaturedArtisans(6);
        
        console.log(`✅ Loaded ${artisans.length} featured artisans from database`);
        setFeaturedArtisans(artisans);
      } catch (err) {
        console.error('Error fetching featured artisans:', err);
        setError('Failed to load featured artisans');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArtisans();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-navy-blue/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-charcoal-black'
            }`}>
              Meet Our Featured Artisans
            </h2>
            <p className={`text-xl ${
              isDark ? 'text-white/80' : 'text-charcoal-black/70'
            }`}>
              Skilled creators ready to bring your vision to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl shadow-lg border border-muted-gold/30 p-6 bg-card/30 animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-muted-gold/20 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted-gold/20 rounded mb-2"></div>
                    <div className="h-3 bg-muted-gold/20 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-muted-gold/20 rounded"></div>
                  <div className="h-3 bg-muted-gold/20 rounded w-4/5"></div>
                  <div className="h-8 bg-muted-gold/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-navy-blue/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-wine-red text-6xl mb-4">⚠️</div>
            <h3 className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-charcoal-black'
            }`}>Unable to load featured artisans</h3>
            <p className={`${
              isDark ? 'text-white/80' : 'text-charcoal-black/70'
            }`}>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-navy-blue/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-charcoal-black'
          }`}>
            Meet Our Featured Artisans
          </h2>
          <p className={`text-xl ${
            isDark ? 'text-white/80' : 'text-charcoal-black/70'
          }`}>
            Skilled creators ready to bring your vision to life
          </p>

        </div>
        
        {featuredArtisans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArtisans.map((artisan) => (
              <div key={artisan.id} className="rounded-xl shadow-lg border border-muted-gold/30 transition-all hover:shadow-xl hover:shadow-muted-gold/20 p-6 relative bg-card/30 hover:bg-card/50">
                {/* Action Buttons - Top Right */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <ComparisonButton
                    artisan={artisan}
                    isSelected={isInComparison(artisan.id)}
                    onToggle={(artisanId) => {
                      if (isInComparison(artisanId)) {
                        removeFromComparison(artisanId);
                      } else {
                        addToComparison(artisan);
                      }
                    }}
                  />
                  <FavoriteButton 
                    artisan={artisan} 
                    size="sm"
                    onToggle={(isFavorite) => {
                      console.log(`${artisan.name} ${isFavorite ? 'added to' : 'removed from'} favorites`);
                    }}
                  />
                </div>

                <div className="flex items-center mb-4">
                  <ProfileImage src={artisan.profileImage} alt={artisan.name} className="w-16 h-16 mr-4" />
                  <div>
                    <h3 className={`text-xl font-bold flex items-center gap-2 ${
                      isDark ? 'text-white' : 'text-charcoal-black'
                    }`}>
                      {artisan.name}
                      {artisan.verified && <span className="text-green-400 text-sm">✓</span>}
                    </h3>
                    <p className={`${
                      isDark ? 'text-white/80' : 'text-charcoal-black/70'
                    }`}>{artisan.specialty}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 fill-current text-muted-gold" />
                    <span className={`ml-1 ${
                      isDark ? 'text-white' : 'text-charcoal-black'
                    }`}>{artisan.rating.toFixed(1)}</span>
                    <span className={`ml-1 ${
                      isDark ? 'text-white/60' : 'text-charcoal-black/60'
                    }`}>({artisan.totalOrders} orders)</span>
                  </div>
                  <div className={`flex items-center ${
                    isDark ? 'text-white/60' : 'text-charcoal-black/60'
                  }`}>
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{artisan.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="font-semibold text-muted-gold">{artisan.priceRange}</div>
                  <div className={`flex items-center ${
                    isDark ? 'text-white/60' : 'text-charcoal-black/60'
                  }`}>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{artisan.responseTime}</span>
                  </div>
                </div>
                
                <Link 
                  href={`/artisan/${artisan.id}`}
                  className={`w-full py-3 rounded-lg transition-colors shadow-md inline-block text-center ${
                    isDark ? 'text-white bg-wine-red hover:bg-wine-red/80' : 'text-cream bg-wine-red hover:bg-wine-red/80'
                  }`}
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍🎨</div>
            <h3 className={`font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-charcoal-black'
            }`}>No featured artisans yet</h3>
            <p className={`mb-6 ${
              isDark ? 'text-white/80' : 'text-charcoal-black/70'
            }`}>
              Check back soon to see our featured artisans!
            </p>
            <Link
              href="/browse"
              className={`px-6 py-3 rounded-lg transition-colors inline-block ${
                isDark ? 'bg-wine-red text-white hover:bg-wine-red/80' : 'bg-wine-red text-cream hover:bg-wine-red/80'
              }`}
            >
              Browse All Artisans
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}