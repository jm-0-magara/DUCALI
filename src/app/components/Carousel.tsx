import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    title: 'Handcrafted Wedding Dress',
    description: 'Custom-made with love and attention to detail',
    image: '/images/carousel/dress.jpg',
    category: 'Fashion'
  },
  {
    id: 2,
    title: 'Artisan Furniture',
    description: 'Unique pieces that tell your story',
    image: '/images/carousel/table.jpg',
    category: 'Home & Decor'
  },
  {
    id: 3,
    title: 'Custom Jewelry',
    description: 'One-of-a-kind pieces crafted just for you',
    image: '/images/carousel/jewelry.jpg',
    category: 'Jewelry'
  },
  {
    id: 4,
    title: 'Artisan Ceramics',
    description: 'Beautiful pottery for your home',
    image: '/images/carousel/vase.jpg',
    category: 'Art & Design'
  }
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Featured Creations
          </h2>
          <p className="text-xl text-slate-300">
            Discover amazing custom work from our talented artisans
          </p>
        </div>
        
        <div className="relative">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide) => (
                <div key={slide.id} className="w-full flex-shrink-0 relative">
                  <div className="h-96 relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-600">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center px-4">
                        <div className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white mb-2" style={{ backgroundColor: '#626F47' }}>
                          {slide.category}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{slide.title}</h3>
                        <p className="text-slate-200 max-w-md mx-auto">{slide.description}</p>
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white hover:bg-[#626F47] transition-all shadow-lg"
            style={{ backgroundColor: 'rgba(162, 180, 101, 0.8)' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full text-white hover:bg-[#626F47] transition-all shadow-lg"
            style={{ backgroundColor: 'rgba(162, 180, 101, 0.8)' }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-[#A4B465] scale-125' 
                    : 'bg-slate-500 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}