import React from 'react';
import Link from 'next/link';

interface CategoriesProps {
  darkMode: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

const categories: Category[] = [
  { id: 'all', name: 'All Categories', icon: '🎨', slug: 'browse' },
  { id: 'fashion', name: 'Fashion & Clothing', icon: '👗', slug: 'fashion' },
  { id: 'home', name: 'Home & Decor', icon: '🏠', slug: 'home-decor' },
  { id: 'jewelry', name: 'Jewelry & Accessories', icon: '💍', slug: 'jewelry' },
  { id: 'art', name: 'Art & Design', icon: '🎨', slug: 'art-design' },
  { id: 'food', name: 'Food & Catering', icon: '🍰', slug: 'food-catering' },
  { id: 'digital', name: 'Digital Services', icon: '💻', slug: 'digital-services' }
];

export default function Categories({ darkMode }: CategoriesProps) {
  return (
    <section 
      className="py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      style={{
        backgroundColor: darkMode ? 'rgba(28, 28, 28, 0.5)' : 'rgba(29, 45, 80, 0.3)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#FDF6F0' }}>
          What Would You Like Made?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.slug === 'browse' ? '/browse' : `/categories/${category.slug}`}
              className="p-6 rounded-xl text-center transition-all transform hover:scale-105 shadow-lg hover:shadow-xl border"
              style={{
                backgroundColor: darkMode 
                  ? 'rgba(28, 28, 28, 0.8)' 
                  : 'rgba(253, 246, 240, 0.1)',
                color: '#FDF6F0',
                borderColor: 'rgba(253, 246, 240, 0.2)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <div className="text-3xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium">{category.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}