# Quote System Setup & Documentation

## 🎯 Overview

The quote system allows customers to request quotes from artisans and artisans to respond with detailed proposals. This system includes:

- **Quote Request Modal**: For customers to submit detailed project requests
- **Quote Response Modal**: For artisans to respond with pricing and terms
- **Quote Dashboard**: For both customers and artisans to manage their quotes
- **API Routes**: Backend endpoints for quote operations
- **Firebase Integration**: Real-time data storage and retrieval

## 🚀 Quick Start

### 1. Test the System

```bash
# Test the quote system functionality
npm run test-quotes

# View available indexes and setup instructions
npm run setup-indexes
```

### 2. Access the Quote Dashboard

- **Customer View**: Navigate to `/quotes` to see your quote requests
- **Artisan View**: Navigate to `/quotes` to see incoming quote requests
- **Test Page**: Navigate to `/test-quotes` for testing with sample data

### 3. Create Quote Requests

1. Go to any artisan's profile page
2. Click the "Get Quote" button in the contact form
3. Fill out the detailed quote request form
4. Submit to send the request to the artisan

## 📁 File Structure

```
src/
├── components/quotes/
│   ├── QuoteRequestModal.tsx      # Customer quote request form
│   └── QuoteResponseModal.tsx     # Artisan response form
├── lib/
│   └── quoteService.ts            # Firebase operations for quotes
├── app/
│   ├── api/quotes/
│   │   ├── request/route.ts       # POST/GET quote requests
│   │   └── [id]/respond/route.ts  # POST quote responses
│   ├── quotes/page.tsx            # Main quote dashboard
│   └── test-quotes/page.tsx       # Test page with sample data
└── scripts/
    ├── setup-firebase-indexes.js  # Index setup instructions
    └── test-quote-system.js       # System testing script
```

## 🔧 Firebase Setup

### Required Indexes

The quote system requires the following Firebase composite indexes:

1. **quoteRequests** collection:
   - `artisanId` (asc) + `createdAt` (desc)
   - `customerId` (asc) + `createdAt` (desc)
   - `artisanId` (asc) + `status` (asc) + `createdAt` (desc)

