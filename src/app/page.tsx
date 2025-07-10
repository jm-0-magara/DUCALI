"use client";

import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Carousel from './components/Carousel';
import Categories from './components/Categories';
import FeaturedArtisans from './components/FeaturedArtisans';
import CTASection from './components/CTASection';
import Footer from './components/Footer';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800'
    }`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <HeroSection />
      <Carousel />
      <Categories darkMode={darkMode} />
      <FeaturedArtisans darkMode={darkMode} />
      <CTASection />
      <Footer />
    </div>
  );
}