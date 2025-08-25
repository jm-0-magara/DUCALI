# Reviews & Ratings System

## Overview

The Reviews & Ratings System is a comprehensive feature that allows customers to leave reviews and ratings for artisans, helping build trust and credibility within the marketplace. The system includes real-time rating calculations, review management, and interactive components.

## Features

### ⭐ Core Features
- **Star Rating System**: Interactive 1-5 star ratings with visual feedback
- **Review Management**: Create, edit, and delete reviews
- **Rating Statistics**: Average ratings, total reviews, and rating distribution
- **Review Actions**: Mark helpful, report inappropriate reviews
- **Verified Reviews**: Distinguish verified purchase reviews
- **Real-time Updates**: Instant updates when reviews are added/modified

### 🎯 User Experience
- **Customer Reviews**: Write detailed reviews with titles and comments
- **Artisan Profiles**: Display ratings prominently on artisan pages
- **Review Display**: Beautiful review cards with user avatars and timestamps
- **Rating Distribution**: Visual breakdown of ratings (1-5 stars)
- **Review Form**: Intuitive form for submitting new reviews

## Technical Implementation

### Database Structure

#### Reviews Collection
```typescript
interface Review {
  id: string;
  artisanId: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  rating: number;           // 1-5 stars
  title: string;           // Review title
  comment: string;         // Review content
  createdAt: Date;
  updatedAt?: Date;
  helpful: number;         // Helpful votes count
  reported: boolean;       // Flagged for review
  verified: boolean;       // Verified purchase
  orderId?: string;        // Associated order
}
```

#### Review Statistics (stored in artisan document)
```typescript
interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recentReviews: Review[];
}
```

### Key Components

#### 1. ReviewsService (`src/lib/reviewsService.ts`)
- **getArtisanReviews()**: Fetch reviews for an artisan
- **getArtisanReviewStats()**: Calculate rating statistics
- **createReview()**: Add new review
- **updateReview()**: Edit existing review
- **deleteReview()**: Remove review (soft delete)
- **markReviewHelpful()**: Increment helpful count
- **reportReview()**: Flag inappropriate review
- **hasUserReviewedArtisan()**: Check if user already reviewed
- **getUserReview()**: Get user's existing review

#### 2. StarRating Component (`src/components/StarRating.tsx`)
- Interactive star selection
- Multiple sizes (sm, md, lg)
- Optional rating display
- Hover effects and animations

#### 3. ReviewCard Component (`src/components/ReviewCard.tsx`)
- Display individual reviews
- User avatars and information
- Rating display
- Action buttons (helpful, report, delete)
- Timestamp formatting

#### 4. ReviewForm Component (`src/components/ReviewForm.tsx`)
- Create new reviews
- Edit existing reviews
- Form validation
- Character limits
- Loading states

#### 5. ReviewsSection Component (`src/components/ReviewsSection.tsx`)
- Complete reviews display
- Rating statistics
- Review form integration
- User's existing review
- Loading and error states

### Firebase Integration

#### Queries
```typescript
// Get artisan reviews
const q = query(
  reviewsRef,
  where('artisanId', '==', artisanId),
  where('reported', '==', false),
  orderBy('createdAt', 'desc'),
  limit(10)
);

// Check if user reviewed artisan
const q = query(
  reviewsRef,
  where('customerId', '==', customerId),
  where('artisanId', '==', artisanId),
  where('reported', '==', false)
);
```

#### Real-time Updates
- Reviews automatically update artisan rating statistics
- Changes reflect immediately across the platform
- Optimistic UI updates for better UX

## User Experience Flow

### For Customers

1. **Browse Artisan**: View artisan profile with ratings
2. **Write Review**: Click "Write Review" button
3. **Rate & Comment**: Select stars and write detailed review
4. **Submit**: Review is saved and displayed
5. **Manage**: Edit or delete their own reviews

### For Artisans

