import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Grid, Home } from 'lucide-react';

export default function CategoryNotFound() {
  const validCategories = [
    { name: 'Fashion & Clothing', slug: 'fashion', icon: '👗' },
    { name: 'Home & Decor', slug: 'home-decor', icon: '🏠' },
    { name: 'Jewelry & Accessories', slug: 'jewelry', icon: '💍' },
    { name: 'Art & Design', slug: 'art-design', icon: '🎨' },
    { name: 'Food & Catering', slug: 'food-catering', icon: '🍰' },
    { name: 'Digital Services', slug: 'digital-services', icon: '💻' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="text-8xl mb-4">📂</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Category Not Found
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Sorry, we couldn&apos;t find the category you&apos;re looking for. It may have been moved or doesn&apos;t exist.
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Browse Available Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {validCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors group"
              >
                <div className="text-2xl">{category.icon}</div>
                <div className="text-left">
                  <h3 className="text-white font-medium group-hover:text-[#A4B465] transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link 
            href="/browse"
            className="inline-flex items-center gap-2 bg-[#626F47] text-white px-6 py-3 rounded-lg hover:bg-[#A4B465] transition-colors font-medium"
          >
            <Grid className="w-4 h-4" />
            Browse All Artisans
          </Link>
          
          <Link 
            href="/"
            className="inline-flex items-center gap-2 border-2 border-slate-600 text-slate-300 px-6 py-3 rounded-lg hover:border-[#A4B465] hover:text-[#A4B465] transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="mt-8 text-sm text-slate-500">
          <p>Error Code: 404 | Category Not Found</p>
        </div>
      </div>
    </div>
  );
}