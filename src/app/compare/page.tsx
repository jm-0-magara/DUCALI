"use client";

import React, { useState } from 'react';
import { Scale, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../components/Footer';
import ComparisonTool from '../../components/ComparisonTool';
import { useComparison } from '../../contexts/ComparisonContext';
import { artisanService, type Artisan } from '../../lib/artisanService';

export default function ComparePage() {
  const { selectedArtisans, clearComparison } = useComparison();
  const [showComparisonTool, setShowComparisonTool] = useState(false);
  const [allArtisans, setAllArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const loadAllArtisans = async () => {
      try {
        setLoading(true);
        const result = await artisanService.getArtisans();
        setAllArtisans(result.artisans);
      } catch (error) {
        console.error('Error loading artisans:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllArtisans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/browse"
              className="inline-flex items-center text-[#A4B465] hover:text-[#626F47] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Browse
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">Compare Artisans</h1>
            <p className="text-slate-300 text-lg">
              Compare up to 4 artisans side-by-side to make the best choice for your project
            </p>
          </div>

          {/* Current Comparison Status */}
          <div className="bg-slate-800 rounded-xl p-6 mb-8 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white flex items-center">
                <Scale className="w-6 h-6 mr-3 text-[#A4B465]" />
                Your Comparison
              </h2>
              {selectedArtisans.length > 0 && (
                <button
                  onClick={clearComparison}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {selectedArtisans.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚖️</div>
                <h3 className="text-white font-semibold mb-2">No artisans selected for comparison</h3>
                <p className="text-slate-400 mb-6">
                  Start comparing artisans by browsing our marketplace and adding them to your comparison list.
                </p>
                <Link
                  href="/browse"
                  className="bg-[#A4B465] text-white px-6 py-3 rounded-lg hover:bg-[#626F47] transition-colors inline-block"
                >
                  Browse Artisans
                </Link>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {selectedArtisans.map((artisan) => (
                    <div key={artisan.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-full overflow-hidden mr-3">
                          {artisan.profileImage ? (
                            <img
                              src={artisan.profileImage}
                              alt={artisan.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              {artisan.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{artisan.name}</h4>
                          <p className="text-slate-400 text-sm">{artisan.specialty}</p>
                        </div>
                      </div>
                      <div className="text-sm text-slate-300">
                        <div className="flex items-center mb-1">
                          <span className="text-[#F0BB78]">★</span>
                          <span className="ml-1">{artisan.averageRating || 0}</span>
                          <span className="ml-1 text-slate-400">({artisan.totalReviews || 0})</span>
                        </div>
                        <div className="text-[#A4B465] font-medium">{artisan.priceRange}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowComparisonTool(true)}
                    className="bg-[#A4B465] text-white px-8 py-3 rounded-lg hover:bg-[#626F47] transition-colors"
                  >
                    View Detailed Comparison
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add More Artisans Section */}
          {selectedArtisans.length < 4 && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">Add More Artisans</h2>
                <span className="text-slate-400">
                  {selectedArtisans.length}/4 selected
                </span>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="text-slate-400">Loading artisans...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allArtisans.slice(0, 6).map((artisan) => (
                    <div key={artisan.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-[#A4B465] transition-colors">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-slate-600 rounded-full overflow-hidden mr-3">
                          {artisan.profileImage ? (
                            <img
                              src={artisan.profileImage}
                              alt={artisan.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                              {artisan.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{artisan.name}</h4>
                          <p className="text-slate-400 text-sm">{artisan.specialty}</p>
                        </div>
                        <button
                          onClick={() => setShowComparisonTool(true)}
                          className="p-2 bg-[#A4B465] text-white rounded-full hover:bg-[#626F47] transition-colors"
                          title="Add to comparison"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-sm text-slate-300">
                        <div className="flex items-center mb-1">
                          <span className="text-[#F0BB78]">★</span>
                          <span className="ml-1">{artisan.averageRating || 0}</span>
                          <span className="ml-1 text-slate-400">({artisan.totalReviews || 0})</span>
                        </div>
                        <div className="text-[#A4B465] font-medium">{artisan.priceRange}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-center mt-6">
                <Link
                  href="/browse"
                  className="bg-[#626F47] text-white px-6 py-3 rounded-lg hover:bg-[#A4B465] transition-colors inline-block"
                >
                  Browse All Artisans
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Comparison Tool Modal */}
      {showComparisonTool && (
        <ComparisonTool />
      )}
    </div>
  );
}
