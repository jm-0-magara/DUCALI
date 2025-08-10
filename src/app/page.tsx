"use client";

import React, { useState } from 'react';
import Header from '../components/Header';
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
    <div className={`min-h-screen transition-colors duration-300`}
         style={{
           background: darkMode 
             ? 'linear-gradient(to bottom right, #1C1C1C, #1D2D50, #1C1C1C)'
             : 'linear-gradient(to bottom right, #1D2D50, #B08D57, #6E1414)'
         }}>
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