### Creating Indexes

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ducali-ec5a7`
3. Navigate to **Firestore Database** → **Indexes**
4. Click **Create Index** for each required index above
5. Or use the direct link provided by the setup script

### Index Creation Time

- **Small collections** (< 1000 documents): 1-2 minutes
- **Medium collections** (1K-10K documents): 5-10 minutes
- **Large collections** (> 10K documents): 15-30 minutes

## 📊 Data Models

### QuoteRequest Interface

```typescript
interface QuoteRequest {
  id: string;
  customerId: string;
  artisanId: string;
  projectTitle: string;
  projectDescription: string;
  projectType: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  attachments: string[];
  additionalRequirements: string;
  status: 'pending' | 'responded' | 'accepted' | 'declined' | 'expired';
  artisanResponse?: {
    quote: number;
    currency: string;
    message: string;
    timeline: string;
    terms: string;
    respondedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}
```

### QuoteResponse Interface

```typescript
interface QuoteResponseData {
  quote: number;
  currency: string;
  message: string;
  timeline: string;
  terms: string;
}
```

## 🔌 API Endpoints

### Create Quote Request

```http
POST /api/quotes/request
Content-Type: application/json

{
  "customerId": "string",
  "artisanId": "string",
  "projectTitle": "string",
  "projectDescription": "string",
  "projectType": "string",
  "budget": {
    "min": number,
    "max": number,
    "currency": "string"
  },
  "timeline": "string",
  "location": "string",
  "urgency": "low|medium|high",
  "attachments": ["string"],
  "additionalRequirements": "string"
}
```

### Get Quote Requests

```http
GET /api/quotes/request?customerId=string
GET /api/quotes/request?artisanId=string
GET /api/quotes/request?id=string
```

### Respond to Quote Request

```http
POST /api/quotes/[id]/respond
Content-Type: application/json

{
  "quote": number,
  "currency": "string",
  "message": "string",
  "timeline": "string",
  "terms": "string"
}
```

## 🎨 UI Components

### QuoteRequestModal

**Features:**
- Comprehensive project details form
- Budget range selection
- Timeline and location fields
- Urgency level selection
- File attachment support
- Form validation
- Success/error feedback

**Usage:**
```tsx
<QuoteRequestModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  artisanId="artisan-id"
  artisanName="John Doe"
  artisanSpecialty="Custom Furniture"
  darkMode={true}
/>
```

### QuoteResponseModal

**Features:**
- Quote amount input
- Detailed response message
- Timeline specification
- Terms and conditions
- Project context display
- Form validation

**Usage:**
```tsx
<QuoteResponseModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  quoteRequest={quoteData}
  darkMode={true}
/>
```

## 🔄 Workflow

### Customer Workflow

1. **Browse Artisans**: Find artisans in their category
2. **Request Quote**: Click "Get Quote" on artisan profile
3. **Fill Form**: Provide detailed project requirements
4. **Submit Request**: Send to artisan for review
5. **Wait for Response**: Artisan has 24-48 hours to respond
6. **Review Quote**: View artisan's response and pricing
7. **Accept/Decline**: Make decision on the quote

### Artisan Workflow

1. **Receive Requests**: View incoming quote requests
2. **Review Details**: Examine project requirements
3. **Create Response**: Provide quote amount and terms
4. **Submit Quote**: Send detailed response to customer
5. **Wait for Decision**: Customer reviews and decides
6. **Follow Up**: Handle accepted quotes or follow up on declined ones

## 🛠️ Development

### Testing

```bash
# Test the entire quote system
npm run test-quotes

# Test specific components
npm run dev
# Then visit: http://localhost:3000/test-quotes
```

### Adding New Features

1. **New Fields**: Update the `QuoteRequest` interface
2. **Validation**: Add validation rules in the modal components
3. **API**: Extend the API routes as needed
4. **UI**: Update the dashboard to display new fields

### Troubleshooting

#### Common Issues

1. **Index Errors**: Run `npm run setup-indexes` for instructions
2. **Form Validation**: Check browser console for validation errors
3. **API Errors**: Verify Firebase connection and permissions
4. **UI Issues**: Check for missing imports or CSS classes

#### Debug Commands

```bash
# Check Firebase connection
npm run test-firebase

# View index requirements
npm run setup-indexes

# Test quote system
npm run test-quotes
```

## 📈 Performance Considerations

### Optimization Strategies

1. **Pagination**: Implement pagination for large quote lists
2. **Caching**: Cache frequently accessed quote data
3. **Lazy Loading**: Load quote details on demand
4. **Indexing**: Ensure proper Firebase indexes are created

### Monitoring

- Monitor quote response times
- Track quote acceptance rates
- Analyze popular project types
- Monitor system performance

## 🔒 Security

### Data Protection

- All quote data is stored securely in Firebase
- User authentication required for all operations
- Input validation on all forms
- Rate limiting on API endpoints

### Privacy

- Quote details are only visible to involved parties
- No public access to quote information
- Secure data transmission using HTTPS

## 🚀 Deployment

### Production Checklist

- [ ] Firebase indexes created and built
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] UI components responsive
- [ ] Error handling implemented
- [ ] Performance optimized

### Monitoring

- Set up Firebase Analytics
- Monitor error rates
- Track user engagement
- Monitor system performance

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Run the test scripts to verify functionality
3. Check Firebase console for errors
4. Review the browser console for client-side errors

## 🔄 Updates

### Recent Changes

- **v1.0.0**: Initial quote system implementation
- **v1.1.0**: Added Firebase index optimization
- **v1.2.0**: Enhanced UI components and validation
- **v1.3.0**: Added comprehensive testing suite

### Future Enhancements

- [ ] Quote templates for common projects
- [ ] Automated quote expiration handling
- [ ] Quote analytics and reporting
- [ ] Integration with payment system
- [ ] Mobile app support
