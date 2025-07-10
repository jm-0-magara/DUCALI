"use client";

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ArtisanHero from './components/ArtisanHero';
import ArtisanPortfolio from './components/ArtisanPortfolio';
import ArtisanReviews from './components/ArtisanReviews';
import ContactForm from './components/ContactForm';
import { getArtisanById } from './data/artisanData';

interface ArtisanProfileProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ArtisanProfile({ params }: ArtisanProfileProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'contact'>('portfolio');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Unwrap params using React.use()
  const resolvedParams = use(params);
  
  // Get artisan data
  const artisan = getArtisanById(parseInt(resolvedParams.id));

  if (!artisan) {
    notFound();
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800'
    }`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <ArtisanHero artisan={artisan} />
      
      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center mb-8">
          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-600">
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
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
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
          {activeTab === 'reviews' && <ArtisanReviews artisan={artisan} />}
          {activeTab === 'contact' && <ContactForm artisan={artisan} />}
        </div>
      </div>

      <Footer />
    </div>
  );
}