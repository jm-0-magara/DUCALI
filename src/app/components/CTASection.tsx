"use client";

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';

export default function CTASection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${
      isDark 
        ? 'bg-gradient-to-r from-navy-blue to-wine-red' 
        : 'bg-gradient-to-r from-[#EDE8E0] to-[#E5E0D8]'
    }`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className={`text-3xl font-bold mb-4 ${
          isDark ? 'text-cream' : 'text-charcoal-black'
        }`}>
          Ready to Create Something Amazing?
        </h2>
        <p className={`text-xl mb-8 ${
          isDark ? 'text-cream/80' : 'text-charcoal-black/70'
        }`}>
          Join thousands of satisfied customers who found their perfect artisan on Ducali
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/browse"
            className="px-8 py-4 rounded-lg text-lg font-semibold hover:bg-muted-gold/90 transition-all shadow-lg inline-block bg-muted-gold text-charcoal-black" 
          >
            Start Your Order
          </Link>
          <Link 
            href="/browse"
                         className={`border-2 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#FAF7F2] hover:text-charcoal-black transition-all inline-block border-muted-gold ${
               isDark ? 'text-cream' : 'text-charcoal-black'
             }`}
          >
            Become an Artisan
          </Link>
        </div>
      </div>
    </section>
  );
}