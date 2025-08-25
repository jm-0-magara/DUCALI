"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';
import { reviewsService } from '../../lib/reviewsService';

export default function HeroSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState({
    totalArtisans: 500,
    totalOrders: 2500,
    averageRating: 4.9
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const platformStats = await reviewsService.getPlatformReviewStats();
        setStats({
          totalArtisans: platformStats.totalArtisans,
          totalOrders: platformStats.totalOrders,
          averageRating: platformStats.averageRating
        });
      } catch (error) {
        console.error('Error fetching platform stats:', error);
        // Keep default values if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className={`relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 ${
      isDark 
        ? 'bg-gradient-to-br from-charcoal-black via-navy-blue to-charcoal-black' 
        : 'bg-gradient-to-br from-[#F5F1EB] via-[#FAF7F2] to-[#F5F1EB]'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className={`font-bold mb-4 sm:mb-6 ${
            isDark ? 'text-cream' : 'text-charcoal-black'
          }`}>
            Bring Your <span className="text-muted-gold">Vision</span> to Life
          </h1>
          <p className={`mb-6 sm:mb-8 max-w-3xl mx-auto ${
            isDark ? 'text-cream/80' : 'text-charcoal-black/70'
          }`}>
            Connect with skilled artisans and creators to get custom-made products that are uniquely yours. 
            From wedding dresses to handcrafted furniture, we make bespoke accessible.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
            <button 
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transform hover:scale-105 transition-all shadow-lg bg-wine-red text-cream hover:bg-wine-red/90 touch-manipulation"
            >
              Start Your Custom Order
            </button>
            <Link 
              href="/browse" 
              className="border-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition-all inline-block text-center hover:opacity-80 border-muted-gold text-muted-gold hover:bg-muted-gold hover:text-white touch-manipulation"
            >
              Browse Artisans
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-muted-gold">
                {loading ? '...' : `${stats.totalArtisans}+`}
              </div>
              <div className={`text-sm sm:text-base ${isDark ? 'text-cream/60' : 'text-charcoal-black/60'}`}>Verified Artisans</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-muted-gold">
                {loading ? '...' : `${stats.totalOrders.toLocaleString()}+`}
              </div>
              <div className={`text-sm sm:text-base ${isDark ? 'text-cream/60' : 'text-charcoal-black/60'}`}>Orders Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-muted-gold">
                {loading ? '...' : `${stats.averageRating}★`}
              </div>
              <div className={`text-sm sm:text-base ${isDark ? 'text-cream/60' : 'text-charcoal-black/60'}`}>Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}