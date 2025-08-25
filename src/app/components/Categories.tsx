"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../../contexts/ThemeContext';
import { categoryService, Category } from '../../lib/categoryService';
import { Loader2 } from 'lucide-react';

export default function Categories() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get active categories
        const activeCategories = await categoryService.getCategories('active');
        setCategories(activeCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-card/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 ${
            isDark ? 'text-white' : 'text-charcoal-black'
          }`}>
            What Would You Like Made?
          </h2>
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-muted-gold" />
            <span className={`ml-2 text-sm sm:text-base ${isDark ? 'text-white' : 'text-charcoal-black'}`}>
              Loading categories...
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            isDark ? 'text-white' : 'text-charcoal-black'
          }`}>
            What Would You Like Made?
          </h2>
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className={`${isDark ? 'text-white' : 'text-charcoal-black'}`}>
              Unable to load categories. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-card/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 ${
          isDark ? 'text-white' : 'text-charcoal-black'
        }`}>
          What Would You Like Made?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.slug === 'browse' ? '/browse' : `/categories/${category.slug}`}
              className="p-4 sm:p-6 rounded-xl text-center transition-all transform hover:scale-105 shadow-lg hover:shadow-xl border border-muted-gold/20 bg-card/30 backdrop-blur-sm hover:bg-card/50 touch-manipulation"
            >
              <div className="text-2xl sm:text-3xl mb-2">{category.icon}</div>
              <div className={`text-xs sm:text-sm font-medium ${
                isDark ? 'text-white' : 'text-charcoal-black'
              }`}>{category.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}