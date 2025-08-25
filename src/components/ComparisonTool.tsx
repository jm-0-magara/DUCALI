"use client";

import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Clock, Shield, Award, Trash2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { type Artisan, artisanService } from '../lib/artisanService';
import StarRating from './StarRating';
import { useAuth } from '../contexts/AuthContext';
import FavoriteButton from './FavoriteButton';

interface ComparisonToolProps {
  className?: string;
}

interface ComparisonArtisan extends Artisan {
  isSelected: boolean;
}

export default function ComparisonTool({ className = '' }: ComparisonToolProps) {
  const { user } = useAuth();
  const [artisans, setArtisans] = useState<ComparisonArtisan[]>([]);
  const [selectedArtisans, setSelectedArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Load real artisans for comparison
  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get featured artisans for comparison
        const realArtisans = await artisanService.getFeaturedArtisans(10);
        
        // Convert to ComparisonArtisan format
        const comparisonArtisans: ComparisonArtisan[] = realArtisans.map(artisan => ({
          ...artisan,
          isSelected: false
        }));
        
        setArtisans(comparisonArtisans);
      } catch (err) {
        console.error('Error fetching artisans for comparison:', err);
        setError('Failed to load artisans for comparison');
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  const toggleArtisanSelection = (artisanId: string) => {
    setArtisans(prev => prev.map(artisan => 
      artisan.id === artisanId 
        ? { ...artisan, isSelected: !artisan.isSelected }
        : artisan
    ));
  };

  const addToComparison = () => {
    const selected = artisans.filter(artisan => artisan.isSelected);
    if (selected.length >= 2 && selected.length <= 4) {
      setSelectedArtisans(selected);
      setShowComparison(true);
    } else {
      alert('Please select between 2 and 4 artisans to compare.');
    }
  };

  const removeFromComparison = (artisanId: string) => {
    setSelectedArtisans(prev => prev.filter(artisan => artisan.id !== artisanId));
    if (selectedArtisans.length <= 2) {
      setShowComparison(false);
    }
  };

  const clearComparison = () => {
    setSelectedArtisans([]);
    setShowComparison(false);
    setArtisans(prev => prev.map(artisan => ({ ...artisan, isSelected: false })));
  };

  const comparisonFeatures = [
    { key: 'rating', label: 'Rating', icon: Star },
    { key: 'totalReviews', label: 'Reviews', icon: Star },
    { key: 'totalOrders', label: 'Orders', icon: Award },
    { key: 'responseTime', label: 'Response Time', icon: Clock },
    { key: 'experience', label: 'Experience', icon: Award },
    { key: 'priceRange', label: 'Price Range', icon: Award },
    { key: 'verified', label: 'Verified', icon: Shield },
    { key: 'featured', label: 'Featured', icon: Award }
  ];

  if (loading) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-700 ${className}`}>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#A4B465]" />
            <span className="ml-2 text-slate-400">Loading artisans for comparison...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-700 ${className}`}>
        <div className="p-6">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-white text-lg font-semibold mb-2">Unable to load artisans</h3>
            <p className="text-slate-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (showComparison) {
    return (
      <div className={`bg-slate-800 rounded-xl border border-slate-700 ${className}`}>
        {/* Comparison Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-xl font-semibold">Artisan Comparison</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={clearComparison}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Selection
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-4 text-left text-slate-400 font-medium">Features</th>
                {selectedArtisans.map((artisan) => (
                  <th key={artisan.id} className="p-4 text-center">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="w-16 h-16 mx-auto mb-2 bg-slate-700 rounded-full overflow-hidden">
                          {artisan.profileImage ? (
                            <img 
                              src={artisan.profileImage} 
                              alt={artisan.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to optimized URL if image fails
                                const target = e.currentTarget;
                                if (target.src.includes('cloudinary.com')) {
                                  // Try optimized URL
                                  const optimizedUrl = target.src.replace('/upload/', '/upload/w_64,h_64,c_fill,g_face,q_80,f_webp/');
                                  target.src = optimizedUrl;
                                } else {
                                  // Replace with fallback
                                  target.style.display = 'none';
                                  target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl text-slate-400">${artisan.name.charAt(0).toUpperCase()}</div>`;
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-slate-400">
                              {artisan.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <h4 className="text-white font-medium text-sm mb-1">{artisan.name}</h4>
                        <p className="text-slate-400 text-xs mb-2">{artisan.specialty}</p>
                        <div className="flex justify-center mb-2">
                          <FavoriteButton artisan={artisan} size="sm" />
                        </div>
                        <button
                          onClick={() => removeFromComparison(artisan.id)}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature) => (
                <tr key={feature.key} className="border-b border-slate-700/50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <feature.icon className="w-4 h-4 text-[#A4B465]" />
                      <span className="text-slate-300 text-sm">{feature.label}</span>
                    </div>
                  </td>
                  {selectedArtisans.map((artisan) => (
                    <td key={artisan.id} className="p-4 text-center">
                      {feature.key === 'rating' ? (
                        <div className="flex flex-col items-center">
                          <StarRating rating={artisan.averageRating || 0} size="sm" showValue />
                          <span className="text-slate-400 text-xs mt-1">
                            {artisan.totalReviews} reviews
                          </span>
                        </div>
                      ) : feature.key === 'verified' || feature.key === 'featured' ? (
                        <div className="flex justify-center">
                          {artisan[feature.key as keyof Artisan] ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                              <span className="text-slate-400 text-xs">-</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-white text-sm">
                          {(() => {
                            const value = artisan[feature.key as keyof Artisan];
                            if (value instanceof Date) {
                              return value.toLocaleDateString();
                            }
                            if (Array.isArray(value)) {
                              return value.length > 0 ? `${value.length} items` : 'None';
                            }
                            if (typeof value === 'object' && value !== null) {
                              return 'Object';
                            }
                            return String(value || 'N/A');
                          })()}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              
              {/* Skills Comparison */}
              <tr className="border-b border-slate-700/50">
                <td className="p-4">
                  <span className="text-slate-300 text-sm">Skills</span>
                </td>
                {selectedArtisans.map((artisan) => (
                  <td key={artisan.id} className="p-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {artisan.skills?.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#626F47] text-white rounded-full text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {artisan.skills && artisan.skills.length > 3 && (
                        <span className="text-slate-400 text-xs">
                          +{artisan.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="text-slate-400 text-sm">
              Comparing {selectedArtisans.length} artisans
            </div>
            <div className="flex items-center gap-3">
              {selectedArtisans.map((artisan) => (
                <a
                  key={artisan.id}
                  href={`/artisan/${artisan.id}`}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                >
                  View {artisan.name.split(' ')[0]}'s Profile
                  <ArrowRight className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 ${className}`}>
      {/* Selection Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-xl font-semibold mb-2">Compare Artisans</h3>
            <p className="text-slate-400 text-sm">
              Select 2-4 artisans to compare their features side-by-side
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">
              {artisans.filter(a => a.isSelected).length} selected
            </span>
            <button
              onClick={addToComparison}
              disabled={artisans.filter(a => a.isSelected).length < 2}
              className="flex items-center gap-2 px-4 py-2 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4" />
              Compare Selected
            </button>
          </div>
        </div>
      </div>

      {/* Artisan Selection Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artisans.map((artisan) => (
            <div
              key={artisan.id}
              className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                artisan.isSelected
                  ? 'border-[#A4B465] bg-[#A4B465]/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => toggleArtisanSelection(artisan.id)}
            >
              {/* Selection Indicator */}
              <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                artisan.isSelected
                  ? 'border-[#A4B465] bg-[#A4B465]'
                  : 'border-slate-500 bg-transparent'
              }`}>
                {artisan.isSelected && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>

              {/* Artisan Info */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-slate-700 rounded-full overflow-hidden">
                  {artisan.profileImage ? (
                    <img 
                      src={artisan.profileImage} 
                      alt={artisan.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg text-slate-400">
                      {artisan.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{artisan.name}</h4>
                  <p className="text-slate-400 text-xs">{artisan.specialty}</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Rating</span>
                  <div className="flex items-center gap-1">
                    <StarRating rating={artisan.averageRating || 0} size="sm" showValue />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Location</span>
                  <span className="text-white text-xs">{artisan.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Orders</span>
                  <span className="text-white text-xs">{artisan.totalOrders}+</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-1 mt-3">
                {artisan.verified && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">
                    Verified
                  </span>
                )}
                {artisan.featured && (
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                    Featured
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