1. **View Reviews**: See all reviews on their profile
2. **Rating Display**: Prominent rating display in hero section
3. **Statistics**: Detailed rating breakdown
4. **Notifications**: Get notified of new reviews

## Integration Points

### Artisan Profile Page
- **Hero Section**: Display average rating and total reviews
- **Reviews Tab**: Complete reviews section with form
- **Rating Display**: Star ratings throughout the profile

### Browse Page
- **Artisan Cards**: Show ratings on search results
- **Filtering**: Filter by rating (future enhancement)

### Customer Dashboard
- **Review History**: View all reviews written
- **Review Management**: Edit/delete reviews

## Error Handling

### Common Scenarios
- **Network Errors**: Graceful fallbacks with retry options
- **Validation Errors**: Clear error messages for form validation
- **Permission Errors**: Handle unauthorized actions
- **Data Loading**: Loading states and skeleton screens

### Error States
```typescript
// Loading state
<div className="flex items-center justify-center py-8">
  <Loader2 className="w-6 h-6 animate-spin text-[#A4B465]" />
  <span className="ml-2 text-white">Loading reviews...</span>
</div>

// Error state
<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
  <p className="text-red-400 text-sm">{error}</p>
  <button onClick={refreshReviews} className="mt-2 text-red-400 hover:text-red-300 text-sm underline">
    Try again
  </button>
</div>
```

## Performance Considerations

### Optimization Strategies
- **Pagination**: Load reviews in batches (10 per page)
- **Caching**: Cache review statistics
- **Lazy Loading**: Load reviews on demand
- **Debouncing**: Prevent excessive API calls

### Data Management
- **Soft Deletes**: Mark reviews as reported instead of deleting
- **Indexing**: Proper Firestore indexes for queries
- **Batch Updates**: Update statistics efficiently

## Security & Moderation

### Review Moderation
- **Report System**: Users can report inappropriate reviews
- **Admin Review**: Flagged reviews for admin review
- **Content Filtering**: Basic content validation
- **Rate Limiting**: Prevent spam reviews

### Data Validation
- **Rating Range**: Ensure ratings are 1-5
- **Content Length**: Limit review length
- **User Verification**: Verify user has ordered from artisan
- **Duplicate Prevention**: One review per customer per artisan

## Future Enhancements

### Planned Features
- **Review Responses**: Artisans can respond to reviews
- **Review Photos**: Allow image attachments
- **Review Categories**: Rate different aspects (quality, communication, etc.)
- **Review Analytics**: Detailed analytics for artisans
- **Review Notifications**: Email notifications for new reviews
- **Review Incentives**: Reward customers for helpful reviews

### Technical Improvements
- **Advanced Filtering**: Filter by rating, date, helpfulness
- **Review Search**: Search within reviews
- **Review Export**: Export review data
- **Review API**: Public API for reviews
- **Review Widgets**: Embeddable review widgets

## Testing Strategy

### Unit Tests
- Component rendering
- Form validation
- Service methods
- Error handling

### Integration Tests
- Firebase operations
- Real-time updates
- User interactions
- Cross-component communication

### E2E Tests
- Complete review flow
- Rating calculations
- Review management
- Error scenarios

## Deployment Notes

### Environment Setup
- Ensure Firebase indexes are created
- Set up proper security rules
- Configure review moderation settings
- Test with sample data

### Monitoring
- Track review submission rates
- Monitor rating distributions
- Alert on unusual activity
- Performance metrics

### Backup Strategy
- Regular review data backups
- Export review statistics
- Archive old reviews
- Disaster recovery plan

## Conclusion

The Reviews & Ratings System provides a robust foundation for building trust and credibility in the artisan marketplace. With comprehensive features, excellent user experience, and strong technical implementation, it enhances the platform's value for both customers and artisans.

The system is designed to be scalable, maintainable, and extensible for future enhancements while maintaining high performance and security standards.
