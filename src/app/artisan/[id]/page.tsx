"use client";

import React, { useState, useEffect } from 'react';
// import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../components/Footer';
import ArtisanHero from './components/ArtisanHero';
import ArtisanPortfolio from './components/ArtisanPortfolio';
import ReviewsSection from '../../../components/ReviewsSection';
import ContactForm from './components/ContactForm';
import { artisanService, type Artisan } from '../../../lib/artisanService';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export default function ArtisanProfile() {
  const params = useParams();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const artisanId = params.id as string;
  
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'contact'>('portfolio');

  useEffect(() => {
    const loadArtisan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const artisanData = await artisanService.getArtisanById(artisanId);
        if (artisanData) {
          setArtisan(artisanData);
        } else {
          setError('Artisan not found');
        }
      } catch (err) {
        console.error('Error loading artisan:', err);
        setError('Failed to load artisan profile');
      } finally {
        setLoading(false);
      }
    };

    if (artisanId) {
      loadArtisan();
    }
  }, [artisanId]);

     if (loading) {
     return (
       <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'}`}>
         <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#A4B465] mx-auto mb-4" />
            <p className={isDark ? 'text-white' : 'text-slate-900'}>Loading artisan profile...</p>
          </div>
        </div>
      </div>
    );
  }

     if (error || !artisan) {
     return (
       <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'}`}>
         <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error || 'Artisan not found'}</p>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

     return (
     <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'}`}>
       <Header />
      
      <ArtisanHero artisan={artisan} />
      
      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className={`flex ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-slate-200 border-slate-300'} rounded-lg p-1 border`}>
            {[
              { key: 'portfolio', label: 'Portfolio' },
              { key: 'reviews', label: 'Reviews' },
              { key: 'contact', label: 'Get Quote' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#626F47] text-white shadow-md'
                    : isDark 
                      ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'portfolio' && <ArtisanPortfolio artisan={artisan} />}
          {activeTab === 'reviews' && (
            <ReviewsSection 
              artisanId={artisan.id} 
              artisanName={artisan.name}
            />
          )}
          {activeTab === 'contact' && <ContactForm artisan={artisan} />}
        </div>
      </div>

      <Footer />
    </div>
  );
}