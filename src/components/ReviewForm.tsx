import React, { useState } from 'react';
import { Star, Send, Loader2 } from 'lucide-react';
import StarRating from './StarRating';
import { reviewsService, type Review } from '../lib/reviewsService';
import { useAuth } from '../contexts/AuthContext';

interface ReviewFormProps {
  artisanId: string;
  artisanName: string;
  onReviewSubmitted?: () => void;
  onCancel?: () => void;
  existingReview?: Review | null;
}

export default function ReviewForm({
  artisanId,
  artisanName,
  onReviewSubmitted,
  onCancel,
  existingReview
}: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('You must be logged in to submit a review');
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let success = false;

      if (existingReview) {
        // Update existing review
        success = await reviewsService.updateReview(existingReview.id, {
          rating,
          title: title.trim(),
          comment: comment.trim()
        });
      } else {
        // Create new review
        const reviewData: any = {
          artisanId,
          customerId: user.id,
          customerName: user.name,
          rating,
          title: title.trim(),
          comment: comment.trim()
        };

        // Only add customerImage if it exists
        if (user.profileImage) {
          reviewData.customerImage = user.profileImage;
        }

        success = await reviewsService.createReview(reviewData);
      }

      if (success) {
        onReviewSubmitted?.();
        // Reset form if it's a new review
        if (!existingReview) {
          setRating(0);
          setTitle('');
          setComment('');
        }
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError('An error occurred while submitting your review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (existingReview) {
      // Reset to original values
      setRating(existingReview.rating);
      setTitle(existingReview.title);
      setComment(existingReview.comment);
    } else {
      // Clear form
      setRating(0);
      setTitle('');
      setComment('');
    }
    onCancel?.();
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-white text-lg font-semibold mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Artisan Info */}
        <div className="text-slate-300 text-sm">
          Reviewing: <span className="text-white font-medium">{artisanName}</span>
        </div>

        {/* Rating Selection */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Your Rating *
          </label>
          <StarRating
            rating={rating}
            interactive={true}
            onRatingChange={setRating}
            size="lg"
            className="mb-2"
          />
          <p className="text-slate-400 text-xs">
            {rating === 0 && 'Click on a star to rate'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        </div>

        {/* Review Title */}
        <div>
          <label htmlFor="review-title" className="block text-white text-sm font-medium mb-2">
            Review Title (Optional)
          </label>
          <input
            type="text"
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A4B465] focus:border-transparent"
            maxLength={100}
          />
        </div>

        {/* Review Comment */}
        <div>
          <label htmlFor="review-comment" className="block text-white text-sm font-medium mb-2">
            Your Review *
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this artisan..."
            rows={4}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A4B465] focus:border-transparent resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-slate-400 text-xs">
              {comment.length}/500 characters
            </span>
            {comment.length > 450 && (
              <span className="text-orange-400 text-xs">
                {500 - comment.length} characters left
              </span>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !comment.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
