// src/app/dashboard/artisan/components/ArtisanPortfolioManager.tsx
import React, { useState } from 'react';
import { Plus, Edit3, Eye, Star, Trash2 } from 'lucide-react';
import { PortfolioItem } from '../../../../types';

const mockPortfolio: PortfolioItem[] = [
  {
    id: 1,
    title: 'Elegant Mermaid Wedding Dress',
    description: 'Custom mermaid-style wedding dress with hand-sewn pearls and lace detailing',
    price: '$450',
    timeframe: '6 weeks',
    placeholder: '👰‍♀️',
    category: 'Wedding Dress',
    views: 234,
    likes: 45
  },
  {
    id: 2,
    title: 'Traditional Kenyan Wedding Gown',
    description: 'Beautiful fusion of modern silhouette with traditional Kenyan beadwork',
    price: '$380',
    timeframe: '5 weeks',
    placeholder: '✨',
    category: 'Cultural Wear',
    views: 187,
    likes: 32
  },
  {
    id: 3,
    title: 'Vintage-Inspired Evening Dress',
    description: 'Art deco inspired evening gown with intricate embroidery',
    price: '$320',
    timeframe: '4 weeks',
    placeholder: '🌟',
    category: 'Evening Wear',
    views: 156,
    likes: 28
  },
  {
    id: 4,
    title: 'Modern Cocktail Dress',
    description: 'Sleek contemporary design with bold colors and clean lines',
    price: '$250',
    timeframe: '3 weeks',
    placeholder: '🍸',
    category: 'Cocktail Wear',
    views: 89,
    likes: 15
  }
];

export function ArtisanPortfolioManager() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  const categories = ['All Categories', 'Wedding Dress', 'Evening Wear', 'Cultural Wear', 'Cocktail Wear'];
  
  const filteredPortfolio = selectedCategory === 'All Categories' 
    ? mockPortfolio 
    : mockPortfolio.filter(item => item.category === selectedCategory);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Portfolio Management</h2>
        <button className="bg-[#626F47] text-white px-4 py-2 rounded-lg hover:bg-[#A4B465] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Item
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredPortfolio.map((item) => (
          <div key={item.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden group hover:border-[#A4B465] transition-colors">
            <div className="h-48 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-6xl relative">
              {item.placeholder}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-opacity-30 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-2 text-white hover:bg-opacity-30 transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-semibold">{item.title}</h3>
                <span className="text-xs bg-[#626F47] text-white px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex justify-between items-center mb-3">
                <span className="text-[#A4B465] font-semibold">{item.price}</span>
                <span className="text-slate-500 text-sm">{item.timeframe}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-700 pt-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{item.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{item.likes}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-[#A4B465] hover:text-white transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="text-red-400 hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Stats */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Portfolio Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#A4B465]">{mockPortfolio.length}</div>
            <div className="text-slate-400 text-sm">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#A4B465]">
              {mockPortfolio.reduce((sum, item) => sum + (item.views || 0), 0)}
            </div>
            <div className="text-slate-400 text-sm">Total Views</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#A4B465]">
              {mockPortfolio.reduce((sum, item) => sum + (item.likes || 0), 0)}
            </div>
            <div className="text-slate-400 text-sm">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#A4B465]">
              {Math.round(mockPortfolio.reduce((sum, item) => sum + (item.views || 0), 0) / mockPortfolio.length)}
            </div>
            <div className="text-slate-400 text-sm">Avg Views</div>
          </div>
        </div>
      </div>
    </div>
  );
}