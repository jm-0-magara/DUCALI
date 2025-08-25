"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  price?: string;
}

const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    title: 'Handcrafted Wedding Dress',
    description: 'Custom-made with love and attention to detail',
    image: '/images/carousel/dress.jpg',
    category: 'Fashion',
    price: 'From KSH 80,000'
  },
  {
    id: 2,
    title: 'Artisan Furniture',
    description: 'Unique pieces that tell your story',
    image: '/images/carousel/table.jpg',
    category: 'Home & Decor',
    price: 'From KSH 120,000'
  },
  {
    id: 3,
    title: 'Custom Jewelry',
    description: 'One-of-a-kind pieces crafted just for you',
    image: '/images/carousel/jewelry.jpg',
    category: 'Jewelry',
    price: 'From KSH 30,000'
  },
  {
    id: 4,
    title: 'Artisan Ceramics',
    description: 'Beautiful pottery for your home',
    image: '/images/carousel/vase.jpg',
    category: 'Art & Design',
    price: 'From KSH 15,000'
  },
  {
    id: 5,
    title: 'Leather Craftsmanship',
    description: 'Premium leather goods made to last',
    image: '/images/carousel/leather.jpg',
    category: 'Leather Goods',
    price: 'From KSH 20,000'
  }
];

export default function Carousel() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-advance carousel
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${
      isDark 
        ? 'bg-gradient-to-br from-charcoal-black via-navy-blue to-charcoal-black' 
        : 'bg-gradient-to-br from-[#F5F1EB] via-[#FAF7F2] to-[#F5F1EB]'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDark ? 'text-cream' : 'text-charcoal-black'
          }`}>
            Featured Creations
          </h2>
          <p className={`text-xl ${
            isDark ? 'text-slate-300' : 'text-charcoal-black/70'
          }`}>
            Discover amazing custom work from our talented artisans
          </p>
        </div>
        
        <div className="relative group">
          {/* Main Carousel Container */}
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide) => (
                <div key={slide.id} className="w-full flex-shrink-0 relative">
                  <div className="h-64 sm:h-80 md:h-96 lg:h-[500px] relative overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={slide.id === 1}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex items-end justify-center pb-8 sm:pb-12">
                      <div className="text-center px-4 max-w-2xl">
                        {/* Category Badge */}
                        <div className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white mb-4 bg-muted-gold/90 backdrop-blur-sm border border-white/20">
                          {slide.category}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                          {slide.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-lg sm:text-xl text-white/90 mb-4 drop-shadow-md">
                          {slide.description}
                        </p>
                        
                        {/* Price */}
                        {slide.price && (
                          <div className="inline-block px-4 py-2 rounded-lg text-lg font-semibold text-white bg-black/40 backdrop-blur-sm border border-white/20">
                            {slide.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full text-white bg-black/30 hover:bg-black/50 transition-all duration-200 backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full text-white bg-black/30 hover:bg-black/50 transition-all duration-200 backdrop-blur-sm border border-white/20 opacity-0 group-hover:opacity-100 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="absolute top-4 right-4 p-2 rounded-full text-white bg-black/30 hover:bg-black/50 transition-all duration-200 backdrop-blur-sm border border-white/20"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          {/* Progress Bar */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-muted-gold transition-all duration-1000 ease-linear"
              style={{ width: `${((currentSlide + 1) / carouselSlides.length) * 100}%` }}
            />
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-3">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                  index === currentSlide 
                    ? 'bg-muted-gold scale-125 shadow-lg' 
                    : isDark 
                      ? 'bg-slate-500 hover:bg-slate-400' 
                      : 'bg-charcoal-black/30 hover:bg-charcoal-black/50'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-muted-gold text-white rounded-lg hover:bg-muted-gold/90 transition-all duration-200 hover:scale-105 shadow-lg font-semibold">
            Explore All Creations
          </button>
        </div>
      </div>
    </section>
  );
}