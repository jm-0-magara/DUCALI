import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, Loader2, RefreshCw } from 'lucide-react';
import { reviewsService, type Review, type ReviewStats } from '../lib/reviewsService';
import { useAuth } from '../contexts/AuthContext';
import StarRating from './StarRating';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';

interface ReviewsSectionProps {
  artisanId: string;
  artisanName: string;
  className?: string;
}

export default function ReviewsSection({
  artisanId,
  artisanName,
  className = ''
}: ReviewsSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadReviews = async () => {
    try {
      setError(null);
      const [reviewsData, statsData] = await Promise.all([
        reviewsService.getArtisanReviews(artisanId, 10),
        reviewsService.getArtisanReviewStats(artisanId)
      ]);
      
      setReviews(reviewsData);
      setStats(statsData);

      // Check if current user has reviewed this artisan
      if (user?.id) {
        const userReviewData = await reviewsService.getUserReview(user.id, artisanId);
        setUserReview(userReviewData);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshReviews = async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  };

  useEffect(() => {
    loadReviews();
  }, [artisanId, user?.id]);

  const handleReviewSubmitted = () => {
    setShowReviewForm(false);
    refreshReviews();
  };

  const handleReviewHelpful = async (reviewId: string) => {
    try {
      await reviewsService.markReviewHelpful(reviewId);
      refreshReviews();
    } catch (error) {
      console.error('Error marking review helpful:', error);
    }
  };

  const handleReviewReport = async (reviewId: string) => {
    if (confirm('Are you sure you want to report this review?')) {
      try {
        await reviewsService.reportReview(reviewId);
        refreshReviews();
      } catch (error) {
        console.error('Error reporting review:', error);
      }
    }
  };

  const handleReviewDelete = async (reviewId: string) => {
    if (confirm('Are you sure you want to delete your review?')) {
      try {
        await reviewsService.deleteReview(reviewId);
        setUserReview(null);
        refreshReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const canWriteReview = user?.id && !userReview;

  if (loading) {
    return (
      <div className={`bg-slate-800 rounded-lg p-6 border border-slate-700 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#A4B465]" />
          <span className="ml-2 text-white">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 rounded-lg border border-slate-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#A4B465]" />
            <h3 className="text-white text-xl font-semibold">Reviews</h3>
            {stats && (
              <div className="flex items-center gap-2">
                <StarRating rating={stats.averageRating} size="sm" showValue />
                <span className="text-slate-400 text-sm">
                  ({stats.totalReviews} reviews)
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={refreshReviews}
              disabled={refreshing}
              className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              title="Refresh reviews"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            
            {canWriteReview && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-2 px-3 py-2 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Write Review
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={refreshReviews}
              className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="p-6 border-b border-slate-700">
          <ReviewForm
            artisanId={artisanId}
            artisanName={artisanName}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* User's Review */}
      {userReview && !showReviewForm && (
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Your Review</h4>
            <button
              onClick={() => setShowReviewForm(true)}
              className="text-[#A4B465] hover:text-[#626F47] text-sm transition-colors"
            >
              Edit
            </button>
          </div>
          <ReviewCard
            review={userReview}
            onDelete={handleReviewDelete}
            showActions={true}
          />
        </div>
      )}

      {/* Review Stats */}
      {stats && stats.totalReviews > 0 && (
        <div className="p-6 border-b border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <StarRating rating={stats.averageRating} size="lg" />
              <div className="text-slate-400 text-sm mt-1">
                {stats.totalReviews} total reviews
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="flex items-center gap-1 w-8">
                      <span className="text-slate-400 text-sm">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="p-6">
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onHelpful={handleReviewHelpful}
                onReport={handleReviewReport}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">No reviews yet</h4>
            <p className="text-slate-400 text-sm">
              Be the first to review {artisanName}
            </p>
            {canWriteReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#A4B465] text-white rounded-lg hover:bg-[#626F47] transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Write the First Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
