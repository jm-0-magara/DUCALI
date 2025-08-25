"use client";

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Footer from './components/Footer';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-charcoal-black via-navy-blue to-charcoal-black' 
        : 'bg-gradient-to-br from-[#F5F1EB] via-[#FAF7F2] to-[#F5F1EB]'
    }`}>
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
              isDark ? 'bg-slate-800/50' : 'bg-card/50'
            } border-2 border-muted-gold/30`}>
              <span className="text-6xl">404</span>
            </div>
          </div>

          {/* Error Message */}
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-charcoal-black'
          }`}>
            Page Not Found
          </h1>
          
          <p className={`text-xl mb-8 ${
            isDark ? 'text-slate-300' : 'text-charcoal-black/70'
          }`}>
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="/"
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                isDark 
                  ? 'bg-wine-red text-cream hover:bg-wine-red/80' 
                  : 'bg-wine-red text-cream hover:bg-wine-red/80'
              }`}
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            
            <Link 
              href="/browse"
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors border-2 ${
                isDark 
                  ? 'border-muted-gold text-muted-gold hover:bg-muted-gold hover:text-charcoal-black' 
                  : 'border-muted-gold text-muted-gold hover:bg-muted-gold hover:text-charcoal-black'
              }`}
            >
              <Search className="w-5 h-5" />
              Browse Artisans
            </Link>
          </div>

          {/* Popular Pages */}
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-slate-800/50' : 'bg-card/50'
          } border border-muted-gold/20`}>
            <h2 className={`text-lg font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-charcoal-black'
            }`}>
              Popular Pages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link 
                href="/how-it-works"
                className={`p-3 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' 
                    : 'text-charcoal-black/70 hover:text-charcoal-black hover:bg-muted/50'
                }`}
              >
                How It Works
              </Link>
              <Link 
                href="/for-artisans"
                className={`p-3 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' 
                    : 'text-charcoal-black/70 hover:text-charcoal-black hover:bg-muted/50'
                }`}
              >
                For Artisans
              </Link>
              <Link 
                href="/categories/fashion"
                className={`p-3 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' 
                    : 'text-charcoal-black/70 hover:text-charcoal-black hover:bg-muted/50'
                }`}
              >
                Fashion & Clothing
              </Link>
              <Link 
                href="/for-artisans/support"
                className={`p-3 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' 
                    : 'text-charcoal-black/70 hover:text-charcoal-black hover:bg-muted/50'
                }`}
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
