import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onRatingChange,
  className = ''
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    // Optional: Add hover effects for interactive ratings
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0;
          
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
              disabled={!interactive}
              className={`${
                interactive 
                  ? 'cursor-pointer hover:scale-110 transition-transform' 
                  : 'cursor-default'
              } ${sizeClasses[size]}`}
            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled 
                    ? 'fill-current text-yellow-400' 
                    : isHalfFilled 
                    ? 'fill-current text-yellow-400 opacity-50' 
                    : 'text-gray-300'
                }`}
              />
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className={`${textSizes[size]} text-gray-600 ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
