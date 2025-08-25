"use client";

import React from 'react';
import Header from '../components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturedArtisans from './components/FeaturedArtisans';
import Categories from './components/Categories';
import CTASection from './components/CTASection';
import Carousel from './components/Carousel';
import { CurrencyProvider } from '../contexts/CurrencyContext';
import MessageButton from '../components/messaging/MessageButton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <CurrencyProvider>
        <Header />
        
        <main className="flex-1">
          <HeroSection />
          <Carousel />
          <Categories />
          <FeaturedArtisans />
          <CTASection />
        </main>
        
        <Footer />
        
        {/* Floating Message Button */}
        <MessageButton variant="floating" />
      </CurrencyProvider>
    </div>
  );
}