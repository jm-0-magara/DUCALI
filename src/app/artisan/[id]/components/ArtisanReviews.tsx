import React from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { ArtisanProfile } from '../data/artisanData';

interface ArtisanReviewsProps {
  artisan: ArtisanProfile;
}

export default function ArtisanReviews({ artisan }: ArtisanReviewsProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-[#F0BB78] fill-current' : 'text-slate-500'
        }`}
      />
    ));
  };

  const ratingDistribution = [
    { stars: 5, count: 45, percentage: 78 },
    { stars: 4, count: 8, percentage: 14 },
    { stars: 3, count: 3, percentage: 5 },
    { stars: 2, count: 1, percentage: 2 },
    { stars: 1, count: 1, percentage: 2 },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Rating Overview */}
        <div className="lg:col-span-1">
          <h3 className="text-2xl font-bold text-white mb-6">Customer Reviews</h3>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-white mb-2">{artisan.rating}</div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.floor(artisan.rating))}
            </div>
            <p className="text-slate-400">Based on {artisan.totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2">
                <span className="text-slate-400 text-sm w-6">{item.stars}★</span>
                <div className="flex-1 bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-[#F0BB78] h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-slate-400 text-sm w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="lg:col-span-2">
          <h4 className="text-xl font-bold text-white mb-4">Recent Reviews</h4>
          
          <div className="space-y-6">
            {artisan.reviews.map((review, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="text-white font-medium">{review.customerName}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-slate-400 text-sm">{review.date}</span>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="bg-[#A4B465] text-white text-xs px-2 py-1 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>
                
                <p className="text-slate-300 mb-3">{review.comment}</p>
                
                {review.projectType && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Project: {review.projectType}</span>
                    <div className="flex items-center gap-4 text-slate-500">
                      <button className="flex items-center gap-1 hover:text-[#A4B465] transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Load More Reviews */}
          <div className="text-center mt-6">
            <button className="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:border-[#A4B465] hover:text-[#A4B465] transition-colors">
              Load More Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}