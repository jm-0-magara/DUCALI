import React from 'react';
import { ThumbsUp, Flag, Calendar, User } from 'lucide-react';
import { type Review } from '../lib/reviewsService';
import StarRating from './StarRating';
import { useAuth } from '../contexts/AuthContext';

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  showActions?: boolean;
}

export default function ReviewCard({
  review,
  onHelpful,
  onReport,
  onDelete,
  showActions = true
}: ReviewCardProps) {
  const { user } = useAuth();
  const isOwner = user?.id === review.customerId;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      {/* Review Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            {review.customerImage ? (
              <img 
                src={review.customerImage} 
                alt={review.customerName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <h4 className="text-white font-medium">{review.customerName}</h4>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} size="sm" />
              <span className="text-slate-400 text-sm">
                {formatDate(review.createdAt)}
              </span>
              {review.verified && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-2">
            {onHelpful && (
              <button
                onClick={() => onHelpful(review.id)}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm"
                title="Mark as helpful"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{review.helpful}</span>
              </button>
            )}
            
            {onReport && !isOwner && (
              <button
                onClick={() => onReport(review.id)}
                className="text-slate-400 hover:text-red-400 transition-colors"
                title="Report review"
              >
                <Flag className="w-4 h-4" />
              </button>
            )}
            
            {onDelete && isOwner && (
              <button
                onClick={() => onDelete(review.id)}
                className="text-slate-400 hover:text-red-400 transition-colors"
                title="Delete review"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Review Title */}
      {review.title && (
        <h5 className="text-white font-semibold mb-2">{review.title}</h5>
      )}

      {/* Review Comment */}
      <p className="text-slate-300 text-sm leading-relaxed mb-3">
        {review.comment}
      </p>

      {/* Review Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Reviewed {formatDate(review.createdAt)}</span>
          {review.updatedAt && review.updatedAt !== review.createdAt && (
            <span className="ml-2">(edited)</span>
          )}
        </div>
        
        {review.orderId && (
          <span className="text-slate-400">
            Order #{review.orderId.slice(-6)}
          </span>
        )}
      </div>
    </div>
  );
}
